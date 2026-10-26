# Backgrounds (Map/Back/<set>.img)

<!-- generated:schema -->
Units: **36**. Examples: `Map/Back/back_blueCave.img`, `Map/Back/back_blueCave2.img`, `Map/Back/back_christmas.img`.

25 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `back` | property | 36 | 100.0% |  |  |
| `back/<n>` | canvas | 36 | 100.0% |  |  |
| `back/<n>/origin` | vector | 36 | 100.0% |  |  |
| `back/<n>/z` | int | 36 | 100.0% | 0 |  |
| `ani` | property | 12 | 33.3% |  |  |
| `ani/<n>` | property | 12 | 33.3% |  |  |
| `ani/<n>/<n>` | canvas, uol | 12 | 33.3% | 1 … 3 | `../0/0`, `../0/1`, `../0/3`, `../0/4`, `../0/5` |
| `ani/<n>/<n>/origin` | vector | 12 | 33.3% |  |  |
| `ani/<n>/<n>/z` | int | 12 | 33.3% | 0 |  |
| `ani/<n>/<n>/delay` | int, string | 11 | 30.6% | 50 … 3700 |  |
| `back/<n>/_outlink` | string | 8 | 22.2% |  | `Map/Back/_Canvas/back_event.img/back/0`, `Map/Back/_Canvas/back_event.img/back/1`, `Map/Back/_Canvas/back_event.img/back/2`, `Map/Back/_Canvas/back_event.img/back/3`, `Map/Back/_Canvas/back_event.img/back/4` |
| `ani/<n>/<n>/_outlink` | string | 5 | 13.9% |  | `Map/Back/_Canvas/back_login.img/back/15`, `Map/Back/_Canvas/back_login.img/ani/0/1`, `Map/Back/_Canvas/back_login.img/ani/0/2`, `Map/Back/_Canvas/back_login.img/ani/2/0`, `Map/Back/_Canvas/back_login.img/ani/2/1` |
| `ani/<n>/<n>/a0` | int | 4 | 11.1% | 0 … 255 |  |
| `ani/<n>/<n>/a1` | int | 3 | 8.3% | 0 … 255 |  |
| `ani/<n>/<n>/moveH` | int | 2 | 5.6% | -17 … 50 |  |
| `ani/<n>/<n>/moveP` | int | 2 | 5.6% | 1500 … 4300 |  |
| `ani/<n>/<n>/moveType` | int | 2 | 5.6% | 1 … 2 |  |
| `back/<n>/moveH` | int | 2 | 5.6% | -40 … 50 |  |
| `back/<n>/moveP` | int | 2 | 5.6% | 2500 … 5000 |  |
| `back/<n>/moveType` | int | 2 | 5.6% | 2 |  |
| `ani/<n>/<n>/moveW` | int | 1 | 2.8% | 50 |  |
| `ani/<n>/blend` | int | 1 | 2.8% | 1 |  |
| `back/<n>/a0` | int | 1 | 2.8% | 235 |  |
| `back/<n>/blend` | int | 1 | 2.8% | 1 |  |
| `back/<n>/delay` | int | 1 | 2.8% | 700 |  |
<!-- /generated:schema -->
