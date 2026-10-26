# Equip info (Character/<Slot>/<id>.img/info)

<!-- generated:schema -->
Units: **3967**. Examples: `Character/Accessory/01017000.img`, `Character/Accessory/01017001.img`, `Character/Accessory/01017002.img`.

108 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `info/iconRaw` | canvas | 3967 | 100.0% |  |  |
| `info/iconRaw/origin` | vector | 3967 | 100.0% |  |  |
| `info/cash` | int, string | 3965 | 99.9% | 0 … 1 |  |
| `info/reqLevel` | int | 3963 | 99.9% | 0 … 70 |  |
| `info/islot` | string | 3956 | 99.7% |  | `Af`, `Ay`, `Ae`, `Cp`, `HrCp` |
| `info/vslot` | string | 3956 | 99.7% |  | `Af`, `Ay`, `Ae`, `CpH1H5`, `CpH5` |
| `info/reqJob` | int, string | 3955 | 99.7% | 0 … 13 |  |
| `info/iconRaw/_outlink` | string | 3953 | 99.6% |  |  |
| `info/icon` | canvas | 3801 | 95.8% |  |  |
| `info/icon/origin` | vector | 3801 | 95.8% |  |  |
| `info/icon/_outlink` | string | 3788 | 95.5% |  |  |
| `info/reqDEX` | int | 2298 | 57.9% | 0 … 145 |  |
| `info/reqSTR` | int | 2298 | 57.9% | 0 … 145 |  |
| `info/reqINT` | int | 2295 | 57.9% | 0 … 140 |  |
| `info/reqLUK` | int, string | 2295 | 57.9% | 0 … 145 |  |
| `info/price` | int, string | 1253 | 31.6% | 0 … 38000 |  |
| `info/tuc` | int, long | 1214 | 30.6% | 0 … 10 |  |
| `info/scope` | short | 1150 | 29.0% | -1 … 0 |  |
| `info/incPDD` | int, string | 977 | 24.6% | 1 … 200 |  |
| `info/incDEX` | int | 327 | 8.2% | 0 … 999 |  |
| `info/incMHP` | int | 285 | 7.2% | 2 … 70 |  |
| `info/incMDD` | int | 278 | 7.0% | 3 … 200 |  |
| `info/incSTR` | int | 271 | 6.8% | 0 … 999 |  |
| `info/colorvar` | int | 233 | 5.9% | 1 |  |
| `info/afterImage` | string | 204 | 5.1% |  | `swordOL`, `swordOS`, `mace`, `barehands`, `swordTS` |
| `info/attack` | short | 204 | 5.1% | 1 … 8 |  |
| `info/attackSpeed` | int | 204 | 5.1% | 2 … 8 |  |
| `info/sfx` | string | 204 | 5.1% |  | `swordL`, `swordS`, `mace`, `barehands`, `spear` |
| `info/stand` | int | 204 | 5.1% | 1 … 2 |  |
| `info/walk` | int | 204 | 5.1% | 1 … 2 |  |
| `info/incWAT` | int | 203 | 5.1% | 10 … 200 |  |
| `info/incLUK` | int | 178 | 4.5% | 0 … 999 |  |
| `info/sample` | canvas | 161 | 4.1% |  |  |
| `info/sample/_outlink` | string | 161 | 4.1% |  |  |
| `info/incEVA` | int | 159 | 4.0% | 1 … 200 |  |
| `info/collabo` | int | 156 | 3.9% | 1 |  |
| `info/incMMP` | int | 147 | 3.7% | 4 … 70 |  |
| `info/exceptLinkCashWeaponData` | int | 142 | 3.6% | 1 |  |
| `info/incINT` | int | 121 | 3.1% | 0 … 999 |  |
| `info/incACC` | int | 110 | 2.8% | 1 … 200 |  |
| `info/incCRT` | int | 109 | 2.7% | 1 … 4 |  |
| `info/chatBalloon` | int | 81 | 2.0% | 1 … 181 |  |
| `info/nameTag` | int | 77 | 1.9% | 1 … 191 |  |
| `info/incSpeed` | int | 70 | 1.8% | 1 … 30 |  |
| `info/incJump` | int | 64 | 1.6% | 1 … 50 |  |
| `info/icon/z` | int | 39 | 1.0% | 0 |  |
| `info/iconRaw/z` | int | 39 | 1.0% | 0 |  |
| `info/noPrism` | int | 35 | 0.9% | 1 |  |
| `info/incCRD` | int | 31 | 0.8% | 1 … 6 |  |
| `info/effect` | property | 26 | 0.7% |  |  |
| `info/effect/bottom` | int | 26 | 0.7% | -10 … 20 |  |
| `info/effect/delay` | int | 26 | 0.7% | 1200 … 3600 |  |
| `info/effect/follow` | int | 26 | 0.7% | 0 … 1 |  |
| `info/effect/interval` | int | 26 | 0.7% | 50 … 450 |  |
| `info/effect/left` | string, int | 26 | 0.7% | -40 … -1 |  |
| `info/effect/path` | string | 26 | 0.7% |  | `Effect/CharacterEff.img/1032053`, `Effect/CharacterEff.img/1032063`, `Effect/CharacterEff.img/1002667`, `Effect/CharacterEff.img/1003249`, `Effect/CharacterEff.img/1003252` |
| `info/effect/right` | int | 26 | 0.7% | 1 … 50 |  |
| `info/effect/top` | int | 26 | 0.7% | -50 … 20 |  |
| `info/incMAD` | int | 24 | 0.6% | 0 … 111 |  |
| `info/knockback` | int | 23 | 0.6% | 20 … 30 |  |
| `info/effect/dx` | int | 22 | 0.6% | 0 … 50 |  |
| `info/effect/dy` | int | 22 | 0.6% | -20 … 10 |  |
| `info/effect/genOnMove` | int | 22 | 0.6% | 1 |  |
| `info/effect/z` | int | 22 | 0.6% | -1 |  |
| `info/removeEar` | int | 17 | 0.4% | 1 |  |
| `info/reqPOP` | int | 15 | 0.4% | 10 … 20 |  |
| `info/invisibleFace` | int | 11 | 0.3% | 1 |  |
| `info/tradeBlock` | int | 9 | 0.2% | 1 |  |
| `info/onlyEquip` | int | 5 | 0.1% | 1 |  |
| `info/fs` | int | 4 | 0.1% | 10 |  |
| `info/night` | int | 3 | 0.1% | 1 |  |
| `info/noRemove` | int | 3 | 0.1% | 1 |  |
| `info/quest` | int | 3 | 0.1% | 1 |  |
| `info/accountSharable` | int | 2 | 0.1% | 1 |  |
| `info/cashTradeBlock` | int | 2 | 0.1% | 1 |  |
| `info/incPAD` | int | 2 | 0.1% | 0 |  |
| `info/level` | property | 2 | 0.1% |  |  |
| `info/level/case` | property | 2 | 0.1% |  |  |
| `info/level/case/<n>` | property | 2 | 0.1% |  |  |
| `info/level/case/<n>/<n>` | property | 2 | 0.1% |  |  |
| `info/level/case/<n>/<n>/EquipmentSkill` | property | 2 | 0.1% |  |  |
| `info/level/case/<n>/<n>/EquipmentSkill/<n>` | property | 2 | 0.1% |  |  |
| `info/level/case/<n>/<n>/EquipmentSkill/<n>/id` | int | 2 | 0.1% | 80012714 … 80012715 |  |
| `info/level/case/<n>/<n>/EquipmentSkill/<n>/level` | int | 2 | 0.1% | 1 |  |
| `info/level/case/<n>/<n>/hs` | string | 2 | 0.1% |  | `h1` |
| `info/level/case/<n>/prob` | int | 2 | 0.1% | 1 |  |
| `info/level/fixLevel` | int | 2 | 0.1% | 1 |  |
| `info/level/info` | property | 2 | 0.1% |  |  |
| `info/level/info/<n>` | property | 2 | 0.1% |  |  |
| `info/onlyCash` | int | 2 | 0.1% | 1 |  |
| `info/origin` | vector | 2 | 0.1% |  |  |
| `info/recovery` | float | 2 | 0.1% | 1.5 |  |
| `info/weekly` | int | 2 | 0.1% | 1 |  |
| `info/groupEffectID` | short | 1 | 0.0% | 4 |  |
| `info/hide` | int | 1 | 0.0% | 1 |  |
| `info/iconRaw/_inlink` | string | 1 | 0.0% |  | `info/icon` |
| `info/isAbleToTradeOnce` | int | 1 | 0.0% | 0 |  |
| `info/keywordEffect` | property | 1 | 0.0% |  |  |
| `info/keywordEffect/<n>` | property | 1 | 0.0% |  |  |
| `info/keywordEffect/<n>/<n>` | canvas | 1 | 0.0% |  |  |
| `info/keywordEffect/<n>/<n>/_outlink` | string | 1 | 0.0% |  |  |
| `info/keywordEffect/<n>/<n>/delay` | int | 1 | 0.0% | 90 … 240 |  |
| `info/keywordEffect/<n>/<n>/origin` | vector | 1 | 0.0% |  |  |
| `info/keywordEffect/<n>/keyword` | string | 1 | 0.0% |  | `flyhigh` |
| `info/keywordEffect/<n>/sound` | string | 1 | 0.0% |  | `01002796_0` |
| `info/keywordEffect/<n>/z` | int | 1 | 0.0% | 1 |  |
| `info/notSale` | int | 1 | 0.0% | 1 |  |
| `info/only` | int | 1 | 0.0% | 1 |  |
<!-- /generated:schema -->
