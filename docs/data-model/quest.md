# Quest tree

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

`Quest/QuestData/<id>.img`: one image per quest (343 in Classic World), named by the
unpadded quest ID. Statistics: [generated/quest.md](generated/quest.md). Reader:
`src/model/quest.ts`. Example: `Quest/QuestData/1000.img` (Borrowing Sera's Mirror).

Every quest has the same four children. `Check`, `Act` and `Say` each hold `0` (starting
the quest) and `1` (completing it).

| Node | Meaning |
|---|---|
| `QuestInfo` | Name, group, area, quest log texts. |
| `Check/0`, `Check/1` | Conditions to start / to complete. |
| `Act/0`, `Act/1` | What happens on accepting / on completing (rewards). |
| `Say/0`, `Say/1` | The NPC's dialogue when starting / completing. |

## QuestInfo

| Field | Meaning |
|---|---|
| `name` | Quest name. |
| `parent` | Group name shown above related quests ("Sera's Mirror"); quests of one chain share it. |
| `area` | Category number; titles in `Quest/QuestCategory.img` (below). |
| `0`, `1`, `2` | Quest log text: before starting, in progress, completed. Uses the text markup (see [string.md](string.md)). |
| `demandSummary`, `rewardSummary` | One-line goal and reward texts, with `#c<item>#` counts and `#a<n>#` kill counts. |
| `order` | Sort order (rare). |
| `autoStart`, `autoAccept`, `selfStart`, `disableAtStartTab`, `disableAtPerformTab`, `disableAtCompleteTab`, `disableAtNPC`, `selectedMob`, `resignScript` | Flags, 1 = on. Their effects are named after the field (`UNVERIFIED`). |

## Check (conditions)

| Field | Meaning |
|---|---|
| `npc` | The NPC to talk to (start) or report to (complete). |
| `lvmin`, `lvmax` | Level range. |
| `job/<n>` | Allowed job IDs. Quests open to everyone list every job ID of every class (`1001.img` lists 70). |
| `quest/<n>` | `id`, `state`: another quest must be in this state (0 not started, 1 in progress, 2 completed). Every Classic World use is `state 2`. |
| `item/<n>` | `id`, `count`: items to have (start) or bring (complete). |
| `mob/<n>` | `id`, `count`: monsters to defeat. |
| `skill/<n>` | `id`, `level`, `levelCondition` ("or higher"), `acquire` (1 = must have it). |
| `npcSpeech/<n>` | `id`, `order`, `script`: an extra NPC to talk to, handled by a script. |
| `infoex/<n>` | `conditionContent` (text), `exVariable`, `value`, `order`: a goal tracked by a script variable. |
| `startscript`, `endscript`, `failscript` | Script names (contents are server-side). |
| `start`, `end` | Availability window, `YYYYMMDDhhmm`. `start_t` / `end_t` hold the same values in every Classic World quest. |
| `dayByDay`, `weeklyRepeat` | 1 = repeatable daily / weekly. |
| `interval` | Repeat interval (unit `UNVERIFIED`). |
| `normalAutoStart`, `pop`, `infoNumber`, `order` | Rare; `pop` is fame. |
| `citizenshipTown`, `citizenshipGrade` | The Citizenship quests (123 of them): town number and required grade. |
| `job_GL` | Always empty in Classic World. |

## Act (actions and rewards)

| Field | Meaning |
|---|---|
| `exp` | EXP. |
| `money` | Mesos; negative values cost mesos. |
| `pop` | Fame. |
| `item/<n>` | `id`, `count`. A positive count gives the item, a negative one takes it. More fields below. |
| `skill/<n>` | `id`, `exp`. |
| `nextQuest` | The quest that follows (also linked back through the next quest's `Check/0/quest`). |
| `citizenshipContr` | `town`, and either `amount` (a fixed number: donations pay 700 … 2,100, story quests 50 … 100) or `amountFormula` (text such as `100 + ( ( citizenshipGrade - 1 ) x 25 )`, the daily greetings). |

Reward item fields:

- **`job`** is a bit set: 1 Beginner, 2 Warrior, 4 Magician, 8 Bowman, 16 Thief.
  Confirmed by comparing each rewarded item's own `info/reqJob`: in `10007.img` the Work
  Gloves (any job) carry bit 0, Dark Clench (Warrior) bit 1, Dark Manute (Magician) bit 2,
  and so on. Higher bits (10–14, 17, 20–22, 30) are set alongside and belong to other class
  lines that aren't in Classic World.
- **`prop`**: items with `prop > 0` are one random pick weighted by `prop`
  (`UNVERIFIED`; e.g. `10105.img`: 30 potions with weight 7, a club with weight 3).
  Taken items carry `prop 0`.
- **`gender`**: 0 male, 1 female, 2 either (`UNVERIFIED`; `10007.img` uses 2 on every item).
- **`jobEx`** (1, 2), **`potentialGrade`** ("Normal"), **`order`**: meaning `UNVERIFIED`.

## Say (dialogue)

A `Say/<0|1>` node holds numbered string lines shown in order, and named branches that hold
more lines (and branches):

| Branch | When it is shown |
|---|---|
| `yes`, `no` | After the player accepts / declines the last line's question. |
| `stop` | When the quest can't go on yet. Its children name the reason: `npc`, `item`, `mob`, `level`, `default`. |
| `lost` | When the player lost the quest item. |
| `<n>` under `stop` | In quizzes: replies keyed by the chosen option (see below). |

`ask = 1` marks a node whose first line is a question with `#L` choices
(`1013.img/Say/1`). Its `stop/0` branch then holds one line per choice, keyed by the
choice number, and an `answer` int: in `1013.img` the replies are keyed 0, 1 and 3 for a
4-choice question whose right answer is 2, and `answer` is 3. The choice without a reply is
presumably the right one; what `answer` holds is `UNVERIFIED`. Line keys matter here, so
readers must keep them rather than renumber lines.

Branch meanings come from the texts, not from client code: each `npc` reply says the player
hasn't met the NPC yet, each `item` reply mentions missing items, and so on.

Job advancement quests (`20000`–`20303`, areas 100–103) have empty `Say` nodes: they run
on server scripts (`startscript q20002s` etc.), so the client data shows the conditions
and the quest log but not the dialogue or the job change itself.

## Quest categories

`Quest/QuestCategory.img`:

- Numbered entries `<n>/title` and `<n>/category` map an area number to its title:
  1 Maple Island, 10 Victoria Island, 11 Lith Harbor, 12 Henesys, 13 Ellinia,
  14 Kerning City, 15 Perion, 16 Sleepywood, 17 Forgotten Hollow, 18 Florina Beach,
  19 Crafting, 20 Citizenship, 21 Orbis, 22 El Nath, 99 Event, 100 Warrior,
  101 Magician, 102 Bowman, 103 Thief.
- `group/<n>`: `title`, `sort`, `sub/<n>` (area numbers), plus icon and colour paths.
  Groups: Event (99), Job (100–103), Content (19, 20), Normal (empty `sub`: every other
  area).
- `img`, `lowPrestartIcon`: quest window art and a list of small numbers (meaning
  `UNVERIFIED`). `img/main` and `img/normal` are 263 px area bars from a later, wider
  quest window; the classic list draws its own bar with `UI/Basic.img/BtMinus` / `BtPlus`.

## Quest window art

The data holds two quest windows. `UI/Quest.img/Quest` matches the classic client's; `UI/UIWindow.img/Quest` is an older set with
the same parts: backgrounds, buttons and icons, without placement.

- `list/backgrnd` (247 × 398): the list window, its title strip (y 6–19), tab band
  (25–42), red rule (43–45), white list area (46–364) and bottom band (369–393).
  `list/Tab/enabled|disabled/0–2` (Available, In Progress, Completed; `enabled` is the
  selected tab; a fourth, Korean "Recommended", is left out), `list/notice0–2` (the empty
  tab's message), `list/BtDetail`, all placed by their origins.
- `quest_info/backgrnd` (306 × 398): the quest panel beside the list. Blue header at
  x 15–298, y 26–104, split at x 190 (name, level, class on the left, the NPC on the right),
  text area y 105–364. `BtClose` folds the panel; `BtArlim` (Quest Helper) and `BtGiveup`
  (Forfeit) sit in the bottom band. Placed by origin.
- `UI/UIWindow.img/Quest/icon0`–`icon9`: list state icons, some animated. Used here:
  `icon0` (can start), `icon2` (in progress), `icon3` (ready to report), `icon4` (done);
  which state each stands for is `UNVERIFIED`, read off the classic client's look.
  `icon5` is a "new" tag, `icon7` an hourglass (time limit).
- `UI/Quest.img/QuestAlarm`: the quest helper in the top right.
  `backgrndmax` (223 × 25: the 20 px title bar and the top of the body), `backgrndcenter`
  (one 18 px line, repeated), `backgrndbottom` (5 px), `backgrndmin` (the bar alone,
  folded); `BtAuto` (placed by origin in the bar) and `BtDelete` (beside each quest). The
  body is white at about a third opacity. There is no title art: the client writes it as
  text. The fold button is `UI/Basic.img/BtMin` / `BtMax`.

`RecurringQuestGroup.img` pools quests offered again each day or week: per group `info`
(a description such as "Citizenship Henesys Daily"), `type` (`daily`, `weekly`),
`selectCount` (how many are offered per cycle, always 1), `list` (the quests) and
`doNotRepeat` (those done only once). Five groups: the crafting masters' weekly requests, and a
daily and a weekly pool for each citizenship town (`readRecurringGroups` in
`src/model/quest.ts`).

Other images in `Quest/`: `Exclusive.img` (sets of mutually exclusive quests),
`QuestDestination.img` (quest → map, live-client IDs 57104…), `QuestExpByLevel.img`,
`ChangeableQExpTable.img`, `PQuest.img`, `QuestPerformByDay.img`. No reader here uses
them yet.
