# Mob tree

> [!WARNING]
> This content was AI-generated and must be reviewed for accuracy and completeness before use.

Monster images `Mob/<id 7 digits>.img` are stored only in the `Packs/Mob_00000.ms` pack (117
images). Pixels for 79 of them are in `Mob/_Canvas/<id>.img`. Field statistics:
[generated/mob.md](generated/mob.md).

Examples: `Mob/0000002.img` (Snail, inline pixels), `Mob/0000003.img` (Blue Snail,
`_inlink`), `Mob/0000026.img` (Fairy 2, borrows sprites through `info/link` = 25).

## `info`

| Field | Type | Seen | Meaning |
|---|---|---|---|
| `level` | int | 100% | Monster level (1–200). |
| `maxHP`, `maxMP` | int | 100% | Hit points (30 … 2,100,000,000) and mana. |
| `exp` | int | 93% | Experience given (0 … 6000). |
| `PADamage`, `MADamage` | int | 100% | Physical / magic attack. |
| `PDDamage`, `MDDamage` | int | 100% | Physical / magic defence. |
| `acc`, `eva` | int | 100% | Accuracy, avoidability. |
| `speed`, `flySpeed` | int | 88%, 5% | Movement speed offset (−70 … 35); negative is slower. Walking speed is linear in `speed`: `mobBaseSpeed × (speed − mobSpeedZero) / −mobSpeedZero` px/s, with `mobBaseSpeed` 178 and `mobSpeedZero` −79 fitted to a Blue Mushroom (+5, about 190 px/s) and a Snail (−65, about 31 px/s) in Classic World (`UNVERIFIED` beyond those two). |
| `bodyAttack` | int | 100% | 1 = touching the monster hurts. |
| `pushed` | int | 100% | Damage threshold for knock-back (`UNVERIFIED`). |
| `undead`, `boss`, `firstAttack`, `invincible` | int (0/1) | | Flags (`firstAttack`: attacks on sight; `boss`: shows the boss HP bar, `UI/BossMobHP.img`). No mob has `hpTagColor`/`hpTagBgcolor`. |
| `elemAttr` | string | 65% | Elemental attributes: letter + digit pairs, e.g. `H2L2S3`. Letters seen: F, I, L, S, H, D, P. Readable as Fire, Ice, Lightning, Poison, Holy, Dark, Physical; digits 1/2/3 read as immune/resistant/weak. Letter and level meanings are `UNVERIFIED` against gameplay. |
| `link` | string | 32% | ID of the mob whose animations this one uses. The linking mob usually has only `info`. |
| `mobType` | string/int | 14% | e.g. `1N`, `7N` (`UNVERIFIED`). |
| `category` | int | 9% | 1 … 7 (`UNVERIFIED`). |
| `summonType`, `hideLevel`, `fs` | | | `fs` is always 10 (float). |
| `noFlip` | int | 1% | 1 = never draw mirrored; the mob still walks both ways. Only the tutorial Jr. Sentinel (`0000001`), whose frames include a Ctrl key hint. |
| `hpRecovery`, `mpRecovery` | int | ~19% | Regeneration amounts. |
| `revive/<n>` | int | 2% | Mob IDs spawned on death. |
| `removeAfter` | int | 1% | Seconds before the mob disappears. |
| `attack/<n>` | property | 20% | Attack definitions: `action` (which `attack<n>` animation), `type`, `attackRatio`, `afterDelay`, `conMP`, `magic`, `elemAttr`, `disease`, `level`, `jumpAttack`. |
| `skill/<n>` | property | 14% | Mob skills: `skill` (ID in `Skill/MobSkill`), `level`, `action`, `effectAfter`, `afterDelay`. |

## Animations

Every other top-level child is an animation: `stand`, `move`, `fly`, `jump`, `hit1`, `die1`,
`attack1…3`, `skill1…2`, `revive`. Frames are numbered canvases (see `rendering.md`) with:

| Frame field | Meaning |
|---|---|
| `origin` | Anchor point: the canvas is drawn at `position − origin`. |
| `delay` | Frame duration in ms (string or int). |
| `lt`, `rb` | Body box corners relative to the origin (e.g. Snail: (−18,−26)–(19,0)). |
| `head` | Point above the head (name tag / effects). |
| `z` | Layer, always 0 for mobs. |
| `_hash` | 64 hex digits; `UNVERIFIED` (probably a content hash of the pixels). |
| `_inlink` / `_outlink` | Where the pixels are (see `wz-format.md`). |

Animation-level fields: `zigzag` = 1 plays frames forward then backward (Snail `move`).

### Moving: walk, jump, fly

Which animations a monster has is the only thing that says how it moves; no `info` field
does. MeowDB's "Stays on its floor" / "Jumps between floors" / "Flies" follow these exactly.

| Has | Moves | Monsters (with `info/link` followed) |
|---|---|---|
| `move` | Walks its floor and turns at ledges and walls. | Snails, Stumps, Green and Horny Mushroom, Octopus, Mano, … |
| `move` and `jump` | Walks, and hops. A hop comes down on the first floor it crosses: on its own platform (floors linked through `prev` / `next`, and across a wall a step it can hop both ways), or across a gap or off a ledge onto another floor no further below than it jumps high (wandering, inside its `rx0`…`rx1`). A hop that wouldn't stays on its platform. Chasing a player below it, it hops off a ledge onto any floor down to theirs. Walking towards a step, it hops it, taking off where it clears the wall and lands just past it; a step higher than it jumps turns it round. How far it gets depends on the map, not the monster: The Cave of Evil Eye's short, stacked floors are a hop apart, most hunting grounds' are not. | 42 of 98: Slime, Pig, Orange, Blue, Zombie and Rotten Mushroom, the boars, eyes and Lupins, King Slime, the Mushmoms, … |
| `fly` only | Flies (`info/flySpeed` instead of `speed`): across, diagonally or straight up and down, switching at random every few seconds, between `rx0`…`rx1` and within a band of heights around its spawn point; chasing, it climbs or sinks to the player's height. The band and timings aren't in the data. | Stirge, Golden Stirge, Super Stirge, … |

`jump` is always a single frame, held while in the air: 22 of the 28 images that own one
reuse a `move` (or `stand`) frame through `_inlink`, and most have no `delay`. Jump height,
how often a monster hops and the client's physics constants aren't in the data (there is
no `Physics.img`), so a game has to tune them. `info/attack/<n>/jumpAttack` = 1 is set only on the Mushmoms' and
King Slime's attack, the jump stomp (`UNVERIFIED`); it doesn't decide whether they hop.

## Sounds

`Sound/Mob.img/<id 7 digits>/<name>` — 195 entries, MP3. Every entry has `Damage` and
`Die`; other names seen:

| Name | Entries | Meaning |
|---|---|---|
| `Damage` | 195 | The monster is hit. |
| `Die` | 195 | The monster dies. |
| `Attack1` … `Attack3` | 83, 10, 2 | Attack `n` is used (matches `attack<n>` / `info/attack/<n-1>`, `UNVERIFIED`). |
| `CharDam1` … `CharDam3` | 72, 9, 2 | The character is hit by attack `n` (`UNVERIFIED`). |
| `Skill1` … `Skill4` | 18, 1, 1, 1 | Skill `n` is used (`UNVERIFIED`). |

### Shared sounds

Many entries don't hold audio but borrow another monster's: their children are UOLs such as
`../0000002/Damage`. Blue Snail (3) and Red Snail (5) both play the Snail's (2) `Damage`
and `Die`. Of 589 sound nodes, 228 are links: 222 point into a *different* monster's
entry, and 6 to a sibling in the same entry (Fairy `0000025`'s `Attack1` → its own
`Skill1`). 55 entries are made only of links; 44 mix their own audio with links.

This is independent of `info/link`: the snails have their own sprites but share sounds,
and 15 monsters with `info/link` have a sound entry whose links point to some other
monster than their sprite source.

19 monsters have no sound entry at all; 16 of those have an `info/link` to a monster that
does. Whether the client then plays the linked monster's sounds is `UNVERIFIED`.
