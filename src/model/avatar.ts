/**
 * Character composition: body, head, face, hair and equips, positioned through their anchor
 * maps, ordered by `Base/zmap.img` and hidden by slot claims (`Base/smap.img` + `vslot`).
 * See docs/rendering.md ("Characters").
 */
import type { WzFileSystem } from "../fs.ts";
import type { Vector, WzNode } from "../node.ts";
import { pad } from "./ids.ts";
import { itemLocations } from "./item.ts";

/** The head image holds one canvas per ear type; a character shows at most one. */
export const EARS = {
  human: { child: "humanEar", label: "Human ears" },
  elf: { child: "ear", label: "Elf ears" },
  lef: { child: "lefEar", label: "Lef ears" },
  highlef: { child: "highlefEar", label: "High lef ears" },
} as const;

export type EarType = keyof typeof EARS | "none";

export function isEarType(value: string | null): value is EarType {
  return value === "none" || (value !== null && Object.hasOwn(EARS, value));
}

/** What a character looks like: skin index, face and hair IDs, ears and equipped item IDs. */
export interface Look {
  skin: number;
  face: number;
  hair: number;
  ears: EarType;
  equips: number[];
  /**
   * Weapon type a cash weapon is drawn as (`floor(id / 10000) - 100` of the weapon it covers,
   * e.g. 30 for a one-handed sword); its first type when absent or missing.
   */
  weaponType?: number;
}

/** A beginner from `Etc/MakeCharInfo.img` (first choice of each list, male). */
export const DEFAULT_LOOK: Look = {
  skin: 0,
  face: 20000,
  hair: 30030,
  ears: "human",
  equips: [1040002, 1060002, 1072001, 1302000],
};

export interface AvatarPart {
  /** Item (or body/head/face/hair) ID the part belongs to. */
  source: number;
  /** Child name in the frame (`body`, `arm`, `mailArm`, `default`, …). */
  name: string;
  /** z-layer name from the canvas (`z`). */
  layer: string;
  /** Draw order: larger is drawn later (in front). */
  z: number;
  /** Canvas node path (links are resolved when decoding). */
  canvas: string;
  /** Top-left corner relative to the character's feet (body origin). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Why the part isn't drawn, if it isn't (slot claimed by another item). */
  hiddenBy?: number;
}

export interface AvatarFrame {
  /** The action and frame actually drawn (after `action`/`frame` redirects). */
  action: string;
  frame: number;
  delay: number;
  /** Visible parts, in draw order. */
  parts: AvatarPart[];
  /** Parts hidden by another item's slot claim (for the debug view). */
  hidden: AvatarPart[];
  /** Anchor points (navel, neck, hand, brow, …) relative to the feet. */
  anchors: Record<string, Vector>;
  /** Union of the visible parts' rectangles. */
  bounds: { left: number; top: number; right: number; bottom: number };
  /** `rotate` on a redirect frame; not applied (UNVERIFIED). */
  rotate: number;
}

export interface AvatarAction {
  name: string;
  frames: number;
  /** Each frame's delay in ms (missing delays count 100; negative ones as positive). */
  delays: number[];
  /** Total of `delays`. */
  duration: number;
}

export interface AvatarInfo {
  actions: AvatarAction[];
  expressions: AvatarAction[];
  /** Stance the weapon asks for: 1 (one-handed) or 2 (two-handed). */
  stand: number;
  walk: number;
  /** Item IDs that couldn't be found. */
  missing: number[];
}

// ---- layers and slots ---------------------------------------------------------------

interface Layers {
  /** z-layer name → draw order (front-most layer gets the largest number). */
  order: Map<string, number>;
  /** z-layer name → slot codes. */
  slots: Map<string, string[]>;
}

const layerCache = new WeakMap<WzFileSystem, Promise<Layers>>();

/** Splits `MaGw` into `Ma`, `Gw`. */
export function slotCodes(text: string): string[] {
  return text.match(/[A-Z][a-z0-9]/g) ?? [];
}

function loadLayers(fs: WzFileSystem): Promise<Layers> {
  let layers = layerCache.get(fs);

  if (!layers) {
    layers = (async () => {
      const zmap = await fs.get("Base/zmap.img");
      const smap = await fs.get("Base/smap.img");

      // zmap lists layers from the front-most to the back-most.
      const names = (zmap?.children() ?? []).map((c) => c.name);
      const order = new Map(names.map((n, i) => [n, names.length - i]));
      const slots = new Map<string, string[]>();

      for (const c of smap?.children() ?? []) {
        if (c.kind === "string") {
          slots.set(c.name, slotCodes(c.value as string));
        }
      }

      return { order, slots };
    })();

    layerCache.set(fs, layers);
  }

  return layers;
}

// ---- sources ------------------------------------------------------------------------

interface Source {
  id: number;
  /** The image root (holds `info`). */
  image: WzNode;
  /** The node holding the actions (differs for cash weapons). */
  root: WzNode;
  /** Larger claims win slots (and hide lower parts). */
  priority: number;
  vslot: string[];
  /** Only these child names are drawn (the head's ear variants are chosen by the look). */
  only?: string[];
}

/**
 * Slot-claim priority by equip type (`floor(id / 10000)`). Lower types are claimed over by
 * higher ones: a cap hides hair, a long-sleeved coat hides glove wrists, pants hide nothing of
 * the shoes. The order is chosen so every rule seen in the data reads sensibly (UNVERIFIED).
 */
const PRIORITY: Record<number, number> = {
  107: 10, // shoes
  106: 11, // pants
  108: 12, // gloves
  104: 13, // coat
  105: 13, // longcoat (overall)
  109: 14, // shield
  110: 16, // cape
  111: 17, // ring
  103: 18, // earrings
  102: 19, // eye accessory
  101: 20, // face accessory
  100: 21, // cap
};

const WEAPON_PRIORITY = 15;

function equipPriority(id: number): number {
  const type = Math.floor(id / 10000);

  if (type >= 130 && type < 180) {
    return WEAPON_PRIORITY;
  }

  return PRIORITY[type] ?? 9;
}

function isWeapon(id: number): boolean {
  return equipPriority(id) === WEAPON_PRIORITY;
}

/**
 * Cash weapons keep their actions under a weapon-type key (`Character/Weapon/01702000.img/33/…`).
 * Returns the node that holds the actions: the `preferred` type's when it has one.
 */
function weaponActions(root: WzNode, preferred?: number): WzNode {
  if (root.child("stand1") || root.child("stand2")) {
    return root;
  }

  const wanted = preferred !== undefined ? root.child(String(preferred)) : undefined;

  if (wanted?.kind === "property") {
    return wanted;
  }

  const typed = root.children().find((c) => /^\d+$/.test(c.name) && c.kind === "property");

  return typed ?? root;
}

async function loadSources(fs: WzFileSystem, look: Look): Promise<{ sources: Source[]; missing: number[] }> {
  const locations = await itemLocations(fs);
  const missing: number[] = [];
  const sources: Source[] = [];

  const add = async (id: number, path: string, priority: number, only?: string[]) => {
    const root = await fs.get(path);

    if (!root) {
      missing.push(id);

      return;
    }

    const actions = isWeapon(id) ? weaponActions(root, look.weaponType) : root;

    sources.push({ id, image: root, root: actions, priority, vslot: slotCodes(root.string("", "info/vslot")), only });
  };

  await add(2000 + look.skin, `Character/${pad(2000 + look.skin, 8)}.img`, 0);
  await add(12000 + look.skin, `Character/${pad(12000 + look.skin, 8)}.img`, 1, ["head", ...(look.ears === "none" ? [] : [EARS[look.ears].child])]);

  if (look.face) {
    await add(look.face, `Character/Face/${pad(look.face, 8)}.img`, 2);
  }

  if (look.hair) {
    await add(look.hair, `Character/Hair/${pad(look.hair, 8)}.img`, 3);
  }

  for (const id of look.equips) {
    const location = locations.get(id);

    if (!location || location.category !== "Equip") {
      missing.push(id);
      continue;
    }

    await add(id, location.path, equipPriority(id));
  }

  return { sources, missing };
}

// ---- info ---------------------------------------------------------------------------

function framesOf(node: WzNode | undefined): number {
  return (node?.children() ?? []).filter((c) => /^\d+$/.test(c.name)).length;
}

function delaysOf(node: WzNode | undefined): number[] {
  return (node?.children() ?? []).filter((c) => /^\d+$/.test(c.name)).map((c) => Math.abs(c.resolve()?.int(100, "delay") ?? 100));
}

function actionOf(name: string, node: WzNode | undefined, frames = framesOf(node)): AvatarAction {
  const delays = delaysOf(node);

  return { name, frames, delays, duration: delays.reduce((sum, d) => sum + d, 0) };
}

export async function avatarInfo(fs: WzFileSystem, look: Look): Promise<AvatarInfo> {
  const { sources, missing } = await loadSources(fs, look);
  const body = sources.find((s) => s.priority === 0);
  const face = sources.find((s) => s.priority === 2);
  const weapon = sources.find((s) => isWeapon(s.id));

  const actions = (body?.root.children() ?? [])
    .filter((c) => c.name !== "info")
    .map((c) => actionOf(c.name, c.resolve()))
    .filter((a) => a.frames > 0);

  const expressions = (face?.root.children() ?? [])
    .filter((c) => c.name !== "info")
    .map((c) => actionOf(c.name, c.resolve(), c.name === "default" ? 1 : undefined))
    .filter((a) => a.frames > 0);

  return {
    actions,
    expressions,
    stand: weaponStance(weapon, "stand"),
    walk: weaponStance(weapon, "walk"),
    missing,
  };
}

/** 1 or 2: from `info/stand` / `info/walk`, or from which actions a cash weapon has. */
function weaponStance(weapon: Source | undefined, kind: "stand" | "walk"): number {
  if (!weapon) {
    return 1;
  }

  const declared = weapon.image.int(0, `info/${kind}`);

  if (declared === 1 || declared === 2) {
    return declared;
  }

  return !weapon.root.child(`${kind}1`) && weapon.root.child(`${kind}2`) ? 2 : 1;
}

// ---- composing ----------------------------------------------------------------------

interface RawPart {
  source: Source;
  name: string;
  node: WzNode;
  layer: string;
  origin: Vector;
  map: Record<string, Vector>;
}

function readMap(node: WzNode): Record<string, Vector> {
  const out: Record<string, Vector> = {};

  for (const c of node.get("map")?.children() ?? []) {
    if (c.kind === "vector") {
      out[c.name] = c.value as Vector;
    }
  }

  return out;
}

/** The canvases of one frame node; a property whose children are per-skin canvases picks the skin. */
function frameParts(source: Source, frame: WzNode, skin: number): RawPart[] {
  const parts: RawPart[] = [];

  for (const child of frame.children()) {
    if (source.only && !source.only.includes(child.name)) {
      continue;
    }

    let node = child.resolve();

    if (node?.kind === "property") {
      node = node.get(String(skin)) ?? node.get("0");
    }

    if (!node || node.kind !== "canvas") {
      continue;
    }

    parts.push({
      source,
      name: child.name,
      node,
      layer: node.string("", "z"),
      origin: node.vector("origin") ?? { x: 0, y: 0 },
      map: readMap(node),
    });
  }

  return parts;
}

/** Follows body-frame redirects (`action` + `frame`, with optional `move`, `delay`, `rotate`). */
function resolveBodyFrame(body: WzNode, action: string, frame: number) {
  let node = body.get(`${action}/${frame}`);
  let move = { x: 0, y: 0 };
  let delay: number | null = null;
  let rotate = 0;

  for (let hop = 0; node && node.child("action") && hop < 4; hop++) {
    const m = node.vector("move");

    if (m) {
      move = { x: move.x + m.x, y: move.y + m.y };
    }

    if (delay === null && node.child("delay")) {
      delay = node.int(100, "delay");
    }

    rotate ||= node.int(0, "rotate");
    action = node.string("", "action");
    frame = node.int(0, "frame");
    node = body.get(`${action}/${frame}`);
  }

  return { node, action, frame, move, delay: delay ?? node?.int(100, "delay") ?? 100, rotate };
}

export async function composeAvatar(
  fs: WzFileSystem,
  look: Look,
  action: string,
  frame: number,
  expression = "default",
  expressionFrame = 0,
): Promise<AvatarFrame | null> {
  const layers = await loadLayers(fs);
  const { sources } = await loadSources(fs, look);
  const body = sources.find((s) => s.priority === 0);

  if (!body) {
    return null;
  }

  const resolved = resolveBodyFrame(body.root, action, frame);

  if (!resolved.node) {
    return null;
  }

  const showFace = resolved.node.int(1, "face") !== 0;
  const raw: RawPart[] = [];

  for (const source of sources) {
    if (source.priority === 2) {
      if (!showFace) {
        continue;
      }

      const faceNode = expression === "default" ? source.root.get("default") : source.root.get(`${expression}/${expressionFrame}`);

      if (faceNode) {
        raw.push(...frameParts(source, faceNode, look.skin));
      }

      continue;
    }

    let node = source === body ? resolved.node : source.root.get(`${resolved.action}/${resolved.frame}`);

    // Face accessories follow the face: keyed by expression, not by body action. Parts with no
    // frames for the action (all but the body's for `dead`, the ghost) show on their own: the
    // head as `front`, hair and caps as `default`.
    if (!node && showFace) {
      node = expression === "default" ? undefined : source.root.get(`${expression}/${expressionFrame}`);
      node ??= source.root.get("default") ?? source.root.get("front");
    }

    if (node) {
      raw.push(...frameParts(source, node, look.skin));
    }
  }

  // ---- anchors: start at the body's origin (the feet) and spread through shared map points.

  const anchors: Record<string, Vector> = {};
  const placed = new Map<RawPart, Vector>();
  const start = raw.find((p) => p.source === body && p.name === "body") ?? raw.find((p) => p.source === body);

  const place = (part: RawPart, at: Vector) => {
    placed.set(part, at);

    for (const [k, v] of Object.entries(part.map)) {
      anchors[k] ??= { x: at.x + v.x, y: at.y + v.y };
    }
  };

  if (start) {
    place(start, { x: 0, y: 0 });
  }

  for (let progress = true; progress; ) {
    progress = false;

    for (const part of raw) {
      if (placed.has(part)) {
        continue;
      }

      const key = Object.keys(part.map).find((k) => anchors[k]);

      if (key) {
        place(part, { x: anchors[key].x - part.map[key].x, y: anchors[key].y - part.map[key].y });
        progress = true;
      }
    }
  }

  // ---- hiding: a part is hidden when a higher-priority source claims one of its slots.

  const claims = new Map<string, Source>();

  for (const s of [...sources].sort((a, b) => a.priority - b.priority)) {
    for (const code of s.vslot) {
      claims.set(code, s);
    }
  }

  const parts: AvatarPart[] = [];
  const hidden: AvatarPart[] = [];
  const readOrder = new Map<AvatarPart, number>();

  // Ears sit on the head: hair and earrings never hide them, only gear that removes them does.
  const earHider = sources.find((s) => s.image.int(0, "info/removeEar") === 1);
  const isEar = (part: RawPart) => part.source.only !== undefined && part.name !== "head";

  await Promise.all(
    raw.map(async (part, index) => {
      const at = placed.get(part) ?? { x: 0, y: 0 };
      const target = await fs.resolveCanvas(part.node);
      const canvas = target?.canvas ?? part.node.canvas();
      const blocker = isEar(part) ? earHider : (layers.slots.get(part.layer) ?? [])
        .map((code) => claims.get(code))
        .find((owner) => owner && owner.priority > part.source.priority);

      const out: AvatarPart = {
        source: part.source.id,
        name: part.name,
        layer: part.layer,
        z: (layers.order.get(part.layer) ?? 0) * 100 + part.source.priority,
        canvas: part.node.path,
        x: at.x - part.origin.x + resolved.move.x,
        y: at.y - part.origin.y + resolved.move.y,
        width: canvas?.width ?? 0,
        height: canvas?.height ?? 0,
      };

      readOrder.set(out, index);

      if (blocker) {
        out.hiddenBy = blocker.id;
        hidden.push(out);
      } else {
        parts.push(out);
      }
    }),
  );

  // Same layer and source: keep the order the parts appear in the frame.
  parts.sort((a, b) => a.z - b.z || readOrder.get(a)! - readOrder.get(b)!);

  const bounds = { left: 0, top: 0, right: 0, bottom: 0 };

  for (const p of parts) {
    bounds.left = Math.min(bounds.left, p.x);
    bounds.top = Math.min(bounds.top, p.y);
    bounds.right = Math.max(bounds.right, p.x + p.width);
    bounds.bottom = Math.max(bounds.bottom, p.y + p.height);
  }

  return {
    action: resolved.action,
    frame: resolved.frame,
    delay: resolved.delay,
    parts,
    hidden,
    anchors,
    bounds,
    rotate: resolved.rotate,
  };
}

/** Equip type: `floor(id / 10000)`, with every weapon type folded into 130. */
export function equipType(id: number): number {
  const type = Math.floor(id / 10000);

  return type >= 130 && type < 180 ? 130 : type;
}

/**
 * Puts an item on: faces and hairs replace the current ones; an equip replaces any item of
 * the same type. An overall (105) replaces top (104) and bottom (106), and the reverse.
 */
export function wear(look: Look, id: number): Look {
  const type = Math.floor(id / 10000);

  if (type >= 2 && type < 3) {
    return { ...look, face: id };
  }

  if (type >= 3 && type < 5) {
    return { ...look, hair: id };
  }

  const t = equipType(id);
  const clashes = (other: number) => {
    const o = equipType(other);

    return o === t || (t === 105 && (o === 104 || o === 106)) || (o === 105 && (t === 104 || t === 106));
  };

  return { ...look, equips: [...look.equips.filter((e) => !clashes(e)), id] };
}

/** Starter looks from `Etc/MakeCharInfo.img`, per gender. */
export interface StarterOptions {
  skins: number[];
  male: Record<string, number[]>;
  female: Record<string, number[]>;
}

export async function readStarterOptions(fs: WzFileSystem): Promise<StarterOptions | null> {
  const root = await fs.get("Etc/MakeCharInfo.img/0");

  if (!root) {
    return null;
  }

  const lists = (node: WzNode | undefined) => {
    const out: Record<string, number[]> = {};

    for (const kind of node?.children() ?? []) {
      out[kind.name] = kind
        .children()
        .filter((c) => /^\d+$/.test(c.name) && c.kind !== "property")
        .map((c) => c.int(0));
    }

    return out;
  };

  return {
    skins: (root.get("info/skin")?.children() ?? []).map((s) => s.int(0, "id") - 12000),
    male: lists(root.get("male")),
    female: lists(root.get("female")),
  };
}
