# Bundled items (Item/<Category>/<prefix>.img/<id>)

<!-- generated:schema -->
Units: **1389**. Examples: `Item/Cash/0501.img/05010000`, `Item/Cash/0501.img/05010001`, `Item/Cash/0501.img/05010002`.

292 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `info` | property | 1377 | 99.1% |  |  |
| `info/icon` | canvas, uol | 1377 | 99.1% |  | `../../02040000/info/icon`, `../../02040001/info/icon`, `../../02040002/info/icon`, `../../02040003/info/icon`, `../../02100000/info/icon` |
| `info/iconRaw` | canvas, uol | 1377 | 99.1% |  | `icon`, `../../02040000/info/iconRaw`, `../../02040001/info/iconRaw`, `../../02040002/info/iconRaw`, `../../02040003/info/iconRaw` |
| `info/icon/origin` | vector | 1121 | 80.7% |  |  |
| `info/icon/_outlink` | string | 1118 | 80.5% |  |  |
| `info/iconRaw/origin` | vector | 1114 | 80.2% |  |  |
| `info/iconRaw/_outlink` | string | 1111 | 80.0% |  |  |
| `info/price` | int | 1032 | 74.3% | 0 … 25000 |  |
| `info/slotMax` | int | 507 | 36.5% | 1 … 1000 |  |
| `info/cash` | int | 322 | 23.2% | 0 … 1 |  |
| `info/icon/z` | int | 268 | 19.3% | 0 |  |
| `info/iconRaw/z` | int | 267 | 19.2% | 0 |  |
| `info/success` | int | 217 | 15.6% | 10 … 100 |  |
| `spec` | property | 190 | 13.7% |  |  |
| `info/quest` | int | 146 | 10.5% | 1 |  |
| `info/notSale` | int | 102 | 7.3% | 1 |  |
| `spec/npc` | int | 84 | 6.0% | 317 … 9010000 |  |
| `spec/script` | string | 84 | 6.0% |  | `cash_5180000`, `cash_5680000`, `cash_5680001`, `cash_5680002`, `cash_5680003` |
| `info/timeLimited` | int | 81 | 5.8% | 1 |  |
| `effect` | property | 80 | 5.8% |  |  |
| `info/notConsume` | int | 79 | 5.7% | 1 |  |
| `info/height` | int | 75 | 5.4% | 27 … 141 |  |
| `info/tradeBlock` | int, string | 75 | 5.4% | 1 |  |
| `info/width` | int | 75 | 5.4% | 16 … 239 |  |
| `info/iconReward` | property | 72 | 5.2% |  |  |
| `info/iconReward/<n>` | canvas | 72 | 5.2% |  |  |
| `info/iconReward/<n>/_outlink` | string | 72 | 5.2% |  |  |
| `info/iconReward/<n>/origin` | vector | 72 | 5.2% |  |  |
| `effect/<n>` | canvas, uol | 71 | 5.1% | 0 … 15 |  |
| `effect/<n>/origin` | vector | 71 | 5.1% |  |  |
| `effect/z` | int | 71 | 5.1% | -1 … 3 |  |
| `info/incWAT` | int | 69 | 5.0% | 1 … 29 |  |
| `effect/<n>/_outlink` | string | 68 | 4.9% |  |  |
| `image` | property | 64 | 4.6% |  |  |
| `image/<n>` | property | 64 | 4.6% |  |  |
| `image/<n>/<n>` | canvas, uol | 64 | 4.6% | 1 … 2 |  |
| `image/<n>/<n>/_outlink` | string | 64 | 4.6% |  |  |
| `image/<n>/<n>/origin` | vector | 64 | 4.6% |  |  |
| `image/<n>/z` | int | 64 | 4.6% | 0 … 1 |  |
| `info/accountSharable` | int | 64 | 4.6% | 1 |  |
| `effect/pos` | int | 57 | 4.1% | 1 |  |
| `info/recoveryHP` | int | 56 | 4.0% | 20 … 200 |  |
| `info/noDrop` | int | 53 | 3.8% | 1 |  |
| `info/cursed` | int | 52 | 3.7% | 50 |  |
| `info/itemID1` | int | 52 | 3.7% | 2040001 … 2048005 |  |
| `info/itemID2` | int | 52 | 3.7% | 2040002 … 2048006 |  |
| `info/itemID3` | int | 52 | 3.7% | 2040003 … 2048007 |  |
| `info/reqLevel` | int | 51 | 3.7% | 0 … 15 |  |
| `bullet` | property | 48 | 3.5% |  |  |
| `bullet/<n>` | canvas | 48 | 3.5% |  |  |
| `bullet/<n>/_outlink` | string | 48 | 3.5% |  |  |
| `bullet/<n>/origin` | vector | 48 | 3.5% |  |  |
| `info/recoveryMP` | int | 46 | 3.3% | 5 … 200 |  |
| `info/collabo` | int | 44 | 3.2% | 1 |  |
| `effect/<n>/z` | int | 36 | 2.6% | 0 |  |
| `spec/hp` | int | 34 | 2.4% | 30 … 2500 |  |
| `info/addTime` | int | 32 | 2.3% | 86400 … 31536000 |  |
| `info/maxDays` | int | 30 | 2.2% | 365 |  |
| `hit` | property | 29 | 2.1% |  |  |
| `hit/<n>` | canvas | 29 | 2.1% |  |  |
| `hit/<n>/_outlink` | string | 29 | 2.1% |  |  |
| `hit/<n>/delay` | int | 29 | 2.1% | 72 … 150 |  |
| `hit/<n>/origin` | vector | 29 | 2.1% |  |  |
| `spec/time` | int | 29 | 2.1% | 300000 … 3600000 |  |
| `info/type` | int | 27 | 1.9% | 0 … 12 |  |
| `effect/<n>/delay` | int | 26 | 1.9% | 80 … 2400 |  |
| `info/flatRate` | int | 24 | 1.7% | 1 |  |
| `info/limitMin` | int | 24 | 1.7% | 1 … 30 |  |
| `info/incPDD` | int | 23 | 1.7% | 2 … 8 |  |
| `info/minusLevel` | int | 21 | 1.5% | 5 … 30 |  |
| `info/selectedSlot` | property | 21 | 1.5% |  |  |
| `info/selectedSlot/<n>` | int | 21 | 1.5% | 1 … 1104 |  |
| `spec/mp` | int | 20 | 1.4% | 30 … 2500 |  |
| `info/incMDD` | int | 19 | 1.4% | 2 … 8 |  |
| `info/path` | string | 18 | 1.3% |  | `Map/MapHelper.img/weather/snow`, `Map/MapHelper.img/weather/flower`, `Map/MapHelper.img/weather/soap`, `Map/MapHelper.img/weather/snowCrystal`, `Map/MapHelper.img/weather/present` |
| `bullet/<n>/z` | int | 16 | 1.2% | 0 |  |
| `info/incACC` | int | 16 | 1.2% | 1 … 4 |  |
| `info/floatType` | int | 15 | 1.1% | 1 … 99 |  |
| `spec/cosmetic` | int | 15 | 1.1% | 22000 … 32060 |  |
| `iconRaw` | canvas, property | 12 | 0.9% |  |  |
| `info/incDEX` | int | 12 | 0.9% | 1 … 4 |  |
| `info/incINT` | int | 12 | 0.9% | 1 … 4 |  |
| `info/incLUK` | int | 12 | 0.9% | 1 … 4 |  |
| `info/incMAD` | int | 12 | 0.9% | 2 … 10 |  |
| `info/incMHP` | int | 12 | 0.9% | 10 … 25 |  |
| `info/incMMP` | int | 12 | 0.9% | 10 … 25 |  |
| `info/incSTR` | int | 12 | 0.9% | 1 … 4 |  |
| `info/maxEntityCount` | int | 11 | 0.8% | 12 … 24 |  |
| `info/unitPrice` | double | 11 | 0.8% | 0.3 … 1 |  |
| `spec/moveTo` | int | 11 | 0.8% | 10000000 … 999999999 |  |
| `info/npcID` | int | 10 | 0.7% | 238 … 800015 |  |
| `info/pquest` | int | 10 | 0.7% | 1 |  |
| `effect2` | property | 9 | 0.6% |  |  |
| `effect2/<n>` | canvas | 9 | 0.6% |  |  |
| `effect2/<n>/_outlink` | string | 9 | 0.6% |  |  |
| `effect2/<n>/origin` | vector | 9 | 0.6% |  |  |
| `effect2/<n>/z` | int | 9 | 0.6% | 0 |  |
| `effect2/z` | int | 9 | 0.6% | -1 … 3 |  |
| `info/masterLevel` | int | 9 | 0.6% | 15 … 30 |  |
| `info/reqSkillLevel` | int | 9 | 0.6% | 5 … 10 |  |
| `info/skill` | property | 9 | 0.6% |  |  |
| `info/skill/<n>` | int | 9 | 0.6% | 4311003 … 22141002 |  |
| `mob` | property | 9 | 0.6% |  |  |
| `mob/<n>` | property | 9 | 0.6% |  |  |
| `mob/<n>/id` | int | 9 | 0.6% | 700004 … 810005 |  |
| `mob/<n>/prob` | int | 9 | 0.6% | 100 |  |
| `effect/default` | property | 8 | 0.6% |  |  |
| `effect/default/<n>` | canvas | 8 | 0.6% |  |  |
| `effect/default/<n>/_outlink` | string | 8 | 0.6% |  |  |
| `effect/default/<n>/origin` | vector | 8 | 0.6% |  |  |
| `effect/default/pos` | int | 8 | 0.6% | 1 |  |
| `effect/default/z` | int | 8 | 0.6% | -1 |  |
| `effect2/pos` | int | 8 | 0.6% | 1 |  |
| `icon` | canvas | 8 | 0.6% |  |  |
| `icon/_outlink` | string | 8 | 0.6% |  |  |
| `icon/origin` | vector | 8 | 0.6% |  |  |
| `iconRaw/<n>` | canvas | 8 | 0.6% |  |  |
| `iconRaw/<n>/_outlink` | string | 8 | 0.6% |  |  |
| `iconRaw/<n>/origin` | vector | 8 | 0.6% |  |  |
| `info/incEVA` | int | 8 | 0.6% | 1 … 4 |  |
| `info/incJump` | int | 8 | 0.6% | 1 … 4 |  |
| `info/incSpeed` | int | 8 | 0.6% | 1 … 4 |  |
| `info/noRemove` | int | 8 | 0.6% | 1 |  |
| `info/only` | int | 8 | 0.6% | 1 |  |
| `info/stateChangeItem` | int | 8 | 0.6% | 2023000 … 2210003 |  |
| `spec/morph` | int | 8 | 0.6% | 1 … 5 |  |
| `effect2/<n>/delay` | int | 7 | 0.5% | 100 … 160 |  |
| `image/on` | property | 7 | 0.5% |  |  |
| `image/on/<n>` | property | 7 | 0.5% |  |  |
| `image/on/<n>/<n>` | canvas | 7 | 0.5% |  |  |
| `image/on/<n>/<n>/_outlink` | string | 7 | 0.5% |  |  |
| `image/on/<n>/<n>/origin` | vector | 7 | 0.5% |  |  |
| `image/on/<n>/z` | int | 7 | 0.5% | 0 |  |
| `imageSelector` | property | 7 | 0.5% |  |  |
| `imageSelector/<n>` | string | 7 | 0.5% |  | `default`, `on` |
| `imageSelector/sound` | property | 7 | 0.5% |  |  |
| `imageSelector/sound/<n>` | string | 7 | 0.5% |  | `Sound/Game.img/HousingInteractOn`, `Sound/Game.img/HousingInteractClose`, `Sound/Game.img/HousingInteractOpen`, `Sound/Game.img/HousingInteractFanOff`, `Sound/Game.img/HousingInteractFanOn` |
| `info/dateExpire` | string | 7 | 0.5% | 202611190000 |  |
| `info/noMoveToLocker` | int | 7 | 0.5% | 1 |  |
| `bullet/<n>/delay` | int | 6 | 0.4% | 30 |  |
| `playerAnim` | property | 6 | 0.4% |  |  |
| `playerAnim/<n>` | property | 6 | 0.4% |  |  |
| `playerAnim/<n>/moveAction` | int | 6 | 0.4% | 5 … 10 |  |
| `playerAnim/<n>/pos` | vector | 6 | 0.4% |  |  |
| `playerAnim/dist` | int | 6 | 0.4% | 40 … 120 |  |
| `effect/default/<n>/delay` | int | 5 | 0.4% | 120 |  |
| `info/bagType` | int | 5 | 0.4% | 7 |  |
| `info/useCooldown` | int | 5 | 0.4% | 30 … 3600 |  |
| `skin` | property | 5 | 0.4% |  |  |
| `skin/backgrnd` | canvas | 5 | 0.4% |  |  |
| `skin/backgrnd/_outlink` | string | 5 | 0.4% |  |  |
| `skin/backgrnd/origin` | vector | 5 | 0.4% |  |  |
| `addTime` | int | 4 | 0.3% | 604800 … 2592000 |  |
| `cash` | int | 4 | 0.3% | 1 |  |
| `emotion` | property | 4 | 0.3% |  |  |
| `icon/z` | int | 4 | 0.3% | 0 |  |
| `iconRaw/_outlink` | string | 4 | 0.3% |  |  |
| `iconRaw/origin` | vector | 4 | 0.3% |  |  |
| `iconReward` | property | 4 | 0.3% |  |  |
| `iconReward/<n>` | canvas | 4 | 0.3% |  |  |
| `iconReward/<n>/_outlink` | string | 4 | 0.3% |  |  |
| `iconReward/<n>/origin` | vector | 4 | 0.3% |  |  |
| `image/<n>/<n>/delay` | int | 4 | 0.3% | 150 … 10000 |  |
| `info/add` | int | 4 | 0.3% | 1 |  |
| `info/incCRD` | int | 4 | 0.3% | 1 … 4 |  |
| `info/incCRT` | int | 4 | 0.3% | 1 … 4 |  |
| `info/lt` | vector | 4 | 0.3% |  |  |
| `info/rb` | vector | 4 | 0.3% |  |  |
| `info/time` | int | 4 | 0.3% | 60 |  |
| `maplist` | property | 4 | 0.3% |  |  |
| `maplist/<n>` | int | 4 | 0.3% | 100000000 … 310000000 |  |
| `maxDays` | int | 4 | 0.3% | 365 |  |
| `name` | string | 4 | 0.3% |  | `Convenience Essentials Pack`, `Beauty Essentials Pack`, `Pet Booster Essentials Pack`, `Monthly Essentials` |
| `onlyCash` | int | 4 | 0.3% | 1 |  |
| `spec/mpR` | int | 4 | 0.3% | 35 … 100 |  |
| `spec/pad` | int | 4 | 0.3% | 10 … 50 |  |
| `tile` | property | 4 | 0.3% |  |  |
| `tile/<n>` | property | 4 | 0.3% |  |  |
| `tile/<n>/<n>` | canvas | 4 | 0.3% |  |  |
| `tile/<n>/<n>/_outlink` | string | 4 | 0.3% |  |  |
| `tile/<n>/<n>/a0` | int | 4 | 0.3% | 0 … 255 |  |
| `tile/<n>/<n>/a1` | int | 4 | 0.3% | 0 … 255 |  |
| `tile/<n>/<n>/delay` | int, string | 4 | 0.3% | 250 … 900 |  |
| `tile/<n>/<n>/origin` | vector | 4 | 0.3% |  |  |
| `effect/default/<n>/z` | int | 3 | 0.2% | 0 |  |
| `hit/<n>/z` | int | 3 | 0.2% | 0 |  |
| `info/ArcaneForceDC` | property | 3 | 0.2% |  |  |
| `info/ArcaneForceDC/ArcaneForceDcItemID` | int | 3 | 0.2% | 1712001 … 1712003 |  |
| `info/ArcaneForceDC/ArcaneForceDcRate` | int | 3 | 0.2% | 70 |  |
| `info/BuffSkillID` | int | 3 | 0.2% | 80011594 … 80011596 |  |
| `info/expireOnLogout` | int | 3 | 0.2% | 1 |  |
| `info/recoveryRate` | int | 3 | 0.2% | 100 |  |
| `info/sample` | canvas | 3 | 0.2% |  |  |
| `info/sample/_outlink` | string | 3 | 0.2% |  |  |
| `info/tamingMob` | int | 3 | 0.2% | 1983000 … 1983024 |  |
| `info/useCooldownSharedItemID` | int | 3 | 0.2% | 2000004 … 5450000 |  |
| `minusLevel` | int | 3 | 0.2% | 20 |  |
| `reward` | property | 3 | 0.2% |  |  |
| `reward/<n>` | property | 3 | 0.2% |  |  |
| `reward/<n>/meso` | int | 3 | 0.2% | 10000 … 100000 |  |
| `reward/<n>/prob` | int | 3 | 0.2% | 1 … 100 |  |
| `reward/<n>/type` | int | 3 | 0.2% | 1 |  |
| `selectedSlot` | property | 3 | 0.2% |  |  |
| `selectedSlot/<n>` | int | 3 | 0.2% | 1 … 1104 |  |
| `spec/acc` | int | 3 | 0.2% | -5 … 7 |  |
| `spec/eva` | int | 3 | 0.2% | 5 … 10 |  |
| `spec/expBuff` | int | 3 | 0.2% | 150 … 300 |  |
| `spec/hpR` | int | 3 | 0.2% | 35 … 100 |  |
| `spec/incRepleteness` | int | 3 | 0.2% | 30 … 100 |  |
| `spec/incTameness` | int | 3 | 0.2% | 1 … 100 |  |
| `spec/mad` | int | 3 | 0.2% | 10 … 50 |  |
| `book` | property | 2 | 0.1% |  |  |
| `book/<n>` | property | 2 | 0.1% |  |  |
| `book/<n>/<n>` | property | 2 | 0.1% |  |  |
| `book/<n>/<n>/text` | string | 2 | 0.1% |  | `Scroll of Switch Pet Ability`, `Legend of the Snail` |
| `buff` | property | 2 | 0.1% |  |  |
| `buff/<n>` | property | 2 | 0.1% |  |  |
| `buff/<n>/buffItemID` | int | 2 | 0.1% | 2002100 … 2028077 |  |
| `buff/<n>/prob` | int | 2 | 0.1% | 100 |  |
| `effect/<n>/a0` | int | 2 | 0.1% | 225 |  |
| `effect/<n>/a1` | int | 2 | 0.1% | 0 |  |
| `emotion/angry` | int | 2 | 0.1% | 25 |  |
| `emotion/cheers` | int | 2 | 0.1% | 25 |  |
| `emotion/chu` | int | 2 | 0.1% | 20 |  |
| `emotion/cry` | int | 2 | 0.1% | 20 |  |
| `emotion/glitter` | int | 2 | 0.1% | 25 |  |
| `emotion/love` | int | 2 | 0.1% | 30 |  |
| `emotion/oops` | int | 2 | 0.1% | 15 |  |
| `emotion/vomit` | int | 2 | 0.1% | 40 |  |
| `iconLeave` | property | 2 | 0.1% |  |  |
| `iconLeave/<n>` | canvas | 2 | 0.1% |  |  |
| `iconLeave/<n>/_outlink` | string | 2 | 0.1% |  |  |
| `iconLeave/<n>/delay` | int | 2 | 0.1% | 60 |  |
| `iconLeave/<n>/origin` | vector | 2 | 0.1% |  |  |
| `iconLeave/<n>/z` | int | 2 | 0.1% | 0 |  |
| `iconRaw/<n>/delay` | int | 2 | 0.1% | 60 |  |
| `iconRaw/<n>/z` | int | 2 | 0.1% | 0 |  |
| `iconReward/<n>/delay` | int | 2 | 0.1% | 150 |  |
| `info/iconReward/<n>/delay` | int | 2 | 0.1% | 120 … 300 |  |
| `info/notExtend` | int | 2 | 0.1% | 1 |  |
| `info/soldInform` | int | 2 | 0.1% | 1 |  |
| `skin/baloonOrigin` | vector | 2 | 0.1% |  |  |
| `spec/<n>` | int | 2 | 0.1% | 5000000 … 5000054 |  |
| `spec/crt` | int | 2 | 0.1% | 3 … 10 |  |
| `tile/<n>/<n>/z` | int | 2 | 0.1% | 0 |  |
| `book/<n>/<n>/align` | string | 1 | 0.1% | 1 |  |
| `effect/alpha` | int | 1 | 0.1% | 224 |  |
| `effect/delay` | int | 1 | 0.1% | 600 |  |
| `effect/interval` | int | 1 | 0.1% | 100 |  |
| `effect/spectrum` | string | 1 | 0.1% | 1 |  |
| `iconReward/<n>/z` | int | 1 | 0.1% | 0 |  |
| `iconUsedSkill` | property | 1 | 0.1% |  |  |
| `iconUsedSkill/<n>` | canvas | 1 | 0.1% |  |  |
| `iconUsedSkill/<n>/_outlink` | string | 1 | 0.1% |  |  |
| `iconUsedSkill/<n>/delay` | int | 1 | 0.1% | 60 |  |
| `iconUsedSkill/<n>/origin` | vector | 1 | 0.1% |  |  |
| `iconUsedSkill/<n>/z` | int | 1 | 0.1% | 0 |  |
| `info/choice` | int | 1 | 0.1% | 1 |  |
| `info/consumeHP` | int | 1 | 0.1% | 1 |  |
| `info/consumeMP` | int | 1 | 0.1% | 1 |  |
| `info/dropSweep` | int | 1 | 0.1% | 1 |  |
| `info/endUseDate` | string | 1 | 0.1% | 202701130800 |  |
| `info/expireOnNonPremiumLogin` | int | 1 | 0.1% | 1 |  |
| `info/iconRaw/desc` | string | 1 | 0.1% |  |  |
| `info/iconReward/<n>/a0` | int | 1 | 0.1% | 128 … 255 |  |
| `info/iconReward/<n>/a1` | int | 1 | 0.1% | 128 … 255 |  |
| `info/iconReward/<n>/z` | int | 1 | 0.1% | 0 |  |
| `info/incLEV` | int | 1 | 0.1% | 5 |  |
| `info/invisibleCape` | int | 1 | 0.1% | 1 |  |
| `info/invisibleWeapon` | int | 1 | 0.1% | 1 |  |
| `info/jumplevel` | int | 1 | 0.1% | 50 |  |
| `info/life` | int | 1 | 0.1% | 30 |  |
| `info/longRange` | int | 1 | 0.1% | 1 |  |
| `info/maxLevel` | int | 1 | 0.1% | 30 |  |
| `info/mobID` | int | 1 | 0.1% | 910000 |  |
| `info/npc` | int | 1 | 0.1% | 9090000 |  |
| `info/origin` | vector | 1 | 0.1% |  |  |
| `info/pickUpBlock` | int | 1 | 0.1% | 1 |  |
| `info/purchaseShop` | int | 1 | 0.1% | 1 |  |
| `info/removeBody` | int | 1 | 0.1% | 1 |  |
| `info/replace` | property | 1 | 0.1% |  |  |
| `info/replace/itemid` | int | 1 | 0.1% | 3994011 |  |
| `info/replace/msg` | string | 1 | 0.1% |  |  |
| `info/showMessage` | int | 1 | 0.1% | 1 |  |
| `reward/<n>/worldMsg` | string | 1 | 0.1% |  | `/name got /meso mesos from a Meso Sack.` |
| `spec/crd` | int | 1 | 0.1% | 3 |  |
| `spec/exp` | int | 1 | 0.1% | 500 |  |
| `spec/indieJump` | string | 1 | 0.1% | 10 |  |
| `spec/indieSpeed` | string | 1 | 0.1% | 30 |  |
| `spec/pdd` | int | 1 | 0.1% | 10 |  |
| `spec/speed` | int | 1 | 0.1% | 8 |  |
| `spec/thaw` | int | 1 | 0.1% | 10 |  |
<!-- /generated:schema -->
