# Data layout

What a MapleStory Classic World install contains, as observed in the files. `npm run
inventory` lists every file and archive of your own install into `out/data-inventory.md`.

## Where the data lives

The Steam app `MapleStory` (app id 216150) installs **two clients** side by side:

| Folder | What it is |
|---|---|
| `<install>/Data/` | The **live MapleStory** client: ~70 GB, 1,065 files, many encrypted `.ms` packs, modern trees (ArcaneForce, Android, Familiar, …). |
| `<install>/MSCW/Data/` | **MapleStory Classic World**: ~674 MB, 274 files. |

So the game root for Classic World is `<install>/MSCW`, and its data folder is
`<install>/MSCW/Data`. An app that is given the outer `<install>` folder must look for
`MSCW/Data` first; picking `<install>/Data` would mount the other game. The reader mounts
either (`detectEdition` in `src/model/edition.ts` tells them apart).

## Folder layout

Every data folder `X` follows the same pattern:

| File | Content |
|---|---|
| `X.ini` | Text, `LastWzIndex\|N`. `N` is the index of the last part archive; `-1` means none. |
| `Packs/Packs.ini` | Not in Classic World. In the current client: one `Name\|N` line per pack family (`Mob\|3`, `Skill\|8`), `N` being the last `Name_NNNNN.ms` index. |
| `X.wz` | A PKG1 archive whose directory lists the folder's **sub-folders** (as directory entries with no images). Not empty, but holds no images. |
| `X_000.wz` … `X_00N.wz` | Standalone PKG1 archives holding the folder's images. |
| `X/<Sub>/` | Sub-folders with the same layout (e.g. `Character/Hair/`). |
| `X/_Canvas/` | A sub-folder holding the **pixel data** for the canvases of `X`'s images (see below). |

Mounting rule: the directory of folder `X` is the union of the directories of `X.wz` and
all `X_NNN.wz`, with each sub-folder `X/S` mounted at path `X/S`. Paths are therefore
tree-relative (`Npc/0000001.img`, `Character/Hair/00030000.img`) no matter which part
archive holds an image. Only `Sound` has more than one part archive (`Sound_000.wz` and
`Sound_001.wz`); every other folder has exactly one, or none. `WzFileSystem` (`src/fs.ts`)
implements this rule.

`Base/Base.wz` lists all fifteen tree names (Character, Effect, Etc, Item, Map, Mob, Morph,
Npc, Quest, Reactor, Skill, Sound, String, TamingMob, UI) as empty directories, and
`Base/Base_000.wz` holds `zmap.img`, `smap.img` and `StandardPDD.img`.

### The `_Canvas` split

Canvases in a folder's main archives are **1×1 placeholders** (format 1, 10-byte payload).
They keep their properties (`origin`, `z`, `delay`, `a0`, `a1`, …) and add a string
property `_outlink` whose value is the full tree path of the real canvas, e.g.

```
Npc/0000001.img/stand/0/_outlink = "Npc/_Canvas/0000001.img/stand/0"
```

The target in `Npc/_Canvas/0000001.img` has the real size and pixels but no properties.
Identical frames share one target (`Npc/0000001.img/smile0/0` links to `.../stand/1`), so
`_Canvas` images can have fewer entries than their main image. Readers must take the pixel
description from the target and everything else from the placeholder
(`WzFileSystem.resolveCanvas` does). Not every canvas is split; for example
`Map/Back/back_dryRock.img/back/0` stores its pixels inline.

### `Packs/*.ms` — Mob and Skill data

`Mob/Mob.ini` and `Skill/Skill.ini` say `LastWzIndex|-1`: those trees have **no** PKG1 part
archives. Their only PKG1 content is `Mob/_Canvas` (pixels for 79 mobs),
`Mob/QuestCountGroup` (empty), `Skill/_Canvas` (19 images) and `Skill/MobSkill/_Canvas`.

The Mob and Skill images themselves (mob stats and animations, skill level tables and
effects) are in two encrypted `.ms` packs, with `Packs/digest.md5` holding their MD5 sums:

| Pack | Size | Entries | Contents |
|---|---|---|---|
| `Packs/Mob_00000.ms` | 5.7 MB | 118 | `Mob/<id>.img`, and one non-image file `Mob/pack_ignore.txt` |
| `Packs/Skill_00000.ms` | 43.9 MB | 46 | `Skill/<job>.img`, `Skill/MobSkill/<id>.img`, `Attacktype.img`, `ItemSkill.img`, and one non-image file `Skill/pack_ignore.txt` |

Each pack entry names its full tree path (`Mob/0000001.img`), so entries are mounted into
the same trees as the PKG1 archives. The pack format is in [wz-format.md](wz-format.md). Pack
images are ordinary images once decrypted. Their canvases either hold pixels inline, link
within the image with `_inlink`, or (for the `_Canvas` mobs) with `_outlink`.

## Version

All 88 archives that contain images auto-detect as version **779** (hash `0x0000E73A`,
header check value `encVer = 34`). Archives without images can't be checked: any candidate
version "validates" when there is no offset to test, so they report no version.

## IDs differ from older MapleStory

Classic World renumbers mobs and NPCs (mobs `0000001`…, NPCs `0000001`… and
`0800000`…, `0900001`…), while items keep the familiar ranges (`2000000` is Red Potion).
Maps use 9-digit IDs starting at `000000001` ("Mushroom Town - West Entrance"). Never assume
an ID from another MapleStory version.
