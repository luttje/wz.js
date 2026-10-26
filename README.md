# ![wz.js](./logo.png)

Reads MapleStory's data files: PKG1 `.wz` archives, the encrypted `.ms` packs, every
property type, canvases and sounds, and turns them into typed game data (items, monsters,
NPCs, maps, quests, skills, characters). It runs in the browser (including workers) and in
Node, reads only the files you give it, and ships no game data.

It was written against MapleStory Classic World (PKG1 version 779) and also mounts the
current client's `Data` folder.

> [!NOTE]
> **wz.js was built with the help of AI-assisted coding.** If that's not your cup of
> tea, no hard feelings: this project probably isn't for you, and that's fine.

## Install

```sh
npm install github:luttje/wz.js
```

Installing from GitHub builds `dist/` on the spot (the `prepare` script). Pin a commit or tag
(`github:luttje/wz.js#<ref>`) to control when an app picks up changes.

## Use

```ts
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { WzFileSystem, type DataFile } from "wz.js/fs";
import { readMob } from "wz.js/model/mob";
import { NodeFileSource } from "wz.js/sources/node";

// The game's Data folder, e.g. …/steamapps/common/MapleStory/MSCW/Data
const dataDir = process.argv[2];
const files: DataFile[] = [];

for (const entry of await readdir(dataDir, { recursive: true })) {
  const path = entry.replaceAll("\\", "/");

  if (/\.(wz|ini|ms)$/i.test(path)) {
    files.push({ path, source: await NodeFileSource.open(join(dataDir, path), path) });
  }
}

const fs = await WzFileSystem.open(files);
const snail = await readMob(fs, 2);

console.log(snail?.name, snail?.animations.map((a) => a.name));
```

Every module is its own entry point (`wz.js/<path>` is `src/<path>.ts`); in the browser, use
`wz.js/sources/file` (`BlobSource`) instead of the Node source. See [docs/api.md](docs/api.md).

## Docs

[docs/](docs/README.md) describes the Classic World data in depth: the file layout, the
binary format, every tree field by field, how the data is drawn, and its quirks.

## Develop

```sh
npm install
npm test
npm run typecheck
npm run build
```

To work on the package and a project that uses it together, link your checkout into that
project (`npm link ../wz-js` from there) and run `npm run build` here after a change. Tests
use small synthetic archives written by `tests/helpers/wz-writer.ts`, so they need no game
data.

## Tools

The tools read your own install, read-only. Point them at its `Data` folder with
`--data <dir>` or the `WZ_DATA` environment variable:

```sh
export WZ_DATA="…/steamapps/common/MapleStory/MSCW/Data"

npm run wz -- tree Npc/0000001.img 2               # browse the tree
npm run wz -- find "Blue Snail"                     # search the String tree (or another folder)
npm run wz -- json Npc/0000001.img out/heena.json   # one image as JSON
npm run wz -- png Npc/0000001.img/stand/0 out/heena.png
npm run wz -- dump Mob/0000002.img/move out/snail   # every canvas under a path as PNGs
npm run inventory
npm run schema
```

- `wz` inspects the data from the command line; canvases are decoded and written as PNG.
- `inventory` lists every file and archive, parses every image with format statistics and
  writes the report to `out/data-inventory.md`. Zero parse failures is the check that the
  reader still understands the data, for instance after a game patch.
- `schema [kind…]` walks every unit of every kind (monsters, maps, quests, …) and writes
  the field statistics in [docs/data-model/generated/](docs/data-model/generated/) (`--out
  <dir>` writes elsewhere).

Keep what they write in `out/` (gitignored): it is extracted game data.

Never commit game data: `tests/hygiene.test.ts` fails on tracked `.wz`, `.ms` or `.img`
files.

## Disclaimer

wz.js is an unofficial fan project. It is not affiliated with, endorsed by or
sponsored by Nexon. MapleStory and all related names and assets are trademarks and
copyright of Nexon.
