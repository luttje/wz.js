# Skill tree

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

`Skill/<job 3 digits>.img` (from `Packs/Skill_00000.ms`). Statistics:
[generated/skill.md](generated/skill.md), [generated/job.md](generated/job.md). Reader:
`src/model/skill.ts`. Example: `Skill/100.img/skill/1001001` (Power Strike).

| Node | Content |
|---|---|
| `info/icon` | The job's skill book icon. |
| `skill/<id 7 digits>` | One skill. `id = job × 10000 + n`. |

Job images in Classic World: `000` Beginner; `100`, `110`, `120`, `130` (Warrior line); `200`,
`210`, `220`, `230`; `300`, `310`, `320`; `400`, `410`, `420`; plus `800` (Admin), `9200`–`9205`
and `800127` (special books, not player jobs). Names are `String/Skill.img/<job>/bookName`
(skill book titles; see `quirks.md`).

## A skill

| Field | Meaning |
|---|---|
| `icon`, `iconMouseOver`, `iconDisabled` | 32×32 icons. |
| `level/<n>/*` | Values for level n (all 95 player skills use this form). Fields below. |
| `common/*` | Formulas in `x` (the level) instead of `level/<n>`, with `maxLevel`; the reader evaluates them (`src/model/formula.ts`). Seven player skills have both: there `common` holds constants every level shares (Slash Blast `mobCount 6`, Energy Bolt `range 350`, MP Eater `cooltime 5`, Iron Body `x 300`), and the reader adds them to each level that lacks them. |
| `req/<skillId>` | Required skill and its level. |
| `action` | Body action(s) the character plays (a string, or numbered strings). |
| `weapon`, `weapon2`, … | Weapon type allowed (`weapon 47` = claw: equip group 147). |
| `psd` | 1 = passive. |
| `invisible` | 1 = not shown in the skill window (`UNVERIFIED`). |
| `elemAttr` | Element letter(s): `f` fire, `i` ice, `l` lightning, `s` poison, `h` holy, `d` dark. |
| `processtype`, `skillType`, `masterLevel` | Raw; meaning `UNVERIFIED`. |
| `effect`, `effect0…`, `hit/<n>`, `ball`, `affected`, `mob`, `special`, `prepare`, `keydown`, … | Effect animations (numbered frames). `hit/<n>` holds one animation per hit. |
| `info/*` | Raw flags (`type`, `magicDamage`, …). |

## Level fields

Seen in player skills (count of level entries): `hs` (2,014), `mpCon` (1,509), `time`,
`mobCount`, `x`, `attackCount`, `prop`, `damage`, `lt`/`rb`, `mastery`, `bulletCount`, `hpCon`,
`range`, `mad`, `y`, `speed`, `cooltime`, `dot`/`dotTime`/`dotInterval`, `indiePdd`, `crtX`,
`indiePad`, `ballDelay`, `crdX`, `indieMad`, `bulletConsume`, `indieSpeed`, `indieJump`,
`accX`, `subTime`, `indiePddR`, `indieMdd`, `indieAcc`, `indieEva`, `z`, `mhpR`, `mmpR`,
`evaX`, `itemCon`, `itemConNo`, `fixdamage`.

- `hs` names the level's text in `String/Skill.img/<id>`: `hs = "h1"` → `h1`. In Classic
  World every `hs` (2,014 of 2,044 levels; the rest have none) points at the level's own `h<n>`, and the texts are already filled in ("MP -4;
  Damage 160%"): there are no value placeholders to substitute.
- `mpCon` is the MP cost (matches the level texts in all 1,459 cases), `damage` the damage
  percentage (218 of 225 match), `mad` magic attack ("Basic Attack 45"), `mastery` the
  mastery level, `attackCount` hits per enemy, `mobCount` enemies, `time` duration in seconds
  (`UNVERIFIED` unit beyond the texts that say "sec").
- `x`, `y`, `z` are skill-specific (`4001003` Lucky Seven: `x 30`, `y 5`, `z 500`).
- `lt`, `rb` are the attack area corners relative to the character.

