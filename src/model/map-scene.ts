/**
 * Everything needed to draw a map, with every asset resolved to frames.
 * See docs/rendering.md ("Maps").
 *
 * Asset locations:
 *   tiles        Map/Tile/<tS>.img/<u>/<no>               (one canvas)
 *   objects      Map/Obj/<oS>.img/<l0>/<l1>/<l2>          (an animation; `obstacle` ones are traps)
 *   backgrounds  Map/Back/<bS>.img/back/<no>              (still, ani = 0)
 *                Map/Back/<bS>.img/ani/<no>               (animation, ani = 1)
 *   portals      Map/MapHelper.img/portal/game/pv/<image> (visible portal animation; `default` unless `image` says)
 */
import type { WzFileSystem } from "../fs.ts";
import { readAnimation, readAnimations, readFrame, resolveFrameSizes, type Animation } from "./animation.ts";
import { imageName, parseId } from "./ids.ts";
import { readMap, type Life, type MapBack, type MapData, type MapReactor, type MapReadOptions, type MapTile, type MapObject, type Portal } from "./map.ts";
import { loadStrings } from "./strings.ts";

export interface SceneTile extends MapTile {
  layer: number;
  /** Sort key within the layer: the tile canvas's `z`, or `zM` when that is 0. */
  order: number;
  animation: Animation;
}

/**
 * A trap object (`obstacle` = 1 on its animation node): touching a frame's `lt`–`rb` box
 * hurts. See docs/data-model/map.md.
 */
export interface Obstacle {
  /** HP taken per hit. */
  damage: number;
  /** Knockback direction as a clock hour (3 right, 9 left, 12 up, 6 down), 0 when unset. UNVERIFIED. */
  dir: number;
  /** A monster skill status it puts on the player (`disease`: 123 stun, 125 poison) at `level`. */
  disease?: { skill: number; level: number };
}

export interface SceneObject extends MapObject {
  layer: number;
  animation: Animation;
  obstacle: Obstacle | null;
}

export interface SceneBack extends MapBack {
  animation: Animation;
}

export interface SceneLife extends Life {
  name: string;
  /** Layer of the foothold the spawn stands on (life is drawn on that layer). */
  layer: number;
  animation: Animation | null;
}

export interface SceneReactor extends MapReactor {
  reactorName: string;
  layer: number;
  animation: Animation | null;
}

export interface ScenePortal extends Portal {
  /** Short type name from the editor list (`sp`, `pv`, `ph`, …). */
  typeName: string;
  animation: Animation | null;
}

export interface MapScene {
  map: MapData;
  tiles: SceneTile[];
  objects: SceneObject[];
  backs: SceneBack[];
  life: SceneLife[];
  reactors: SceneReactor[];
  portals: ScenePortal[];
  /** Assets that could not be found, as paths. */
  missing: string[];
}

/**
 * Portal type names by `pt`: the names `Map/MapHelper.img/portal/editor` lists, in its order
 * except for `pgi`, which the editor lists after `ps` but which is pt 5: every pt 6 portal is
 * named `tp`, and pt 7 portals are the doors that run a script (the Free Market's, Up and
 * Up's). pt 0 portals are named `sp`, pt 2 portals are the visible doors.
 */
export async function portalTypeNames(fs: WzFileSystem): Promise<string[]> {
  const editor = await fs.get("Map/MapHelper.img/portal/editor");
  const names = editor?.children().map((c) => c.name) ?? [];
  const pgi = names.indexOf("pgi");

  if (pgi > 5) {
    names.splice(5, 0, ...names.splice(pgi, 1));
  }

  return names;
}

/** Portals drawn with `portal/game/pv`: the visible doors and the visible script doors. */
const VISIBLE_PORTALS = new Set(["pv", "ps"]);

/** Portal types that are hidden (not shown to players). UNVERIFIED names; see docs/data-model/map.md. */
export const HIDDEN_PORTALS = new Set(["pi", "ph", "psh", "psi", "pgi"]);

export interface SceneReadOptions {
  /** See `MapReadOptions.copies`. */
  copies?: MapReadOptions["copies"];
  /**
   * HP taken from a trap whose obstacle node has no `damage`, by the object's path under
   * `Map/Obj` (`obj_trap/steam/0`). The data leaves some traps without one; 0 when unset.
   */
  trapDamage?: (path: string) => number;
}

/** A map by ID, or by image path (see `readMap`). */
export async function readMapScene(fs: WzFileSystem, id: number | string, options: SceneReadOptions = {}): Promise<MapScene | null> {
  const map = await readMap(fs, id, { copies: options.copies });
  const trapDamage = (obj: MapObject) => options.trapDamage?.(`${obj.oS}/${obj.l0}/${obj.l1}/${obj.l2}`) ?? 0;

  if (!map) {
    return null;
  }

  const missing: string[] = [];
  const strings = await loadStrings(fs);

  const animationAt = async (path: string): Promise<Animation | null> => {
    const node = await fs.get(path);

    if (!node) {
      missing.push(path);

      return null;
    }

    // A single canvas becomes a one-frame animation.
    if (node.kind === "canvas" || node.kind === "uol") {
      const frame = readFrame(node);

      return frame ? { name: node.name, path: node.path, frames: [frame], zigzag: false, loop: true } : null;
    }

    const anim = readAnimation(node);

    return anim.frames.length ? anim : null;
  };

  // ---- layers ----

  const tiles: SceneTile[] = [];
  const objects: SceneObject[] = [];

  for (const layer of map.layers) {
    for (const tile of layer.tiles) {
      const anim = layer.tileSet ? await animationAt(`Map/Tile/${layer.tileSet}.img/${tile.u}/${tile.no}`) : null;

      if (anim) {
        const z = typeof anim.frames[0].z === "number" ? anim.frames[0].z : 0;

        tiles.push({ ...tile, layer: layer.layer, order: z !== 0 ? z : tile.zM, animation: anim });
      }
    }

    for (const obj of layer.objects) {
      const path = `Map/Obj/${obj.oS}.img/${obj.l0}/${obj.l1}/${obj.l2}`;
      const anim = await animationAt(path);

      if (anim) {
        const node = await fs.get(path);
        const obstacle: Obstacle | null =
          node?.int(0, "obstacle") === 1 ? { damage: node.int(0, "damage") || trapDamage(obj), dir: node.int(0, "dir") } : null;

        if (obstacle && node?.child("disease")) {
          obstacle.disease = { skill: node.int(0, "disease"), level: node.int(1, "level") };
        }

        objects.push({ ...obj, layer: layer.layer, animation: anim, obstacle });
      }
    }
  }

  // ---- backgrounds ----

  const backs: SceneBack[] = [];

  for (const back of map.backs) {
    if (!back.bS) {
      continue;
    }

    const anim = await animationAt(`Map/Back/${back.bS}.img/${back.ani === 1 ? "ani" : "back"}/${back.no}`);

    if (anim) {
      backs.push({ ...back, animation: anim });
    }
  }

  // ---- life, reactors, portals ----

  const fhLayer = new Map(map.footholds.map((f) => [f.id, f.layer]));
  const lifeAnimations = new Map<string, Animation | null>();

  const lifeAnimation = async (type: string, lifeId: number): Promise<Animation | null> => {
    const key = `${type}:${lifeId}`;

    if (lifeAnimations.has(key)) {
      return lifeAnimations.get(key)!;
    }

    const folder = type === "m" ? "Mob" : "Npc";
    let root = await fs.get(`${folder}/${imageName(lifeId, type === "m" ? "mob" : "npc")}`);
    const link = parseId(root?.string("", "info/link"));

    if (root && link !== null) {
      root = (await fs.get(`${folder}/${imageName(link, type === "m" ? "mob" : "npc")}`)) ?? root;
    }

    const anims = root ? readAnimations(root) : [];
    const anim = anims.find((a) => a.name === "stand") ?? anims.find((a) => a.name === "move" || a.name === "fly") ?? anims[0] ?? null;

    lifeAnimations.set(key, anim);

    return anim;
  };

  const life: SceneLife[] = [];

  for (const l of map.life) {
    life.push({
      ...l,
      name: l.type === "m" ? (strings.mobs.get(l.id) ?? "") : (strings.npcs.get(l.id)?.name ?? ""),
      layer: fhLayer.get(l.fh) ?? 7,
      animation: await lifeAnimation(l.type, l.id),
    });
  }

  const reactors: SceneReactor[] = [];

  for (const r of map.reactors) {
    const root = await fs.get(`Reactor/${imageName(r.id, "reactor")}`);
    const link = parseId(root?.string("", "info/link"));
    const spriteRoot = link !== null ? ((await fs.get(`Reactor/${imageName(link, "reactor")}`)) ?? root) : root;
    const state0 = spriteRoot?.get("0");

    reactors.push({
      ...r,
      reactorName: root?.string("", "info/info") ?? "",
      layer: 7,
      animation: state0 ? readAnimation(state0) : null,
    });
  }

  const typeNames = await portalTypeNames(fs);
  // A portal's `image` picks its look (the home doors are `pv/2`).
  const looks = new Map<string, Animation | null>();
  const portals: ScenePortal[] = [];

  for (const p of map.portals) {
    const typeName = typeNames[p.type] ?? `pt${p.type}`;
    const image = String(p.fields.image ?? "default");

    const visible = VISIBLE_PORTALS.has(typeName);

    if (visible && !looks.has(image)) {
      looks.set(image, (await animationAt(`Map/MapHelper.img/portal/game/pv/${image}`)) ?? (await animationAt("Map/MapHelper.img/portal/game/pv/default")));
    }

    portals.push({ ...p, typeName, animation: visible ? (looks.get(image) ?? null) : null });
  }

  // ---- real frame sizes (linked canvases report 1x1) ----

  const all: Animation[] = [
    ...tiles.map((t) => t.animation),
    ...objects.map((o) => o.animation),
    ...backs.map((b) => b.animation),
    ...[...lifeAnimations.values()].filter((a): a is Animation => a !== null),
    ...reactors.map((r) => r.animation).filter((a): a is Animation => a !== null),
    ...[...looks.values()].filter((a): a is Animation => a !== null),
  ];

  await resolveFrameSizes(fs, [...new Set(all)]);

  return { map, tiles, objects, backs, life, reactors, portals, missing };
}
