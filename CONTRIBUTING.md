# Contributing to wz.js

## Project rules

1. **Read-only access to the game files.** Nothing here ever writes to a game folder; the
   Node source opens files read-only.
2. **Never decompile, disassemble, debug or memory-read the game executable or its DLLs.**
   Everything comes from the data archives and observation of the data
   ([docs/wz-format.md](docs/wz-format.md)).
3. **Don't copy code from other MapleStory projects** (HeavenClient/Journey,
   HaRepacker/HaCreator/MapleLib, WzComparerR2, the `wz` npm package, maplestory.io,
   server emulators). Format facts may be learned from them; all code is written here.
4. **Host nothing from the game.** No images, sounds, dumps, extracted JSON or archive
   copies in the repo (`tests/hygiene.test.ts`). Tests build their archives with
   `tests/helpers/wz-writer.ts`. Documentation may describe structure, field names, IDs and
   small numeric examples, but must not embed images, audio or bulk text.
5. **No network access.** The reader only reads the sources it is given.

## Documentation

`docs/` is the knowledge base about the client files. Only state what was observed in the
data or confirmed by rendering; mark anything else `UNVERIFIED`. Keep it about the files:
how a particular game or tool uses the data belongs with that project. When the data
snapshot changes, run `npm run inventory` and `npm run schema` and update the snapshot line
in `docs/README.md`.

## Code

- No DOM or UI dependencies; only `src/sources/node.ts` may import Node modules.
- No game-specific behaviour in the models: an app passes what it adds (map `copies`,
  `trapDamage`) as options, or extends the types with module augmentation.
- Internal imports use `.ts` extensions; the build rewrites them to `.js`.
- Dependencies: none at runtime. Ask before adding one.
- Code is airy: blank lines between logical blocks, no dense one-liners.
