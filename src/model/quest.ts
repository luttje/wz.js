/**
 * Quests: `Quest/QuestData/<id>.img`, one image per quest with `QuestInfo`, `Check`, `Act`
 * and `Say`. Index 0 is the start of the quest, 1 its completion.
 * See docs/data-model/quest.md.
 */
import type { WzFileSystem } from "../fs.ts";
import type { WzNode } from "../node.ts";
import { scalars, type Scalar } from "./item.ts";

export interface QuestRequirements {
  npc: number | null;
  levelMin: number | null;
  levelMax: number | null;
  /** Job IDs allowed (empty = any). */
  jobs: number[];
  /** Quests that must be in `state` (2 = completed). */
  quests: { id: number; state: number }[];
  items: { id: number; count: number }[];
  mobs: { id: number; count: number }[];
  /** `levelCondition` is a text such as "or higher". */
  skills: { id: number; level: number | null; levelCondition?: string; acquire: boolean }[];
  /** NPCs to talk to along the way (`npcSpeech`), each with a script name. */
  npcSpeech: { id: number; script: string }[];
  /** Script-tracked goals (`infoex`): a description and the variable the script sets. */
  infoex: { text: string; variable: string; value: string }[];
  /** Remaining scalar fields (scripts, dates, repeat flags, …), raw. */
  other: Record<string, Scalar>;
}

export interface QuestRewardItem {
  id: number;
  /** Negative counts take items away. */
  count: number;
  /** `prop` > 0: weight in a random pick among the items that have one (UNVERIFIED). */
  prop?: number;
  /** 0 male, 1 female, 2 either (UNVERIFIED). */
  gender?: number;
  /** Job bit set: 1 Beginner, 2 Warrior, 4 Magician, 8 Bowman, 16 Thief; higher bits are other classes. */
  job?: number;
  /** Meaning UNVERIFIED; seen as 1 and 2 next to `job`. */
  jobEx?: number;
  potentialGrade?: string;
}

export interface QuestRewards {
  exp: number | null;
  money: number | null;
  /** Fame (`pop`). */
  fame: number | null;
  items: QuestRewardItem[];
  skills: { id: number; exp: number | null }[];
  nextQuest: number | null;
  /**
   * Citizenship contribution for a town: a fixed `amount` (donations, story quests) or a
   * `formula` over `citizenshipGrade` (the daily greetings); the other is 0 or "".
   */
  citizenship: { town: number; amount: number; formula: string } | null;
  other: Record<string, Scalar>;
}

/**
 * One `Say` node: numbered lines in order, plus named sub-branches (`yes`, `no`, `stop`,
 * `npc`, `item`, `mob`, `lost`, `level`, `default`, or a choice number).
 */
export interface Dialogue {
  /** `key` is the line's child name; in a reply branch it is the choice it answers. */
  lines: { key: number; text: string }[];
  /** `ask = 1`: the first line is a question with `#L` choices. */
  ask: boolean;
  /** `answer` (meaning UNVERIFIED). */
  answer?: number;
  branches: Record<string, Dialogue>;
}

export interface Quest {
  id: number;
  path: string;
  name: string;
  /** Group name shown above related quests (`QuestInfo/parent`). */
  parent?: string;
  area: number;
  order?: number;
  /** Quest log texts: 0 before start, 1 in progress, 2 completed. */
  logText: string[];
  demandSummary?: string;
  rewardSummary?: string;
  info: Record<string, Scalar>;
  start: QuestRequirements;
  complete: QuestRequirements;
  startActions: QuestRewards;
  completeActions: QuestRewards;
  startDialogue: Dialogue | null;
  completeDialogue: Dialogue | null;
}

export async function readQuest(fs: WzFileSystem, id: number): Promise<Quest | null> {
  const path = `Quest/QuestData/${id}.img`;
  const root = await fs.get(path);

  if (!root) {
    return null;
  }

  return questFromNode(root, id);
}

export function questFromNode(root: WzNode, id: number): Quest {
  const info = root.get("QuestInfo");
  const logText: string[] = [];

  for (let i = 0; i < 3; i++) {
    const line = info?.string("", i);

    if (line) {
      logText[i] = line;
    }
  }

  const infoScalars = scalars(info);

  for (const k of ["0", "1", "2", "name", "parent", "area", "order", "demandSummary", "rewardSummary"]) {
    delete infoScalars[k];
  }

  return {
    id,
    path: root.path,
    name: info?.string("", "name") ?? "",
    parent: info?.string("", "parent") || undefined,
    area: info?.int(0, "area") ?? 0,
    order: info?.child("order") ? info.int(0, "order") : undefined,
    logText,
    demandSummary: info?.string("", "demandSummary") || undefined,
    rewardSummary: info?.string("", "rewardSummary") || undefined,
    info: infoScalars,
    start: readCheck(root.get("Check/0")),
    complete: readCheck(root.get("Check/1")),
    startActions: readAct(root.get("Act/0")),
    completeActions: readAct(root.get("Act/1")),
    startDialogue: readSay(root.get("Say/0")),
    completeDialogue: readSay(root.get("Say/1")),
  };
}

function idCounts(node: WzNode | undefined): { id: number; count: number }[] {
  return (node?.children() ?? []).map((n) => ({ id: n.int(0, "id"), count: n.int(1, "count") }));
}

function readCheck(node: WzNode | undefined): QuestRequirements {
  const other = scalars(node);

  for (const k of ["npc", "lvmin", "lvmax"]) {
    delete other[k];
  }

  return {
    npc: node?.child("npc") ? node.int(0, "npc") : null,
    levelMin: node?.child("lvmin") ? node.int(0, "lvmin") : null,
    levelMax: node?.child("lvmax") ? node.int(0, "lvmax") : null,
    jobs: (node?.get("job")?.children() ?? []).map((j) => j.int(0)),
    quests: (node?.get("quest")?.children() ?? []).map((q) => ({ id: q.int(0, "id"), state: q.int(0, "state") })),
    items: idCounts(node?.get("item")),
    mobs: idCounts(node?.get("mob")),
    skills: (node?.get("skill")?.children() ?? []).map((s) => ({
      id: s.int(0, "id"),
      level: s.child("level") ? s.int(0, "level") : null,
      levelCondition: s.string("", "levelCondition") || undefined,
      acquire: s.int(0, "acquire") === 1,
    })),
    npcSpeech: (node?.get("npcSpeech")?.children() ?? []).map((n) => ({ id: n.int(0, "id"), script: n.string("", "script") })),
    infoex: (node?.get("infoex")?.children() ?? []).map((n) => ({
      text: n.string("", "conditionContent"),
      variable: n.string("", "exVariable"),
      value: n.string("", "value"),
    })),
    other,
  };
}

function readAct(node: WzNode | undefined): QuestRewards {
  const other = scalars(node);
  const citizenship = node?.get("citizenshipContr");

  for (const k of ["exp", "money", "pop", "nextQuest"]) {
    delete other[k];
  }

  return {
    exp: node?.child("exp") ? node.int(0, "exp") : null,
    money: node?.child("money") ? node.int(0, "money") : null,
    fame: node?.child("pop") ? node.int(0, "pop") : null,
    items: (node?.get("item")?.children() ?? []).map((n) => ({
      id: n.int(0, "id"),
      count: n.int(1, "count"),
      prop: n.child("prop") ? n.int(0, "prop") : undefined,
      gender: n.child("gender") ? n.int(0, "gender") : undefined,
      job: n.child("job") ? n.int(0, "job") : undefined,
      jobEx: n.child("jobEx") ? n.int(0, "jobEx") : undefined,
      potentialGrade: n.string("", "potentialGrade") || undefined,
    })),
    skills: (node?.get("skill")?.children() ?? []).map((s) => ({
      id: s.int(0, "id"),
      exp: s.child("exp") ? s.int(0, "exp") : null,
    })),
    nextQuest: node?.child("nextQuest") ? node.int(0, "nextQuest") : null,
    citizenship: citizenship ? { town: citizenship.int(0, "town"), amount: citizenship.int(0, "amount"), formula: citizenship.string("", "amountFormula") } : null,
    other,
  };
}

function readSay(node: WzNode | undefined): Dialogue | null {
  if (!node) {
    return null;
  }

  const dialogue: Dialogue = {
    lines: [],
    ask: node.int(0, "ask") === 1,
    answer: node.child("answer") ? node.int(0, "answer") : undefined,
    branches: {},
  };

  for (const child of node.children()) {
    if (/^\d+$/.test(child.name) && child.kind === "string") {
      dialogue.lines.push({ key: Number(child.name), text: child.value as string });
    } else if (child.kind === "property") {
      const branch = readSay(child);

      if (branch) {
        dialogue.branches[child.name] = branch;
      }
    }
  }

  dialogue.lines.sort((a, b) => a.key - b.key);

  return dialogue;
}

/**
 * `Quest/RecurringQuestGroup.img`: pools of quests offered again each day or week, a few at
 * a time (the Community Boards' citizenship quests, the crafting masters' weekly requests).
 * `doNotRepeat` quests are offered only until done once.
 */
export interface RecurringGroup {
  index: number;
  /** Description ("Citizenship Henesys Daily"). */
  info: string;
  /** "daily" or "weekly". */
  type: string;
  /** How many of the pool are offered per cycle. */
  selectCount: number;
  quests: number[];
  doNotRepeat: number[];
}

export async function readRecurringGroups(fs: WzFileSystem): Promise<RecurringGroup[]> {
  const root = await fs.get("Quest/RecurringQuestGroup.img");

  return (root?.children() ?? []).map((g) => ({
    index: Number(g.name),
    info: g.string("", "info"),
    type: g.string("", "type"),
    selectCount: g.int(1, "selectCount"),
    quests: (g.get("list")?.children() ?? []).map((q) => q.int(0)),
    doNotRepeat: (g.get("doNotRepeat")?.children() ?? []).map((q) => q.int(0)),
  }));
}

export interface QuestCategoryGroup {
  title: string;
  sort: number;
  /** Area numbers in this group, in order (empty for the catch-all "Normal" group). */
  areas: number[];
}

export interface QuestCategories {
  /** `QuestInfo/area` → title ("Maple Island", "Warrior", …). */
  areas: Record<number, string>;
  groups: QuestCategoryGroup[];
}

/**
 * `Quest/QuestCategory.img`: numbered entries map an area (`category`) to a `title`;
 * `group/<n>` gathers areas under a heading (`sub` lists area numbers). Areas that are in
 * no group belong to the group with an empty `sub` ("Normal").
 */
export async function readQuestCategories(fs: WzFileSystem): Promise<QuestCategories> {
  const root = await fs.get("Quest/QuestCategory.img");
  const areas: Record<number, string> = {};
  const groups: QuestCategoryGroup[] = [];

  for (const child of root?.children() ?? []) {
    if (/^\d+$/.test(child.name) && child.child("category")) {
      areas[child.int(0, "category")] = child.string("", "title");
    }
  }

  for (const g of root?.get("group")?.children() ?? []) {
    groups.push({
      title: g.string("", "title"),
      sort: g.int(0, "sort"),
      areas: (g.get("sub")?.children() ?? []).map((s) => s.int(0)),
    });
  }

  groups.sort((a, b) => a.sort - b.sort);

  return { areas, groups };
}

export function questIds(fs: WzFileSystem): number[] {
  return [...fs.imagesUnder("Quest/QuestData")].map((i) => Number(i.name.replace(".img", ""))).filter(Number.isSafeInteger);
}
