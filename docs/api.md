# API

Every module is its own entry point: `wz.js/<path>` is `src/<path>.ts`. None of them touch
the DOM, and only `wz.js/sources/node` needs Node, so the reader runs the same in a browser
tab, a worker or Node. Everything reads the user's own files; nothing is fetched from
elsewhere.

Layering:

```
wz.js/fs, node, …      bytes → archives → images → nodes          (no game knowledge)
wz.js/decode/pixels    canvas payloads → RGBA pixels              (worker-friendly)
wz.js/model/*          nodes → typed game data (items, maps, …)   (pure functions of a WzFileSystem)
```

Drawing is left to you (PixiJS for maps and animations and a 2D canvas for characters both
work well); [rendering.md](rendering.md) describes the rules a renderer has to follow.

## Reading the files

### Byte sources

```ts
interface ByteSource {
  readonly name: string;
  readonly size: number;
  readRange(offset: number, length: number): Promise<Uint8Array>;
}
```

| Module | Source |
|---|---|
| `wz.js/sources/file` | `BlobSource`: a browser `File` or `Blob`. |
| `wz.js/sources/node` | `NodeFileSource.open(path, name)`: a file on disk, read-only (Node only). |
| `wz.js/sources/http` | `HttpRangeSource`: HTTP `Range` requests, e.g. a dev server serving the data folder. |
| `wz.js/source` | `MemorySource` (tests), and `CachedSource`, which wraps any source in a 64 KB block LRU (256 blocks by default). |

### WzFileSystem (`wz.js/fs`)

```ts
import { WzFileSystem } from "wz.js/fs";

const fs = await WzFileSystem.open(files);      // files: { path: "Map/Map_000.wz", source }[]
fs.version;                                     // 779 (auto-detected)
fs.trees();                                     // ["Base", "Character", …]

const map = await fs.get("Map/Map/Map0/000000010.img/info");
map?.string("", "bgm");                         // "Bgm00/FloralLife"

for (const image of fs.imagesUnder("Npc")) { /* lazy: image.load() parses */ }
```

- `open(files, { maxLoadedImages, cache, cacheBlocks, layout })` mounts every `.wz` (PKG1)
  and `.ms` (pack) file. Paths are relative to the `Data` folder; `X.ini` files,
  `Packs/Packs.ini` and stubs are understood ([data-layout.md](data-layout.md)). Mount
  problems are collected in `fs.warnings` rather than thrown; archives and packs that can't
  be opened are skipped and listed in `fs.unsupported`. `maxLoadedImages` (default 512)
  bounds the parsed-image LRU; `cacheBlocks` (default 256) bounds each file's block cache.
- `layout()` returns the archive directories and pack entry tables as plain data
  (`MountLayout`). Passing it back as `open(sameFiles, { layout })` mounts the same tree
  without reading any directory, e.g. on another thread. It rests on
  `WzArchive.restore(source, archive.layout())` and `MsPack.restore(source, pack.layout())`.
- `get(path)` resolves a tree path through directories into an image and on into its nodes
  (UOLs followed). Images are parsed on first use and kept in an LRU.
- `entry(path)`, `image(path)`, `imagesUnder(path)`, `splitAtImage(path)`: directory access.
- `resolveCanvas(node)` follows `_outlink` / `_inlink` to the canvas that holds the pixels
  and returns `{ canvas, via }`; `readPayload(canvas)` returns the compressed bytes.

Lower layers, for tools: `wz.js/archive` (`WzArchive`, one PKG1 file), `wz.js/ms/pack`
(`MsPack`, one `.ms` pack), `wz.js/image` (`parseImage`, `FormatStats`), `wz.js/crypto` and
`wz.js/cursor`. Their formats are in [wz-format.md](wz-format.md).

### WzNode (`wz.js/node`)

```ts
node.kind;               // "property" | "int" | "float" | "string" | "vector" | "canvas" | "sound" | "uol" | …
node.children();         // ordered
node.child("name");      // no UOL resolution
node.get("a/b/../c");    // relative path, UOLs followed (cycles stop safely)
node.resolve();          // follow a UOL
node.int(def, path?);    // typed getters accept numeric strings: int, float, string, vector, canvas, sound
node.path;               // "Mob/0000002.img/move/0"
```

A node may really be named `.` (the decimal point in the number fonts): `get` treats `.` as
"this node" only when no such child exists.

`CanvasData`: `width`, `height`, `format`, `scale`, payload location. `SoundData`:
`durationMs`, `header`, payload location (MP3 bytes).

## Pixels (`wz.js/decode/pixels`)

```ts
import { decodeCanvas, premultiply } from "wz.js/decode/pixels";

const bytes = await fs.readPayload(canvas);
const image = await decodeCanvas(bytes, canvas.width, canvas.height, canvas.format, canvas.scale);
// image.rgba: Uint8Array, width * height * 4, straight alpha
premultiply(image.rgba);   // in place, for GPU textures that want premultiplied alpha
```

Formats 1, 2, 513 (with `scale`), 1026, 2050 are decoded; others throw
`UnsupportedFormatError` (`placeholder(w, h)` makes a magenta image). It uses only
`DecompressionStream`, so it runs in workers: a small pool of decode workers keeps large
maps from stalling the main thread.

## Game data (`wz.js/model/*`)

All readers take the mounted `WzFileSystem` and return plain, serialisable objects (or
`null`). The data each one reads is described in [data-model/](data-model/README.md).

| Module | Function | Returns |
|---|---|---|
| `strings` | `loadStrings(fs)` | Name and text tables (items, equips incl. faces and hairs, mobs, NPCs, maps, skills). Cached per file system; `resetStringCache()` drops the cache (tests). |
| `item` | `itemLocations(fs)`, `readItem(fs, id)` | Where each item lives; one item with `info`, `spec`, icons, names. |
| `item` | `itemImages(fs)`, `imageItems(fs, image)`, `readItemAt(fs, location)` | The same lookup image by image: every image that holds items, in lookup order (no loading); the items one image holds (bundles are loaded); one item at a known location. |
| `mob` | `readMob(fs, id, options?)` | Stats, animations (frames with real sizes), attacks, skills, elements, `link`, sounds (links to another monster's audio resolved, with `from`). `options.sounds: false` skips the sounds. |
| `mob` | `readMobSounds(fs, id)` | A monster's entry in `Sound/Mob.img` (`{ path, sounds }`), or `null`. That image can be hundreds of MB, so callers reading many monsters can read sounds separately. |
| `mob-skill` | `readMobSkill(fs, id)` | A monster skill's levels (the status it causes, its numbers and effects). |
| `npc` | `readNpc(fs, id, options?)` | Name, function, speech (balloon lines, citizenship sets), animations, scripts. |
| `map` | `readMap(fs, idOrPath, options?)` | All map data, including seats, areas and `noSkill`. `layout: false` skips footholds, ladders, layers, backgrounds and the minimap. `copies` maps IDs that have no image to the map they are built from. |
| `map` | `mapRules(info)`, `FIELD_LIMITS` | The restrictions a map's `info` sets (named `fieldLimit` bits, `limitSpeedAndJump`). |
| `map-scene` | `readMapScene(fs, idOrPath, options?)` | The map with every asset resolved for drawing: tiles, objects (traps with their `obstacle`), backgrounds, life, reactors, portals. `options.copies` as for `readMap`; `options.trapDamage(path)` gives damage to traps the data leaves without one. |
| `map-scene` | `portalTypeNames(fs)`, `HIDDEN_PORTALS` | Portal type names by `pt`; the types not shown to players. |
| `world-map` | `readWorldMaps(fs)` | Every `Map/WorldMap` image, with its spots. |
| `quest` | `readQuest(fs, id)`, `readQuestCategories(fs)`, `readRecurringGroups(fs)` | Conditions, actions, dialogue (keyed lines, branches), log texts; area titles and groups; daily and weekly quest pools. |
| `skill` | `readSkill(fs, id, options?)`, `readSkillBook(fs, job)`, `readJobs(fs)` | Level tables (with `common` values added), formulas, texts, effects (also per level); a job's skill book; the job list. |
| `skill` | `jobImagePaths(fs)`, `readJob(fs, path)` | The job images (`Skill/100.img`, …) without loading them; one job from its image. |
| `reactor` | `readReactor(fs, id, options?)` | States, idle/hit animations, events. |
| `pet` | `readPet(fs, id)` | Hunger, commands, food reactions and what the pet says. |
| `craft` | `readCraftRecipes(fs)` | Every crafting recipe: profession, level, ingredients, cost, result, EXP. |
| `commodity` | `readCommodities(fs)` | The client's Cash Shop commodity list (`Etc/Commodity.img`). |
| `edition` | `detectEdition(fs)` | `"classic"` or `"current"`: whether third and fourth job skill books exist (Classic World has none). |
| `animation` | `readAnimation(node)`, `readAnimations(node)`, `resolveFrameSizes(fs, anims)` | Frames with origin, delay (default 100 ms), z, a0/a1, vectors. |
| `afterimage` | `readAfterimage(fs, set, level, action)` | A weapon swing trail: the body frame it starts on and its frames (real sizes). `afterimageBracket(brackets, level)` picks the level bracket. |
| `avatar` | `composeAvatar(fs, look, action, frame, expression?, expressionFrame?)` | One character frame: positioned parts in draw order, hidden parts, anchors, bounds, delay. |
| `avatar` | `avatarInfo(fs, look)`, `readStarterOptions(fs)` | Available actions (with frame delays) and expressions, weapon stance; character-creation choices. |
| `avatar` | `wear(look, id)` | A look with one item put on (slot conflicts resolved). |
| `formula` | `evaluate(text, x)` | Safe evaluator for `common` skill formulas (`u`, `d`, `log`, `min`, `max`, `abs`). |
| `media` | `mediaImages`, `soundsIn`, `visualsIn` | Listing sounds and animations in media images. |
| `mob`, `npc`, `map`, `quest`, `reactor` | `mobIds`, `npcIds`, `mapIds`, `questIds`, `reactorIds` | Every ID of a kind. |

Reader `options` are `{ frameSizes?: boolean }`. With `frameSizes: false` the 1x1 placeholder
sizes of linked frames are kept instead of being looked up in the `_Canvas` archives, which
is much faster when only icon paths are needed.

```ts
import { readMob } from "wz.js/model/mob";
import { composeAvatar, DEFAULT_LOOK, wear } from "wz.js/model/avatar";

const snail = await readMob(fs, 2);
snail?.animations.find((a) => a.name === "move")?.frames.length;   // 5

const look = wear(DEFAULT_LOOK, 1402002);                           // two-handed sword
const frame = await composeAvatar(fs, look, "stand2", 0);
frame?.parts.map((p) => p.layer);                                   // back to front
```

IDs: `wz.js/model/ids` has `pad`, `imageName(id, kind)` (zero-padded image names),
`parseId`, `jobOfSkill`.

## Extending the models

A game that adds data of its own can extend the model types with TypeScript's module
augmentation instead of forking them. A game that adds quests of its own could record
where they are given and handed in like this:

```ts
declare module "wz.js/model/quest" {
  interface Quest {
    placed?: { start: string; end: string; repeatable: boolean };
  }
}
```
