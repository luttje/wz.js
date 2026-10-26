# Quests (Quest/QuestData/<id>.img)

<!-- generated:schema -->
Units: **343**. Examples: `Quest/QuestData/1000.img`, `Quest/QuestData/1001.img`, `Quest/QuestData/1002.img`.

123 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `Act` | property | 343 | 100.0% |  |  |
| `Act/<n>` | property | 343 | 100.0% |  |  |
| `Check` | property | 343 | 100.0% |  |  |
| `Check/<n>` | property | 343 | 100.0% |  |  |
| `QuestInfo` | property | 343 | 100.0% |  |  |
| `QuestInfo/<n>` | string | 343 | 100.0% |  | `Go talk to #b#p1##k.`, `Talk to #b#p3##k.`, `Talk to #b#p4##k.`, `#b#p10##k needs someone to help her...`, `Solve #b#p19##k's second question.` |
| `QuestInfo/area` | int | 343 | 100.0% | 1 … 103 |  |
| `QuestInfo/name` | string | 343 | 100.0% |  | `Borrowing Sera's Mirror`, `Bringing a Mirror to Heena`, `Roger's Apple`, `What Sen wants to eat`, `Returning to Nina` |
| `Say` | property | 343 | 100.0% |  |  |
| `Say/<n>` | property | 343 | 100.0% |  |  |
| `Check/<n>/npc` | int | 342 | 99.7% | 1 … 9010000 |  |
| `Check/<n>/lvmin` | int | 337 | 98.3% | 1 … 65 |  |
| `Say/<n>/<n>` | string | 318 | 92.7% |  | `Oh, hello. How can I help you?`, `...What do you want.`, ` ...What do you want, stranger?`, `Who are you? I don't think we've met.`, `I'm sorry I can't be of much help.` |
| `Act/<n>/exp` | int | 310 | 90.4% | 2 … 25900 |  |
| `Say/<n>/stop` | property | 307 | 89.5% |  |  |
| `Act/<n>/money` | int | 288 | 84.0% | -1000 … 10000 |  |
| `Act/<n>/item` | property | 267 | 77.8% |  |  |
| `Act/<n>/item/<n>` | property | 267 | 77.8% |  |  |
| `Act/<n>/item/<n>/count` | int | 267 | 77.8% | -200 … 30 |  |
| `Act/<n>/item/<n>/id` | int | 267 | 77.8% | 1002000 … 4160001 |  |
| `QuestInfo/demandSummary` | string | 260 | 75.8% |  | `#o2# #a10061#`, `#o9# #a10101#`, `#o6# #a100001#\n#o7# #a100002#`, `Reaching Level 10`, `#i4031042# #t4031042# #b#c4031042# / 10` |
| `Say/<n>/yes` | property | 243 | 70.8% |  |  |
| `Say/<n>/yes/<n>` | string | 243 | 70.8% |  | `I got everything. Thank you so much.`, `This is too good to be true!`, `I don't need you now, so please leave!`, `Again, thanks a lot! Later!`, `I will be waiting for you here.` |
| `Check/<n>/quest` | property | 225 | 65.6% |  |  |
| `Check/<n>/quest/<n>` | property | 225 | 65.6% |  |  |
| `Check/<n>/quest/<n>/id` | int | 225 | 65.6% | 1000 … 600009 |  |
| `Check/<n>/quest/<n>/state` | int | 225 | 65.6% | 2 |  |
| `QuestInfo/parent` | string | 216 | 63.0% |  | `Sera's Mirror`, `Nina and Sen's Dinner Menu`, `Please bring this letter to Lucas`, `Mai's Training`, `Rain's Maple Quiz` |
| `Check/<n>/item` | property | 214 | 62.4% |  |  |
| `Check/<n>/item/<n>` | property | 214 | 62.4% |  |  |
| `Check/<n>/item/<n>/id` | int | 214 | 62.4% | 1002084 … 4160001 |  |
| `Check/<n>/item/<n>/count` | int | 213 | 62.1% | 1 … 200 |  |
| `Say/<n>/stop/item` | property | 195 | 56.9% |  |  |
| `Say/<n>/stop/item/<n>` | string | 195 | 56.9% |  |  |
| `Say/<n>/no` | property | 191 | 55.7% |  |  |
| `Say/<n>/no/<n>` | string | 191 | 55.7% |  | `What...? Aren't you gonna deliver it? `, `Come on! Think about the planet!`, `Humans really are a fickle bunch.`, `I knew you'd end up wasting my time.`, `Please return when you are ready.` |
| `Say/<n>/stop/<n>` | property | 138 | 40.2% |  |  |
| `Check/<n>/citizenshipGrade` | int | 125 | 36.4% | 1 … 10 |  |
| `Check/<n>/citizenshipTown` | int | 125 | 36.4% | 1 … 2 |  |
| `Check/<n>/order` | int | 122 | 35.6% | 1 |  |
| `Act/<n>/nextQuest` | int | 118 | 34.4% | 1001 … 506163 |  |
| `Act/<n>/citizenshipContr` | property | 115 | 33.5% |  |  |
| `Act/<n>/citizenshipContr/town` | int | 115 | 33.5% | 1 … 2 |  |
| `Say/<n>/stop/npc` | property | 87 | 25.4% |  |  |
| `Say/<n>/stop/npc/<n>` | string | 87 | 25.4% |  | `Please go and speak with #b#p313##k.` |
| `Act/<n>/citizenshipContr/amount` | int | 79 | 23.0% | 50 … 2100 |  |
| `Say/<n>/stop/level` | property | 73 | 21.3% |  |  |
| `Say/<n>/stop/level/<n>` | string | 73 | 21.3% |  |  |
| `Check/<n>/mob` | property | 64 | 18.7% |  |  |
| `Check/<n>/mob/<n>` | property | 64 | 18.7% |  |  |
| `Check/<n>/mob/<n>/count` | int | 64 | 18.7% | 1 … 200 |  |
| `Check/<n>/mob/<n>/id` | int | 64 | 18.7% | 1 … 800003 |  |
| `Say/<n>/stop/mob` | property | 63 | 18.4% |  |  |
| `Say/<n>/stop/mob/<n>` | string | 63 | 18.4% |  | `Don't forget to defeat the monsters too!` |
| `Check/<n>/item/<n>/order` | int | 49 | 14.3% | 1 |  |
| `Check/<n>/mob/<n>/order` | int | 44 | 12.8% | 1 |  |
| `Say/<n>/lost` | property | 42 | 12.2% |  |  |
| `Say/<n>/lost/<n>` | string | 42 | 12.2% |  |  |
| `Act/<n>/item/<n>/prop` | int | 37 | 10.8% | -1 … 9 |  |
| `Check/<n>/job` | property | 37 | 10.8% |  |  |
| `Check/<n>/job/<n>` | int | 37 | 10.8% | 0 … 436 |  |
| `Act/<n>/citizenshipContr/amountFormula` | string | 36 | 10.5% |  | `100 + ( ( citizenshipGrade - 1 ) x 25 )` |
| `Act/<n>/item/<n>/potentialGrade` | string | 33 | 9.6% |  | `Normal`, `normal` |
| `Say/<n>/lost/yes` | property | 32 | 9.3% |  |  |
| `Check/<n>/start` | string | 28 | 8.2% | 202604140000 … 202612090000 |  |
| `Check/<n>/start_t` | string | 28 | 8.2% | 202604140000 … 202612090000 |  |
| `Act/<n>/pop` | int | 26 | 7.6% | 1 … 5 |  |
| `QuestInfo/order` | int | 23 | 6.7% | 1 … 7 |  |
| `Say/<n>/ask` | int | 22 | 6.4% | 1 |  |
| `Say/<n>/stop/<n>/answer` | int | 22 | 6.4% | 1 … 5 |  |
| `Check/<n>/endscript` | string | 20 | 5.8% |  | `q1002e`, `q10130e`, `q20002e`, `q20003e`, `q20102e` |
| `Act/<n>/skill` | property | 18 | 5.2% |  |  |
| `Act/<n>/skill/<n>` | property | 18 | 5.2% |  |  |
| `Act/<n>/skill/<n>/exp` | int | 18 | 5.2% | 1 … 50 |  |
| `Act/<n>/skill/<n>/id` | int | 18 | 5.2% | 92000000 … 92050000 |  |
| `Check/<n>/end` | string | 18 | 5.2% | 202604232359 … 202611190000 |  |
| `Check/<n>/end_t` | string | 18 | 5.2% | 202604232359 … 202611190000 |  |
| `Check/<n>/startscript` | string | 18 | 5.2% |  | `q1002s`, `q7707s`, `q20002s`, `q20102s`, `q20202s` |
| `Say/<n>/stop/<n>/<n>` | string | 17 | 5.0% |  | `Nope, not 2 points. Think again.`, `No, no, NO! Think carefully!`, `Are you sure? Think again!`, `Whatever. Leave!`, `Get out of my face. Bye!` |
| `Check/<n>/quest/<n>/order` | int | 16 | 4.7% | 1 |  |
| `Check/<n>/skill` | property | 12 | 3.5% |  |  |
| `Check/<n>/skill/<n>` | property | 12 | 3.5% |  |  |
| `Check/<n>/skill/<n>/acquire` | int | 12 | 3.5% | 1 |  |
| `Check/<n>/skill/<n>/id` | int | 12 | 3.5% | 92000000 … 92050000 |  |
| `Check/<n>/skill/<n>/level` | int | 12 | 3.5% | 2 … 5 |  |
| `Check/<n>/skill/<n>/levelCondition` | string | 12 | 3.5% |  | `or higher` |
| `QuestInfo/rewardSummary` | string | 12 | 3.5% |  | `#i1302019# #t1302019# x1`, `#i2430047# #t2430047# x1`, `#i2430048# #t2430048# x1`, `#i2430049# #t2430049# x1`, `#i2430050# #t2430050# x1` |
| `Act/<n>/item/<n>/order` | int | 10 | 2.9% | 1 |  |
| `QuestInfo/selfStart` | int | 8 | 2.3% | 1 |  |
| `QuestInfo/disableAtStartTab` | int | 7 | 2.0% | 1 |  |
| `Check/<n>/weeklyRepeat` | int | 6 | 1.7% | 1 |  |
| `QuestInfo/disableAtNPC` | int | 6 | 1.7% | 1 |  |
| `Act/<n>/item/<n>/gender` | int | 5 | 1.5% | 0 … 2 |  |
| `Act/<n>/item/<n>/job` | int | 5 | 1.5% | 1 … 1074922497 |  |
| `Check/<n>/dayByDay` | int | 5 | 1.5% | 1 |  |
| `Check/<n>/failscript` | string | 5 | 1.5% |  | `q10130f`, `q20002f`, `q20102f`, `q20202f`, `q20302f` |
| `Act/<n>/item/<n>/resignRemove` | int | 3 | 0.9% | 1 |  |
| `QuestInfo/autoStart` | int | 3 | 0.9% | 1 |  |
| `Say/<n>/stop/default` | property | 2 | 0.6% |  |  |
| `Say/<n>/stop/default/<n>` | string | 2 | 0.6% |  |  |
| `Act/<n>/item/<n>/jobEx` | int | 1 | 0.3% | 1 … 2 |  |
| `Check/<n>/infoex` | property | 1 | 0.3% |  |  |
| `Check/<n>/infoex/<n>` | property | 1 | 0.3% |  |  |
| `Check/<n>/infoex/<n>/conditionContent` | string | 1 | 0.3% |  | `Find the child in the dark tunnel`, `Find the child on the open field`, `Find the child up on the high ground` |
| `Check/<n>/infoex/<n>/exVariable` | string | 1 | 0.3% |  | `npc1`, `npc2`, `npc3` |
| `Check/<n>/infoex/<n>/order` | int | 1 | 0.3% | 1 |  |
| `Check/<n>/infoex/<n>/value` | string | 1 | 0.3% | 1 |  |
| `Check/<n>/infoNumber` | int | 1 | 0.3% | 510006 |  |
| `Check/<n>/interval` | int | 1 | 0.3% | 0 |  |
| `Check/<n>/job_GL` | property | 1 | 0.3% |  |  |
| `Check/<n>/normalAutoStart` | int | 1 | 0.3% | 1 |  |
| `Check/<n>/npcSpeech` | property | 1 | 0.3% |  |  |
| `Check/<n>/npcSpeech/<n>` | property | 1 | 0.3% |  |  |
| `Check/<n>/npcSpeech/<n>/id` | int | 1 | 0.3% | 313 |  |
| `Check/<n>/npcSpeech/<n>/order` | int | 1 | 0.3% | 1 |  |
| `Check/<n>/npcSpeech/<n>/script` | string | 1 | 0.3% |  | `q500000_midNPC1` |
| `Check/<n>/pop` | int | 1 | 0.3% | 10 |  |
| `Check/<n>/QuestRecordAndOption` | int | 1 | 0.3% | 1 |  |
| `QuestInfo/autoAccept` | int | 1 | 0.3% | 1 |  |
| `QuestInfo/disableAtCompleteTab` | int | 1 | 0.3% | 1 |  |
| `QuestInfo/disableAtPerformTab` | int | 1 | 0.3% | 1 |  |
| `QuestInfo/resignScript` | string | 1 | 0.3% |  | `q500009x` |
| `QuestInfo/selectedMob` | int | 1 | 0.3% | 1 |  |
<!-- /generated:schema -->
