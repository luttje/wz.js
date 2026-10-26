# Reactor tree

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

`Reactor/<id 7 digits>.img` (26 in Classic World). Statistics:
[generated/reactor.md](generated/reactor.md). Reader: `src/model/reactor.ts`.
Example: `Reactor/0000001.img` (wooden box).

| Node | Content |
|---|---|
| `info/info` or `info/name` | Name ("wooden box", "Evening Primrose"). |
| `info/link` | Another reactor whose sprites this one uses (7 reactors). |
| `info/removeInFieldSet` | Raw flag (6 reactors). |
| `action` | Script name, when the reactor runs one. |
| `<state>` | Numbered states, from 0. |
| `<state>/<n>` | Idle frames of the state. |
| `<state>/hit/<n>` | Animation played when it is hit (frames often fade with `a0`/`a1`). |
| `<state>/event/<n>` | Transitions: `type`, `state` (the next state), plus type-specific fields. |

Event types seen:

| `type` | Count | Meaning | Fields |
|---|---|---|---|
| 0 | 54 | Hit by an attack. | — |
| 2 | 3 | `UNVERIFIED` (witch's herb `0000004`). | — |
| 100 | 9 | An item dropped inside the area. | `0` item ID, `1` count, `lt`/`rb` area. |

A state without events is final. Placements: `Map/Map/…/<map>.img/reactor/<n>` (`id`, `x`,
`y`, `f`, `name`, `reactorTime`). Drops aren't in the client.
