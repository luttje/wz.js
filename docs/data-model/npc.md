# Npc tree

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

`Npc/<id 7 digits>.img`, 233 images; pixels in `Npc/_Canvas/<id>.img` (146 images).
Statistics: [generated/npc.md](generated/npc.md). Example: `Npc/0000001.img` (Heena).

| Node | Meaning |
|---|---|
| `info/speak/<n>` | Keys of the `String/Npc.img` lines this NPC says in a bubble (`n0`, `s1`, …), drawn with `UI/ChatBalloon.img/npc`. 149 of 233 NPCs speak; one key (`707/s1`) has no line. How often the client has them speak isn't in the data. |
| `info/speak/condition<N>` | Line sets (`0`, `1`, … keys such as `c10`, `c20`) for residents of `citizenshipTown` (1 Henesys, 2 Kerning City) at `citizenshipGrade` (one set per grade, 1–10). Their lines say `/name`, `/grade` and `/town` for the player's name, grade title and town (the only placeholders in speak lines). Residents hear the everyday lines too. |
| `info/script/<n>/script` | Script names (`npc_8`, `quest_1005`). Script bodies are not in the client (`Etc/Script` is empty). |
| `info/dcLeft/Top/Right/Bottom` | A rectangle around the NPC (`UNVERIFIED`: probably the click area). |
| `info/link` | Borrow another NPC's animations. |
| `info/hideName` | 1: no name tag (the Free Market Maple TV, `0800007`). |
| `info/MapleTV`, `MapleTVmsgX/Y`, `MapleTVadX/Y` | A Maple TV cabinet. The sprite has empty screens; the offsets place the top-left of the message screen (240×90, `UI/MapleTV.img/TVon`, `TVbasic`, `TVoff`, `TVchat1/2`) and the ad screen (240×180, `UI/MapleTV.img/TVmedia/<n>`) relative to the NPC, ignoring the frames' origins. |
| `stand`, `move`, `say`, `eye`, `blink`, `talk`, `smile`, … | Animations; same frame format as mobs. `stand` exists for 92%. |

IDs come in ranges `0000001`–`0000804`, `0800000`–`0800018`, `0900001`–`0900026`,
`9010000` and `9090000`. Their meaning is `UNVERIFIED`.

The `clr` of the `npc` and `pet` balloon styles (0x800000) isn't the colour NPCs and pets
talk in: that is 0x5B191B, as seen in game.
