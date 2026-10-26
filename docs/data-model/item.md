# Items

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

Items live in three places. Locate an item by scanning these folders (no guessing from ID
ranges):

| Kind | Path | Category | Count |
|---|---|---|---|
| Equips | `Character/<Slot>/<id 8 digits>.img` for the slot folders Cap, Accessory, Coat, Longcoat, Pants, Shoes, Glove, Shield, Cape, Ring, Weapon, PetEquip, TamingMob | Equip | ~4,080 |
| Bundled | `Item/<Folder>/<4-digit prefix>.img/<id 8 digits>` with folders Consume (Use), Etc, Install (Setup), Cash, Special | Use / Etc / Setup / Cash | 1,349 |
| Pets | `Item/Pet/<id 7 digits>.img` | Pet | 35 |

`Character/Hair` and `Character/Face` hold hair and face styles, not items.
Names are in `String` (see `string.md`). Examples: `2000000` Red Potion
(`Item/Consume/0200.img/02000000`), `1302000` Sword (`Character/Weapon/01302000.img`),
`4000001` Snail Shell.

## Equip `info` ([generated/equip-info.md](generated/equip-info.md), [generated/equip.md](generated/equip.md))

| Field | Meaning |
|---|---|
| `icon`, `iconRaw` | Inventory icon (with and without the item frame shading); sometimes a UOL to `iconRaw`. |
| `islot`, `vslot` | Inventory slot code and visible-slot codes (which body regions it occupies/hides), e.g. `Cp` cap, `CpH1H5`. Used by the avatar renderer (`rendering.md`). |
| `reqLevel`, `reqJob`, `reqSTR`, `reqDEX`, `reqINT`, `reqLUK`, `reqPOP` | Requirements. `reqJob` is a bit set: 1 Warrior, 2 Magician, 4 Bowman, 8 Thief, 16 Pirate; 0 = any (`UNVERIFIED` beyond these bits; values up to 13 seen). |
| `incSTR`, `incDEX`, `incINT`, `incLUK`, `incMHP`, `incMMP` | Stat bonuses. |
| `incWAT` / `incPAD`, `incMAD` | Weapon (physical) attack, magic attack. Weapon attack is almost always `incWAT` (203 items); `incPAD` appears twice. |
| `incPDD`, `incMDD`, `incACC`, `incEVA`, `incSpeed`, `incJump` | Defence and movement bonuses. |
| `incCRT`, `incCRD` | Critical rate / critical damage bonuses (`UNVERIFIED` names). |
| `tuc` | Upgrade slots. |
| `attackSpeed` | Weapon speed tier, 2 to 8 on Classic World weapons: 6 is normal, smaller is faster (NiaMeowDB attack-speed page). |
| `price` | Sell price to NPC shops in mesos. |
| `cash` | 1 = cash item. |
| `stand`, `walk`, `attack`, `afterImage`, `sfx` | Weapon stance numbers, swing afterimage set and sound. See `rendering.md`. |

Weapon types follow `floor(id / 10000)`: 130 one-handed sword, 131 one-handed axe, 132
one-handed blunt weapon, 133 dagger, 137 wand, 138 staff, 140–142 two-handed
sword/axe/blunt weapon, 143 spear, 144 polearm, 145 bow, 146 crossbow, 147 claw. This
comes from the ID scheme and was checked against the names of the first items in each
group (1302000 Sword, 1372000 Wooden Wand, 1472000 Garnier, …). There are no knuckles
(148) or guns (149): Classic World has no pirates.

## Bundled item `info` and `spec` ([generated/item.md](generated/item.md))

| Field | Meaning |
|---|---|
| `info/price`, `info/unitPrice` | Sell price; `unitPrice` (double) for rechargeables. |
| `info/slotMax` | Maximum stack size. |
| `info/success`, `info/cursed`, `info/incXXX` | Scroll success %, destroy % on failure, and the stats it adds (`info/incSTR`, `info/incPDD`, `info/incWAT`, …). |
| `info/reqLevel`, `info/quest`, `info/tradeBlock`, `info/notSale`, `info/timeLimited` | Restrictions and flags. |
Every `spec` key seen, with the number of items using it: `npc` 77, `script` 77, `hp` 34,
`time` 29, `mp` 19, `cosmetic` 15, `moveTo` 11, `morph` 8, `mpR` 4, `pad` 4, `acc` 3, `eva` 3,
`expBuff` 3, `hpR` 3, `incRepleteness` 3, `incTameness` 3, `mad` 3, `crt` 2, `crd` 1,
`exp` 1, `indieJump` 1, `indieSpeed` 1, `pdd` 1, `speed` 1, `thaw` 1.

| Field | Meaning |
|---|---|
| `spec/hp`, `spec/mp` | Restores that much HP/MP (Red Potion: `hp` 100, matching its description). |
| `spec/hpR`, `spec/mpR` | Restores a percentage (`UNVERIFIED`). |
| `spec/time` | Buff duration in ms. |
| `spec/pad`, `mad`, `pdd`, `acc`, `eva`, `speed`, `indieSpeed`, `indieJump`, `crt`, `crd` | Temporary stat buffs. |
| `spec/moveTo` | Return scroll target map; 999999999 = the current map's `info/returnMap` (the scroll is "Return Scroll - Nearest Town"). |
| `spec/npc`, `spec/script` | Item that opens an NPC conversation / script. |
| `spec/cosmetic` | Coupon that applies a hair/face style ID. |
| `spec/morph` | Transformation (ID in the Morph tree). |
| `spec/incRepleteness`, `spec/incTameness` | Pet food: fullness and closeness. Pet Food (`2120000`, `2120001`: 30 and 1) also lists the pets it feeds as `spec/0`, `spec/1`, … (`5000000`–`5000010` and `5000054`); Premium Pet Food (`5249000`: 100 and 100) lists none. |

`info/icon` of scrolls is often a UOL to another scroll's icon
(`../../02040000/info/icon`).

## Pets ([generated/pet.md](generated/pet.md))

`Item/Pet/<id>.img` holds a pet's poses (`stand0`, `move`, `jump`, `hang`, and the poses it
answers with: `rest0`, `stand1`, `cry`, `sit`, …) besides:

| Field | Meaning |
|---|---|
| `info/hungry` | Fullness lost per hunger tick (1–5). |
| `info/life` | Lifespan in days; the Snail (`5000033`) has `dateExpire`, the Maple Snail `limitedLife` 18000 (seconds). |
| `info/chatBalloon`, `info/nameTag` | Its balloon style (`UI/ChatBalloon.img/pet/<n>`, 0 when absent) and name tag style (`UI/NameTag.img/<n>` or `UI/NameTag.img/pet/<n>`, `UNVERIFIED`). |
| `info/pickupItem`, `consumeHP`, `consumeMP` | Pet skills it comes with. |
| `interact/<n>` | A command: `command` (`c1`, `c2`, …), `prob` (chance to obey, %), `inc` (closeness when it obeys), `l0`–`l1` (the pet levels that know it), and `success/0`, `fail/0`: an `act` pose and the `String/PetDialog.img/<id>` keys of what it says. The same word comes in up to four entries, one per level band (1–9, 10–19, 20–29, 30). |
| `food/<n>` | Its reaction to food by level band: `success` when hungry, `fail` when full. |
| `slang/<n>` | A reaction (`act` and a line `s1`…`s4`) per level band, for bad words (not used). |

The words that call `cN` are in `String/PetCommand.img/<id>/cN`, `|`-separated
(`bad|no|badgirl|badboy`), for 14 pets: `5000000`–`5000011`, `5000033` and `5000054`
(Dino Boy and Dino Girl lack `c33`). Later pets have some of theirs as `cN` in
`String/PetDialog.img/<id>` (Porcupine: `c7` `knit` … `c36` `dart`) and the rest nowhere, so
those commands can't be given. Some `act`s name a pose the pet doesn't have (Panda `prone`,
Monkey `merong`); it stands instead. The `clr` of the pet balloon styles (0x800000) isn't the
colour pets talk in (0x5B191B, as NPCs).
