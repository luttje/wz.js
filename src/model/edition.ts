/**
 * Which game a data folder belongs to: MapleStory Classic World or the current client.
 *
 * Both use the same archive formats and tree layout. The clearest difference in the data is
 * the job tree: Classic World has only first and second job skill books (`Skill/100.img`,
 * `Skill/110.img`, …), while the current client also has third and fourth job books
 * (`Skill/111.img`, `Skill/112.img`, …). Where the folder was found (`MSCW/Data`) is a
 * stronger signal, so callers that know it should prefer it.
 */
import type { WzFileSystem } from "../fs.ts";

export type Edition = "classic" | "current";

export function detectEdition(fs: WzFileSystem): Edition {
  for (const image of fs.imagesUnder("Skill")) {
    const match = /^Skill\/(\d+)\.img$/.exec(image.path);

    if (!match) {
      continue;
    }

    const job = Number(match[1]);

    // Explorer jobs 100–999: a last digit other than 0 is a third or fourth job (111, 112).
    if (job >= 100 && job < 1000 && job % 10 !== 0) {
      return "current";
    }
  }

  return "classic";
}
