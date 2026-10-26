# Tiles (Map/Tile/<set>.img)

<!-- generated:schema -->
Units: **32**. Examples: `Map/Tile/tile_blackTile.img`, `Map/Tile/tile_blankTower.img`, `Map/Tile/tile_blueCave.img`.

80 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `bsc` | property | 32 | 100.0% |  |  |
| `bsc/<n>` | canvas | 32 | 100.0% |  |  |
| `bsc/<n>/origin` | vector | 32 | 100.0% |  |  |
| `edD` | property | 32 | 100.0% |  |  |
| `edD/<n>` | canvas | 32 | 100.0% |  |  |
| `edD/<n>/origin` | vector | 32 | 100.0% |  |  |
| `edD/<n>/z` | int | 32 | 100.0% | -5 … -4 |  |
| `edU` | property | 32 | 100.0% |  |  |
| `edU/<n>` | canvas | 32 | 100.0% |  |  |
| `edU/<n>/foothold` | convex | 32 | 100.0% |  |  |
| `edU/<n>/foothold/<n>` | vector | 32 | 100.0% |  |  |
| `edU/<n>/origin` | vector | 32 | 100.0% |  |  |
| `edU/<n>/z` | int | 32 | 100.0% | -5 … -4 |  |
| `enH0` | property | 32 | 100.0% |  |  |
| `enH0/<n>` | canvas | 32 | 100.0% |  |  |
| `enH0/<n>/foothold` | convex | 32 | 100.0% |  |  |
| `enH0/<n>/foothold/<n>` | vector | 32 | 100.0% |  |  |
| `enH0/<n>/origin` | vector | 32 | 100.0% |  |  |
| `enH0/<n>/z` | int | 32 | 100.0% | -4 … -3 |  |
| `enH1` | property | 32 | 100.0% |  |  |
| `enH1/<n>` | canvas | 32 | 100.0% |  |  |
| `enH1/<n>/origin` | vector | 32 | 100.0% |  |  |
| `enH1/<n>/z` | int | 32 | 100.0% | -4 … -3 |  |
| `enV0` | property | 32 | 100.0% |  |  |
| `enV0/<n>` | canvas | 32 | 100.0% |  |  |
| `enV0/<n>/foothold` | convex | 32 | 100.0% |  |  |
| `enV0/<n>/foothold/<n>` | vector | 32 | 100.0% |  |  |
| `enV0/<n>/origin` | vector | 32 | 100.0% |  |  |
| `enV0/<n>/z` | int | 32 | 100.0% | -3 … -2 |  |
| `enV1` | property | 32 | 100.0% |  |  |
| `enV1/<n>` | canvas | 32 | 100.0% |  |  |
| `enV1/<n>/foothold` | convex | 32 | 100.0% |  |  |
| `enV1/<n>/foothold/<n>` | vector | 32 | 100.0% |  |  |
| `enV1/<n>/origin` | vector | 32 | 100.0% |  |  |
| `enV1/<n>/z` | int | 32 | 100.0% | -3 … -2 |  |
| `info` | property | 32 | 100.0% |  |  |
| `bsc/<n>/z` | int | 31 | 96.9% | 0 |  |
| `slLD` | property | 29 | 90.6% |  |  |
| `slLD/<n>` | canvas | 29 | 90.6% |  |  |
| `slLD/<n>/origin` | vector | 29 | 90.6% |  |  |
| `slLD/<n>/z` | int | 29 | 90.6% | -3 … -2 |  |
| `slLU` | property | 29 | 90.6% |  |  |
| `slLU/<n>` | canvas | 29 | 90.6% |  |  |
| `slLU/<n>/foothold` | convex | 29 | 90.6% |  |  |
| `slLU/<n>/foothold/<n>` | vector | 29 | 90.6% |  |  |
| `slLU/<n>/origin` | vector | 29 | 90.6% |  |  |
| `slLU/<n>/z` | int | 29 | 90.6% | -3 … -2 |  |
| `slRD` | property | 29 | 90.6% |  |  |
| `slRD/<n>` | canvas | 29 | 90.6% |  |  |
| `slRD/<n>/origin` | vector | 29 | 90.6% |  |  |
| `slRD/<n>/z` | int | 29 | 90.6% | -3 … -2 |  |
| `slRU` | property | 29 | 90.6% |  |  |
| `slRU/<n>` | canvas | 29 | 90.6% |  |  |
| `slRU/<n>/foothold` | convex | 29 | 90.6% |  |  |
| `slRU/<n>/foothold/<n>` | vector | 29 | 90.6% |  |  |
| `slRU/<n>/origin` | vector | 29 | 90.6% |  |  |
| `slRU/<n>/z` | int | 29 | 90.6% | -3 … -2 |  |
| `slRD/<n>/map` | property | 22 | 68.8% |  |  |
| `enH0/<n>/map` | property | 21 | 65.6% |  |  |
| `edD/<n>/map` | property | 20 | 62.5% |  |  |
| `enH1/<n>/map` | property | 20 | 62.5% |  |  |
| `enV0/<n>/map` | property | 20 | 62.5% |  |  |
| `enV1/<n>/map` | property | 20 | 62.5% |  |  |
| `slLD/<n>/map` | property | 20 | 62.5% |  |  |
| `slLU/<n>/map` | property | 19 | 59.4% |  |  |
| `slRU/<n>/map` | property | 19 | 59.4% |  |  |
| `bsc/<n>/map` | property | 9 | 28.1% |  |  |
| `edU/<n>/map` | property | 9 | 28.1% |  |  |
| `bsc/<n>/_outlink` | string | 7 | 21.9% |  | `Map/Tile/_Canvas/tile_blueCave.img/bsc/0` |
| `edD/<n>/_outlink` | string | 7 | 21.9% |  | `Map/Tile/_Canvas/tile_blueCave.img/edD/0`, `Map/Tile/_Canvas/tile_darkCave.img/edD/0`, `Map/Tile/_Canvas/tile_deepCave.img/edD/0` |
| `edU/<n>/_outlink` | string | 7 | 21.9% |  | `Map/Tile/_Canvas/tile_blueCave.img/edU/0`, `Map/Tile/_Canvas/tile_darkCave.img/edU/0`, `Map/Tile/_Canvas/tile_deepCave.img/edU/0` |
| `enH0/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `enH1/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `enV0/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `enV1/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `slLD/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `slLU/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `slRD/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `slRU/<n>/_outlink` | string | 7 | 21.9% |  |  |
| `info/mag` | int | 1 | 3.1% | 2 |  |
<!-- /generated:schema -->
