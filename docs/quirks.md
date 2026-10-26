# Quirks

Surprising things in the data. Each entry names an example so it can be checked.

## Files and archives

- **Two clients in one install.** The Steam install's top-level `Data/` is the live
  MapleStory client; Classic World is in `MSCW/Data/`. See [data-layout.md](data-layout.md).
- **Stub `.wz` files are not empty.** `X.wz` is a valid PKG1 archive whose directory lists
  the sub-folders of `X` as empty directories (e.g. `Npc/Npc.wz` lists `_Canvas`).
  `Base/Base.wz` lists all fifteen tree names.
- **Empty archives exist.** `Etc/Script/Script_000.wz`, `Mob/QuestCountGroup/QuestCountGroup_000.wz`
  and others are 63-byte archives with an empty root directory. Their version can't be
  detected, because any candidate validates.
- **Chrome and Edge hide the `.ini` files.** On Windows, Chromium rates `.ini` as a dangerous
  download type, and File System Access directory listings (picker, remembered folder,
  dropped folder) leave those files out. Firefox's entries API lists them. So a browser
  app should confirm each tree by its stub `X/X.wz`, and the `LastWzIndex` check only runs where the
  `.ini` files show up.
- **Mob and Skill are only in `.ms` packs.** `Mob.ini` and `Skill.ini` say `LastWzIndex|-1`.
  Only the `_Canvas` sub-folders are PKG1; the images are in `Packs/*.ms`.
- **Keys depend on the pack's file name.** `.ms` keys are derived from the lower-cased file
  name, so a renamed pack can't be opened. Both Classic World packs share the same salt
  (`alDFd@e1DFSG0wl950mc#^`).
- **Counter reset in the pack entry table.** The entry table's ChaCha20 counter restarts at
  0 whenever a field ends exactly on a 64-byte keystream block. See `wz-format.md`.
- **Only 1 KB of each pack image is encrypted.** The rest of each entry is plain image data.
- **A text file inside a pack.** `Packs/Skill_00000.ms` contains `Skill/pack_ignore.txt`
  (88 bytes), which is not an image.

## Canvases

- **Placeholder canvases with `_outlink`.** Canvases in main images are 1×1 format-1
  placeholders; the pixels live at the tree path in the `_outlink` string property
  (`Npc/0000001.img/stand/0` → `Npc/_Canvas/0000001.img/stand/0`). Placeholders keep the
  frame properties; targets have none.
- **Placeholder sizes.** A linked canvas reports width and height 1; the real size is only
  known after following the link (`Npc/0000001.img/stand/0` is really 56×55).
- **Shared `_outlink` targets.** Identical frames point at one target:
  `Npc/0000001.img/smile0/0` links to `Npc/_Canvas/0000001.img/stand/1`.
- **Truncated zlib streams.** Every pixel payload sampled lacks the zlib trailer; strict
  inflaters fail on the last bytes. See `wz-format.md`.
- **Scale instead of format 517.** The "RGB565, one pixel per 16×16 block" format appears as
  format 513 with the scale byte set to 4 (`Map/Back/back_dryRock.img/back/0`).
- **Unknown format 4098** in `Skill/_Canvas/800127.img` only (probably BC7).
- **Three ways to find pixels.** A canvas holds its pixels inline, or links to them with
  `_inlink` (a path within the same image: `Mob/0000003.img/stand/0` → `move/0`), or with
  `_outlink` (a full tree path, usually into `_Canvas`). Many pack canvases also carry a
  `_hash` string (64 hex digits), meaning `UNVERIFIED`.

## Strings

- **Escaped line breaks.** Descriptions contain the two characters `\` `n` (and `\r\n`),
  not a newline character: `String/Consume.img/2000000/desc` is
  `A potion made out of red herbs.\nRestores 100 HP.` with a literal backslash.
- **Zero-padding differs between images and strings.** `Mob/_Canvas/0000002.img` and
  `Npc/0000001.img` are named with 7 digits, but `String/Mob.img` and `String/Npc.img` key
  them without leading zeros (`2`, `1`). Map images and `String/Map.img` both use 9 digits
  (`000000010`). Skill strings use 7 digits (`String/Skill.img/0001000`).
- **Extra level in equip names.** Equip names are under `String/Eqp.img/ClassicWorld/<Slot>/<id>`,
  not `String/Eqp.img/Eqp/<Slot>/<id>`. `String/Etc.img` keeps the classic `Etc/<id>` level;
  `Consume`, `Ins`, `Cash` and `Pet` have IDs at the top level.
- **Numbers stored as strings.** Frame delays are sometimes strings and sometimes ints within
  one animation (`Npc/0000001.img/stand/0/delay` is `"1500"`, `stand/1/delay` is `100`).
  Readers must accept both.

## Other

- **Live-client leftovers.** `Etc/MobLocation.img` is keyed by live MapleStory mob IDs and is
  unrelated to Classic World data.

- **`RawData` extended objects** in `Effect/lut.img` (8), not covered by the classic format
  description.

## Housing

- **Swapped names.** `String/Map.img/VictoriaIsland/010001008` has "Victoria Road" as its map
  name and "Yellow Mushroom House" as its street name.
- **Footholds inside objects.** `Map/Obj/obj_housing.img/kerning/interior/*` canvases carry
  `foothold` shapes; the Backalley Semi-Basement has its own footholds too.
- **A bed is two parts, not an animation.** Furniture `effect` frames at different `z` (Cherry Bed
  `03000005`, Rustic Bed `03000031`) are drawn together.

## Skills and quests

- **Level texts disagree with level data in a few places.** Of 225 level texts that state a
  damage percentage, 7 differ from `level/<n>/damage`: Rush (`1101005`, `1201005`,
  `1301005`) says 70% at level 11 and 73% at level 14 where the data has 69 and 74;
  Power Knockback (`3001003`) says 140% at level 8 where the data has 170. All 1,459 MP
  costs agree. Which one the server uses is unknown.
- **`common` beside `level/<n>`.** Seven player skills keep a few values in `common` next to
  their level tables, the same for every level (MP Eater's `cooltime 5`, Slash Blast's
  `mobCount 6`). Iron Body's is `x 300`; its texts say nothing that matches, and what it
  does is unknown.
- **Patches change the data.** Iron Body gave Weapon Def. +5 % at level 1 and +25 % at 20
  until the 21 October 2026 patch made it +20 % and +40 % (`indiePddR`, and its texts agree).
  A reader sees whichever version the data came from.
- **Job names aren't in the client.** `String/Skill.img/<job>/bookName` holds skill book
  titles ("Fighter Techniques", "Introduction to Magic"); the class names Warrior, Magician,
  Bowman and Thief appear only as quest category titles (`Quest/QuestCategory.img`).
- **Prerequisites without `nextQuest`.** 114 quest prerequisites have no matching
  `nextQuest` on the earlier quest (`1006` → `1009`), so quest chains have to be
  built from the prerequisites ([data-model/quest.md](data-model/quest.md)).
- **Quiz replies are keyed by choice number** (`Quest/QuestData/1013.img/Say/1/stop/0`
  has lines 0, 1, 3), so reading lines as a plain list loses which choice they answer.

## Characters

- **Face accessories follow the face, not the body.** `Character/Accessory/01017002.img`
  is keyed by expression (`blink/0/default`), while earrings (`01032000.img`) are keyed by
  body action.
- **Cash weapons nest their actions under a weapon type** (`Weapon/01702000.img/33/stand1`)
  and have no `info/stand` / `info/walk`.
- **Redirect frames.** 86 body frames hold `action` + `frame` instead of canvases.
- **The head carries four ear variants** (`ear`, `lefEar`, `highlefEar`, `humanEar`) in
  every frame; only one belongs on a character (`Look.ears` picks it). Their
  layers (`hairShade`, `accessoryOverHair`) share slots with hair and accessories, so slot
  rules must not apply to them.

- **The beauty preview lists aren't the salons' lists.** `Etc/BeautyPreview.img` keys its
  hair lists by coupon ID, the real coupons (`5150000` Mystery, `5150100` Signature) and two
  that don't exist (`5150001`, `5150101`), and gives Mystery and Signature the same styles.
  Nexon's launch posts list six other styles per gender for each coupon (Mystery: Bed Head
  Hair `30830`, …; Signature: Bowl Cut `30190`, …), 25 of the 48 not in the preview at all.
  The two hair lists look like old GMS's Henesys and Kerning City salons (`30060`, `30140`,
  `30200` vs `30040`, `30110`, `30130`), so the last digit is perhaps the salon. UNVERIFIED.

## Reactors

- **Invisible first states.** Evening Primrose (`Reactor/1000007.img/0/0`) is a real 1×1
  canvas with no link: the plant is invisible until item `4001095` (not present in this
  client) is dropped on it.
