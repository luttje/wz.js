# NPCs (Npc/<id>.img)

<!-- generated:schema -->
Units: **233**. Examples: `Npc/0000001.img`, `Npc/0000002.img`, `Npc/0000003.img`.

329 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `info` | property | 233 | 100.0% |  |  |
| `stand` | property | 214 | 91.8% |  |  |
| `stand/<n>` | canvas, uol | 214 | 91.8% | 0 … 13 |  |
| `stand/<n>/origin` | vector | 214 | 91.8% |  |  |
| `stand/<n>/_outlink` | string | 163 | 70.0% |  | `Npc/_Canvas/0000001.img/stand/0`, `Npc/_Canvas/0000001.img/stand/1`, `Npc/_Canvas/0000001.img/stand/2`, `Npc/_Canvas/0000003.img/stand/0`, `Npc/_Canvas/0000004.img/stand/0` |
| `info/speak` | property | 149 | 63.9% |  |  |
| `info/speak/<n>` | string | 149 | 63.9% |  | `n0`, `n1`, `n2`, `n3`, `s0` |
| `stand/<n>/z` | int | 121 | 51.9% | 0 … 1 |  |
| `info/script` | property | 109 | 46.8% |  |  |
| `info/script/<n>` | property | 109 | 46.8% |  |  |
| `info/script/<n>/script` | string | 109 | 46.8% |  | `quest_1005`, `npc_8`, `npc_14`, `npc_15`, `npc_18` |
| `stand/<n>/delay` | string, int | 72 | 30.9% | 50 … 5000 |  |
| `info/dcLeft` | int | 38 | 16.3% | -75 … 0 |  |
| `info/dcRight` | int | 38 | 16.3% | 0 … 85 |  |
| `info/dcTop` | int | 38 | 16.3% | -210 … 0 |  |
| `info/dcBottom` | int | 37 | 15.9% | -60 … 0 |  |
| `say` | property | 31 | 13.3% |  |  |
| `say/<n>` | canvas, uol | 31 | 13.3% | 0 … 6 |  |
| `say/<n>/origin` | vector | 31 | 13.3% |  |  |
| `eye` | property | 30 | 12.9% |  |  |
| `eye/<n>` | canvas, uol | 30 | 12.9% | 0 … 6 |  |
| `eye/<n>/origin` | vector | 30 | 12.9% |  |  |
| `say/speak` | property | 29 | 12.4% |  |  |
| `say/speak/<n>` | string | 29 | 12.4% |  | `s0`, `s1`, `s2`, `s3`, `s4` |
| `eye/<n>/_outlink` | string | 27 | 11.6% |  | `Npc/_Canvas/0000203.img/eye/0`, `Npc/_Canvas/0000203.img/eye/1`, `Npc/_Canvas/0000203.img/eye/2`, `Npc/_Canvas/0000229.img/stand/0`, `Npc/_Canvas/0000229.img/eye/1` |
| `say/<n>/delay` | int | 26 | 11.2% | 100 … 1500 |  |
| `say/<n>/_outlink` | string | 24 | 10.3% |  | `Npc/_Canvas/0000113.img/stand/0`, `Npc/_Canvas/0000113.img/say/1`, `Npc/_Canvas/0000114.img/stand/0`, `Npc/_Canvas/0000114.img/say/1`, `Npc/_Canvas/0000114.img/say/2` |
| `info/speak/condition1` | property | 20 | 8.6% |  |  |
| `info/speak/condition1/<n>` | string | 20 | 8.6% |  | `c10`, `c11`, `n0`, `n1`, `n2` |
| `info/speak/condition1/citizenshipGrade` | int | 20 | 8.6% | 1 |  |
| `info/speak/condition1/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition10` | property | 20 | 8.6% |  |  |
| `info/speak/condition10/<n>` | string | 20 | 8.6% |  | `c30`, `c31`, `n0`, `n1`, `n2` |
| `info/speak/condition10/citizenshipGrade` | int | 20 | 8.6% | 10 |  |
| `info/speak/condition10/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition2` | property | 20 | 8.6% |  |  |
| `info/speak/condition2/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition2/citizenshipGrade` | int | 20 | 8.6% | 2 |  |
| `info/speak/condition2/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition3` | property | 20 | 8.6% |  |  |
| `info/speak/condition3/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition3/citizenshipGrade` | int | 20 | 8.6% | 3 |  |
| `info/speak/condition3/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition4` | property | 20 | 8.6% |  |  |
| `info/speak/condition4/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition4/citizenshipGrade` | int | 20 | 8.6% | 4 |  |
| `info/speak/condition4/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition5` | property | 20 | 8.6% |  |  |
| `info/speak/condition5/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition5/citizenshipGrade` | int | 20 | 8.6% | 5 |  |
| `info/speak/condition5/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition6` | property | 20 | 8.6% |  |  |
| `info/speak/condition6/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition6/citizenshipGrade` | int | 20 | 8.6% | 6 |  |
| `info/speak/condition6/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition7` | property | 20 | 8.6% |  |  |
| `info/speak/condition7/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition7/citizenshipGrade` | int | 20 | 8.6% | 7 |  |
| `info/speak/condition7/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition8` | property | 20 | 8.6% |  |  |
| `info/speak/condition8/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition8/citizenshipGrade` | int | 20 | 8.6% | 8 |  |
| `info/speak/condition8/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/speak/condition9` | property | 20 | 8.6% |  |  |
| `info/speak/condition9/<n>` | string | 20 | 8.6% |  | `c20`, `c21`, `n0`, `n1`, `n2` |
| `info/speak/condition9/citizenshipGrade` | int | 20 | 8.6% | 9 |  |
| `info/speak/condition9/citizenshipTown` | int | 20 | 8.6% | 1 … 2 |  |
| `info/link` | string | 19 | 8.2% | 3 … 9010000 |  |
| `eye/<n>/z` | int | 17 | 7.3% | 0 |  |
| `eye/<n>/delay` | int | 14 | 6.0% | 90 … 2000 |  |
| `info/trunkPut` | int | 13 | 5.6% | 0 … 100 |  |
| `talk` | property | 12 | 5.2% |  |  |
| `talk/<n>` | canvas, uol | 12 | 5.2% | 0 … 3 |  |
| `talk/<n>/_outlink` | string | 12 | 5.2% |  | `Npc/_Canvas/0000229.img/stand/0`, `Npc/_Canvas/0000229.img/talk/1`, `Npc/_Canvas/0000230.img/stand/0`, `Npc/_Canvas/0000230.img/talk/1`, `Npc/_Canvas/0000231.img/stand/0` |
| `talk/<n>/origin` | vector | 12 | 5.2% |  |  |
| `talk/<n>/z` | int | 12 | 5.2% | 0 |  |
| `talk/speak` | property | 12 | 5.2% |  |  |
| `talk/speak/<n>` | string | 12 | 5.2% |  | `s0`, `s1`, `s2`, `s3` |
| `info/dcMark` | int | 11 | 4.7% | 1 |  |
| `move` | property | 11 | 4.7% |  |  |
| `move/<n>` | canvas, uol | 11 | 4.7% | 0 |  |
| `move/<n>/origin` | vector | 11 | 4.7% |  |  |
| `blink` | property | 9 | 3.9% |  |  |
| `blink/<n>` | canvas, uol | 9 | 3.9% | 0 … 3 |  |
| `blink/<n>/delay` | string, int | 9 | 3.9% | 60 … 1200 |  |
| `blink/<n>/origin` | vector | 9 | 3.9% |  |  |
| `blink/<n>/z` | int | 9 | 3.9% | 0 |  |
| `move/<n>/z` | int | 9 | 3.9% | 0 |  |
| `smile` | property | 9 | 3.9% |  |  |
| `smile/<n>` | canvas, uol | 9 | 3.9% | 0 … 4 | `../stand/1`, `../stand/2`, `../stand/0` |
| `smile/<n>/delay` | string, int | 9 | 3.9% | 100 … 5000 |  |
| `smile/<n>/origin` | vector | 9 | 3.9% |  |  |
| `finger` | property | 7 | 3.0% |  |  |
| `finger/<n>` | canvas | 7 | 3.0% |  |  |
| `finger/<n>/delay` | int | 7 | 3.0% | 5000 |  |
| `finger/<n>/origin` | vector | 7 | 3.0% |  |  |
| `finger/<n>/z` | int | 7 | 3.0% | 0 |  |
| `say/<n>/z` | int | 7 | 3.0% | 0 |  |
| `smile/<n>/z` | int | 7 | 3.0% | 0 |  |
| `wink` | property | 7 | 3.0% |  |  |
| `wink/<n>` | canvas | 7 | 3.0% |  |  |
| `wink/<n>/delay` | int | 7 | 3.0% | 200 … 4800 |  |
| `wink/<n>/origin` | vector | 7 | 3.0% |  |  |
| `wink/<n>/z` | int | 7 | 3.0% | 0 |  |
| `blink/<n>/_outlink` | string | 6 | 2.6% |  | `Npc/_Canvas/0000004.img/blink/0`, `Npc/_Canvas/0000004.img/blink/1`, `Npc/_Canvas/0000004.img/stand/0`, `Npc/_Canvas/0000113.img/stand/0`, `Npc/_Canvas/0000113.img/blink/1` |
| `finger/<n>/_outlink` | string | 6 | 2.6% |  | `Npc/_Canvas/0000003.img/finger/0`, `Npc/_Canvas/0000006.img/finger/0` |
| `hair` | property | 6 | 2.6% |  |  |
| `hair/<n>` | canvas, uol | 6 | 2.6% | 0 … 2 |  |
| `hair/<n>/delay` | string, int | 6 | 2.6% | 150 … 4400 |  |
| `hair/<n>/origin` | vector | 6 | 2.6% |  |  |
| `hair/<n>/z` | int | 6 | 2.6% | 0 |  |
| `info/citizenshipTown` | int | 6 | 2.6% | 1 … 2 |  |
| `info/quest` | string | 6 | 2.6% |  | `begin7`, `bookPrize`, `go_pc`, `refine_kerning2`, `mike` |
| `move/<n>/_outlink` | string | 6 | 2.6% |  | `Npc/_Canvas/0000018.img/move/0`, `Npc/_Canvas/0000018.img/move/1`, `Npc/_Canvas/0000018.img/move/2`, `Npc/_Canvas/0000018.img/move/3`, `Npc/_Canvas/0000201.img/move/0` |
| `move/<n>/delay` | int | 6 | 2.6% | 100 … 200 |  |
| `say0` | property | 6 | 2.6% |  |  |
| `say0/<n>` | canvas, uol | 6 | 2.6% | 0 … 2 |  |
| `say0/<n>/_outlink` | string | 6 | 2.6% |  | `Npc/_Canvas/0000208.img/stand/0`, `Npc/_Canvas/0000208.img/say0/1`, `Npc/_Canvas/0800000.img/stand/0`, `Npc/_Canvas/0800000.img/say0/1`, `Npc/_Canvas/0800001.img/stand/0` |
| `say0/<n>/delay` | int | 6 | 2.6% | 250 … 1200 |  |
| `say0/<n>/origin` | vector | 6 | 2.6% |  |  |
| `say0/speak` | property | 6 | 2.6% |  |  |
| `say0/speak/<n>` | string | 6 | 2.6% |  | `n0`, `n1`, `s0` |
| `wink/<n>/_outlink` | string | 6 | 2.6% |  | `Npc/_Canvas/0000003.img/wink/0`, `Npc/_Canvas/0000003.img/stand/0`, `Npc/_Canvas/0000006.img/wink/0`, `Npc/_Canvas/0000006.img/stand/0` |
| `alert` | property | 4 | 1.7% |  |  |
| `alert/<n>` | canvas | 4 | 1.7% |  |  |
| `alert/<n>/delay` | string | 4 | 1.7% | 300 … 4700 |  |
| `alert/<n>/origin` | vector | 4 | 1.7% |  |  |
| `alert/<n>/z` | int | 4 | 1.7% | 0 |  |
| `angry` | property | 4 | 1.7% |  |  |
| `angry/<n>` | canvas | 4 | 1.7% |  |  |
| `angry/<n>/delay` | string | 4 | 1.7% | 5000 |  |
| `angry/<n>/origin` | vector | 4 | 1.7% |  |  |
| `angry/<n>/z` | int | 4 | 1.7% | 0 |  |
| `arm` | property | 4 | 1.7% |  |  |
| `arm/<n>` | canvas | 4 | 1.7% |  |  |
| `arm/<n>/delay` | int | 4 | 1.7% | 5000 |  |
| `arm/<n>/origin` | vector | 4 | 1.7% |  |  |
| `arm/<n>/z` | int | 4 | 1.7% | 0 |  |
| `heart` | property | 4 | 1.7% |  |  |
| `heart/<n>` | canvas, uol | 4 | 1.7% | 0 |  |
| `heart/<n>/delay` | int | 4 | 1.7% | 150 … 3750 |  |
| `heart/<n>/origin` | vector | 4 | 1.7% |  |  |
| `heart/<n>/z` | int | 4 | 1.7% | 0 |  |
| `image` | property | 4 | 1.7% |  |  |
| `image/<n>` | canvas | 4 | 1.7% |  |  |
| `image/<n>/delay` | string | 4 | 1.7% | 5000 |  |
| `image/<n>/origin` | vector | 4 | 1.7% |  |  |
| `image/<n>/z` | int | 4 | 1.7% | 0 |  |
| `say1` | property | 4 | 1.7% |  |  |
| `say1/<n>` | canvas, uol | 4 | 1.7% | 0 … 1 |  |
| `say1/<n>/_outlink` | string | 4 | 1.7% |  | `Npc/_Canvas/0800000.img/stand/0`, `Npc/_Canvas/0800000.img/say0/1`, `Npc/_Canvas/0800001.img/stand/0`, `Npc/_Canvas/0800001.img/say0/1`, `Npc/_Canvas/0800002.img/stand/0` |
| `say1/<n>/delay` | int | 4 | 1.7% | 250 |  |
| `say1/<n>/origin` | vector | 4 | 1.7% |  |  |
| `say1/speak` | property | 4 | 1.7% |  |  |
| `say1/speak/<n>` | string | 4 | 1.7% |  | `n0`, `n1` |
| `smile/<n>/_outlink` | string | 4 | 1.7% |  | `Npc/_Canvas/0000201.img/smile/0`, `Npc/_Canvas/0000201.img/smile/1`, `Npc/_Canvas/0000208.img/stand/0`, `Npc/_Canvas/0000208.img/stand/1`, `Npc/_Canvas/0000208.img/smile/3` |
| `smile/speak` | property | 4 | 1.7% |  |  |
| `smile/speak/<n>` | string | 4 | 1.7% |  | `s0`, `n0`, `s1`, `s2` |
| `alert/speak` | property | 3 | 1.3% |  |  |
| `alert/speak/<n>` | string | 3 | 1.3% |  | `l0` |
| `angry/speak` | property | 3 | 1.3% |  |  |
| `angry/speak/<n>` | string | 3 | 1.3% |  | `a0` |
| `finger/speak` | property | 3 | 1.3% |  |  |
| `finger/speak/<n>` | string | 3 | 1.3% |  | `f0`, `f1`, `f2` |
| `hair/<n>/_outlink` | string | 3 | 1.3% |  | `Npc/_Canvas/0000018.img/hair/0`, `Npc/_Canvas/0000018.img/hair/1`, `Npc/_Canvas/0000018.img/hair/2`, `Npc/_Canvas/0000201.img/hair/0`, `Npc/_Canvas/0000201.img/hair/1` |
| `hair/speak` | property | 3 | 1.3% |  |  |
| `hair/speak/<n>` | string | 3 | 1.3% |  | `h0` |
| `heart/<n>/_outlink` | string | 3 | 1.3% |  | `Npc/_Canvas/0000006.img/heart/0`, `Npc/_Canvas/0000006.img/heart/1`, `Npc/_Canvas/0000006.img/heart/2`, `Npc/_Canvas/0000006.img/heart/3`, `Npc/_Canvas/0000006.img/heart/4` |
| `magic` | property | 3 | 1.3% |  |  |
| `magic/<n>` | canvas | 3 | 1.3% |  |  |
| `magic/<n>/delay` | int | 3 | 1.3% | 100 … 550 |  |
| `magic/<n>/origin` | vector | 3 | 1.3% |  |  |
| `shy` | property | 3 | 1.3% |  |  |
| `shy/<n>` | canvas, uol | 3 | 1.3% | 0 … 2 |  |
| `shy/<n>/_outlink` | string | 3 | 1.3% |  | `Npc/_Canvas/0000004.img/shy/0`, `Npc/_Canvas/0000004.img/shy/1`, `Npc/_Canvas/0000004.img/shy/2`, `Npc/_Canvas/0000004.img/stand/0` |
| `shy/<n>/delay` | string | 3 | 1.3% | 100 … 1200 |  |
| `shy/<n>/origin` | vector | 3 | 1.3% |  |  |
| `shy/<n>/z` | int | 3 | 1.3% | 0 |  |
| `shy/speak` | property | 3 | 1.3% |  |  |
| `shy/speak/<n>` | string | 3 | 1.3% |  | `s0` |
| `up` | property | 3 | 1.3% |  |  |
| `up/<n>` | canvas, uol | 3 | 1.3% | 0 … 1 |  |
| `up/<n>/_outlink` | string | 3 | 1.3% |  | `Npc/_Canvas/0000004.img/up/0`, `Npc/_Canvas/0000004.img/stand/0` |
| `up/<n>/delay` | string | 3 | 1.3% | 300 … 1000 |  |
| `up/<n>/origin` | vector | 3 | 1.3% |  |  |
| `up/<n>/z` | int | 3 | 1.3% | 0 |  |
| `wink/speak` | property | 3 | 1.3% |  |  |
| `wink/speak/<n>` | string | 3 | 1.3% |  | `w0`, `w1`, `w2` |
| `alert/<n>/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000201.img/alert/0`, `Npc/_Canvas/0000201.img/alert/1` |
| `angry/<n>/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000201.img/angry/0` |
| `bewildered` | property | 2 | 0.9% |  |  |
| `bewildered/<n>` | canvas | 2 | 0.9% |  |  |
| `bewildered/<n>/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000001.img/bewildered/0`, `Npc/_Canvas/0000001.img/bewildered/1`, `Npc/_Canvas/0000001.img/bewildered/2`, `Npc/_Canvas/0000001.img/bewildered/3`, `Npc/_Canvas/0000001.img/bewildered/4` |
| `bewildered/<n>/delay` | int | 2 | 0.9% | 150 … 4400 |  |
| `bewildered/<n>/origin` | vector | 2 | 0.9% |  |  |
| `bewildered/<n>/z` | int | 2 | 0.9% | 0 |  |
| `bewildered/speak` | property | 2 | 0.9% |  |  |
| `bewildered/speak/<n>` | string | 2 | 0.9% |  | `b0` |
| `cough` | property | 2 | 0.9% |  |  |
| `cough/<n>` | canvas, uol | 2 | 0.9% | 1 … 2 |  |
| `cough/<n>/delay` | int | 2 | 0.9% | 150 … 500 |  |
| `cough/<n>/origin` | vector | 2 | 0.9% |  |  |
| `cough/<n>/z` | int | 2 | 0.9% | 0 |  |
| `cry` | property | 2 | 0.9% |  |  |
| `cry/<n>` | canvas, uol | 2 | 0.9% | 0 … 4 |  |
| `cry/<n>/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000001.img/cry/0`, `Npc/_Canvas/0000001.img/cry/1`, `Npc/_Canvas/0000001.img/cry/2`, `Npc/_Canvas/0000001.img/cry/3`, `Npc/_Canvas/0000001.img/cry/4` |
| `cry/<n>/delay` | string | 2 | 0.9% | 100 |  |
| `cry/<n>/origin` | vector | 2 | 0.9% |  |  |
| `cry/<n>/z` | int | 2 | 0.9% | 0 |  |
| `cry/speak` | property | 2 | 0.9% |  |  |
| `cry/speak/<n>` | string | 2 | 0.9% |  | `c0` |
| `hand` | property | 2 | 0.9% |  |  |
| `hand/<n>` | canvas, uol | 2 | 0.9% | 0 … 3 |  |
| `hand/<n>/delay` | string, int | 2 | 0.9% | 90 … 5000 |  |
| `hand/<n>/origin` | vector | 2 | 0.9% |  |  |
| `heart/speak` | property | 2 | 0.9% |  |  |
| `heart/speak/<n>` | string | 2 | 0.9% |  | `h0`, `h1` |
| `image/<n>/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000201.img/image/0` |
| `image/speak` | property | 2 | 0.9% |  |  |
| `image/speak/<n>` | string | 2 | 0.9% |  | `i0` |
| `info/default` | canvas | 2 | 0.9% |  |  |
| `info/default/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000235.img/info/default`, `Npc/_Canvas/0000431.img/info/default` |
| `info/default/origin` | vector | 2 | 0.9% |  |  |
| `info/default/z` | int | 2 | 0.9% | 0 |  |
| `info/housingPostBox` | int | 2 | 0.9% | 1 |  |
| `side` | property | 2 | 0.9% |  |  |
| `side/<n>` | canvas | 2 | 0.9% |  |  |
| `side/<n>/delay` | int | 2 | 0.9% | 5000 |  |
| `side/<n>/origin` | vector | 2 | 0.9% |  |  |
| `side/<n>/z` | int | 2 | 0.9% | 0 |  |
| `smile0` | property | 2 | 0.9% |  |  |
| `smile0/<n>` | canvas | 2 | 0.9% |  |  |
| `smile0/<n>/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000001.img/stand/1` |
| `smile0/<n>/delay` | string | 2 | 0.9% | 5000 |  |
| `smile0/<n>/origin` | vector | 2 | 0.9% |  |  |
| `smile0/<n>/z` | int | 2 | 0.9% | 0 |  |
| `smile0/speak` | property | 2 | 0.9% |  |  |
| `smile0/speak/<n>` | string | 2 | 0.9% |  | `s0` |
| `smile1` | property | 2 | 0.9% |  |  |
| `smile1/<n>` | canvas | 2 | 0.9% |  |  |
| `smile1/<n>/_outlink` | string | 2 | 0.9% |  | `Npc/_Canvas/0000001.img/smile1/0` |
| `smile1/<n>/delay` | string | 2 | 0.9% | 5000 |  |
| `smile1/<n>/origin` | vector | 2 | 0.9% |  |  |
| `smile1/<n>/z` | int | 2 | 0.9% | 0 |  |
| `smile1/speak` | property | 2 | 0.9% |  |  |
| `smile1/speak/<n>` | string | 2 | 0.9% |  | `s1`, `s2` |
| `stand/speak` | property | 2 | 0.9% |  |  |
| `stand/speak/<n>` | string | 2 | 0.9% |  | `n0` |
| `swing` | property | 2 | 0.9% |  |  |
| `swing/<n>` | canvas, uol | 2 | 0.9% | 0 … 3 |  |
| `swing/<n>/delay` | int | 2 | 0.9% | 200 |  |
| `swing/<n>/origin` | vector | 2 | 0.9% |  |  |
| `swing/<n>/z` | int | 2 | 0.9% | 0 |  |
| `cough/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0000202.img/cough/0`, `Npc/_Canvas/0000202.img/cough/1` |
| `fish` | property | 1 | 0.4% |  |  |
| `fish/<n>` | canvas, uol | 1 | 0.4% | 0 … 2 |  |
| `fish/<n>/delay` | int | 1 | 0.4% | 100 … 1500 |  |
| `fish/<n>/origin` | vector | 1 | 0.4% |  |  |
| `fish/<n>/z` | int | 1 | 0.4% | 0 |  |
| `hand/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0000515.img/stand/0`, `Npc/_Canvas/0000515.img/hand/1`, `Npc/_Canvas/0000515.img/hand/2`, `Npc/_Canvas/0000515.img/hand/3` |
| `hand/<n>/z` | int | 1 | 0.4% | 0 |  |
| `hand/speak` | property | 1 | 0.4% |  |  |
| `hand/speak/<n>` | string | 1 | 0.4% |  | `h0`, `h1`, `h2` |
| `info/hideName` | int | 1 | 0.4% | 1 |  |
| `info/MapleTV` | int | 1 | 0.4% | 1 |  |
| `info/MapleTVadX` | int | 1 | 0.4% | -237 |  |
| `info/MapleTVadY` | int | 1 | 0.4% | -261 |  |
| `info/MapleTVmsgX` | short | 1 | 0.4% | -232 |  |
| `info/MapleTVmsgY` | int | 1 | 0.4% | -379 |  |
| `info/reg` | property | 1 | 0.4% |  |  |
| `info/reg/count` | int | 1 | 0.4% | 0 |  |
| `info/reg/map` | int | 1 | 0.4% | -1 |  |
| `magic/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0000605.img/magic/0`, `Npc/_Canvas/0000605.img/magic/1`, `Npc/_Canvas/0000605.img/magic/2`, `Npc/_Canvas/0000605.img/magic/3`, `Npc/_Canvas/0000605.img/magic/4` |
| `magic/speak` | property | 1 | 0.4% |  |  |
| `magic/speak/<n>` | string | 1 | 0.4% |  | `m0` |
| `proud` | property | 1 | 0.4% |  |  |
| `proud/<n>` | canvas, uol | 1 | 0.4% | 0 … 2 |  |
| `proud/<n>/delay` | int | 1 | 0.4% | 150 … 300 |  |
| `proud/<n>/origin` | vector | 1 | 0.4% |  |  |
| `proud/<n>/z` | int | 1 | 0.4% | 0 |  |
| `qBlue` | property | 1 | 0.4% |  |  |
| `qBlue/<n>` | canvas | 1 | 0.4% |  |  |
| `qBlue/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/9010000.img/qBlue/0` |
| `qBlue/<n>/delay` | int | 1 | 0.4% | 5000 |  |
| `qBlue/<n>/origin` | vector | 1 | 0.4% |  |  |
| `qBlue/<n>/z` | int | 1 | 0.4% | 0 |  |
| `qBlue/special` | int | 1 | 0.4% | 1 |  |
| `rub` | property | 1 | 0.4% |  |  |
| `rub/<n>` | canvas, uol | 1 | 0.4% | 0 … 2 |  |
| `rub/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0000014.img/rub/0`, `Npc/_Canvas/0000014.img/rub/1`, `Npc/_Canvas/0000014.img/rub/2` |
| `rub/<n>/delay` | int | 1 | 0.4% | 100 … 150 |  |
| `rub/<n>/origin` | vector | 1 | 0.4% |  |  |
| `rub/<n>/z` | int | 1 | 0.4% | 0 |  |
| `salute` | property | 1 | 0.4% |  |  |
| `salute/<n>` | canvas | 1 | 0.4% |  |  |
| `salute/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0000014.img/salute/0` |
| `salute/<n>/delay` | int | 1 | 0.4% | 5000 |  |
| `salute/<n>/origin` | vector | 1 | 0.4% |  |  |
| `salute/<n>/z` | int | 1 | 0.4% | 0 |  |
| `salute/speak` | property | 1 | 0.4% |  |  |
| `salute/speak/<n>` | string | 1 | 0.4% |  | `s0` |
| `shake` | property | 1 | 0.4% |  |  |
| `shake/<n>` | canvas, uol | 1 | 0.4% | 0 … 2 |  |
| `shake/<n>/delay` | int | 1 | 0.4% | 150 … 300 |  |
| `shake/<n>/origin` | vector | 1 | 0.4% |  |  |
| `shake/<n>/z` | int | 1 | 0.4% | 0 |  |
| `shop` | property | 1 | 0.4% |  |  |
| `shop/<n>` | canvas | 1 | 0.4% |  |  |
| `shop/<n>/origin` | vector | 1 | 0.4% |  |  |
| `sigh` | property | 1 | 0.4% |  |  |
| `sigh/<n>` | canvas | 1 | 0.4% |  |  |
| `sigh/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0000224.img/sigh/0`, `Npc/_Canvas/0000224.img/sigh/1`, `Npc/_Canvas/0000224.img/sigh/2`, `Npc/_Canvas/0000224.img/sigh/3`, `Npc/_Canvas/0000224.img/sigh/4` |
| `sigh/<n>/delay` | int | 1 | 0.4% | 200 … 230 |  |
| `sigh/<n>/origin` | vector | 1 | 0.4% |  |  |
| `sigh/speak` | property | 1 | 0.4% |  |  |
| `sigh/speak/<n>` | string | 1 | 0.4% |  | `f0` |
| `stand/origin` | vector | 1 | 0.4% |  |  |
| `stand/zigzag` | int | 1 | 0.4% | 1 |  |
| `swing/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0000202.img/swing/0`, `Npc/_Canvas/0000202.img/swing/1`, `Npc/_Canvas/0000202.img/swing/3` |
| `what` | property | 1 | 0.4% |  |  |
| `what/<n>` | canvas, uol | 1 | 0.4% | 4 |  |
| `what/<n>/delay` | int | 1 | 0.4% | 100 … 500 |  |
| `what/<n>/origin` | vector | 1 | 0.4% |  |  |
| `what/<n>/z` | int | 1 | 0.4% | 0 |  |
| `wind` | property | 1 | 0.4% |  |  |
| `wind/<n>` | canvas | 1 | 0.4% |  |  |
| `wind/<n>/_outlink` | string | 1 | 0.4% |  | `Npc/_Canvas/0900026.img/wind/0`, `Npc/_Canvas/0900026.img/wind/1`, `Npc/_Canvas/0900026.img/say/1`, `Npc/_Canvas/0900026.img/wind/8`, `Npc/_Canvas/0900026.img/wind/9` |
| `wind/<n>/delay` | int | 1 | 0.4% | 156 |  |
| `wind/<n>/origin` | vector | 1 | 0.4% |  |  |
<!-- /generated:schema -->
