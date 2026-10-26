# Pets (Item/Pet/<id>.img)

<!-- generated:schema -->
Units: **35**. Examples: `Item/Pet/5000000.img`, `Item/Pet/5000001.img`, `Item/Pet/5000002.img`.

Showing the 500 most common of 685 field paths.

Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.

| Field | Types | Units | % | Range | Samples |
|---|---|---|---|---|---|
| `chat` | property | 35 | 100.0% |  |  |
| `chat/<n>` | canvas, uol | 35 | 100.0% | 0 … 7 |  |
| `chat/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/chat/0`, `Item/Pet/_Canvas/5000001.img/chat/0`, `Item/Pet/_Canvas/5000002.img/chat/0`, `Item/Pet/_Canvas/5000002.img/chat/1`, `Item/Pet/_Canvas/5000003.img/chat/0` |
| `chat/<n>/lt` | vector | 35 | 100.0% |  |  |
| `chat/<n>/origin` | vector | 35 | 100.0% |  |  |
| `chat/<n>/rb` | vector | 35 | 100.0% |  |  |
| `fly` | property | 35 | 100.0% |  |  |
| `fly/<n>` | canvas, uol | 35 | 100.0% | 0 … 3 |  |
| `fly/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/fly/0`, `Item/Pet/_Canvas/5000000.img/move/2`, `Item/Pet/_Canvas/5000001.img/fly/0`, `Item/Pet/_Canvas/5000001.img/fly/1`, `Item/Pet/_Canvas/5000002.img/fly/0` |
| `fly/<n>/origin` | vector | 35 | 100.0% |  |  |
| `food` | property | 35 | 100.0% |  |  |
| `food/<n>` | property | 35 | 100.0% |  |  |
| `food/<n>/fail` | property | 35 | 100.0% |  |  |
| `food/<n>/fail/<n>` | property | 35 | 100.0% |  |  |
| `food/<n>/fail/<n>/<n>` | string | 35 | 100.0% |  | `f1_f`, `f2_f`, `f3_f`, `f4_f` |
| `food/<n>/fail/<n>/act` | string | 35 | 100.0% |  | `cry`, `chat`, `rest0`, `angry`, `bewildered` |
| `food/<n>/l0` | int | 35 | 100.0% | 1 … 30 |  |
| `food/<n>/l1` | int | 35 | 100.0% | 9 … 30 |  |
| `food/<n>/success` | property | 35 | 100.0% |  |  |
| `food/<n>/success/<n>` | property | 35 | 100.0% |  |  |
| `food/<n>/success/<n>/<n>` | string | 35 | 100.0% |  | `f1_s`, `f2_s`, `f3_s`, `f4_s` |
| `food/<n>/success/<n>/act` | string | 35 | 100.0% |  | `rest0`, `eat`, `chat`, `charge`, `hug` |
| `hang` | property | 35 | 100.0% |  |  |
| `hang/<n>` | canvas | 35 | 100.0% |  |  |
| `hang/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/hang/0`, `Item/Pet/_Canvas/5000001.img/hang/0`, `Item/Pet/_Canvas/5000002.img/hang/0`, `Item/Pet/_Canvas/5000003.img/hang/0`, `Item/Pet/_Canvas/5000004.img/hang/0` |
| `hang/<n>/lt` | vector | 35 | 100.0% |  |  |
| `hang/<n>/origin` | vector | 35 | 100.0% |  |  |
| `hang/<n>/rb` | vector | 35 | 100.0% |  |  |
| `hungry` | property | 35 | 100.0% |  |  |
| `hungry/<n>` | canvas, uol | 35 | 100.0% | 0 … 6 |  |
| `hungry/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/hungry/0`, `Item/Pet/_Canvas/5000000.img/hungry/1`, `Item/Pet/_Canvas/5000000.img/hungry/2`, `Item/Pet/_Canvas/5000001.img/hungry/0`, `Item/Pet/_Canvas/5000002.img/hungry/0` |
| `hungry/<n>/lt` | vector | 35 | 100.0% |  |  |
| `hungry/<n>/origin` | vector | 35 | 100.0% |  |  |
| `hungry/<n>/rb` | vector | 35 | 100.0% |  |  |
| `info` | property | 35 | 100.0% |  |  |
| `info/cash` | int | 35 | 100.0% | 1 |  |
| `info/hungry` | int | 35 | 100.0% | 1 … 5 |  |
| `info/icon` | canvas | 35 | 100.0% |  |  |
| `info/icon/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/info/icon`, `Item/Pet/_Canvas/5000001.img/info/icon`, `Item/Pet/_Canvas/5000002.img/info/icon`, `Item/Pet/_Canvas/5000003.img/info/icon`, `Item/Pet/_Canvas/5000004.img/info/icon` |
| `info/icon/origin` | vector | 35 | 100.0% |  |  |
| `info/iconD` | canvas | 35 | 100.0% |  |  |
| `info/iconD/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/info/iconD`, `Item/Pet/_Canvas/5000001.img/info/iconD`, `Item/Pet/_Canvas/5000002.img/info/iconD`, `Item/Pet/_Canvas/5000003.img/info/iconD`, `Item/Pet/_Canvas/5000004.img/info/iconD` |
| `info/iconD/origin` | vector | 35 | 100.0% |  |  |
| `info/iconRaw` | canvas | 35 | 100.0% |  |  |
| `info/iconRaw/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000028.img/info/icon`, `Item/Pet/_Canvas/5000033.img/info/icon` |
| `info/iconRaw/origin` | vector | 35 | 100.0% |  |  |
| `info/iconRawD` | canvas | 35 | 100.0% |  |  |
| `info/iconRawD/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000028.img/info/iconD` |
| `info/iconRawD/origin` | vector | 35 | 100.0% |  |  |
| `info/pickupItem` | int | 35 | 100.0% | 1 |  |
| `interact` | property | 35 | 100.0% |  |  |
| `interact/<n>` | property | 35 | 100.0% |  |  |
| `interact/<n>/command` | string | 35 | 100.0% |  | `c1`, `c2`, `c3`, `c4`, `c5` |
| `interact/<n>/fail` | property | 35 | 100.0% |  |  |
| `interact/<n>/fail/<n>` | property | 35 | 100.0% |  |  |
| `interact/<n>/fail/<n>/<n>` | string | 35 | 100.0% |  | `c1_f1`, `c1_f2`, `c2_f1`, `c2_f2`, `c2_f3` |
| `interact/<n>/fail/<n>/act` | string | 35 | 100.0% |  | `stand1`, `prone`, `angry`, `stretch`, `rest0` |
| `interact/<n>/inc` | int | 35 | 100.0% | 1 … 3 |  |
| `interact/<n>/l0` | int | 35 | 100.0% | 1 … 30 |  |
| `interact/<n>/l1` | int | 35 | 100.0% | 9 … 30 |  |
| `interact/<n>/prob` | int | 35 | 100.0% | 20 … 100 |  |
| `interact/<n>/success` | property | 35 | 100.0% |  |  |
| `interact/<n>/success/<n>` | property | 35 | 100.0% |  |  |
| `interact/<n>/success/<n>/<n>` | string | 35 | 100.0% |  | `c1_s1`, `c1_s2`, `c2_s1`, `c2_s2`, `c2_s3` |
| `interact/<n>/success/<n>/act` | string | 35 | 100.0% |  | `rest0`, `poor`, `cry`, `dung`, `chat` |
| `jump` | property | 35 | 100.0% |  |  |
| `jump/<n>` | canvas | 35 | 100.0% |  |  |
| `jump/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/jump/0`, `Item/Pet/_Canvas/5000001.img/jump/0`, `Item/Pet/_Canvas/5000002.img/move/3`, `Item/Pet/_Canvas/5000003.img/move/1`, `Item/Pet/_Canvas/5000004.img/jump/0` |
| `jump/<n>/lt` | vector | 35 | 100.0% |  |  |
| `jump/<n>/origin` | vector | 35 | 100.0% |  |  |
| `jump/<n>/rb` | vector | 35 | 100.0% |  |  |
| `move` | property | 35 | 100.0% |  |  |
| `move/<n>` | canvas, uol | 35 | 100.0% | 0 … 3 |  |
| `move/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/move/0`, `Item/Pet/_Canvas/5000000.img/move/1`, `Item/Pet/_Canvas/5000000.img/move/2`, `Item/Pet/_Canvas/5000001.img/move/0`, `Item/Pet/_Canvas/5000001.img/move/1` |
| `move/<n>/origin` | vector | 35 | 100.0% |  |  |
| `slang` | property | 35 | 100.0% |  |  |
| `slang/<n>` | property | 35 | 100.0% |  |  |
| `slang/<n>/<n>` | string | 35 | 100.0% |  | `s1`, `s2`, `s3`, `s4` |
| `slang/<n>/act` | string | 35 | 100.0% |  | `rest0`, `chat`, `angry`, `stunned`, `sit` |
| `slang/<n>/l0` | int | 35 | 100.0% | 1 … 30 |  |
| `slang/<n>/l1` | int | 35 | 100.0% | 9 … 30 |  |
| `stand0` | property | 35 | 100.0% |  |  |
| `stand0/<n>` | canvas, uol | 35 | 100.0% | 0 … 7 |  |
| `stand0/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/stand0/0`, `Item/Pet/_Canvas/5000000.img/stand0/1`, `Item/Pet/_Canvas/5000000.img/stand0/2`, `Item/Pet/_Canvas/5000001.img/stand0/0`, `Item/Pet/_Canvas/5000001.img/stand0/1` |
| `stand0/<n>/origin` | vector | 35 | 100.0% |  |  |
| `stand1` | property | 35 | 100.0% |  |  |
| `stand1/<n>` | canvas, uol | 35 | 100.0% | 0 … 6 |  |
| `stand1/<n>/_outlink` | string | 35 | 100.0% |  | `Item/Pet/_Canvas/5000000.img/stand0/0`, `Item/Pet/_Canvas/5000000.img/stand1/1`, `Item/Pet/_Canvas/5000000.img/stand1/2`, `Item/Pet/_Canvas/5000000.img/stand1/5`, `Item/Pet/_Canvas/5000000.img/stand1/6` |
| `stand1/<n>/origin` | vector | 35 | 100.0% |  |  |
| `chat/<n>/delay` | int | 34 | 97.1% | 100 … 4000 |  |
| `fly/<n>/delay` | int | 34 | 97.1% | 110 … 280 |  |
| `fly/<n>/lt` | vector | 34 | 97.1% |  |  |
| `fly/<n>/rb` | vector | 34 | 97.1% |  |  |
| `info/life` | int | 34 | 97.1% | 3 … 90 |  |
| `move/<n>/delay` | int | 34 | 97.1% | 60 … 240 |  |
| `stand0/<n>/delay` | int, string | 34 | 97.1% | 40 … 2000 |  |
| `stand0/<n>/lt` | vector | 34 | 97.1% |  |  |
| `stand0/<n>/rb` | vector | 34 | 97.1% |  |  |
| `stand1/<n>/delay` | int | 34 | 97.1% | 60 … 1200 |  |
| `stand1/<n>/lt` | vector | 34 | 97.1% |  |  |
| `stand1/<n>/rb` | vector | 34 | 97.1% |  |  |
| `move/<n>/lt` | vector | 33 | 94.3% |  |  |
| `move/<n>/rb` | vector | 33 | 94.3% |  |  |
| `rest0` | property | 33 | 94.3% |  |  |
| `rest0/<n>` | canvas, uol | 33 | 94.3% | 0 … 6 |  |
| `rest0/<n>/_outlink` | string | 33 | 94.3% |  | `Item/Pet/_Canvas/5000000.img/rest0/0`, `Item/Pet/_Canvas/5000000.img/rest0/1`, `Item/Pet/_Canvas/5000000.img/rest0/2`, `Item/Pet/_Canvas/5000001.img/rest0/0`, `Item/Pet/_Canvas/5000001.img/rest0/1` |
| `rest0/<n>/origin` | vector | 33 | 94.3% |  |  |
| `angry` | property | 32 | 91.4% |  |  |
| `angry/<n>` | canvas, uol | 32 | 91.4% | 0 … 6 |  |
| `angry/<n>/_outlink` | string | 32 | 91.4% |  | `Item/Pet/_Canvas/5000000.img/angry/0`, `Item/Pet/_Canvas/5000001.img/angry/0`, `Item/Pet/_Canvas/5000001.img/angry/1`, `Item/Pet/_Canvas/5000002.img/angry/0`, `Item/Pet/_Canvas/5000002.img/angry/1` |
| `angry/<n>/delay` | int | 32 | 91.4% | 150 … 4000 |  |
| `angry/<n>/lt` | vector | 32 | 91.4% |  |  |
| `angry/<n>/origin` | vector | 32 | 91.4% |  |  |
| `angry/<n>/rb` | vector | 32 | 91.4% |  |  |
| `cry` | property | 32 | 91.4% |  |  |
| `cry/<n>` | canvas, uol | 32 | 91.4% | 0 … 6 |  |
| `cry/<n>/_outlink` | string | 32 | 91.4% |  | `Item/Pet/_Canvas/5000000.img/cry/0`, `Item/Pet/_Canvas/5000001.img/cry/0`, `Item/Pet/_Canvas/5000001.img/cry/1`, `Item/Pet/_Canvas/5000002.img/cry/0`, `Item/Pet/_Canvas/5000003.img/cry/0` |
| `cry/<n>/delay` | int | 32 | 91.4% | 150 … 4000 |  |
| `cry/<n>/lt` | vector | 32 | 91.4% |  |  |
| `cry/<n>/origin` | vector | 32 | 91.4% |  |  |
| `cry/<n>/rb` | vector | 32 | 91.4% |  |  |
| `rest0/<n>/lt` | vector | 32 | 91.4% |  |  |
| `rest0/<n>/rb` | vector | 32 | 91.4% |  |  |
| `rest0/<n>/delay` | int | 30 | 85.7% | 40 … 2900 |  |
| `hungry/<n>/delay` | int | 27 | 77.1% | 60 … 2000 |  |
| `dung` | property | 25 | 71.4% |  |  |
| `dung/<n>` | canvas, uol | 25 | 71.4% | 0 … 3 |  |
| `dung/<n>/_outlink` | string | 25 | 71.4% |  | `Item/Pet/_Canvas/5000000.img/dung/0`, `Item/Pet/_Canvas/5000001.img/dung/0`, `Item/Pet/_Canvas/5000001.img/dung/1`, `Item/Pet/_Canvas/5000002.img/dung/0`, `Item/Pet/_Canvas/5000003.img/dung/0` |
| `dung/<n>/delay` | int | 25 | 71.4% | 150 … 4000 |  |
| `dung/<n>/lt` | vector | 25 | 71.4% |  |  |
| `dung/<n>/origin` | vector | 25 | 71.4% |  |  |
| `dung/<n>/rb` | vector | 25 | 71.4% |  |  |
| `info/chatBalloon` | int | 20 | 57.1% | 1 … 51 |  |
| `info/nameTag` | int | 20 | 57.1% | 3 … 51 |  |
| `love` | property | 19 | 54.3% |  |  |
| `love/<n>` | canvas, uol | 19 | 54.3% | 0 … 7 |  |
| `love/<n>/_outlink` | string | 19 | 54.3% |  | `Item/Pet/_Canvas/5000007.img/love/0`, `Item/Pet/_Canvas/5000008.img/love/0`, `Item/Pet/_Canvas/5000008.img/love/1`, `Item/Pet/_Canvas/5000008.img/love/2`, `Item/Pet/_Canvas/5000008.img/love/3` |
| `love/<n>/delay` | int | 19 | 54.3% | 100 … 3000 |  |
| `love/<n>/lt` | vector | 19 | 54.3% |  |  |
| `love/<n>/origin` | vector | 19 | 54.3% |  |  |
| `love/<n>/rb` | vector | 19 | 54.3% |  |  |
| `rise` | property | 16 | 45.7% |  |  |
| `rise/<n>` | canvas, uol | 16 | 45.7% | 0 … 5 |  |
| `rise/<n>/_outlink` | string | 16 | 45.7% |  | `Item/Pet/_Canvas/5000000.img/rise/0`, `Item/Pet/_Canvas/5000001.img/rise/0`, `Item/Pet/_Canvas/5000001.img/rise/1`, `Item/Pet/_Canvas/5000002.img/rise/0`, `Item/Pet/_Canvas/5000003.img/rise/0` |
| `rise/<n>/delay` | int | 16 | 45.7% | 100 … 4000 |  |
| `rise/<n>/lt` | vector | 16 | 45.7% |  |  |
| `rise/<n>/origin` | vector | 16 | 45.7% |  |  |
| `rise/<n>/rb` | vector | 16 | 45.7% |  |  |
| `sleep` | property | 16 | 45.7% |  |  |
| `sleep/<n>` | canvas, uol | 16 | 45.7% | 0 … 12 |  |
| `sleep/<n>/_outlink` | string | 16 | 45.7% |  | `Item/Pet/_Canvas/5000008.img/sleep/0`, `Item/Pet/_Canvas/5000008.img/sleep/1`, `Item/Pet/_Canvas/5000008.img/sleep/2`, `Item/Pet/_Canvas/5000008.img/sleep/3`, `Item/Pet/_Canvas/5000008.img/sleep/5` |
| `sleep/<n>/delay` | int | 16 | 45.7% | 80 … 2000 |  |
| `sleep/<n>/lt` | vector | 16 | 45.7% |  |  |
| `sleep/<n>/origin` | vector | 16 | 45.7% |  |  |
| `sleep/<n>/rb` | vector | 16 | 45.7% |  |  |
| `eat` | property | 15 | 42.9% |  |  |
| `eat/<n>` | canvas, uol | 15 | 42.9% | 0 … 11 |  |
| `eat/<n>/_outlink` | string | 15 | 42.9% |  | `Item/Pet/_Canvas/5000006.img/eat/0`, `Item/Pet/_Canvas/5000007.img/eat/0`, `Item/Pet/_Canvas/5000007.img/eat/1`, `Item/Pet/_Canvas/5000007.img/eat/2`, `Item/Pet/_Canvas/5000007.img/eat/3` |
| `eat/<n>/delay` | int | 15 | 42.9% | 110 … 2000 |  |
| `eat/<n>/lt` | vector | 15 | 42.9% |  |  |
| `eat/<n>/origin` | vector | 15 | 42.9% |  |  |
| `eat/<n>/rb` | vector | 15 | 42.9% |  |  |
| `stunned` | property | 15 | 42.9% |  |  |
| `stunned/<n>` | canvas, uol | 15 | 42.9% | 0 … 4 |  |
| `stunned/<n>/_outlink` | string | 15 | 42.9% |  | `Item/Pet/_Canvas/5000007.img/stunned/0`, `Item/Pet/_Canvas/5000007.img/stunned/1`, `Item/Pet/_Canvas/5000007.img/stunned/2`, `Item/Pet/_Canvas/5000007.img/stunned/3`, `Item/Pet/_Canvas/5000007.img/stunned/4` |
| `stunned/<n>/delay` | int | 15 | 42.9% | 30 … 4000 |  |
| `stunned/<n>/lt` | vector | 15 | 42.9% |  |  |
| `stunned/<n>/origin` | vector | 15 | 42.9% |  |  |
| `stunned/<n>/rb` | vector | 15 | 42.9% |  |  |
| `prone` | property | 12 | 34.3% |  |  |
| `prone/<n>` | canvas, uol | 12 | 34.3% | 0 … 2 |  |
| `prone/<n>/_outlink` | string | 12 | 34.3% |  | `Item/Pet/_Canvas/5000000.img/prone/0`, `Item/Pet/_Canvas/5000001.img/prone/0`, `Item/Pet/_Canvas/5000002.img/prone/0`, `Item/Pet/_Canvas/5000002.img/prone/1`, `Item/Pet/_Canvas/5000002.img/prone/2` |
| `prone/<n>/origin` | vector | 12 | 34.3% |  |  |
| `prone/<n>/delay` | int | 11 | 31.4% | 80 … 3000 |  |
| `prone/<n>/lt` | vector | 11 | 31.4% |  |  |
| `prone/<n>/rb` | vector | 11 | 31.4% |  |  |
| `alert` | property | 9 | 25.7% |  |  |
| `alert/<n>` | canvas | 9 | 25.7% |  |  |
| `alert/<n>/_outlink` | string | 9 | 25.7% |  | `Item/Pet/_Canvas/5000000.img/alert/0`, `Item/Pet/_Canvas/5000003.img/alert/0`, `Item/Pet/_Canvas/5000004.img/alert/0`, `Item/Pet/_Canvas/5000011.img/alert/0`, `Item/Pet/_Canvas/5000011.img/alert/1` |
| `alert/<n>/origin` | vector | 9 | 25.7% |  |  |
| `jump/<n>/delay` | int | 9 | 25.7% | 100 … 240 |  |
| `alert/<n>/delay` | int | 8 | 22.9% | 200 … 4000 |  |
| `alert/<n>/lt` | vector | 8 | 22.9% |  |  |
| `alert/<n>/rb` | vector | 8 | 22.9% |  |  |
| `hang/<n>/z` | int | 8 | 22.9% | 0 |  |
| `nap` | property | 8 | 22.9% |  |  |
| `nap/<n>` | canvas, uol | 8 | 22.9% | 0 … 2 |  |
| `nap/<n>/_outlink` | string | 8 | 22.9% |  | `Item/Pet/_Canvas/5000001.img/nap/0`, `Item/Pet/_Canvas/5000001.img/nap/1`, `Item/Pet/_Canvas/5000001.img/nap/2`, `Item/Pet/_Canvas/5000002.img/nap/0`, `Item/Pet/_Canvas/5000002.img/nap/1` |
| `nap/<n>/delay` | int | 8 | 22.9% | 80 … 1500 |  |
| `nap/<n>/lt` | vector | 8 | 22.9% |  |  |
| `nap/<n>/origin` | vector | 8 | 22.9% |  |  |
| `nap/<n>/rb` | vector | 8 | 22.9% |  |  |
| `sit` | property | 7 | 20.0% |  |  |
| `sit/<n>` | canvas, uol | 7 | 20.0% | 1 … 3 |  |
| `sit/<n>/_outlink` | string | 7 | 20.0% |  | `Item/Pet/_Canvas/5000008.img/sit/0`, `Item/Pet/_Canvas/5000012.img/stand0/0`, `Item/Pet/_Canvas/5000017.img/rest0/1`, `Item/Pet/_Canvas/5000018.img/sit/0`, `Item/Pet/_Canvas/5000027.img/sit/0` |
| `sit/<n>/delay` | int | 7 | 20.0% | 180 … 4000 |  |
| `sit/<n>/lt` | vector | 7 | 20.0% |  |  |
| `sit/<n>/origin` | vector | 7 | 20.0% |  |  |
| `sit/<n>/rb` | vector | 7 | 20.0% |  |  |
| `hug` | property | 6 | 17.1% |  |  |
| `hug/<n>` | canvas | 6 | 17.1% |  |  |
| `hug/<n>/_outlink` | string | 6 | 17.1% |  | `Item/Pet/_Canvas/5000002.img/hug/0`, `Item/Pet/_Canvas/5000005.img/hug/0`, `Item/Pet/_Canvas/5000019.img/hug/0`, `Item/Pet/_Canvas/5000019.img/hug/1`, `Item/Pet/_Canvas/5000020.img/hug/0` |
| `hug/<n>/delay` | int | 6 | 17.1% | 200 … 4000 |  |
| `hug/<n>/lt` | vector | 6 | 17.1% |  |  |
| `hug/<n>/origin` | vector | 6 | 17.1% |  |  |
| `hug/<n>/rb` | vector | 6 | 17.1% |  |  |
| `no` | property | 6 | 17.1% |  |  |
| `no/<n>` | canvas, uol | 6 | 17.1% | 0 … 3 |  |
| `no/<n>/_outlink` | string | 6 | 17.1% |  | `Item/Pet/_Canvas/5000003.img/no/0`, `Item/Pet/_Canvas/5000007.img/no/0`, `Item/Pet/_Canvas/5000007.img/no/1`, `Item/Pet/_Canvas/5000007.img/no/2`, `Item/Pet/_Canvas/5000007.img/no/3` |
| `no/<n>/delay` | int | 6 | 17.1% | 150 … 4000 |  |
| `no/<n>/lt` | vector | 6 | 17.1% |  |  |
| `no/<n>/origin` | vector | 6 | 17.1% |  |  |
| `no/<n>/rb` | vector | 6 | 17.1% |  |  |
| `good` | property | 5 | 14.3% |  |  |
| `good/<n>` | canvas, uol | 5 | 14.3% | 0 … 9 |  |
| `good/<n>/_outlink` | string | 5 | 14.3% |  | `Item/Pet/_Canvas/5000016.img/good/0`, `Item/Pet/_Canvas/5000016.img/good/1`, `Item/Pet/_Canvas/5000016.img/good/2`, `Item/Pet/_Canvas/5000016.img/good/3`, `Item/Pet/_Canvas/5000016.img/good/4` |
| `good/<n>/delay` | int | 5 | 14.3% | 100 … 500 |  |
| `good/<n>/lt` | vector | 5 | 14.3% |  |  |
| `good/<n>/origin` | vector | 5 | 14.3% |  |  |
| `good/<n>/rb` | vector | 5 | 14.3% |  |  |
| `info/consumeMP` | int | 5 | 14.3% | 1 |  |
| `change` | property | 4 | 11.4% |  |  |
| `change/<n>` | canvas, uol | 4 | 11.4% | 2 … 9 |  |
| `change/<n>/_outlink` | string | 4 | 11.4% |  | `Item/Pet/_Canvas/5000016.img/change/0`, `Item/Pet/_Canvas/5000016.img/change/1`, `Item/Pet/_Canvas/5000016.img/change/2`, `Item/Pet/_Canvas/5000016.img/change/3`, `Item/Pet/_Canvas/5000016.img/change/6` |
| `change/<n>/delay` | int | 4 | 11.4% | 60 … 840 |  |
| `change/<n>/lt` | vector | 4 | 11.4% |  |  |
| `change/<n>/origin` | vector | 4 | 11.4% |  |  |
| `change/<n>/rb` | vector | 4 | 11.4% |  |  |
| `fly/<n>/z` | int | 4 | 11.4% | 0 … 1 |  |
| `hand` | property | 4 | 11.4% |  |  |
| `hand/<n>` | canvas | 4 | 11.4% |  |  |
| `hand/<n>/_outlink` | string | 4 | 11.4% |  | `Item/Pet/_Canvas/5000006.img/hand/0`, `Item/Pet/_Canvas/5000007.img/hand/0`, `Item/Pet/_Canvas/5000019.img/hand/0`, `Item/Pet/_Canvas/5000021.img/hand/0` |
| `hand/<n>/delay` | int | 4 | 11.4% | 3000 |  |
| `hand/<n>/lt` | vector | 4 | 11.4% |  |  |
| `hand/<n>/origin` | vector | 4 | 11.4% |  |  |
| `hand/<n>/rb` | vector | 4 | 11.4% |  |  |
| `hang/<n>/delay` | int | 4 | 11.4% | 180 … 240 |  |
| `jump/<n>/z` | int | 4 | 11.4% | 0 |  |
| `melong` | property | 4 | 11.4% |  |  |
| `melong/<n>` | canvas | 4 | 11.4% |  |  |
| `melong/<n>/_outlink` | string | 4 | 11.4% |  | `Item/Pet/_Canvas/5000008.img/melong/0`, `Item/Pet/_Canvas/5000012.img/melong/0`, `Item/Pet/_Canvas/5000022.img/melong/0`, `Item/Pet/_Canvas/5000029.img/melong/0`, `Item/Pet/_Canvas/5000029.img/melong/1` |
| `melong/<n>/delay` | int | 4 | 11.4% | 350 … 4000 |  |
| `melong/<n>/lt` | vector | 4 | 11.4% |  |  |
| `melong/<n>/origin` | vector | 4 | 11.4% |  |  |
| `melong/<n>/rb` | vector | 4 | 11.4% |  |  |
| `move/<n>/z` | int | 4 | 11.4% | 0 |  |
| `rest0/zigzag` | int | 4 | 11.4% | 1 |  |
| `smile` | property | 4 | 11.4% |  |  |
| `smile/<n>` | canvas | 4 | 11.4% |  |  |
| `smile/<n>/_outlink` | string | 4 | 11.4% |  | `Item/Pet/_Canvas/5000003.img/smile/0`, `Item/Pet/_Canvas/5000007.img/smile/0`, `Item/Pet/_Canvas/5000009.img/smile/0`, `Item/Pet/_Canvas/5000010.img/smile/0` |
| `smile/<n>/delay` | int | 4 | 11.4% | 3000 … 4000 |  |
| `smile/<n>/lt` | vector | 4 | 11.4% |  |  |
| `smile/<n>/origin` | vector | 4 | 11.4% |  |  |
| `smile/<n>/rb` | vector | 4 | 11.4% |  |  |
| `stand0/<n>/z` | int | 4 | 11.4% | -1 … 0 |  |
| `stretch` | property | 4 | 11.4% |  |  |
| `stretch/<n>` | canvas | 4 | 11.4% |  |  |
| `stretch/<n>/_outlink` | string | 4 | 11.4% |  | `Item/Pet/_Canvas/5000000.img/stretch/0`, `Item/Pet/_Canvas/5000004.img/stretch/0`, `Item/Pet/_Canvas/5000013.img/stand0/0`, `Item/Pet/_Canvas/5000013.img/stretch/1`, `Item/Pet/_Canvas/5000013.img/stretch/2` |
| `stretch/<n>/delay` | int | 4 | 11.4% | 300 … 3000 |  |
| `stretch/<n>/lt` | vector | 4 | 11.4% |  |  |
| `stretch/<n>/origin` | vector | 4 | 11.4% |  |  |
| `stretch/<n>/rb` | vector | 4 | 11.4% |  |  |
| `angry/<n>/z` | int | 3 | 8.6% | 0 |  |
| `chat/<n>/z` | int | 3 | 8.6% | 0 |  |
| `complain` | property | 3 | 8.6% |  |  |
| `complain/<n>` | canvas, uol | 3 | 8.6% | 0 … 2 |  |
| `complain/<n>/_outlink` | string | 3 | 8.6% |  | `Item/Pet/_Canvas/5000002.img/complain/0`, `Item/Pet/_Canvas/5000002.img/complain/1`, `Item/Pet/_Canvas/5000002.img/complain/2`, `Item/Pet/_Canvas/5000005.img/complain/0`, `Item/Pet/_Canvas/5000005.img/complain/1` |
| `complain/<n>/delay` | int | 3 | 8.6% | 200 … 500 |  |
| `complain/<n>/lt` | vector | 3 | 8.6% |  |  |
| `complain/<n>/origin` | vector | 3 | 8.6% |  |  |
| `complain/<n>/rb` | vector | 3 | 8.6% |  |  |
| `donno` | property | 3 | 8.6% |  |  |
| `donno/<n>` | canvas, uol | 3 | 8.6% | 0 … 2 |  |
| `donno/<n>/_outlink` | string | 3 | 8.6% |  | `Item/Pet/_Canvas/5000002.img/stand0/0`, `Item/Pet/_Canvas/5000002.img/donno/1`, `Item/Pet/_Canvas/5000002.img/donno/2`, `Item/Pet/_Canvas/5000005.img/stand1/0`, `Item/Pet/_Canvas/5000005.img/donno/1` |
| `donno/<n>/delay` | int | 3 | 8.6% | 100 … 1100 |  |
| `donno/<n>/lt` | vector | 3 | 8.6% |  |  |
| `donno/<n>/origin` | vector | 3 | 8.6% |  |  |
| `donno/<n>/rb` | vector | 3 | 8.6% |  |  |
| `eat/<n>/z` | int | 3 | 8.6% | 0 |  |
| `info/consumeHP` | int | 3 | 8.6% | 1 |  |
| `info/noMoveToLocker` | int | 3 | 8.6% | 1 |  |
| `info/noRevive` | int | 3 | 8.6% | 1 |  |
| `info/noScroll` | int | 3 | 8.6% | 1 |  |
| `love/<n>/z` | int | 3 | 8.6% | 0 |  |
| `tedious` | property | 3 | 8.6% |  |  |
| `tedious/<n>` | canvas, uol | 3 | 8.6% | 0 … 2 |  |
| `tedious/<n>/_outlink` | string | 3 | 8.6% |  | `Item/Pet/_Canvas/5000001.img/rest0/2`, `Item/Pet/_Canvas/5000001.img/tedious/1`, `Item/Pet/_Canvas/5000001.img/tedious/2`, `Item/Pet/_Canvas/5000006.img/tedious/0`, `Item/Pet/_Canvas/5000006.img/tedious/1` |
| `tedious/<n>/delay` | int | 3 | 8.6% | 150 … 1000 |  |
| `tedious/<n>/lt` | vector | 3 | 8.6% |  |  |
| `tedious/<n>/origin` | vector | 3 | 8.6% |  |  |
| `tedious/<n>/rb` | vector | 3 | 8.6% |  |  |
| `what` | property | 3 | 8.6% |  |  |
| `what/<n>` | canvas, uol | 3 | 8.6% | 0 … 3 |  |
| `what/<n>/_outlink` | string | 3 | 8.6% |  | `Item/Pet/_Canvas/5000027.img/what/0`, `Item/Pet/_Canvas/5000027.img/what/1`, `Item/Pet/_Canvas/5000027.img/what/2`, `Item/Pet/_Canvas/5000027.img/what/3`, `Item/Pet/_Canvas/5000029.img/what/0` |
| `what/<n>/delay` | int | 3 | 8.6% | 180 … 1000 |  |
| `what/<n>/lt` | vector | 3 | 8.6% |  |  |
| `what/<n>/origin` | vector | 3 | 8.6% |  |  |
| `what/<n>/rb` | vector | 3 | 8.6% |  |  |
| `angry_short` | property | 2 | 5.7% |  |  |
| `angry_short/<n>` | canvas, uol | 2 | 5.7% | 0 … 6 |  |
| `angry_short/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000028.img/angry/2`, `Item/Pet/_Canvas/5000028.img/angry/3`, `Item/Pet/_Canvas/5000028.img/angry/4`, `Item/Pet/_Canvas/5000028.img/angry/5`, `Item/Pet/_Canvas/5000028.img/angry/6` |
| `angry_short/<n>/delay` | int | 2 | 5.7% | 180 |  |
| `angry_short/<n>/lt` | vector | 2 | 5.7% |  |  |
| `angry_short/<n>/origin` | vector | 2 | 5.7% |  |  |
| `angry_short/<n>/rb` | vector | 2 | 5.7% |  |  |
| `belch` | property | 2 | 5.7% |  |  |
| `belch/<n>` | canvas | 2 | 5.7% |  |  |
| `belch/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000009.img/belch/0`, `Item/Pet/_Canvas/5000010.img/belch/0` |
| `belch/<n>/delay` | int | 2 | 5.7% | 4000 |  |
| `belch/<n>/lt` | vector | 2 | 5.7% |  |  |
| `belch/<n>/origin` | vector | 2 | 5.7% |  |  |
| `belch/<n>/rb` | vector | 2 | 5.7% |  |  |
| `change/<n>/z` | int | 2 | 5.7% | 0 |  |
| `charge` | property | 2 | 5.7% |  |  |
| `charge/<n>` | canvas, uol | 2 | 5.7% | 0 … 1 |  |
| `charge/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000016.img/charge/0`, `Item/Pet/_Canvas/5000016.img/charge/1`, `Item/Pet/_Canvas/5000032.img/charge/0`, `Item/Pet/_Canvas/5000032.img/charge/1` |
| `charge/<n>/delay` | int | 2 | 5.7% | 100 … 120 |  |
| `charge/<n>/lt` | vector | 2 | 5.7% |  |  |
| `charge/<n>/origin` | vector | 2 | 5.7% |  |  |
| `charge/<n>/rb` | vector | 2 | 5.7% |  |  |
| `dance` | property | 2 | 5.7% |  |  |
| `dance/<n>` | canvas, uol | 2 | 5.7% | 0 … 5 |  |
| `dance/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000017.img/dance/0`, `Item/Pet/_Canvas/5000017.img/dance/1`, `Item/Pet/_Canvas/5000017.img/dance/2`, `Item/Pet/_Canvas/5000017.img/dance/3`, `Item/Pet/_Canvas/5000017.img/dance/4` |
| `dance/<n>/delay` | int | 2 | 5.7% | 150 … 300 |  |
| `dance/<n>/lt` | vector | 2 | 5.7% |  |  |
| `dance/<n>/origin` | vector | 2 | 5.7% |  |  |
| `dance/<n>/rb` | vector | 2 | 5.7% |  |  |
| `deride` | property | 2 | 5.7% |  |  |
| `deride/<n>` | canvas, uol | 2 | 5.7% | 0 … 2 |  |
| `deride/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000009.img/deride/0`, `Item/Pet/_Canvas/5000009.img/deride/1`, `Item/Pet/_Canvas/5000010.img/deride/0`, `Item/Pet/_Canvas/5000010.img/deride/1` |
| `deride/<n>/delay` | int | 2 | 5.7% | 150 … 500 |  |
| `deride/<n>/lt` | vector | 2 | 5.7% |  |  |
| `deride/<n>/origin` | vector | 2 | 5.7% |  |  |
| `deride/<n>/rb` | vector | 2 | 5.7% |  |  |
| `hungry/<n>/z` | int | 2 | 5.7% | 0 |  |
| `ignore` | property | 2 | 5.7% |  |  |
| `ignore/<n>` | canvas | 2 | 5.7% |  |  |
| `ignore/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000022.img/ignore/0`, `Item/Pet/_Canvas/5000032.img/ignore/0` |
| `ignore/<n>/delay` | int | 2 | 5.7% | 300 … 3000 |  |
| `ignore/<n>/lt` | vector | 2 | 5.7% |  |  |
| `ignore/<n>/origin` | vector | 2 | 5.7% |  |  |
| `ignore/<n>/rb` | vector | 2 | 5.7% |  |  |
| `info/longRange` | int | 2 | 5.7% | 1 |  |
| `info/sweepForDrop` | int | 2 | 5.7% | 1 |  |
| `lonely` | property | 2 | 5.7% |  |  |
| `lonely/<n>` | canvas, uol | 2 | 5.7% | 0 … 1 |  |
| `lonely/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000007.img/hungry/0`, `Item/Pet/_Canvas/5000007.img/lonely/1`, `Item/Pet/_Canvas/5000015.img/lonely/0`, `Item/Pet/_Canvas/5000015.img/lonely/1`, `Item/Pet/_Canvas/5000015.img/lonely/2` |
| `lonely/<n>/delay` | int | 2 | 5.7% | 100 … 1300 |  |
| `lonely/<n>/lt` | vector | 2 | 5.7% |  |  |
| `lonely/<n>/origin` | vector | 2 | 5.7% |  |  |
| `lonely/<n>/rb` | vector | 2 | 5.7% |  |  |
| `love2` | property | 2 | 5.7% |  |  |
| `love2/<n>` | canvas, uol | 2 | 5.7% | 0 … 3 |  |
| `love2/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000022.img/love2/0`, `Item/Pet/_Canvas/5000022.img/love2/1`, `Item/Pet/_Canvas/5000022.img/love2/2`, `Item/Pet/_Canvas/5000022.img/love2/3`, `Item/Pet/_Canvas/5000022.img/love2/4` |
| `love2/<n>/delay` | int | 2 | 5.7% | 180 … 240 |  |
| `love2/<n>/lt` | vector | 2 | 5.7% |  |  |
| `love2/<n>/origin` | vector | 2 | 5.7% |  |  |
| `love2/<n>/rb` | vector | 2 | 5.7% |  |  |
| `nap/<n>/z` | int | 2 | 5.7% | 0 |  |
| `play` | property | 2 | 5.7% |  |  |
| `play/<n>` | canvas, uol | 2 | 5.7% | 0 … 1 |  |
| `play/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000008.img/play/0`, `Item/Pet/_Canvas/5000008.img/play/1`, `Item/Pet/_Canvas/5000012.img/play/0`, `Item/Pet/_Canvas/5000012.img/play/1` |
| `play/<n>/delay` | int | 2 | 5.7% | 240 … 250 |  |
| `play/<n>/lt` | vector | 2 | 5.7% |  |  |
| `play/<n>/origin` | vector | 2 | 5.7% |  |  |
| `play/<n>/rb` | vector | 2 | 5.7% |  |  |
| `poor` | property | 2 | 5.7% |  |  |
| `poor/<n>` | canvas | 2 | 5.7% |  |  |
| `poor/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000000.img/poor/0`, `Item/Pet/_Canvas/5000004.img/hungry/0` |
| `poor/<n>/delay` | int | 2 | 5.7% | 3000 |  |
| `poor/<n>/lt` | vector | 2 | 5.7% |  |  |
| `poor/<n>/origin` | vector | 2 | 5.7% |  |  |
| `poor/<n>/rb` | vector | 2 | 5.7% |  |  |
| `rest0/<n>/z` | int | 2 | 5.7% | 0 |  |
| `sad` | property | 2 | 5.7% |  |  |
| `sad/<n>` | canvas | 2 | 5.7% |  |  |
| `sad/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000013.img/sad/0`, `Item/Pet/_Canvas/5000025.img/cry/0` |
| `sad/<n>/delay` | int | 2 | 5.7% | 3000 |  |
| `sad/<n>/lt` | vector | 2 | 5.7% |  |  |
| `sad/<n>/origin` | vector | 2 | 5.7% |  |  |
| `sad/<n>/rb` | vector | 2 | 5.7% |  |  |
| `shock` | property | 2 | 5.7% |  |  |
| `shock/<n>` | canvas, uol | 2 | 5.7% | 0 … 1 |  |
| `shock/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000024.img/shock/0`, `Item/Pet/_Canvas/5000024.img/shock/1`, `Item/Pet/_Canvas/5000026.img/shock/0` |
| `shock/<n>/lt` | vector | 2 | 5.7% |  |  |
| `shock/<n>/origin` | vector | 2 | 5.7% |  |  |
| `shock/<n>/rb` | vector | 2 | 5.7% |  |  |
| `sit/<n>/z` | int | 2 | 5.7% | 0 |  |
| `sulk` | property | 2 | 5.7% |  |  |
| `sulk/<n>` | canvas | 2 | 5.7% |  |  |
| `sulk/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000008.img/sulk/0`, `Item/Pet/_Canvas/5000012.img/sulk/0` |
| `sulk/<n>/delay` | int | 2 | 5.7% | 4000 |  |
| `sulk/<n>/lt` | vector | 2 | 5.7% |  |  |
| `sulk/<n>/origin` | vector | 2 | 5.7% |  |  |
| `sulk/<n>/rb` | vector | 2 | 5.7% |  |  |
| `surprise` | property | 2 | 5.7% |  |  |
| `surprise/<n>` | canvas, uol | 2 | 5.7% | 1 … 3 |  |
| `surprise/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000029.img/surprise/0`, `Item/Pet/_Canvas/5000029.img/surprise/1`, `Item/Pet/_Canvas/5000029.img/surprise/2`, `Item/Pet/_Canvas/5000029.img/surprise/3`, `Item/Pet/_Canvas/5000029.img/surprise/4` |
| `surprise/<n>/delay` | int | 2 | 5.7% | 300 … 1000 |  |
| `surprise/<n>/lt` | vector | 2 | 5.7% |  |  |
| `surprise/<n>/origin` | vector | 2 | 5.7% |  |  |
| `surprise/<n>/rb` | vector | 2 | 5.7% |  |  |
| `transform` | property | 2 | 5.7% |  |  |
| `transform/<n>` | canvas | 2 | 5.7% |  |  |
| `transform/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000029.img/transform/0`, `Item/Pet/_Canvas/5000029.img/transform/1`, `Item/Pet/_Canvas/5000029.img/transform/2`, `Item/Pet/_Canvas/5000029.img/transform/3`, `Item/Pet/_Canvas/5000029.img/transform/4` |
| `transform/<n>/delay` | int | 2 | 5.7% | 75 … 500 |  |
| `transform/<n>/lt` | vector | 2 | 5.7% |  |  |
| `transform/<n>/origin` | vector | 2 | 5.7% |  |  |
| `transform/<n>/rb` | vector | 2 | 5.7% |  |  |
| `wait` | property | 2 | 5.7% |  |  |
| `wait/<n>` | canvas | 2 | 5.7% |  |  |
| `wait/<n>/_outlink` | string | 2 | 5.7% |  | `Item/Pet/_Canvas/5000013.img/wait/0`, `Item/Pet/_Canvas/5000013.img/wait/1`, `Item/Pet/_Canvas/5000025.img/wait/0`, `Item/Pet/_Canvas/5000025.img/wait/1` |
| `wait/<n>/delay` | int | 2 | 5.7% | 200 … 2800 |  |
| `wait/<n>/lt` | vector | 2 | 5.7% |  |  |
| `wait/<n>/origin` | vector | 2 | 5.7% |  |  |
| `wait/<n>/rb` | vector | 2 | 5.7% |  |  |
| `alert/<n>/z` | int | 1 | 2.9% | 0 |  |
| `angry_short/<n>/z` | int | 1 | 2.9% | 0 |  |
| `arrogance` | property | 1 | 2.9% |  |  |
| `arrogance/<n>` | canvas | 1 | 2.9% |  |  |
| `arrogance/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000024.img/arrogance/0`, `Item/Pet/_Canvas/5000024.img/arrogance/1`, `Item/Pet/_Canvas/5000024.img/arrogance/4`, `Item/Pet/_Canvas/5000024.img/arrogance/5`, `Item/Pet/_Canvas/5000024.img/arrogance/6` |
| `arrogance/<n>/delay` | int | 1 | 2.9% | 110 … 550 |  |
| `arrogance/<n>/lt` | vector | 1 | 2.9% |  |  |
| `arrogance/<n>/origin` | vector | 1 | 2.9% |  |  |
| `arrogance/<n>/rb` | vector | 1 | 2.9% |  |  |
| `arrogance/<n>/z` | int | 1 | 2.9% | 0 |  |
| `bewildered` | property | 1 | 2.9% |  |  |
| `bewildered/<n>` | canvas, uol | 1 | 2.9% | 0 … 2 |  |
| `bewildered/<n>/_outlink` | string | 1 | 2.9% |  |  |
| `bewildered/<n>/delay` | int | 1 | 2.9% | 150 |  |
| `bewildered/<n>/lt` | vector | 1 | 2.9% |  |  |
| `bewildered/<n>/origin` | vector | 1 | 2.9% |  |  |
| `bewildered/<n>/rb` | vector | 1 | 2.9% |  |  |
| `birdeye` | property | 1 | 2.9% |  |  |
| `birdeye/<n>` | canvas | 1 | 2.9% |  |  |
| `birdeye/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000018.img/birdeye/0` |
| `birdeye/<n>/delay` | int | 1 | 2.9% | 2000 |  |
| `birdeye/<n>/lt` | vector | 1 | 2.9% |  |  |
| `birdeye/<n>/origin` | vector | 1 | 2.9% |  |  |
| `birdeye/<n>/rb` | vector | 1 | 2.9% |  |  |
| `blush` | property | 1 | 2.9% |  |  |
| `blush/<n>` | canvas | 1 | 2.9% |  |  |
| `blush/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000014.img/blush/0` |
| `blush/<n>/delay` | int | 1 | 2.9% | 4000 |  |
| `blush/<n>/lt` | vector | 1 | 2.9% |  |  |
| `blush/<n>/origin` | vector | 1 | 2.9% |  |  |
| `blush/<n>/rb` | vector | 1 | 2.9% |  |  |
| `burp` | property | 1 | 2.9% |  |  |
| `burp/<n>` | canvas, uol | 1 | 2.9% | 0 … 3 |  |
| `burp/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000026.img/burp/0`, `Item/Pet/_Canvas/5000026.img/burp/1`, `Item/Pet/_Canvas/5000026.img/burp/2`, `Item/Pet/_Canvas/5000026.img/burp/3` |
| `burp/<n>/delay` | int | 1 | 2.9% | 300 |  |
| `burp/<n>/lt` | vector | 1 | 2.9% |  |  |
| `burp/<n>/origin` | vector | 1 | 2.9% |  |  |
| `burp/<n>/rb` | vector | 1 | 2.9% |  |  |
| `burp/<n>/z` | int | 1 | 2.9% | 0 |  |
| `change1` | property | 1 | 2.9% |  |  |
| `change1/<n>` | uol, canvas | 1 | 2.9% | 6 … 21 | `../change/0` |
| `change1/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000016.img/change/1`, `Item/Pet/_Canvas/5000016.img/change1/2`, `Item/Pet/_Canvas/5000016.img/change1/3`, `Item/Pet/_Canvas/5000016.img/change1/4`, `Item/Pet/_Canvas/5000016.img/change1/5` |
| `change1/<n>/delay` | int | 1 | 2.9% | 130 |  |
| `change1/<n>/lt` | vector | 1 | 2.9% |  |  |
| `change1/<n>/origin` | vector | 1 | 2.9% |  |  |
| `change1/<n>/rb` | vector | 1 | 2.9% |  |  |
| `charming` | property | 1 | 2.9% |  |  |
| `charming/<n>` | canvas | 1 | 2.9% |  |  |
| `charming/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000017.img/charming/0`, `Item/Pet/_Canvas/5000017.img/charming/1`, `Item/Pet/_Canvas/5000017.img/charming/2`, `Item/Pet/_Canvas/5000017.img/charming/3`, `Item/Pet/_Canvas/5000017.img/charming/4` |
| `charming/<n>/delay` | int | 1 | 2.9% | 150 … 1200 |  |
| `charming/<n>/lt` | vector | 1 | 2.9% |  |  |
| `charming/<n>/origin` | vector | 1 | 2.9% |  |  |
| `charming/<n>/rb` | vector | 1 | 2.9% |  |  |
| `christmas` | property | 1 | 2.9% |  |  |
| `christmas/<n>` | canvas, uol | 1 | 2.9% | 0 … 3 |  |
| `christmas/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000015.img/christmas/0`, `Item/Pet/_Canvas/5000015.img/christmas/1`, `Item/Pet/_Canvas/5000015.img/christmas/2` |
| `christmas/<n>/delay` | int | 1 | 2.9% | 200 |  |
| `christmas/<n>/lt` | vector | 1 | 2.9% |  |  |
| `christmas/<n>/origin` | vector | 1 | 2.9% |  |  |
| `christmas/<n>/rb` | vector | 1 | 2.9% |  |  |
| `cry/<n>/z` | int | 1 | 2.9% | 0 |  |
| `cry/zigzag` | int | 1 | 2.9% | 1 |  |
| `cute` | property | 1 | 2.9% |  |  |
| `cute/<n>` | canvas | 1 | 2.9% |  |  |
| `cute/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000015.img/cute/0`, `Item/Pet/_Canvas/5000015.img/cute/1`, `Item/Pet/_Canvas/5000015.img/cute/2`, `Item/Pet/_Canvas/5000015.img/cute/3` |
| `cute/<n>/delay` | int | 1 | 2.9% | 150 … 1000 |  |
| `cute/<n>/lt` | vector | 1 | 2.9% |  |  |
| `cute/<n>/origin` | vector | 1 | 2.9% |  |  |
| `cute/<n>/rb` | vector | 1 | 2.9% |  |  |
| `eye` | property | 1 | 2.9% |  |  |
| `eye/<n>` | canvas, uol | 1 | 2.9% | 0 … 3 |  |
| `eye/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000003.img/eye/0`, `Item/Pet/_Canvas/5000003.img/eye/1`, `Item/Pet/_Canvas/5000003.img/eye/2`, `Item/Pet/_Canvas/5000003.img/eye/3` |
| `eye/<n>/delay` | int | 1 | 2.9% | 150 … 350 |  |
| `eye/<n>/lt` | vector | 1 | 2.9% |  |  |
| `eye/<n>/origin` | vector | 1 | 2.9% |  |  |
| `eye/<n>/rb` | vector | 1 | 2.9% |  |  |
| `fight` | property | 1 | 2.9% |  |  |
| `fight/<n>` | canvas, uol | 1 | 2.9% | 0 … 1 |  |
| `fight/<n>/_outlink` | string | 1 | 2.9% |  | `Item/Pet/_Canvas/5000016.img/fight/0`, `Item/Pet/_Canvas/5000016.img/fight/1` |
| `fight/<n>/delay` | int | 1 | 2.9% | 100 |  |
| `fight/<n>/lt` | vector | 1 | 2.9% |  |  |
| `fight/<n>/origin` | vector | 1 | 2.9% |  |  |
| `fight/<n>/rb` | vector | 1 | 2.9% |  |  |
| `front` | property | 1 | 2.9% |  |  |
<!-- /generated:schema -->
