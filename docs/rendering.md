# Rendering

How the client data turns into pictures, as implemented and checked by screenshot. Each
rule names an example that demonstrates it. This package resolves the assets and composes
the frames (`src/model/animation.ts`, `map-scene.ts`, `avatar.ts`, `afterimage.ts`); the
drawing itself is up to you, and these are the rules a renderer has to follow.

## Canvases

- A canvas is drawn with its **`origin` on the anchor point**: top-left corner at
  `anchor − origin`. Example: Heena's `Npc/0000001.img/stand/0` has origin (27, 55) on a
  56×55 image, so the anchor is at the bottom of her feet.
- Pixels may live elsewhere (`_outlink`, `_inlink`; see [wz-format.md](wz-format.md)). The **frame
  properties come from the placeholder**, but its width and height are 1×1: the real size
  must be read from the link target. (Using the placeholder size breaks any layout that
  depends on frame bounds.)
- Mirroring (`f = 1`, or a mob facing right) flips around the anchor: `x' = anchor − (x − anchor)`.

## Animation timing

- An animation is a node whose numbered children (`0`, `1`, …) are canvases or UOLs to
  canvases, played in numeric order. Non-numeric children (`zigzag`, `repeat`, …) are
  options. Example: `Mob/0000002.img/move` (5 frames).
- Each frame shows for its `delay` in ms. When `delay` is missing, 100 ms is used
  (it matches the visible pace of NPC idles). `delay` may
  be an int or a numeric string (`Npc/0000001.img/stand/0/delay` is `"1500"`).
- `zigzag = 1`: play forward, then backward without repeating the end frames
  (0 1 2 3 4 3 2 1 0 1 …). Example: the Snail's `move`.
- A character's looping `stand1`/`stand2` play forward then backward (0 1 2 1 0 …) like a zigzag,
  about 2.2 s a cycle in the live game. An NPC with `say<n>` animations (a mouth opening and
  closing) plays one now and then in place of `stand`.
- Looping: animations loop unless `repeat = 0` (`UNVERIFIED`: rare). Death animations
  (`die1`) should play once in a game; the viewer loops everything for inspection.
- Alpha fades: when a frame has `a0`/`a1` (0–255), alpha goes linearly from `a0` to `a1`
  over the frame's delay. Seen on reactors (`Reactor/<id>.img/<state>/hit/<n>`: a0 255,
  a1 0) and skill effects.
- Frame vectors: `lt`/`rb` (body box corners relative to the origin), `head`, and others
  aren't drawn; they are handy as a debug overlay. Example: Snail `stand/0` has `lt` (−18, −26), `rb` (19, 0).
- A frame can be a UOL to another frame of the same image (`Npc/0000002.img/move/<n>`
  → `0`).

## Maps

Implementation: `src/model/map-scene.ts` (asset resolution). Verified by screenshots of Mushroom Town
(`000000010`), Mushroom Town - West Entrance (`000000001`), Snail Hunting Ground I
(`000000040`), Amherst (`000001010`), Henesys (`010001000`) and East Domain of Perion
(`010004090`, 22 backgrounds with 19 distinct `rx` values).

### Asset locations

| Element | Path | Notes |
|---|---|---|
| Tile | `Map/Tile/<layer info/tS>.img/<u>/<no>` | One canvas; the tile set is per layer (`<layer>/info/tS`). |
| Object | `Map/Obj/<oS>.img/<l0>/<l1>/<l2>` | An animation (numbered frames; most have one). |
| Background | `Map/Back/<bS>.img/back/<no>` (`ani` = 0) or `…/ani/<no>` (`ani` = 1) | Still or animation. `bS` may be empty: skip that entry. |
| Visible portal | `Map/MapHelper.img/portal/game/pv/default` | 8-frame animation. |
| Mob / NPC | `Mob/<id>.img` / `Npc/<id>.img`, `stand` (else `move`/`fly`) | Follow `info/link`. |
| Reactor | `Reactor/<id>.img/0` | State 0 idle frames. |

Every element is drawn with its frame's origin at the element's `(x, y)`; `f = 1` mirrors.
Mobs and NPCs stand at `(x, cy)` (`cy` is the ground below the spawn point).

### Draw order

1. Backgrounds with `front = 0`, in index order.
2. For each layer 0 → 7:
   - objects, sorted by `z` (then index);
   - tiles, sorted by the tile canvas's `z`, or by the map's `zM` when that `z` is 0 (then index);
   - the mobs, NPCs and reactors whose foothold (`fh`) belongs to this layer.
3. Visible portals.
4. Backgrounds with `front = 1`.

With this order every checked map layers correctly (house fronts over walls, grass tiles over
the ground, NPCs in front of buildings). Whether objects should also use `zM` is
`UNVERIFIED`: no visible difference was found.

### Backgrounds

With the camera centred on world point C:

```
x = bx + C.x × (100 + rx) / 100
y = by + C.y × (100 + ry) / 100
```

- `rx = 0` keeps a background fixed on screen (skies: Mushroom Town `back/0` is a
  256×256 solid-blue tile with `rx = 0`, type 3).
- `rx = −100` fixes it to the world like a tile.
- Values in between scroll slower than the world: distant hills (`back/2`, rx −8) barely
  move; nearer rock pillars on the Perion map move noticeably. Checked by rendering
  `010004090` at camera x = −600 and x = 200: sky, horizon and pillars move by increasing
  amounts, as their depth suggests.
- Positions are rounded to whole pixels; fractional positions leave one-pixel seams
  between tiled copies.

| type | Tiling | Movement |
|---|---|---|
| 0 | none | parallax |
| 1 | horizontal | parallax |
| 2 | vertical | parallax |
| 3 | both | parallax |
| 4 | horizontal | moves horizontally at speed `rx`, anchored to the world on x |
| 5 | vertical | moves vertically at speed `ry` |
| 6 | both | moves horizontally at speed `rx` |
| 7 | both | moves vertically at speed `ry` |

Tile spacing is `cx` / `cy`, or the canvas size when 0. Moving speed is `rx × 5`
pixels per second (Mushroom Town's clouds, type 4, rx −5, drift left 133 px in 5.25 s in
the live game). Opacity is `a / 255`. Only types 0, 1, 3 and 4 occur in Classic
World maps (`rx` ranges −300 … 45, `ry` −100 … 8).

### Camera and bounds

The view range is `info/VRLeft/Top/Right/Bottom` (97% of maps); otherwise the footholds'
extent. The game's camera never leaves this rectangle, so content outside it can be
incomplete (background strips that end, for example). A viewer that zooms out past it
shows those edges; that is expected.

## Characters

Implementation: `src/model/avatar.ts` (composition). Data layout:
[data-model/character.md](data-model/character.md). Verified by screenshots of composed
characters: male and female beginners
(`Etc/MakeCharInfo.img`), a cash outfit (Cat Hat, hooded vest, hip-hop pants, Air H's, boxing
gloves, Nymph Wing, Bouquet, Leather Mask), a two-handed sword (`1402002`), Brown Skullcap
(`1002000`) and Iron Burgonet Helm (`1002087`), in `stand`, `walk`, `swingT1` and
`ladder`, facing both ways.

### Parts of one frame

For action `A` and frame `n`:

| Source | Node | Notes |
|---|---|---|
| Body | `Character/<2000 + skin>.img/A/n` | `body`, `arm`, `hand`, `lHand`, `rHand`, `armOverHair`; `delay`; `face` (0 hides the face). |
| Head | `Character/<12000 + skin>.img/A/n` | Draw `head` plus the one ear variant the look picks: `humanEar`, `ear` (elf), `lefEar` or `highlefEar`. Ears ignore slot claims (hair and earrings share their layers' slots); only an equip with `info/removeEar = 1` hides them. |
| Face | `Character/Face/<id>.img/<expression>/<k>` or `…/default` | Expressions: `default`, `blink`, `hit`, `smile`, … (25). |
| Hair | `Character/Hair/<id>.img/A/n` | `hair`, `hairOverHead`, `hairBelowBody`, `backHair`…; `hairShade` holds one canvas per skin (`hairShade/<skin>`). |
| Equip | `<equip image>/A/n` | Caps also have `default`; face accessories are keyed by **expression** like the face (`Accessory/01017002.img/blink/0/default`), not by action. |
| Cash weapon | `<weapon image>/<type>/A/n` | Actions sit under a weapon-type key (`Weapon/01702000.img/33/stand1`). |

Each part is a canvas whose `z` names its layer and whose `map` holds anchor points.

**Redirect frames.** 86 body frames hold `action` + `frame` instead of canvases (skill
actions such as `savage`, `burster1`): draw that action's frame for every source, offset by
`move`. They may set `delay` and `rotate`; `rotate` is not applied (`UNVERIFIED`).

### Positioning

1. Place the body canvas with its origin at the character position (the feet).
2. Every placed part adds its `map` points (relative to its origin) as world anchors: the body
   gives `navel` and `neck`, the arm `hand`, the head `brow`, `earOverHead`, `earBelowHead`.
3. Repeat: any unplaced part with a map point that is already an anchor goes at
   `anchor − map[point]` (its origin), and adds its own points.

Faces, hairs and caps attach at `brow`; coats and pants at `navel`; weapons at `hand`.
Example: `stand1/0` body `neck (−4, −32)`; head `neck (0, 15)` → the head's origin is 47 px
above the feet.

### Draw order

`Base/zmap.img` lists every layer name from the front-most (`mobEquipFront`) to the back-most;
a part is drawn in reverse list order of its `z`. Ties keep source and frame order.

### Hiding by slots

- Every item claims slots with `info/vslot`, two letters each (`CpH1H5` = Cp, H1, H5). Hair
  claims `H1…H6 Hf Hs Hb`, faces `Fc`, a skullcap `Cp H1 H5`, full helmets up to `Cp Hd H1…
  Fc Af Ay As Ae`.
- `Base/smap.img` gives each layer its slots (`hair` → `H2`, `hairOverHead` → `H1`,
  `face` → `Fc`, `head` → `Hd`, `mailArm` → `Ma Gw`, `pants` → `Pn So`).
- A part is hidden when one of its layer's slots is claimed by a **higher-priority** item.
  Priority, low to high: body, head, face, hair, shoes, pants, gloves, top/overall, shield,
  weapon, cape, ring, earrings, eye and face accessories, cap.

Results: a skullcap hides only `hairOverHead` (side hair stays visible under it); the Iron
Burgonet Helm hides head, face and all hair (its art is a whole head); long sleeves (`vslot
MaGw`, 4 coats) hide glove wrists. The priority order is our reading of the data,
chosen because it makes every combination checked look right (`UNVERIFIED` against the
client).

### Weapon stance

`info/stand` and `info/walk` (1 or 2) choose `stand1`/`stand2` and `walk1`/`walk2` for the
whole character; two-handed weapons use 2. Cash weapons have no `info/stand`: the stance
follows which actions they have. Actions a weapon lacks (e.g. `ladder`) simply omit it.

### Facing

Character sprites face left. Facing right mirrors the composed character around the feet.

### Swing trails (`Character/Afterimage`)

The white arc or streak drawn over an attack. Data layout:

```
Character/Afterimage/<set>.img/<bracket>/<action>/<n>/<k>   trail frame k (canvas)
                                         /<action>/lt, rb   the swing's box
```

- **Set.** A weapon names its set in `info/afterImage` (`Weapon/01302000.img/info/afterImage`
  = `swordOL`, beside `info/sfx` = `swordL` for the sound); bare hands use `barehands`. Sets:
  `axe`, `barehands`, `crossBow`, `mace`, `poleArm`, `spear`, `swordOL`, `swordOS`, `swordTL`,
  `swordTS`. Examples: spears `spear`, polearms `poleArm`, two-handed swords and bows
  `swordTS`, crossbows `crossBow`, daggers `swordOS`, claws `swordOL`, wands and staves
  `mace`, two-handed axes and blunt weapons `axe`.
- **Bracket.** Numbered by character level: `0`–`10` (`barehands` `0`–`16`), chosen as
  `level / 10` capped at the last one (`UNVERIFIED`: other versions do this; the client data
  only has the numbers). They mostly repeat each other: `swordOL/swingO1` is the same 79×68
  frame in `0`–`9` and a larger 87×83 one in `10`. Most sets also have a `charge` bracket
  (charged weapons; `charge/1`, …), not used yet.
- **Action.** The body action the trail belongs to. `swordOL`, `swordOS`, `mace`:
  `swingO1`–`3`, `swingOF`, `stabO1`, `stabO2`, `stabOF`, `proneStab`; `swordTL`, `swordTS`,
  `axe`: the same with `swingT1`–`3`, `swingTF` for the swings, and `swordTS` also has
  `shoot1` and `shootF` (bows); `spear`, `poleArm`: `swingT2`, `swingP1`, `swingP2`,
  `swingPF`, `stabT1`, `stabT2`, `stabTF`, `proneStab`; `crossBow`: `swingT1`, `stabT1`,
  `proneStab`, `shoot2`; `barehands`: `stabO1`, `stabO2`, `proneStab`. A set without the
  action draws nothing.
- **`n`**, the only numbered child of the action: the **body frame the trail appears on**
  (`swingO1` 2, `swingOF` 3, `stabO1` 1, `shoot2` 4). Its children `0`, `1`, … are the trail's
  own frames with `origin`, `delay` and `a1 = 0` on the last: a swing is one 200 ms frame that
  fades out; a stab is a 30 ms frame and then a 200 ms fading one.
- **Placement.** The trail's origin goes on the **feet**, like the body, and it faces left;
  facing right mirrors it around the feet. Example: `swordOL/0/swingO1/2/0` is 79×68 with
  origin (97, 69), so it spans 97 to 18 px in front of the feet. `lt`/`rb` (here (−88, −62)
  and (−18, −6)) enclose the trail in the same coordinates: the swing's reach. Whether the
  client takes its attack range from them is `UNVERIFIED`.
- **Pixels.** `barehands`, `swordTL` and `swordTS` hold 1×1 `_outlink` placeholders into
  `Character/Afterimage/_Canvas/<set>.img/…`; the other sets have their pixels inline.
- `blank.img` has one empty property per set name, and `hit.img` holds hit sparks (`sword1`,
  `sword2`, `mace1`, `mace2`, `maceF`, `swordF`, `anniversary`, `anniversary2`), not trails.
  Neither is drawn.
- No skill has an `afterimage` of its own in this client.

Playback: draw the trail over the character, hidden until the attack action reaches frame
`n`, then play it once at its delays stretched by the same factor as the action (attack
speed and boosters). Drop it when the action is cut short before frame `n`. Normal attacks
and weapon skills (not spells) draw the weapon's trail for the action they play. Checked
with a sword, a spear and a bow, facing both ways.

Implementation: `readAfterimage()` in `src/model/afterimage.ts`.

### Death: the ghost and the tombstone

- **Ghost.** The body's `dead/0` is a 28×28 white wisp with a `neck` point and `face = 1`
  (one frame, no `delay`, no `move`). The head image (`000120xx.img`) has no `dead`, and
  neither do hair, caps or clothes. A part with no frames for an action falls back, when the
  face shows, to its `default` (hair, caps, face accessories), or `front` for the head (its
  `default`). Clothes and weapons have neither, so the ghost is the wisp with the player's
  head, face, hair and cap, which matches screenshots of the live game. The ghost bobs in the
  live game; the frame is still and the data says nothing about the motion (floating it up
  6 px and back every 2 s on a sine looks right, `UNVERIFIED`).
- **Tombstone** (`Effect/Tomb.img`). `fall` has 20 frames: 0–11 the stone spinning (38–40 px
  wide, 80 ms each), 12–18 the dust of its landing (85–97 px, 100–150 ms) and 19 the stone at
  rest. `land/0` is a UOL to `fall/19`. The stone falls during frames 0–11
  (960 ms), speeding up, from just above the top of the screen onto the player's feet, and
  `land` stays there until the player is revived (`UNVERIFIED`: the client holds no height
  or speed). It is drawn behind the player, as in the live game.
- `condition1` is a dated variant (`dateStart` 201309050000, `dateEnd` 201309260000) with
  the same `fall`/`land` frames and a `landEffect` of 43 empty 1×1 canvases: a 2013 event
  stripped from Classic World, so it is not used.
- The sound is `Sound/Game.img/Tombstone`.
