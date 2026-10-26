# MapleStory Classic World — client data notes

What the Classic World client files contain, how to read them and how they turn into a
picture, written for someone building a reader or reimplementation. Everything here was
observed in the data or confirmed by rendering it; anything else is marked `UNVERIFIED`. No
game data is stored here, only structure, field names, IDs and small numbers.

Snapshot: Steam install, `MSCW/Data`, PKG1 version 779, 274 files, captured 2026-10-26.
After a game patch, re-run `npm run inventory`, regenerate
[`data-model/generated/`](data-model/README.md#regenerating-generated) and update this line.

| If you want to know… | Read |
|---|---|
| Which files exist and how they are split | [data-layout.md](data-layout.md) |
| How to parse the archives, images, canvases, sounds and `.ms` packs | [wz-format.md](wz-format.md) |
| What each tree holds, field by field | [data-model/](data-model/README.md) |
| How to draw canvases, maps and characters | [rendering.md](rendering.md) |
| Surprises and inconsistencies in the data | [quirks.md](quirks.md) |
| How to use this package | [api.md](api.md) |

These notes describe what the files hold. What the data means for gameplay (damage
formulas, physics constants, drop tables, server scripts) is mostly not in the client and
is out of scope here.
