# String tree

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

`String/String_000.wz`, 24 images. All user-visible names and texts.

| Image | Layout | Notes |
|---|---|---|
| `Eqp.img` | `<group>/<Slot>/<itemId>/{name, desc}` | The single group is `ClassicWorld` (not `Eqp`). Slots match the `Character/<Slot>` folder names, plus `Hair`, `Face` (738 entries). |
| `Consume.img` | `<itemId>/{name, desc}` | 416 entries. |
| `Etc.img` | `Etc/<itemId>/{name, desc}` | Keeps an extra `Etc` level. 400 entries. |
| `Ins.img` | `<itemId>/{name, desc}` | Setup items. 240 entries. |
| `Cash.img` | `<itemId>/{name, desc}` | 115 entries. |
| `Pet.img` | `<itemId>/{name, desc, descD}` | `descD`: description of the "dead" (expired) pet. 35 entries. |
| `Mob.img` | `<mobId>/name` | Unpadded IDs (`2` = Snail, image `Mob/0000002.img`). 118 entries. |
| `Npc.img` | `<npcId>/{name, func, n0…, s0…, d0…, b0, c0, …}` | Unpadded IDs. Besides `name` and `func` (role, e.g. "Hair Salon"), every field is a speech line. `info/speak` in the NPC image lists which keys it uses (`n0`, `n1`, …); `d0`, `d1` are longer dialogue. Meaning of the prefixes (`n`, `s`, `b`, `c`, `d`) is `UNVERIFIED`. |
| `Map.img` | `<region>/<mapId>/{streetName, mapName, mapDesc?}` | 9-digit IDs. Regions: `MapleIsland` (25), `VictoriaIsland` (245), `Ossyria` (0), `Other` (40), `Event` (35), `Dev` (2). |
| `Skill.img` | `<jobId 3 digits>/bookName`; `<skillId 7 digits>/{name, desc, h, h1…hN}` | `h<n>` is the text for skill level n. 114 entries. |
| `MobSkill.img` | `<mobSkillId>/<level>/…` | 4 entries. |
| `PetDialog.img`, `PetCommand.img` | per pet | Pet speech: `cN_s1`… / `cN_f1`… (a command obeyed / refused), `fN_s` / `fN_f` (food per level band), `s1`…`s4` (slang). PetCommand.img has the words that call `cN` for 14 pets; see `item.md`. |
| `ToolTipHelp.img`, `StringTable.img`, `UI.img`, `EULA.img`, … | | UI texts. |

## Text markup

Names and descriptions use the client's inline markup (`#b`, `#k`, `#c…#`, `#p<id>#`, …). Line
breaks are stored as the **two characters** `\n` (and `\r\n`), never as a newline character.
The renderer is described in [rendering.md](../rendering.md).
