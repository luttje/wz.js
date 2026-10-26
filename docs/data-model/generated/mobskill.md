# Mob skills (Skill/MobSkill/<id>.img)

<!-- generated:schema -->
Units: **20**. Examples: `Skill/MobSkill/114.img`, `Skill/MobSkill/120.img`, `Skill/MobSkill/121.img`.

67 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `level` | property | 20 | 100.0% |  |  |
| `level/<n>` | property | 20 | 100.0% |  |  |
| `level/<n>/interval` | int | 20 | 100.0% | 3 … 120 |  |
| `level/<n>/time` | int | 19 | 95.0% | 1 … 120 |  |
| `level/<n>/mpCon` | int | 18 | 90.0% | 5 … 10 |  |
| `level/<n>/lt` | vector | 14 | 70.0% |  |  |
| `level/<n>/rb` | vector | 14 | 70.0% |  |  |
| `level/<n>/x` | int | 14 | 70.0% | 1 … 16856 |  |
| `level/<n>/effect` | property | 11 | 55.0% |  |  |
| `level/<n>/effect/<n>` | canvas | 11 | 55.0% |  |  |
| `level/<n>/effect/<n>/_hash` | string | 11 | 55.0% |  |  |
| `level/<n>/effect/<n>/delay` | int | 11 | 55.0% | 80 … 100 |  |
| `level/<n>/effect/<n>/origin` | vector | 11 | 55.0% |  |  |
| `level/<n>/effect/pos` | int | 11 | 55.0% | 3 |  |
| `level/<n>/effect/<n>/a0` | int | 10 | 50.0% | 255 |  |
| `level/<n>/effect/<n>/a1` | int | 10 | 50.0% | 0 |  |
| `level/<n>/mob` | property | 10 | 50.0% |  |  |
| `level/<n>/mob/<n>` | canvas | 10 | 50.0% |  |  |
| `level/<n>/mob/<n>/origin` | vector | 10 | 50.0% |  |  |
| `level/<n>/affected` | property | 9 | 45.0% |  |  |
| `level/<n>/affected/<n>` | canvas | 9 | 45.0% |  |  |
| `level/<n>/affected/<n>/_hash` | string | 9 | 45.0% |  |  |
| `level/<n>/affected/<n>/delay` | int | 9 | 45.0% | 70 … 120 |  |
| `level/<n>/affected/<n>/origin` | vector | 9 | 45.0% |  |  |
| `level/<n>/affected/repeat` | int | 9 | 45.0% | 1 |  |
| `level/<n>/mob/<n>/_hash` | string | 9 | 45.0% |  |  |
| `level/<n>/mob/pos` | int | 9 | 45.0% | 2 |  |
| `level/<n>/prop` | int | 9 | 45.0% | 50 … 100 |  |
| `level/<n>/affected/pos` | int | 8 | 40.0% | 0 … 1 |  |
| `level/<n>/mob/<n>/_inlink` | string | 8 | 40.0% |  | `level/1/mob/0` |
| `level/<n>/mob/icon` | int | 8 | 40.0% | 1 |  |
| `level/<n>/affected/<n>/_inlink` | string | 6 | 30.0% |  | `level/1/affected/0`, `level/1/affected/1`, `level/1/affected/2`, `level/1/affected/3`, `level/1/affected/4` |
| `level/<n>/effect/<n>/_inlink` | string | 6 | 30.0% |  | `level/1/effect/0`, `level/1/effect/1`, `level/1/effect/2`, `level/1/effect/3`, `level/1/effect/4` |
| `level/<n>/mob0` | property | 6 | 30.0% |  |  |
| `level/<n>/mob0/<n>` | canvas | 6 | 30.0% |  |  |
| `level/<n>/mob0/<n>/_hash` | string | 6 | 30.0% |  |  |
| `level/<n>/mob0/<n>/_inlink` | string | 6 | 30.0% |  | `level/2/mob0/1`, `level/2/mob0/2`, `level/2/mob0/3`, `level/2/mob0/4`, `level/2/mob0/5` |
| `level/<n>/mob0/<n>/delay` | int | 6 | 30.0% | 100 … 1100 |  |
| `level/<n>/mob0/<n>/origin` | vector | 6 | 30.0% |  |  |
| `level/<n>/mob0/pos` | int | 6 | 30.0% | 0 … 3 |  |
| `level/<n>/mob0/<n>/a0` | int | 5 | 25.0% | 255 |  |
| `level/<n>/mob0/<n>/a1` | int | 5 | 25.0% | 0 |  |
| `level/<n>/affected/<n>/z` | int | 2 | 10.0% | 0 |  |
| `level/<n>/hp` | int | 2 | 10.0% | 50 … 90 |  |
| `level/<n>/<n>` | int | 1 | 5.0% | 2 … 800018 |  |
| `level/<n>/count` | int | 1 | 5.0% | 5 |  |
| `level/<n>/elemAttr` | string | 1 | 5.0% |  | `S` |
| `level/<n>/limit` | int | 1 | 5.0% | 2 … 30 |  |
| `level/<n>/mob/repeat` | int | 1 | 5.0% | 1 |  |
| `level/<n>/mob0/<n>/z` | int | 1 | 5.0% | 1 |  |
| `level/<n>/mob1` | property | 1 | 5.0% |  |  |
| `level/<n>/mob1/<n>` | canvas | 1 | 5.0% |  |  |
| `level/<n>/mob1/<n>/_hash` | string | 1 | 5.0% |  |  |
| `level/<n>/mob1/<n>/origin` | vector | 1 | 5.0% |  |  |
| `level/<n>/mob1/<n>/z` | int | 1 | 5.0% | -1 |  |
| `level/<n>/mob1/pos` | int | 1 | 5.0% | 0 |  |
| `level/<n>/summonEffect` | int | 1 | 5.0% | 1 … 9 |  |
| `level/<n>/tile` | property | 1 | 5.0% |  |  |
| `level/<n>/tile/<n>` | property | 1 | 5.0% |  |  |
| `level/<n>/tile/<n>/<n>` | canvas | 1 | 5.0% |  |  |
| `level/<n>/tile/<n>/<n>/_hash` | string | 1 | 5.0% |  |  |
| `level/<n>/tile/<n>/<n>/_inlink` | string | 1 | 5.0% |  | `level/1/tile/0/0`, `level/1/tile/1/0`, `level/1/tile/2/0`, `level/1/tile/3/0`, `level/1/tile/4/0` |
| `level/<n>/tile/<n>/<n>/a0` | int | 1 | 5.0% | 128 … 255 |  |
| `level/<n>/tile/<n>/<n>/a1` | int | 1 | 5.0% | 128 … 255 |  |
| `level/<n>/tile/<n>/<n>/delay` | int | 1 | 5.0% | 640 … 900 |  |
| `level/<n>/tile/<n>/<n>/origin` | vector | 1 | 5.0% |  |  |
| `level/<n>/y` | int | 1 | 5.0% | 200 … 5000 |  |
<!-- /generated:schema -->
