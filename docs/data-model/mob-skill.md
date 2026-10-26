# Monster skills

`Skill/MobSkill/<id>.img` (from `Packs/Skill_00000.ms`; pixels in `Skill/MobSkill/_Canvas`).
Reader: `src/model/mob-skill.ts`. Statistics: [generated/mobskill.md](generated/mobskill.md). Example: `Skill/MobSkill/123.img/level/1` (Stun).

Monsters name the skills they use in `info/skill/<n>` (`skill`, `level`, `action`; see
[mob.md](mob.md)). A trap (`Map/Obj/obj_trap.img`) or a monster attack (`info/attack/<n>`)
names one as its `disease`, with a `level`. `String/MobSkill.img` holds no names for these
(its 4 entries are live-client bosses).

Classic World has 18 images: 114, 120–126, 129, 160–167 and 200.

| ID | Meaning | Used by |
|---|---|---|
| 120 | Seal: no skills | Fairy 2, Jr. Boogie 1, Shade |
| 121 | Darkness: accuracy −x % | Fairy 3, Jr. Boogie 2, Shade |
| 122 | Weakness: no jumping | Fairy 4, Jr. Boogie 2 |
| 123 | Stun: no moving, attacking or skills | Fairy 1; steam traps |
| 124 | Curse: less EXP from kills | Jr. Boogie 1, Shade |
| 125 | Poison: x HP per second | Rotten Mushmom's second attack; steam traps |
| 126 | Slow: Speed −x | Mano |
| 160–163 | Raise the monster's own physical attack, physical defence, magic attack, magic defence by x | Iron Hog, Stone Golem, Dark Stone Golem |
| 164–167 | The same for every monster in the area | Fairies, Mano |
| 200 | Summon: `0`, `1`, … are mob IDs, at most `limit`, once HP is below `hp` % | Mano, King Slime, Shade |
| 114, 129 | Not used by any Classic World monster | |

What 120–126 do comes from the original game and NiaMeowDB's monster pages; the numbers'
units and the stat order of 162 and 166 are `UNVERIFIED`. No map places the steam traps that carry a `disease` (`steam/2`–`4`);
the steam the Sleepywood tunnels use (`steam/0`, `steam/1`) has none.

## A level

`level/<n>`:

| Field | Meaning |
|---|---|
| `time` | Seconds the status (or buff) lasts. |
| `prop` | Chance (%) that it takes on each player in reach. Missing on buffs (always). |
| `interval` | Seconds before the monster can use it again. |
| `x` | The value: Poison's HP per tick (15, 100, 300), Darkness' 50, Slow's 80, a buff's stat (25–60). |
| `mpCon` | MP cost (5). |
| `lt`, `rb` | The area it reaches, around the monster drawn facing left (Stun: (−300, −120)–(300, 120); Poison: only in front, (−150, −90)–(0, 0)). Self buffs have none. |
| `hp`, `limit`, `summonEffect`, `0`… | Summon (200) only. |
| `count` | 129 only. |
| `effect` | Plays on the monster using it (`pos` 3: its middle). |
| `affected` | Plays on the player it takes on (`pos` 1: over the head; no `pos`: at the feet, drawn high). |
| `mob`, `mob0` | Shows over a buffed monster (`pos` 2, `icon` 1); stored as a 1×1 stub linking to the canvas. |

Animation nodes carry `pos` and `repeat` beside their frames. The `pos` readings (0 feet,
1 and 2 head, 3 body) follow the frames' origins (Stun's stars are 18 px tall with origin y 9;
Curse's skull has origin y 90) and are `UNVERIFIED`. The client has no icon for these statuses
(`UI/BuffIcon.img` holds only an empty `IconBase`).
