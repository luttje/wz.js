# Monsters (Mob/<id>.img)

<!-- generated:schema -->
Units: **117**. Examples: `Mob/0000001.img`, `Mob/0000002.img`, `Mob/0000003.img`.

281 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `info` | property | 117 | 100.0% |  |  |
| `info/acc` | int | 117 | 100.0% | 0 … 999 |  |
| `info/eva` | int | 117 | 100.0% | 0 … 1999 |  |
| `info/level` | int | 117 | 100.0% | 1 … 200 |  |
| `info/MADamage` | int | 117 | 100.0% | 0 … 1356 |  |
| `info/maxHP` | int | 117 | 100.0% | 30 … 2100000000 |  |
| `info/maxMP` | int | 117 | 100.0% | 0 … 30000 |  |
| `info/MDDamage` | int | 117 | 100.0% | 0 … 999 |  |
| `info/PADamage` | int | 117 | 100.0% | 0 … 1192 |  |
| `info/PDDamage` | int | 117 | 100.0% | 0 … 999 |  |
| `info/pushed` | int | 117 | 100.0% | 0 … 99999999 |  |
| `info/bodyAttack` | int | 116 | 99.1% | 1 |  |
| `info/summonType` | int | 116 | 99.1% | 0 … 1 |  |
| `info/fs` | float | 115 | 98.3% | 10 |  |
| `info/exp` | int | 109 | 93.2% | 0 … 6000 |  |
| `info/speed` | int | 97 | 82.9% | -70 … 35 |  |
| `info/undead` | int | 92 | 78.6% | 0 … 1 |  |
| `info/hideLevel` | int | 91 | 77.8% | 0 |  |
| `die1` | property | 81 | 69.2% |  |  |
| `die1/<n>` | canvas | 81 | 69.2% |  |  |
| `die1/<n>/delay` | int | 81 | 69.2% | 80 … 500 |  |
| `die1/<n>/origin` | vector | 81 | 69.2% |  |  |
| `hit1` | property | 81 | 69.2% |  |  |
| `hit1/<n>` | canvas | 81 | 69.2% |  |  |
| `hit1/<n>/delay` | int | 81 | 69.2% | 90 … 600 |  |
| `hit1/<n>/lt` | vector | 81 | 69.2% |  |  |
| `hit1/<n>/origin` | vector | 81 | 69.2% |  |  |
| `hit1/<n>/rb` | vector | 81 | 69.2% |  |  |
| `die1/<n>/_hash` | string | 80 | 68.4% |  |  |
| `die1/<n>/head` | vector | 80 | 68.4% |  |  |
| `hit1/<n>/head` | vector | 80 | 68.4% |  |  |
| `die1/<n>/a0` | int | 78 | 66.7% | 255 |  |
| `die1/<n>/a1` | int | 78 | 66.7% | 0 |  |
| `hit1/<n>/_hash` | string | 78 | 66.7% |  |  |
| `stand` | property | 76 | 65.0% |  |  |
| `stand/<n>` | uol, canvas | 76 | 65.0% | 0 | `../move/0`, `../move/1`, `../move/3` |
| `stand/<n>/head` | vector | 75 | 64.1% |  |  |
| `stand/<n>/lt` | vector | 75 | 64.1% |  |  |
| `stand/<n>/origin` | vector | 75 | 64.1% |  |  |
| `stand/<n>/rb` | vector | 75 | 64.1% |  |  |
| `info/elemAttr` | string | 72 | 61.5% |  | `F3`, `L3`, `S1`, `H3`, `H2L2S3` |
| `move` | property | 72 | 61.5% |  |  |
| `move/<n>` | canvas, uol | 72 | 61.5% | 0 … 1 | `../stand/0`, `../stand/1`, `../stand/2`, `../stand/3`, `../stand/4` |
| `move/<n>/_hash` | string | 70 | 59.8% |  |  |
| `move/<n>/head` | vector | 70 | 59.8% |  |  |
| `move/<n>/lt` | vector | 70 | 59.8% |  |  |
| `move/<n>/origin` | vector | 70 | 59.8% |  |  |
| `move/<n>/rb` | vector | 70 | 59.8% |  |  |
| `move/<n>/delay` | int, string | 69 | 59.0% | 50 … 500 |  |
| `stand/<n>/_hash` | string | 64 | 54.7% |  |  |
| `stand/<n>/delay` | int, string | 57 | 48.7% | 60 … 1000 |  |
| `info/link` | string | 36 | 30.8% | 7 … 9990000 |  |
| `jump` | property | 30 | 25.6% |  |  |
| `jump/<n>` | canvas | 30 | 25.6% |  |  |
| `jump/<n>/head` | vector | 30 | 25.6% |  |  |
| `jump/<n>/lt` | vector | 30 | 25.6% |  |  |
| `jump/<n>/origin` | vector | 30 | 25.6% |  |  |
| `jump/<n>/rb` | vector | 30 | 25.6% |  |  |
| `stand/<n>/_inlink` | string | 27 | 23.1% |  | `move/0`, `move/2`, `stand/0`, `move/1`, `stand/6` |
| `info/attack` | property | 24 | 20.5% |  |  |
| `info/attack/<n>` | property | 24 | 20.5% |  |  |
| `info/attack/<n>/action` | int | 24 | 20.5% | 1 … 3 |  |
| `info/attack/<n>/afterDelay` | int | 24 | 20.5% | 3000 … 10000 |  |
| `info/attack/<n>/attackRatio` | int | 24 | 20.5% | 100 … 175 |  |
| `info/attack/<n>/type` | int | 24 | 20.5% | 0 … 2 |  |
| `jump/<n>/_inlink` | string | 24 | 20.5% |  | `move/3`, `move/1`, `move/0`, `stand/1`, `move/2` |
| `info/hpRecovery` | int | 23 | 19.7% | 10 … 999999 |  |
| `info/mpRecovery` | int | 21 | 17.9% | 1 … 99 |  |
| `die1/<n>/_inlink` | string | 20 | 17.1% |  | `hit1/0`, `die1/1`, `move/0`, `die1/2`, `fly/3` |
| `attack1` | property | 18 | 15.4% |  |  |
| `attack1/<n>` | canvas, uol | 18 | 15.4% | 1 … 2 | `../stand/0`, `../stand/1`, `../stand/2`, `../stand/3`, `../stand/4` |
| `attack1/<n>/delay` | int | 18 | 15.4% | 45 … 800 |  |
| `attack1/<n>/head` | vector | 18 | 15.4% |  |  |
| `attack1/<n>/lt` | vector | 18 | 15.4% |  |  |
| `attack1/<n>/origin` | vector | 18 | 15.4% |  |  |
| `attack1/<n>/rb` | vector | 18 | 15.4% |  |  |
| `attack1/info` | property | 18 | 15.4% |  |  |
| `attack1/info/attackAfter` | int | 18 | 15.4% | 300 … 1500 |  |
| `attack1/info/hit` | property | 18 | 15.4% |  |  |
| `attack1/info/hit/<n>` | canvas | 18 | 15.4% |  |  |
| `attack1/info/hit/<n>/origin` | vector | 18 | 15.4% |  |  |
| `attack1/info/range` | property | 18 | 15.4% |  |  |
| `attack1/<n>/_hash` | string | 17 | 14.5% |  |  |
| `info/skill` | property | 17 | 14.5% |  |  |
| `info/skill/<n>` | property | 17 | 14.5% |  |  |
| `info/skill/<n>/action` | int | 17 | 14.5% | 1 … 2 |  |
| `info/skill/<n>/level` | int | 17 | 14.5% | 1 … 6 |  |
| `info/skill/<n>/skill` | int | 17 | 14.5% | 114 … 200 |  |
| `info/boss` | int | 16 | 13.7% | 1 |  |
| `info/firstAttack` | int | 16 | 13.7% | 0 … 1 |  |
| `attack1/info/hit/<n>/_hash` | string | 14 | 12.0% |  |  |
| `info/mobType` | string, int | 14 | 12.0% | 0 … 7 | `1N`, `7N` |
| `info/skill/<n>/effectAfter` | int | 13 | 11.1% | 0 … 1500 |  |
| `attack1/info/hit/<n>/delay` | int | 12 | 10.3% | 50 … 150 |  |
| `info/flySpeed` | int | 12 | 10.3% | -60 … 10 |  |
| `attack1/info/range/r` | int | 11 | 9.4% | 60 … 300 |  |
| `attack1/info/range/sp` | vector | 11 | 9.4% |  |  |
| `info/attack/<n>/conMP` | int | 11 | 9.4% | 2 … 10 |  |
| `skill1` | property | 11 | 9.4% |  |  |
| `skill1/<n>` | canvas, uol | 11 | 9.4% | 0 … 5 | `../stand/0`, `../stand/1`, `../stand/2`, `../stand/3`, `../attack2/0` |
| `skill1/<n>/_hash` | string | 10 | 8.5% |  |  |
| `skill1/<n>/delay` | int | 10 | 8.5% | 90 … 150 |  |
| `skill1/<n>/head` | vector | 10 | 8.5% |  |  |
| `skill1/<n>/lt` | vector | 10 | 8.5% |  |  |
| `skill1/<n>/origin` | vector | 10 | 8.5% |  |  |
| `skill1/<n>/rb` | vector | 10 | 8.5% |  |  |
| `info/attack/<n>/jumpAttack` | int | 9 | 7.7% | 1 |  |
| `info/attack/<n>/magic` | int | 9 | 7.7% | 1 |  |
| `info/category` | int | 9 | 7.7% | 1 … 7 |  |
| `info/skill/<n>/afterDelay` | int | 8 | 6.8% | 3000 … 5000 |  |
| `jump/<n>/delay` | string, int | 8 | 6.8% | 100 … 150 |  |
| `attack1/info/effect` | property | 7 | 6.0% |  |  |
| `attack1/info/effectAfter` | int | 7 | 6.0% | 0 … 700 |  |
| `attack1/info/range/lt` | vector | 7 | 6.0% |  |  |
| `attack1/info/range/rb` | vector | 7 | 6.0% |  |  |
| `attack1/<n>/_inlink` | string | 6 | 5.1% |  | `move/0`, `stand/0`, `attack1/2`, `move/6`, `move/1` |
| `attack1/info/effect/<n>` | canvas | 6 | 5.1% |  |  |
| `attack1/info/effect/<n>/_hash` | string | 6 | 5.1% |  |  |
| `attack1/info/effect/<n>/origin` | vector | 6 | 5.1% |  |  |
| `fly` | property | 6 | 5.1% |  |  |
| `fly/<n>` | canvas | 6 | 5.1% |  |  |
| `fly/<n>/_hash` | string | 6 | 5.1% |  |  |
| `fly/<n>/delay` | int | 6 | 5.1% | 90 … 150 |  |
| `fly/<n>/lt` | vector | 6 | 5.1% |  |  |
| `fly/<n>/origin` | vector | 6 | 5.1% |  |  |
| `fly/<n>/rb` | vector | 6 | 5.1% |  |  |
| `info/hideName` | int | 6 | 5.1% | 1 |  |
| `jump/<n>/_hash` | string | 6 | 5.1% |  |  |
| `attack1/info/effect/<n>/delay` | int | 5 | 4.3% | 50 … 300 |  |
| `attack1/info/hit/<n>/z` | int | 5 | 4.3% | 0 |  |
| `attack2` | property | 5 | 4.3% |  |  |
| `attack2/<n>` | canvas, uol | 5 | 4.3% |  | `../stand/0`, `../stand/1`, `../stand/2`, `../stand/3`, `../stand/4` |
| `attack2/<n>/_hash` | string | 5 | 4.3% |  |  |
| `attack2/<n>/delay` | int | 5 | 4.3% | 60 … 400 |  |
| `attack2/<n>/head` | vector | 5 | 4.3% |  |  |
| `attack2/<n>/lt` | vector | 5 | 4.3% |  |  |
| `attack2/<n>/origin` | vector | 5 | 4.3% |  |  |
| `attack2/<n>/rb` | vector | 5 | 4.3% |  |  |
| `attack2/info` | property | 5 | 4.3% |  |  |
| `attack2/info/attackAfter` | int | 5 | 4.3% | 400 … 1320 |  |
| `attack2/info/hit` | property | 5 | 4.3% |  |  |
| `attack2/info/hit/<n>` | canvas, uol | 5 | 4.3% | 0 … 2 |  |
| `attack2/info/hit/<n>/origin` | vector | 5 | 4.3% |  |  |
| `attack2/info/range` | property | 5 | 4.3% |  |  |
| `die1/<n>/z` | int | 5 | 4.3% | 0 |  |
| `fly/<n>/head` | vector | 5 | 4.3% |  |  |
| `info/attack/<n>/elemAttr` | string | 5 | 4.3% |  | `F`, `L` |
| `info/invincible` | int | 5 | 4.3% | 1 |  |
| `move/<n>/_inlink` | string | 5 | 4.3% |  | `move/0`, `move/1`, `move/2`, `move/3` |
| `attack1/<n>/rect` | property | 4 | 3.4% |  |  |
| `attack1/<n>/rect/<n>` | property | 4 | 3.4% |  |  |
| `attack1/<n>/rect/<n>/lt` | vector | 4 | 3.4% |  |  |
| `attack1/<n>/rect/<n>/rb` | vector | 4 | 3.4% |  |  |
| `attack1/info/hit/attach` | int | 4 | 3.4% | 1 |  |
| `attack2/info/hit/<n>/_hash` | string | 4 | 3.4% |  |  |
| `hit1/<n>/rect` | property | 4 | 3.4% |  |  |
| `hit1/<n>/rect/<n>` | property | 4 | 3.4% |  |  |
| `hit1/<n>/rect/<n>/lt` | vector | 4 | 3.4% |  |  |
| `hit1/<n>/rect/<n>/rb` | vector | 4 | 3.4% |  |  |
| `skill1/<n>/_inlink` | string | 4 | 3.4% |  | `move/1`, `move/2`, `skill1/0`, `skill1/1`, `stand/0` |
| `stand/<n>/rect` | property | 4 | 3.4% |  |  |
| `stand/<n>/rect/<n>` | property | 4 | 3.4% |  |  |
| `stand/<n>/rect/<n>/lt` | vector | 4 | 3.4% |  |  |
| `stand/<n>/rect/<n>/rb` | vector | 4 | 3.4% |  |  |
| `stand/zigzag` | int | 4 | 3.4% | 1 |  |
| `attack1/info/ball` | property | 3 | 2.6% |  |  |
| `attack1/info/ball/<n>` | canvas | 3 | 2.6% |  |  |
| `attack1/info/ball/<n>/_hash` | string | 3 | 2.6% |  |  |
| `attack1/info/ball/<n>/origin` | vector | 3 | 2.6% |  |  |
| `attack1/info/conMP` | int | 3 | 2.6% | 2 |  |
| `attack1/info/type` | int | 3 | 2.6% | 0 |  |
| `attack2/<n>/rect` | property | 3 | 2.6% |  |  |
| `attack2/<n>/rect/<n>` | property | 3 | 2.6% |  |  |
| `attack2/<n>/rect/<n>/lt` | vector | 3 | 2.6% |  |  |
| `attack2/<n>/rect/<n>/rb` | vector | 3 | 2.6% |  |  |
| `attack2/info/effect` | property | 3 | 2.6% |  |  |
| `attack2/info/effectAfter` | int | 3 | 2.6% | 0 … 100 |  |
| `attack2/info/hit/<n>/delay` | int | 3 | 2.6% | 60 … 90 |  |
| `attack2/info/hit/<n>/z` | int | 3 | 2.6% | 0 |  |
| `attack2/info/range/lt` | vector | 3 | 2.6% |  |  |
| `attack2/info/range/rb` | vector | 3 | 2.6% |  |  |
| `move/<n>/rect` | property | 3 | 2.6% |  |  |
| `move/<n>/rect/<n>` | property | 3 | 2.6% |  |  |
| `move/<n>/rect/<n>/lt` | vector | 3 | 2.6% |  |  |
| `move/<n>/rect/<n>/rb` | vector | 3 | 2.6% |  |  |
| `move/zigzag` | int | 3 | 2.6% | 1 |  |
| `stand/<n>/z` | int | 3 | 2.6% | 0 |  |
| `attack1/info/elemAttr` | string | 2 | 1.7% |  | `L` |
| `attack1/info/magic` | int | 2 | 1.7% | 1 |  |
| `attack2/info/ball` | property | 2 | 1.7% |  |  |
| `attack2/info/ball/<n>` | canvas | 2 | 1.7% |  |  |
| `attack2/info/ball/<n>/_hash` | string | 2 | 1.7% |  |  |
| `attack2/info/ball/<n>/origin` | vector | 2 | 1.7% |  |  |
| `attack2/info/effect/<n>` | canvas | 2 | 1.7% |  |  |
| `attack2/info/effect/<n>/_hash` | string | 2 | 1.7% |  |  |
| `attack2/info/effect/<n>/origin` | vector | 2 | 1.7% |  |  |
| `attack2/info/range/r` | int | 2 | 1.7% | 200 … 250 |  |
| `attack2/info/range/sp` | vector | 2 | 1.7% |  |  |
| `hit1/<n>/_inlink` | string | 2 | 1.7% |  | `stand/0` |
| `hit1/<n>/z` | int | 2 | 1.7% | 0 |  |
| `info/attack/<n>/disease` | int | 2 | 1.7% | 125 |  |
| `info/attack/<n>/effectAfter` | int | 2 | 1.7% | 0 |  |
| `info/attack/<n>/level` | int | 2 | 1.7% | 1 … 2 |  |
| `info/revive` | property | 2 | 1.7% |  |  |
| `info/revive/<n>` | int | 2 | 1.7% | 7 |  |
| `jump/<n>/z` | int | 2 | 1.7% | 0 |  |
| `move/<n>/z` | int | 2 | 1.7% | 0 |  |
| `attack1/<n>/hit` | property | 1 | 0.9% |  |  |
| `attack1/<n>/hit/<n>` | canvas | 1 | 0.9% |  |  |
| `attack1/<n>/hit/<n>/delay` | int | 1 | 0.9% | 90 |  |
| `attack1/<n>/hit/<n>/origin` | vector | 1 | 0.9% |  |  |
| `attack1/<n>/hit/attach` | int | 1 | 0.9% | 1 |  |
| `attack1/<n>/z` | int | 1 | 0.9% | 0 |  |
| `attack1/info/ball/<n>/delay` | int | 1 | 0.9% | 60 |  |
| `attack1/info/bulletSpeed` | int | 1 | 0.9% | 140 |  |
| `attack1/info/effect/<n>/z` | int | 1 | 0.9% | 1 |  |
| `attack1/info/jumpAttack` | int | 1 | 0.9% | 1 |  |
| `attack1/info/PADamage` | int | 1 | 0.9% | 165 |  |
| `attack2/<n>/_inlink` | string | 1 | 0.9% |  | `attack2/0`, `attack2/3` |
| `attack2/<n>/z` | int | 1 | 0.9% | 0 |  |
| `attack2/info/ball/<n>/delay` | int | 1 | 0.9% | 90 |  |
| `attack2/info/bulletSpeed` | int | 1 | 0.9% | 140 |  |
| `attack2/info/conMP` | int | 1 | 0.9% | 2 |  |
| `attack2/info/effect/<n>/_inlink` | string | 1 | 0.9% |  | `attack2/info/effect/1` |
| `attack2/info/effect/<n>/delay` | int | 1 | 0.9% | 120 … 160 |  |
| `attack2/info/hit/attachfacing` | int | 1 | 0.9% | 1 |  |
| `attack2/info/magic` | int | 1 | 0.9% | 1 |  |
| `attack2/info/type` | int | 1 | 0.9% | 0 |  |
| `attack3` | property | 1 | 0.9% |  |  |
| `attack3/<n>` | canvas | 1 | 0.9% |  |  |
| `attack3/<n>/_hash` | string | 1 | 0.9% |  |  |
| `attack3/<n>/_inlink` | string | 1 | 0.9% |  | `attack1/0`, `attack2/1`, `attack2/2` |
| `attack3/<n>/delay` | int | 1 | 0.9% | 100 … 500 |  |
| `attack3/<n>/head` | vector | 1 | 0.9% |  |  |
| `attack3/<n>/lt` | vector | 1 | 0.9% |  |  |
| `attack3/<n>/origin` | vector | 1 | 0.9% |  |  |
| `attack3/<n>/rb` | vector | 1 | 0.9% |  |  |
| `attack3/<n>/rect` | property | 1 | 0.9% |  |  |
| `attack3/<n>/rect/<n>` | property | 1 | 0.9% |  |  |
| `attack3/<n>/rect/<n>/lt` | vector | 1 | 0.9% |  |  |
| `attack3/<n>/rect/<n>/rb` | vector | 1 | 0.9% |  |  |
| `attack3/info` | property | 1 | 0.9% |  |  |
| `attack3/info/attackAfter` | int | 1 | 0.9% | 400 |  |
| `attack3/info/effect` | property | 1 | 0.9% |  |  |
| `attack3/info/effect/<n>` | canvas | 1 | 0.9% |  |  |
| `attack3/info/effect/<n>/_hash` | string | 1 | 0.9% |  |  |
| `attack3/info/effect/<n>/origin` | vector | 1 | 0.9% |  |  |
| `attack3/info/effectAfter` | int | 1 | 0.9% | 500 |  |
| `attack3/info/hit` | property | 1 | 0.9% |  |  |
| `attack3/info/hit/<n>` | canvas | 1 | 0.9% |  |  |
| `attack3/info/hit/<n>/_hash` | string | 1 | 0.9% |  |  |
| `attack3/info/hit/<n>/delay` | int | 1 | 0.9% | 90 … 150 |  |
| `attack3/info/hit/<n>/origin` | vector | 1 | 0.9% |  |  |
| `attack3/info/hit/<n>/z` | int | 1 | 0.9% | 0 |  |
| `attack3/info/range` | property | 1 | 0.9% |  |  |
| `attack3/info/range/lt` | vector | 1 | 0.9% |  |  |
| `attack3/info/range/rb` | vector | 1 | 0.9% |  |  |
| `fly/<n>/rect` | property | 1 | 0.9% |  |  |
| `fly/<n>/rect/<n>` | property | 1 | 0.9% |  |  |
| `fly/<n>/rect/<n>/lt` | vector | 1 | 0.9% |  |  |
| `fly/<n>/rect/<n>/rb` | vector | 1 | 0.9% |  |  |
| `info/damagedByMob` | int | 1 | 0.9% | 1 |  |
| `info/default` | property | 1 | 0.9% |  |  |
| `info/default/<n>` | canvas | 1 | 0.9% |  |  |
| `info/default/<n>/_hash` | string | 1 | 0.9% |  |  |
| `info/default/<n>/origin` | vector | 1 | 0.9% |  |  |
| `info/default/<n>/z` | int | 1 | 0.9% | 0 |  |
| `info/dropItemPeriod` | int | 1 | 0.9% | 6 |  |
| `info/fixedDamage` | int | 1 | 0.9% | 1 |  |
| `info/MDRate` | int | 1 | 0.9% | 100 |  |
| `info/noFlip` | int | 1 | 0.9% | 1 |  |
| `info/notAttack` | int | 1 | 0.9% | 1 |  |
| `info/PDRate` | int | 1 | 0.9% | 100 |  |
| `info/removeAfter` | int | 1 | 0.9% | 180 |  |
| `revive` | property | 1 | 0.9% |  |  |
| `revive/<n>` | canvas | 1 | 0.9% |  |  |
| `revive/<n>/_hash` | string | 1 | 0.9% |  |  |
| `revive/<n>/delay` | int | 1 | 0.9% | 70 … 400 |  |
| `revive/<n>/origin` | vector | 1 | 0.9% |  |  |
| `skill2` | property | 1 | 0.9% |  |  |
| `skill2/<n>` | uol | 1 | 0.9% |  | `../skill1/0`, `../skill1/1`, `../skill1/2` |
<!-- /generated:schema -->
