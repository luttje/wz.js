# Character tree

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

How a character is put together on screen: [rendering.md](../rendering.md)
("Characters"). Reader: `src/model/avatar.ts`. Statistics: [generated/body.md](generated/body.md).

| Path | Content |
|---|---|
| `Character/0000<2000 + skin>.img` | Body, one per skin (2000–2006). `info/islot`, `vslot` = `Bd`. Actions (60) → frames. |
| `Character/000<12000 + skin>.img` | Head per skin: `front`, `back` and per-action frames that link (UOL) to them. |
| `Character/Face/<id>.img` | Faces (20000–22807; 738 images). `default/face`, expressions with frames and `delay` (`blink`, `hit`, `smile`, `angry`, …). |
| `Character/Hair/<id>.img` | Hairs (30000–32067; 1,448). `default`, `backDefault`, per-action frames (UOLs into `default`). The last digit is the colour: `MakeCharInfo` lists `hair/color/30000` as 30000–30007. |
| `Character/<Slot>/<id>.img` | Equips: Cap, Accessory, Coat, Longcoat, Pants, Shoes, Glove, Shield, Cape, Ring, Weapon, PetEquip, TamingMob. `info` has stats and `islot` / `vslot`. |
| `Character/_Canvas`, `Character/<Slot>/_Canvas` | Pixel data for the `_outlink` placeholders. |
| `Character/Afterimage/*.img` | Weapon swing trails (`info/afterImage` names one): `<level bracket>/<action>/<first body frame>/<frames>`. See [rendering.md](../rendering.md#swing-trails-characterafterimage). |
| `Base/zmap.img` | Layer names, front-most first (155 entries, including two-letter slot codes at the end). |
| `Base/smap.img` | Layer name → slot codes (string). |
| `Etc/MakeCharInfo.img/0` | Character creation choices: `info/skin/<n>/id` (head IDs 12000–12003), and per `male`/`female`: `face`, `hair` (+ `color` sets), `shirt`, `pants`, `shoes`, `weapon` lists. |
| `Etc/BeautyPreview.img` | `MaleHair`, `FemaleHair`, `MaleFace`, `FemaleFace`, `Skin`: lists of hair or face IDs (colour 0), keyed by coupon ID. Hairs under `5150000`, `5150100` (16 male, 19 female) and `5150001`, `5150101` (17, 19); faces under `5152000` and `5152200` (20000–20010, 21000–21010); `Skin` is empty. Nothing in the client reads it, and the launch lists differ (`quirks.md`). |

## Frame nodes

A frame `Character/<…>.img/<action>/<n>` is a property of canvases (or UOLs to canvases). Each
canvas has `origin`, `z` (layer name), optional `group` (`skin`), and `map/<point>` vectors.

Body frames also have `delay` (ms), `face` (1 shows the face, 0 hides it: back views), and
for redirect frames `action`, `frame`, `move`, `rotate` instead of canvases.

## Slots

Two-letter slot codes seen: `Bd` body, `Hd` head, `Fc` face, `Hr` hair (islot), `H1`–`H6`,
`Hf`, `Hs`, `Hb`, `Hc`, `Hx` hair regions, `Cp` cap, `Cc` cap accessory, `Af` face accessory,
`Ay` eye accessory, `As` eye shadow, `Ae` earrings, `Am`, `At`, `Ma` top, `Pn` bottom,
`So` shoes, `Gl` / `Gw` glove / glove wrist, `Gv` glove (islot), `Si` shield, `Wp` weapon,
`Ws`, `Sr` cape, `Wg` wings, `Ri` ring, `Sd` saddle, `Tm` mount. Exact meanings of `Am`, `At`,
`Ws`, `Hc`, `Hx` are `UNVERIFIED`.

`islot` is where an item is equipped (`MaPn` for an overall occupies top and bottom;
`WpSi` for a two-handed weapon blocks the shield); `vslot` is what it covers visually.
