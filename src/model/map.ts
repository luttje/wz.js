/**
 * Maps: `Map/Map/Map<N>/<id>.img` where N is the first digit of the 9-digit ID.
 * See docs/data-model/map.md and docs/rendering.md.
 */
import type { WzFileSystem } from "../fs.ts";
import type { WzNode } from "../node.ts";
import { pad, parseId } from "./ids.ts";
import { scalars, type Scalar } from "./item.ts";
import { loadStrings } from "./strings.ts";

export interface Portal {
  index: number;
  /** Portal name (`pn`): `sp` spawn points, `in00`/`out00` … */
  name: string;
  /** Portal type (`pt`), see docs/data-model/map.md. */
  type: number;
  x: number;
  y: number;
  /** Target map (`tm`); 999999999 means none. */
  targetMap: number | null;
  /** Target portal name in the target map (`tn`). */
  targetName: string;
  /** The town whose home a door leads to (`individual/housingTownID`), or 0. */
  housingTown: number;
  /** Other fields (script, image, delay, …), raw. */
  fields: Record<string, Scalar>;
}

export interface Life {
  index: number;
  type: "m" | "n" | string;
  id: number;
  x: number;
  y: number;
  cy: number;
  fh: number;
  rx0: number;
  rx1: number;
  flip: boolean;
  hide: boolean;
  /** Respawn time in seconds (`mobTime`), when given. */
  mobTime?: number;
}

export interface MapReactor {
  index: number;
  id: number;
  x: number;
  y: number;
  flip: boolean;
  name: string;
  reactorTime?: number;
}

export interface Foothold {
  layer: number;
  group: number;
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  prev: number;
  next: number;
}

export interface LadderRope {
  index: number;
  /** 1 for a ladder, 0 for a rope (`l`). */
  ladder: boolean;
  /** Whether the top can be climbed onto (`uf`). */
  upperFoothold: boolean;
  x: number;
  y1: number;
  y2: number;
  page: number;
}

export interface MapTile {
  index: number;
  x: number;
  y: number;
  u: string;
  no: number;
  zM: number;
}

export interface MapObject {
  index: number;
  oS: string;
  l0: string;
  l1: string;
  l2: string;
  x: number;
  y: number;
  z: number;
  zM: number;
  flip: boolean;
  /** Other per-object fields (r, move, …), raw. */
  fields: Record<string, Scalar>;
}

export interface MapLayer {
  layer: number;
  tileSet: string;
  tiles: MapTile[];
  objects: MapObject[];
}

export interface MapBack {
  index: number;
  bS: string;
  no: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
  cx: number;
  cy: number;
  type: number;
  alpha: number;
  front: boolean;
  flip: boolean;
  /** 1 when `no` refers to an animation under `ani`, 0 for a still under `back`. */
  ani: number;
}

export interface MiniMap {
  canvas: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  mag: number;
}

export interface MapData {
  id: number;
  path: string;
  name: string;
  streetName: string;
  region: string;
  desc?: string;
  info: Record<string, Scalar>;
  /** View range (VR) bounds, when present. */
  bounds: { left: number; top: number; right: number; bottom: number } | null;
  portals: Portal[];
  life: Life[];
  reactors: MapReactor[];
  /** `area/<n>`: named rectangles scripts check the player against (the party quests' ropes, platforms and barrels). */
  areas: { index: number; x1: number; y1: number; x2: number; y2: number }[];
  footholds: Foothold[];
  ladders: LadderRope[];
  /** `noSkill/skill/<n>`: skills that can't be used here (Dark Sight in the event maps). */
  noSkills: number[];
  /** `seat/<n>`: the map's benches and other seats, as the point the character sits at. */
  seats: { x: number; y: number }[];
  layers: MapLayer[];
  backs: MapBack[];
  miniMap: MiniMap | null;
}

export const NO_MAP = 999999999;

/**
 * Meanings of `info/fieldLimit` bits. Each is a restriction that applies while the bit is set.
 * Checked against Truth Booth (089000000), whose value sets exactly these bits plus a few more
 * we have no names for. Bits not listed here are ignored.
 */
export const FIELD_LIMITS: [bit: number, label: string, description: string][] = [
  [0x1, "No jumping", "You cannot jump."],
  [0x2, "No movement skills", "Haste, Teleport and other mobility skills don't work."],
  [0x4, "No summoning bags", "Summoning bags cannot be used."],
  [0x8, "No Mystic Door", "Priests cannot open a Mystic Door."],
  [0x10, "No channel change", "You cannot change channel."],
  [0x20, "No Return Scroll", "Return Scrolls do nothing."],
  [0x40, "No Teleport Rock", "Teleport Rocks cannot be used."],
  [0x80, "No minigames", "Omok and Match Cards cannot be started."],
  [0x400, "No potions", "Potions and other consumables cannot be used."],
  [0x8000, "No pets", "Pets are put away."],
  [0x10000, "No Lie Detector", "The anti-macro Lie Detector cannot be used."],
  [0x20000, "No dropping down", "You cannot drop down through platforms."],
  [0x80000, "No EXP loss", "Dying here costs no EXP."],
  [0x400000, "No dropping items", "You cannot drop items."],
];

export interface MapRule {
  label: string;
  description: string;
  /** The raw field (and bit) the rule comes from. */
  source: string;
}

/** The rules a map's `info` sets: the named `fieldLimit` bits and the separate `limitSpeedAndJump` flag. */
export function mapRules(info: Record<string, Scalar>): MapRule[] {
  const limit = Number(info.fieldLimit ?? 0);

  const rules = FIELD_LIMITS.filter(([bit]) => Math.floor(limit / bit) % 2 === 1).map(([bit, label, description]) => ({
    label,
    description,
    source: `info/fieldLimit bit 0x${bit.toString(16)}`,
  }));

  if (Number(info.limitSpeedAndJump ?? 0)) {
    rules.push({ label: "Default speed and jump", description: "Speed and Jump are reset to their default values.", source: "info/limitSpeedAndJump" });
  }

  return rules;
}

export function mapImagePath(id: number): string {
  return `Map/Map/Map${Math.floor(id / 100000000)}/${pad(id, 9)}.img`;
}

export interface MapReadOptions {
  /**
   * Read footholds, ladders, tile and object layers, backgrounds and the minimap (default
   * true). Callers that only need the map's info, life, reactors and portals can skip them.
   */
  layout?: boolean;
  /**
   * Maps that have no image of their own, by ID, and the map whose image they are built
   * from. A reader that adds maps the client doesn't ship (a game's homes, say) lists them
   * here; the copy keeps its own ID and name.
   */
  copies?: Record<number, number>;
}

/** Reads a map by ID, or by image path for the maps kept elsewhere (`UI/MapLogin.img`, ID 0). */
export async function readMap(fs: WzFileSystem, map: number | string, options: MapReadOptions = {}): Promise<MapData | null> {
  const id = typeof map === "number" ? map : 0;
  let path = typeof map === "number" ? mapImagePath(map) : map;
  let root = await fs.get(path);

  const copyOf = options.copies?.[id];

  if (!root && copyOf) {
    path = mapImagePath(copyOf);
    root = await fs.get(path);
  }

  if (!root) {
    return null;
  }

  const text = (await loadStrings(fs)).maps.get(id);
  const info = scalars(root.get("info"));

  const hasVr = ["VRLeft", "VRTop", "VRRight", "VRBottom"].every((k) => k in info);
  const layout = options.layout ?? true;

  return {
    id,
    path,
    name: text?.mapName ?? "",
    streetName: text?.streetName ?? "",
    region: text?.region ?? "",
    desc: text?.mapDesc,
    info,
    bounds: hasVr
      ? { left: Number(info.VRLeft), top: Number(info.VRTop), right: Number(info.VRRight), bottom: Number(info.VRBottom) }
      : null,
    portals: numbered(root.get("portal")).map(readPortal),
    life: numbered(root.get("life")).map(readLife),
    areas: numbered(root.get("area")).map((n) => ({ index: Number(n.name), x1: n.int(0, "x1"), y1: n.int(0, "y1"), x2: n.int(0, "x2"), y2: n.int(0, "y2") })),
    noSkills: (root.get("noSkill/skill")?.children() ?? []).map((n) => n.int()),
    reactors: numbered(root.get("reactor")).map((n) => ({
      index: Number(n.name),
      id: parseId(n.string("", "id")) ?? 0,
      x: n.int(0, "x"),
      y: n.int(0, "y"),
      flip: n.int(0, "f") === 1,
      name: n.string("", "name"),
      reactorTime: n.child("reactorTime") ? n.int(0, "reactorTime") : undefined,
    })),
    footholds: layout ? readFootholds(root.get("foothold")) : [],
    ladders: !layout ? [] : numbered(root.get("ladderRope")).map((n) => ({
      index: Number(n.name),
      ladder: n.int(0, "l") === 1,
      upperFoothold: n.int(0, "uf") === 1,
      x: n.int(0, "x"),
      y1: n.int(0, "y1"),
      y2: n.int(0, "y2"),
      page: n.int(0, "page"),
    })),
    seats: !layout ? [] : numbered(root.get("seat")).flatMap((n) => {
      const v = n.vector();

      return v ? [{ x: v.x, y: v.y }] : [];
    }),
    layers: layout ? readLayers(root) : [],
    backs: layout ? numbered(root.get("back")).map(readBack) : [],
    miniMap: layout ? readMiniMap(root.get("miniMap")) : null,
  };
}

function numbered(node: WzNode | undefined): WzNode[] {
  return (node?.children() ?? []).filter((c) => /^\d+$/.test(c.name)).sort((a, b) => Number(a.name) - Number(b.name));
}

function readPortal(n: WzNode): Portal {
  const fields = scalars(n);
  const target = n.int(NO_MAP, "tm");

  for (const k of ["pn", "pt", "x", "y", "tm", "tn"]) {
    delete fields[k];
  }

  return {
    index: Number(n.name),
    name: n.string("", "pn"),
    type: n.int(0, "pt"),
    x: n.int(0, "x"),
    y: n.int(0, "y"),
    targetMap: target === NO_MAP ? null : target,
    targetName: n.string("", "tn"),
    housingTown: n.int(0, "individual/housingTownID"),
    fields,
  };
}

function readLife(n: WzNode): Life {
  return {
    index: Number(n.name),
    type: n.string("", "type"),
    id: parseId(n.string("", "id")) ?? 0,
    x: n.int(0, "x"),
    y: n.int(0, "y"),
    cy: n.int(0, "cy"),
    fh: n.int(0, "fh"),
    rx0: n.int(0, "rx0"),
    rx1: n.int(0, "rx1"),
    flip: n.int(0, "f") === 1,
    hide: n.int(0, "hide") === 1,
    mobTime: n.child("mobTime") ? n.int(0, "mobTime") : undefined,
  };
}

function readFootholds(root: WzNode | undefined): Foothold[] {
  const out: Foothold[] = [];

  for (const layer of root?.children() ?? []) {
    for (const group of layer.children()) {
      for (const fh of group.children()) {
        out.push({
          layer: Number(layer.name),
          group: Number(group.name),
          id: Number(fh.name),
          x1: fh.int(0, "x1"),
          y1: fh.int(0, "y1"),
          x2: fh.int(0, "x2"),
          y2: fh.int(0, "y2"),
          prev: fh.int(0, "prev"),
          next: fh.int(0, "next"),
        });
      }
    }
  }

  return out;
}

function readLayers(root: WzNode): MapLayer[] {
  const layers: MapLayer[] = [];

  for (let layer = 0; layer <= 7; layer++) {
    const node = root.get(String(layer));

    if (!node) {
      continue;
    }

    layers.push({
      layer,
      tileSet: node.string("", "info/tS"),
      tiles: numbered(node.get("tile")).map((t) => ({
        index: Number(t.name),
        x: t.int(0, "x"),
        y: t.int(0, "y"),
        u: t.string("", "u"),
        no: t.int(0, "no"),
        zM: t.int(0, "zM"),
      })),
      objects: numbered(node.get("obj")).map((o) => {
        const fields = scalars(o);

        for (const k of ["oS", "l0", "l1", "l2", "x", "y", "z", "zM", "f"]) {
          delete fields[k];
        }

        return {
          index: Number(o.name),
          oS: o.string("", "oS"),
          l0: o.string("", "l0"),
          l1: o.string("", "l1"),
          l2: o.string("", "l2"),
          x: o.int(0, "x"),
          y: o.int(0, "y"),
          z: o.int(0, "z"),
          zM: o.int(0, "zM"),
          flip: o.int(0, "f") === 1,
          fields,
        };
      }),
    });
  }

  return layers;
}

function readBack(n: WzNode): MapBack {
  return {
    index: Number(n.name),
    bS: n.string("", "bS"),
    no: n.int(0, "no"),
    x: n.int(0, "x"),
    y: n.int(0, "y"),
    rx: n.int(0, "rx"),
    ry: n.int(0, "ry"),
    cx: n.int(0, "cx"),
    cy: n.int(0, "cy"),
    type: n.int(0, "type"),
    alpha: n.int(255, "a"),
    front: n.int(0, "front") === 1,
    flip: n.int(0, "f") === 1,
    ani: n.int(0, "ani"),
  };
}

function readMiniMap(n: WzNode | undefined): MiniMap | null {
  const canvas = n?.get("canvas");

  if (!n || canvas?.kind !== "canvas") {
    return null;
  }

  return {
    canvas: canvas.path,
    centerX: n.int(0, "centerX"),
    centerY: n.int(0, "centerY"),
    width: n.int(0, "width"),
    height: n.int(0, "height"),
    mag: n.int(0, "mag"),
  };
}

export function mapIds(fs: WzFileSystem): number[] {
  return [...fs.imagesUnder("Map/Map")]
    .filter((i) => /^Map\/Map\/Map\d\/\d+\.img$/.test(i.path))
    .map((i) => Number(i.name.replace(".img", "")));
}
