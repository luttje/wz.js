# Map tree

`Map/Map/Map<first digit>/<id 9 digits>.img`: 334 maps in `Map0`, 2 in `Map9`. Names are
in `String/Map.img/<region>/<id>`. Statistics: [generated/map.md](generated/map.md),
[map-back](generated/map-back.md), [map-obj](generated/map-obj.md), [map-tile](generated/map-tile.md).
Example: `Map/Map/Map0/000000010.img` (Mushroom Town).

| Node | Fields | Meaning |
|---|---|---|
| `info` | `bgm`, `returnMap`, `forcedReturn`, `town`, `mobRate`, `fieldLimit`, `VRLeft/Top/Right/Bottom`, `MRLeft/…`, `mapMark`, `swim`, `fly`, `hideMinimap`, `cloud`, `fieldType`, `version`, `onUserEnter`, `onFirstUserEnter`, `fieldScript` | `bgm` `Bgm00/FloralLife` means `Sound/Bgm00.img/FloralLife`. `forcedReturn` 999999999 = none. `fieldLimit` is a bit set of restrictions; the bits we name are in `FIELD_LIMITS` in `src/model/map.ts` (checked against Truth Booth, `089000000`, and matching the rules meowdb lists for it; other set bits are unnamed), and `mapRules` lists a map's. `limitSpeedAndJump` = 1 means default speed and jump, and `noSkill/skill/<n>` lists skills that can't be used. `VR*` is the camera's range; `MR*` probably the minimap range (`UNVERIFIED`). `mapMark` names an icon in `Map/MapHelper.img/mark`. `version` is always 10. Script hooks are names only. |
| `back/<n>` | `bS`, `no`, `ani`, `x`, `y`, `rx`, `ry`, `cx`, `cy`, `type`, `a`, `front`, `f` | Backgrounds; see `rendering.md`. |
| `<0-7>/info/tS` | string | The layer's tile set. |
| `<0-7>/tile/<n>` | `x`, `y`, `u`, `no`, `zM` | Tiles; `u` is the variant (`bsc`, `enH0`, `edD`, …). |
| `<0-7>/obj/<n>` | `oS`, `l0`, `l1`, `l2`, `x`, `y`, `z`, `zM`, `f`, plus rare `r`, `move`, … | Objects. Ones whose animation node has `obstacle` = 1 are traps: touching a frame's `lt`–`rb` box costs `damage` HP (some traps have none), knocks back along `dir`, and may put the monster skill status `disease` on the player at `level` (`SceneObject.obstacle`). |
| `foothold/<layer>/<group>/<id>` | `x1`, `y1`, `x2`, `y2`, `prev`, `next` | Walkable segments, chained into floors by `prev` / `next` (0 = none). |
| `ladderRope/<n>` | `l`, `uf`, `x`, `y1`, `y2`, `page`, `piece` | Ladders (`l` 1) and ropes (`l` 0). |
| `seat/<n>` | vector | Benches and other map seats: the point the character sits at (Henesys has 29). The sit key (X) sits on one within 20 px. |
| `portal/<n>` | `pn`, `pt`, `x`, `y`, `tm`, `tn` | Portals: name, type (see below), position, target map (`tm`, 999999999 = none) and the portal there (`tn`). |
| `life/<n>` | `type`, `id`, `x`, `y`, `cy`, `fh`, `rx0`, `rx1`, `f`, `hide`, `mobTime` | Spawns: `type` `m` mob / `n` NPC; `id` is an unpadded string; `rx0`…`rx1` is the patrol range; `mobTime` −1 … 10800. |
| `reactor/<n>` | `id`, `x`, `y`, `f`, `name`, `reactorTime` | Reactor placements. |
| `miniMap` | `canvas`, `centerX`, `centerY`, `width`, `height`, `mag` | Minimap image and its mapping to world coordinates (`mag` is always 4). The canvas is the map at 1 / 2^`mag` scale: a map point (x, y) is at ((x + `centerX`) / 2^`mag`, (y + `centerY`) / 2^`mag`) in it (Henesys: 6896 × 1189 → 431 × 74). |

Portal type names come from `Map/MapHelper.img/portal/editor` (`portalTypeNames` in
`src/model/map-scene.ts`): `pt` indexes that list, except that `pgi` is pt 5. pt 0 portals
are named `sp`, pt 2 portals are the visible doors (`pv`), pt 6 portals are `tp` and pt 7
(`ps`) are the visible doors that run a script. `pi`, `ph`, `psh`, `psi` and `pgi` are hidden
(`HIDDEN_PORTALS`; the names are `UNVERIFIED`).

## Minimap art

- **Frame and buttons:** `UI/MiniMap.img`. `MinMap` and `MaxMap` are nine-piece frames
  (`nw`, `n`, `ne`, `w`, `e`, `sw`, `s`, `se`, `c`). `MinMap` has a 29-pixel title bar and
  `MaxMap` a 72-pixel header with room for the map mark and names. `Min` (`w`, `c`, `e`,
  20 pixels high) is the collapsed bar. `title` is the "MINI MAP" label. `BtMin`, `BtMax`
  and `BtMap` (WORLD) are buttons with origin (0, 0), so their places aren't in the data.
  The `*Mirror` variants are a later skin.
- **Markers:** `Map/MapHelper.img/minimap/<name>`, centred on their origin: `user`, `npc`,
  `startnpc` / `endnpc` (quest to give / to hand in), `shop`, `portal`, `hiddenportal`,
  `transport`, `trunk`, and others the game doesn't need.

## World maps

`Map/WorldMap/WorldMap<NNN>.img`, one per region. In this client there are only two:
`WorldMap000` (Maple Island) and `WorldMap001` (Victoria Island). Neither has a
`info/parentMap` or a `MapLink`.

| Node | Meaning |
|---|---|
| `info/WorldMap` | The image's own name. |
| `BaseImg/0` | The painted map (636 × 466 for Victoria Island). Its origin is the centre that the spots are relative to. |
| `MapList/<n>/spot` | Spot position, relative to the base image's origin. |
| `MapList/<n>/type` | Icon: `Map/MapHelper.img/worldMap/mapImage/<type>` (0 … 4). Towns use 0 and dungeon entrances 2; the rest is `UNVERIFIED`. |
| `MapList/<n>/mapNo/<i>` | The maps the spot stands for, as 9-digit IDs without padding (Henesys `10001000`). |
| `MapList/<n>/title` | Optional name (`Victoria Island Dungeon`). |

The "you are here" arrow is `Map/MapHelper.img/worldMap/curPos/0…3` (a 180 ms bob). The
window frame is `UI/WorldMap.img/Border/0…7` (corners and edges clockwise from the
top-left) with the title `UI/WorldMap.img/title`.
