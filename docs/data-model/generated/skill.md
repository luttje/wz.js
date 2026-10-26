# Skills (Skill/<job>.img/skill/<id>)

<!-- generated:schema -->
Units: **106**. Examples: `Skill/000.img/skill/0001000`, `Skill/000.img/skill/0001001`, `Skill/000.img/skill/0001002`.

217 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `icon` | canvas | 100 | 94.3% |  |  |
| `icon/origin` | vector | 100 | 94.3% |  |  |
| `icon/z` | int | 100 | 94.3% | 0 |  |
| `iconDisabled` | canvas | 100 | 94.3% |  |  |
| `iconDisabled/origin` | vector | 100 | 94.3% |  |  |
| `iconDisabled/z` | int | 100 | 94.3% | 0 |  |
| `iconMouseOver` | canvas | 100 | 94.3% |  |  |
| `iconMouseOver/origin` | vector | 100 | 94.3% |  |  |
| `iconMouseOver/z` | int | 100 | 94.3% | 0 |  |
| `level` | property | 98 | 92.5% |  |  |
| `level/<n>` | property | 98 | 92.5% |  |  |
| `level/<n>/hs` | string | 97 | 91.5% |  | `h1`, `h2`, `h3`, `h4`, `h5` |
| `icon/_hash` | string | 95 | 89.6% |  |  |
| `iconDisabled/_hash` | string | 95 | 89.6% |  |  |
| `iconMouseOver/_hash` | string | 94 | 88.7% |  |  |
| `info` | property | 69 | 65.1% |  |  |
| `info/type` | int | 69 | 65.1% | 1 … 53 |  |
| `processtype` | int | 67 | 63.2% | -1 … 116 |  |
| `level/<n>/mpCon` | int, string | 66 | 62.3% | 3 … 55 |  |
| `effect` | property, uol | 62 | 58.5% |  | `../1101000/effect`, `../1201000/effect`, `../1301000/effect` |
| `additional_process` | property | 60 | 56.6% |  |  |
| `additional_process/<n>` | int | 60 | 56.6% | 1 … 139 |  |
| `effect/<n>` | canvas | 59 | 55.7% |  |  |
| `effect/<n>/origin` | vector | 58 | 54.7% |  |  |
| `effect/<n>/delay` | int | 55 | 51.9% | 40 … 400 |  |
| `effect/<n>/_hash` | string | 54 | 50.9% |  |  |
| `action` | property, string | 47 | 44.3% |  | `swingO2` |
| `action/<n>` | string | 46 | 43.4% |  | `swingO1`, `swingO2`, `swingO3`, `alert2`, `rushO` |
| `level/<n>/time` | int | 44 | 41.5% | 2 … 2000 |  |
| `weapon` | int | 43 | 40.6% | 30 … 47 |  |
| `req` | property | 41 | 38.7% |  |  |
| `req/<n>` | int | 41 | 38.7% | 1 … 5 |  |
| `level/<n>/x` | int, string, long | 39 | 36.8% | -10 … 200 |  |
| `level/<n>/mobCount` | int, string | 38 | 35.8% | 1 … 15 |  |
| `level/<n>/prop` | int, string | 30 | 28.3% | 0 … 100 |  |
| `level/<n>/attackCount` | int, string | 29 | 27.4% | 1 … 6 |  |
| `hit` | property | 28 | 26.4% |  |  |
| `hit/<n>` | property, uol | 28 | 26.4% |  | `../../1101000/hit/0`, `../../1201000/hit/0`, `../../1301000/hit/0`, `../../2101004/hit/0` |
| `skillType` | int | 28 | 26.4% | 1 … 3 |  |
| `level/<n>/damage` | int | 26 | 24.5% | 0 … 1000 |  |
| `hit/<n>/<n>` | canvas, uol | 24 | 22.6% | 1 … 2 |  |
| `hit/<n>/<n>/origin` | vector | 24 | 22.6% |  |  |
| `hit/<n>/<n>/_hash` | string | 23 | 21.7% |  |  |
| `psd` | int | 23 | 21.7% | 1 |  |
| `hit/<n>/<n>/delay` | int | 21 | 19.8% | 50 … 300 |  |
| `level/<n>/lt` | vector | 20 | 18.9% |  |  |
| `level/<n>/rb` | vector | 20 | 18.9% |  |  |
| `weapon2` | int | 18 | 17.0% | 40 … 46 |  |
| `level/<n>/mastery` | int, string | 17 | 16.0% | 1 … 10 |  |
| `common` | property | 15 | 14.2% |  |  |
| `level/<n>/range` | int, string | 14 | 13.2% | 30 … 350 |  |
| `mob` | property, uol | 14 | 13.2% |  | `../2101004/mob` |
| `level/<n>/hpCon` | int | 13 | 12.3% | 8 … 30 |  |
| `level/<n>/bulletCount` | int, string | 12 | 11.3% | 1 … 3 |  |
| `affected` | property, uol | 11 | 10.4% |  | `../1301000/affected` |
| `effect/<n>/z` | int | 11 | 10.4% | 0 … 1 |  |
| `mob/<n>` | canvas | 11 | 10.4% |  |  |
| `mob/<n>/_hash` | string | 11 | 10.4% |  |  |
| `mob/<n>/origin` | vector | 11 | 10.4% |  |  |
| `mob/pos` | int | 11 | 10.4% | 2 … 3 |  |
| `affected/<n>` | canvas | 10 | 9.4% |  |  |
| `affected/<n>/_hash` | string | 10 | 9.4% |  |  |
| `affected/<n>/delay` | int | 10 | 9.4% | 50 … 300 |  |
| `affected/<n>/origin` | vector | 10 | 9.4% |  |  |
| `invisible` | int | 10 | 9.4% | 1 |  |
| `mob/<n>/delay` | int | 10 | 9.4% | 50 … 200 |  |
| `mob/repeat` | int | 10 | 9.4% | 1 |  |
| `ball` | property | 9 | 8.5% |  |  |
| `ball/<n>` | canvas | 9 | 8.5% |  |  |
| `ball/<n>/_hash` | string | 9 | 8.5% |  |  |
| `ball/<n>/origin` | vector | 9 | 8.5% |  |  |
| `hit/<n>/<n>/z` | int | 9 | 8.5% | 0 … 1 |  |
| `level/<n>/y` | int | 9 | 8.5% | 1 … 50 |  |
| `common/maxLevel` | int | 8 | 7.5% | 1 … 10 |  |
| `effect1` | property, uol | 8 | 7.5% |  | `../1101000/effect1`, `../1201000/effect1`, `../1301000/effect1` |
| `level/<n>/speed` | int | 8 | 7.5% | 2 … 65 |  |
| `effect/<n>/_inlink` | string | 7 | 6.6% |  | `skill/1101002/effect/0`, `skill/1101002/effect/1`, `skill/1101002/effect/2`, `skill/1101002/effect/3`, `skill/1101002/effect/4` |
| `level/<n>/cooltime` | int | 7 | 6.6% | 2 … 180 |  |
| `level/<n>/mad` | int | 7 | 6.6% | 40 … 180 |  |
| `effect/<n>/a0` | int | 6 | 5.7% | 0 … 255 |  |
| `effect/<n>/a1` | int | 6 | 5.7% | 0 … 255 |  |
| `elemAttr` | string | 6 | 5.7% |  | `f`, `s`, `i`, `l`, `h` |
| `iconMouseOver/_inlink` | string | 6 | 5.7% |  | `skill/1101000/iconMouseOver`, `skill/1201000/iconMouseOver`, `skill/1301000/iconMouseOver`, `skill/2101004/iconMouseOver`, `skill/3100000/icon` |
| `common/cooltime` | string | 5 | 4.7% | 5 … 600 |  |
| `effect1/<n>` | canvas | 5 | 4.7% |  |  |
| `effect1/<n>/_hash` | string | 5 | 4.7% |  |  |
| `effect1/<n>/delay` | int | 5 | 4.7% | 70 |  |
| `effect1/<n>/origin` | vector | 5 | 4.7% |  |  |
| `icon/_inlink` | string | 5 | 4.7% |  | `skill/1101000/icon`, `skill/1201000/icon`, `skill/1301000/icon`, `skill/2101004/icon`, `skill/3101004/icon` |
| `iconDisabled/_inlink` | string | 5 | 4.7% |  | `skill/1101000/iconDisabled`, `skill/1201000/iconDisabled`, `skill/1301000/iconDisabled`, `skill/2101004/iconDisabled`, `skill/3101004/iconDisabled` |
| `info/areaAttack` | int | 4 | 3.8% | 1 |  |
| `info/casterMove` | int | 4 | 3.8% | 1 |  |
| `level/<n>/dot` | int, string | 4 | 3.8% | 10 … 100 |  |
| `ball/<n>/delay` | int | 3 | 2.8% | 80 … 90 |  |
| `effect/z` | int | 3 | 2.8% | -1 |  |
| `level/<n>/crtX` | string, int | 3 | 2.8% | 1 … 20 |  |
| `level/<n>/dotInterval` | string, int | 3 | 2.8% | 1 |  |
| `level/<n>/dotTime` | string, int | 3 | 2.8% | 3 … 5 |  |
| `level/<n>/indieJump` | int | 3 | 2.8% | 1 … 10 |  |
| `level/<n>/indiePdd` | int, long | 3 | 2.8% | -40 … 120 |  |
| `level/<n>/indieSpeed` | int | 3 | 2.8% | 10 … 30 |  |
| `masterLevel` | int | 3 | 2.8% | 3 |  |
| `affected/<n>/a0` | int | 2 | 1.9% | 255 |  |
| `affected/<n>/a1` | int | 2 | 1.9% | 0 |  |
| `affected0` | property, uol | 2 | 1.9% |  | `../1301000/affected0` |
| `ball/<n>/z` | int | 2 | 1.9% | 0 |  |
| `collabo` | int | 2 | 1.9% | 1 |  |
| `disable` | int | 2 | 1.9% | 1 |  |
| `effectFlash` | property | 2 | 1.9% |  |  |
| `effectFlash/<n>` | property | 2 | 1.9% |  |  |
| `effectFlash/<n>/alpha` | int | 2 | 1.9% | 10 … 40 |  |
| `effectFlash/<n>/color` | string | 2 | 1.9% | 0 |  |
| `effectFlash/<n>/delay` | int | 2 | 1.9% | 60 … 2460 |  |
| `effectFlash/localOnly` | int | 2 | 1.9% | 1 |  |
| `effectFlash/z` | int | 2 | 1.9% | -2 |  |
| `extraSkillInfo` | property | 2 | 1.9% |  |  |
| `extraSkillInfo/<n>` | property | 2 | 1.9% |  |  |
| `extraSkillInfo/<n>/delay` | string, int | 2 | 1.9% | 0 |  |
| `extraSkillInfo/<n>/skill` | string | 2 | 1.9% | 2101005 … 3101005 |  |
| `hit/<n>/<n>/_inlink` | string | 2 | 1.9% |  | `skill/2001002/hit/0/0`, `skill/2001002/hit/0/1`, `skill/2301001/affected/0`, `skill/2301001/affected/1`, `skill/2301001/affected/2` |
| `hit/<n>/<n>/a0` | int | 2 | 1.9% | 255 |  |
| `hit/<n>/<n>/a1` | int | 2 | 1.9% | 0 |  |
| `info/condition` | string | 2 | 1.9% |  | `attack` |
| `info/massSpell` | int | 2 | 1.9% | 1 |  |
| `level/<n>/accX` | string, int | 2 | 1.9% | 1 … 20 |  |
| `level/<n>/ballDelay` | int, string | 2 | 1.9% | 100 |  |
| `level/<n>/ballDelay1` | int, string | 2 | 1.9% | 100 |  |
| `level/<n>/bulletConsume` | int | 2 | 1.9% | 1 … 2 |  |
| `level/<n>/crdX` | int | 2 | 1.9% | 1 … 35 |  |
| `level/<n>/indieMad` | int | 2 | 1.9% | 5 … 25 |  |
| `level/<n>/indiePad` | int | 2 | 1.9% | 5 … 40 |  |
| `mob/<n>/z` | int | 2 | 1.9% | 0 |  |
| `mob/loop` | property | 2 | 1.9% |  |  |
| `mob/loop/<n>` | canvas | 2 | 1.9% |  |  |
| `mob/loop/<n>/_hash` | string | 2 | 1.9% |  |  |
| `mob/loop/<n>/delay` | int | 2 | 1.9% | 120 |  |
| `mob/loop/<n>/origin` | vector | 2 | 1.9% |  |  |
| `mob/loop/pos` | int | 2 | 1.9% | 3 |  |
| `mob/loop/repeat` | int | 2 | 1.9% | 1 |  |
| `mob/pre` | property | 2 | 1.9% |  |  |
| `mob/pre/<n>` | canvas | 2 | 1.9% |  |  |
| `mob/pre/<n>/_hash` | string | 2 | 1.9% |  |  |
| `mob/pre/<n>/delay` | int | 2 | 1.9% | 120 |  |
| `mob/pre/<n>/origin` | vector | 2 | 1.9% |  |  |
| `mob/pre/pos` | int | 2 | 1.9% | 3 |  |
| `mob/pre/repeat` | int | 2 | 1.9% | 1 |  |
| `notCooltimeReset` | int | 2 | 1.9% | 1 |  |
| `screen` | property | 2 | 1.9% |  |  |
| `screen/<n>` | canvas | 2 | 1.9% |  |  |
| `screen/<n>/_hash` | string | 2 | 1.9% |  |  |
| `screen/<n>/delay` | int | 2 | 1.9% | 60 |  |
| `screen/<n>/origin` | vector | 2 | 1.9% |  |  |
| `screen/<n>/z` | int | 2 | 1.9% | 0 |  |
| `screen/coverField` | int | 2 | 1.9% | 1 |  |
| `screen0` | property | 2 | 1.9% |  |  |
| `screen0/<n>` | canvas | 2 | 1.9% |  |  |
| `screen0/<n>/_hash` | string | 2 | 1.9% |  |  |
| `screen0/<n>/_inlink` | string | 2 | 1.9% |  | `skill/80012714/screen0/9`, `skill/80012714/screen0/10`, `skill/80012714/screen0/11`, `skill/80012714/screen0/12`, `skill/80012715/screen0/9` |
| `screen0/<n>/delay` | int | 2 | 1.9% | 60 … 180 |  |
| `screen0/<n>/origin` | vector | 2 | 1.9% |  |  |
| `screen0/<n>/z` | int | 2 | 1.9% | 0 |  |
| `screen0/z` | int | 2 | 1.9% | -1 |  |
| `weapon3` | int | 2 | 1.9% | 31 … 32 |  |
| `weapon4` | int | 2 | 1.9% | 41 … 42 |  |
| `affected/<n>/_inlink` | string | 1 | 0.9% |  | `skill/2301003/affected/0`, `skill/2301003/affected/1` |
| `affected/pos` | int | 1 | 0.9% | 2 |  |
| `affected0/<n>` | canvas | 1 | 0.9% |  |  |
| `affected0/<n>/_hash` | string | 1 | 0.9% |  |  |
| `affected0/<n>/delay` | int | 1 | 0.9% | 100 |  |
| `affected0/<n>/origin` | vector | 1 | 0.9% |  |  |
| `affected0/pos` | int | 1 | 0.9% | 2 |  |
| `affected0/z` | int | 1 | 0.9% | -1 |  |
| `ball/<n>/_inlink` | string | 1 | 0.9% |  | `skill/2001002/ball/1` |
| `common/attackCount` | string | 1 | 0.9% | 1 |  |
| `common/ballDelay` | string | 1 | 0.9% | 100 |  |
| `common/bulletCount` | string | 1 | 0.9% | 1 |  |
| `common/mobCount` | string | 1 | 0.9% | 6 |  |
| `common/range` | string | 1 | 0.9% | 350 |  |
| `common/x` | string | 1 | 0.9% | 300 |  |
| `effect/pos` | int | 1 | 0.9% | 0 |  |
| `effect0` | property | 1 | 0.9% |  |  |
| `effect0/<n>` | canvas | 1 | 0.9% |  |  |
| `effect0/<n>/_hash` | string | 1 | 0.9% |  |  |
| `effect0/<n>/delay` | int | 1 | 0.9% | 100 … 200 |  |
| `effect0/<n>/origin` | vector | 1 | 0.9% |  |  |
| `effect0/z` | int | 1 | 0.9% | -1 |  |
| `hit/<n>/hitAfter` | int | 1 | 0.9% | 200 |  |
| `hit/<n>/pos` | int | 1 | 0.9% | 2 |  |
| `info/dot` | int | 1 | 0.9% | 1 |  |
| `info/finalAttack` | int | 1 | 0.9% | 1 |  |
| `info/magicDamage` | int | 1 | 0.9% | 1 |  |
| `level/<n>/ball` | property | 1 | 0.9% |  |  |
| `level/<n>/ball/<n>` | canvas | 1 | 0.9% |  |  |
| `level/<n>/ball/<n>/_hash` | string | 1 | 0.9% |  |  |
| `level/<n>/ball/<n>/delay` | int | 1 | 0.9% | 90 |  |
| `level/<n>/ball/<n>/origin` | vector | 1 | 0.9% |  |  |
| `level/<n>/evaX` | int | 1 | 0.9% | 1 … 15 |  |
| `level/<n>/fixdamage` | int | 1 | 0.9% | 15 … 40 |  |
| `level/<n>/hit` | property | 1 | 0.9% |  |  |
| `level/<n>/hit/<n>` | property | 1 | 0.9% |  |  |
| `level/<n>/hit/<n>/<n>` | canvas | 1 | 0.9% |  |  |
| `level/<n>/hit/<n>/<n>/_hash` | string | 1 | 0.9% |  |  |
| `level/<n>/hit/<n>/<n>/delay` | int | 1 | 0.9% | 90 |  |
| `level/<n>/hit/<n>/<n>/origin` | vector | 1 | 0.9% |  |  |
| `level/<n>/indieAcc` | int | 1 | 0.9% | 1 … 20 |  |
| `level/<n>/indieEva` | int | 1 | 0.9% | 5 … 25 |  |
| `level/<n>/indieMdd` | long | 1 | 0.9% | 40 … 120 |  |
| `level/<n>/indiePddR` | string | 1 | 0.9% | 20 … 40 |  |
| `level/<n>/itemCon` | int | 1 | 0.9% | 4000001 … 4000004 |  |
| `level/<n>/itemConNo` | int | 1 | 0.9% | 1 |  |
| `level/<n>/mhpR` | string | 1 | 0.9% | 10 … 25 |  |
| `level/<n>/mmpR` | int | 1 | 0.9% | 10 … 25 |  |
| `level/<n>/subTime` | int | 1 | 0.9% | 1500 |  |
| `level/<n>/z` | int | 1 | 0.9% | 500 |  |
| `multiAttackInfo` | property | 1 | 0.9% |  |  |
| `multiAttackInfo/commonHitDelay` | int | 1 | 0.9% | 0 |  |
| `noBulletConsume` | int | 1 | 0.9% | 1 |  |
<!-- /generated:schema -->
