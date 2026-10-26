/**
 * What a pet does when spoken to or fed: `Item/Pet/<id>.img` holds its hunger rate
 * (`info/hungry`), its commands (`interact/<n>`: a key `cN`, the closeness it gains `inc`,
 * the chance to obey `prob` and the pet levels `l0`–`l1` that know it) and its reactions to
 * food (`food/<n>`, by level band). Each reaction names a pose (`act`) and the keys of what it
 * says, looked up in `String/PetDialog.img/<id>`. The words that call a command are in
 * `String/PetCommand.img/<id>/cN` (`"bad|no|badgirl|badboy"`); the pets PetCommand.img
 * leaves out have some of theirs as `cN` in PetDialog.img instead, and the rest have none.
 * A pet talks in `UI/ChatBalloon.img/pet/<info/chatBalloon>` (style 0 by default).
 */
import type { WzFileSystem } from "../fs.ts";
import type { WzNode } from "../node.ts";

/** A pose with something to say (one of `lines`, picked at random). */
export interface PetReaction {
  act: string;
  lines: string[];
}

export interface PetCommand {
  /** `cN`, unique per pet. */
  key: string;
  /** Lower-case words that call it; empty when the client names none. */
  words: string[];
  /** Closeness gained when the pet obeys. */
  inc: number;
  /** Chance to obey, in percent. */
  prob: number;
  /** The pet levels that know it, inclusive. */
  minLevel: number;
  maxLevel: number;
  success: PetReaction[];
  fail: PetReaction[];
}

/** How a pet of some levels takes food: `success` while hungry, `fail` when already full. */
export interface PetFoodReaction {
  minLevel: number;
  maxLevel: number;
  success: PetReaction[];
  fail: PetReaction[];
}

export interface Pet {
  id: number;
  /** Fullness lost each hunger tick (`info/hungry`). */
  hunger: number;
  commands: PetCommand[];
  food: PetFoodReaction[];
  /** Its speech balloon style's node. */
  balloon: string;
}

export async function readPet(fs: WzFileSystem, id: number): Promise<Pet | null> {
  const root = await fs.get(`Item/Pet/${id}.img`);

  if (!root) {
    return null;
  }

  const [words, dialog] = await Promise.all([fs.get(`String/PetCommand.img/${id}`), fs.get(`String/PetDialog.img/${id}`)]);
  const reactions = (node: WzNode | undefined): PetReaction[] =>
    (node?.children() ?? []).map((r) => ({
      act: r.string("", "act"),
      lines: r
        .children()
        .filter((c) => c.name !== "act")
        .map((c) => dialog?.string("", c.string("")) ?? "")
        .filter(Boolean),
    }));

  const commands = (root.get("interact")?.children() ?? []).map((c): PetCommand => {
    const key = c.string("", "command");
    const called = words?.string("", key) || dialog?.string("", key) || "";

    return {
      key,
      words: called
        .toLowerCase()
        .split("|")
        .map((w) => w.trim())
        .filter(Boolean),
      inc: c.int(0, "inc"),
      prob: c.int(0, "prob"),
      minLevel: c.int(1, "l0"),
      maxLevel: c.int(30, "l1"),
      success: reactions(c.get("success")),
      fail: reactions(c.get("fail")),
    };
  });

  const food = (root.get("food")?.children() ?? []).map(
    (f): PetFoodReaction => ({
      minLevel: f.int(1, "l0"),
      maxLevel: f.int(30, "l1"),
      success: reactions(f.get("success")),
      fail: reactions(f.get("fail")),
    }),
  );

  const style = `UI/ChatBalloon.img/pet/${root.int(0, "info/chatBalloon")}`;
  const balloon = (await fs.get(style)) ? style : "UI/ChatBalloon.img/pet/0";

  return { id, hunger: root.int(0, "info/hungry"), commands, food, balloon };
}
