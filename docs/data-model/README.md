# Data model

One file per tree, describing what each kind of node means. Field statistics (every field
seen, types, frequency, ranges, short samples) are generated into [`generated/`](generated/);
the hand-written files here explain them.

| Kind | Path pattern | Hand-written | Generated |
|---|---|---|---|
| Strings (names, texts) | `String/*.img` | [string.md](string.md) | — |
| Items | `Character/<Slot>/<id>.img`, `Item/<Cat>/<prefix>.img/<id>`, `Item/Pet/<id>.img` | [item.md](item.md) | [equip-info](generated/equip-info.md), [equip](generated/equip.md), [item](generated/item.md), [pet](generated/pet.md) |
| Monsters | `Mob/<id>.img` (pack) | [mob.md](mob.md) | [mob](generated/mob.md) |
| Monster skills | `Skill/MobSkill/<id>.img` (pack) | [mob-skill.md](mob-skill.md) | [mobskill](generated/mobskill.md) |
| NPCs | `Npc/<id>.img` | [npc.md](npc.md) | [npc](generated/npc.md) |
| Maps | `Map/Map/Map<N>/<id>.img` | [map.md](map.md) | [map](generated/map.md), [map-back](generated/map-back.md), [map-obj](generated/map-obj.md), [map-tile](generated/map-tile.md) |
| Quests | `Quest/QuestData/<id>.img` | [quest.md](quest.md) | [quest](generated/quest.md) |
| Skills and jobs | `Skill/<job>.img` (pack) | [skill.md](skill.md) | [skill](generated/skill.md), [job](generated/job.md) |
| Reactors | `Reactor/<id>.img` | [reactor.md](reactor.md) | [reactor](generated/reactor.md) |
| Character parts | `Character/<id>.img`, `Character/Face`, `Character/Hair` | [character.md](character.md) | [body](generated/body.md) |

Conventions used in every file:

- **IDs.** Models use plain integers. Image names are zero-padded (mob/NPC/reactor/skill 7
  digits, map 9, item 8, job 3), while `String` keys for mobs and NPCs and every
  cross-reference (quests, map `life`, portals) use the unpadded number. See
  [quirks.md](../quirks.md).
- **Numbers as strings.** Many numeric fields are stored as strings in some entries and as
  ints in others (`delay`, `mpCon`, `info/link`, `life/<n>/id`). Readers must accept both.
- **UOL.** Any node may be a UOL (a relative link). Readers resolve them transparently.
- Frequency percentages count units (images or entries) that have the field at least once.

## Regenerating `generated/`

`npm run schema` walks every unit of every kind and rewrites these files. After a game
patch:

```sh
npm run schema -- --data "…/MapleStory/MSCW/Data"
```

Only the part between the `generated:schema` markers is replaced.
