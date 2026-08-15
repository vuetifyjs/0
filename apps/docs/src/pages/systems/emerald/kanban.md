---
title: EmKanban - Emerald Kanban Board for Vue
meta:
- name: description
  content: Emerald's kanban board — columns of draggable cards with pointer and keyboard moves, live announcements, and a drop indicator. Composed on Vuetify0's createKanban and useDragDrop.
- name: keywords
  content: emerald kanban, vue kanban, drag and drop board vue, accessible kanban, vuetify0 kanban, paper emerald
features:
  category: Component
  label: 'C: EmKanban'
  level: 2
  renderless: false
  order: 15
related:
  - /systems/emerald
  - /composables/data/create-kanban
  - /composables/system/use-drag-drop
---

# EmKanban

<DocsPageFeatures :frontmatter />

A drag-and-drop board — columns of cards that reorder and move across columns by pointer or keyboard, with the board owning the state and announcing every move.

## Usage

`EmKanban` is the board; each `EmKanbanColumn` is one column, and the cards inside it come from the column's `cards` prop. That prop is a **seed**: the column onboards the array once when it mounts, and from then on the board's internal registry is the source of truth — dragging a card mutates the board, not your array. When another store needs to follow along, listen to the `move` event, which fires with `{ id, from, to, fromIndex, toIndex }` for every drop, including a reorder inside one column.

The column's default slot is the card body. It is scoped — `v-slot="{ card }"` hands you the card's ticket, and `card.value` is the value you seeded — so one slot renders every card in the column and the board stays a pure layout concern. While a drag is over a column, the board paints a 2px indicator bar in the slot the card will land in.

::: ds-example
/systems/emerald/kanban/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmKanban, EmKanbanColumn } from '@paper/emerald'
</script>

<template>
  <EmKanban>
    <EmKanbanColumn />
  </EmKanban>
</template>
```

`EmKanbanCard` exists and is exported, but you never write it — each column renders one around your slot content per card.

## Composed on v0

`EmKanban` instantiates two v0 composables at the root and shares both with its parts through context under the `emerald:kanban` namespace: [createKanban](/composables/data/create-kanban), which owns the columns registry and the `transfer` primitive, and [useDragDrop](/composables/system/use-drag-drop), which owns the draggables, the drop zones, and the drag lifecycle through its default pointer and keyboard adapters.

The split follows from that. Each `EmKanbanColumn` registers itself into `kanban.columns` and registers its card list as a vertical drop zone that accepts `card` drags; each card registers a draggable. From there v0 does the mechanics — hit-testing the pointer against zones, resolving which slot a drop lands in from the zone's geometry, and gating everything on `disabled` — while Emerald owns everything a design system should: the DOM and its list semantics, the drop-indicator bar (drawn from the zone's `indicator` rect), the polite live region and its messages, returning focus to a card after a keyboard drop, and the `move` event.

One correction lives in Emerald rather than v0, and it is worth knowing about if you build your own board: on a same-column drop the zone resolves its index against a stack that still contains the dragged card, while `transfer` removes before inserting — so the column subtracts one when the card moves down its own column. The reactive card iteration comes from v0 too, via [useProxyRegistry](/composables/reactivity/use-proxy-registry).

## Examples

::: ds-example
/systems/emerald/kanban/tones

### Tones and notes

`tone` colors the column's top rule from Emerald's severity palette — `neutral`, `primary`, `secondary`, `info`, `alert`, `danger` — and `note` adds a one-line description under the title. Both are presentation only: a tone changes no behavior, and the same values mean the same things they mean on every other Emerald surface, so a board's colors stay legible next to the rest of the app.

Unlike `cards`, these props stay live. The column watches `title`, `note` and `tone` and pushes changes into its registry entry, so renaming a column or escalating its tone at runtime works — it is only the card seed that is read once.

The count bubble beside each title is automatic and reads from the registry, so it tracks drags and runtime registrations without any wiring.
:::

::: ds-example
/systems/emerald/kanban/move

### Reacting to moves

The board emits `move` after every successful drop with a complete description of what happened: the card's id, the source and destination column ids, and the index it left from and landed at. Same-column reorders emit too — a board that only synced cross-column moves would silently lose ordering.

The payload carries ids, not titles, because ids are what your store keys on. When you do want the human-readable side, the board's template ref exposes the underlying `kanban` context — `board.value.kanban.columns.get(payload.to)` returns the column ticket, and its `value` holds the `title`, `note` and `tone` you passed in. The same context is the door to runtime mutation: registering a card into a column's `items` from an "add card" action, as opposed to re-rendering the seed, is exactly what it is for.

Note the extra hop on the ref: the context is exposed under a `kanban` key — `board.value.kanban.columns`, not `board.value.columns` — alongside `dnd` and `announce`.
:::

::: ds-example
/systems/emerald/kanban/disabled

### Disabling the board

`disabled` freezes the board in both directions at once: drags can no longer start — by pointer or by keyboard — and transfers no-op at the core, so nothing moves even programmatically through `transfer`. The root gains `data-disabled`, which Emerald's stylesheet uses to drop the grab cursor on every card.

What `disabled` does not do is remove the cards from the tab order. They keep their `tabindex` and their keyboard-instructions description, so a keyboard user can still reach and read the board — they just cannot pick anything up. If a frozen board should also explain itself, say why near the control that froze it; the board itself announces nothing when a pick-up is refused.
:::

## Props

### EmKanban

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `'Board'` | Accessible name for the board's list element |
| `disabled` | `boolean` | `false` | Freezes the board — no drags start and transfers no-op |
| `namespace` | `string` | `'emerald:kanban'` | Context the parts resolve against. Only needed when nesting boards |

The default slot is the columns. `move` is the only event, firing after every successful drop with `EmKanbanMovePayload` — `{ id, from, to, fromIndex, toIndex }`, where `from` and `to` are column ids.

The template ref exposes exactly `{ kanban, dnd, announce }`: the [createKanban](/composables/data/create-kanban) context (columns registry plus `transfer`), the [useDragDrop](/composables/system/use-drag-drop) context, and the function that writes to the board's live region. Use `kanban` for runtime mutation — `kanban.columns.get(id)` for a column ticket, `column.items.register({ value })` to add a card.

### EmKanbanColumn

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Column heading. Required; also names the column in announcements |
| `note` | `string` | — | One-line description under the title |
| `tone` | `'neutral' \| 'primary' \| 'secondary' \| 'info' \| 'alert' \| 'danger'` | — | Severity accent on the column's top rule |
| `cards` | `{ id?: ID, value: T }[]` | `[]` | Seed cards, onboarded **once** when the column mounts. Later changes to the array are ignored |
| `id` | `ID` | auto-generated | Column id — the value the `move` payload's `from` / `to` refer to |
| `namespace` | `string` | `'emerald:kanban'` | Context to resolve against |

The component is generic over `T`, the card value type. The default slot renders each card's body and is scoped to `{ card }` — an `EmKanbanCardTicket<T>` whose `value` is what you seeded. `title`, `note` and `tone` are reactive; `cards` is not.

### EmKanbanCard

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `card` | `EmKanbanCardTicket<T>` | — | The ticket to register as a draggable. Required |
| `namespace` | `string` | `'emerald:kanban'` | Context to resolve against |

Internal part — the column renders one per card around your slot content. It is exported for advanced composition, but a board authored from `EmKanban` and `EmKanbanColumn` never writes it.

## Accessibility

The board is a `role="list"` named by `label`; each column is a `role="listitem"` section labelled by its own heading — the title renders as an `h2` — and the cards sit in a nested list of their own. Each card is a focusable `article` with `tabindex="0"`, described by a visually hidden instructions node: "Press space or enter to pick up a card, the arrow keys to move it, space or enter to drop it, and escape to cancel." The drop-indicator bar is `aria-hidden`.

### Keyboard

Drag-and-drop is fully keyboard-operable through v0's keyboard adapter, which listens at the document level and acts on the focused card:

| Key | Behavior |
|-----|----------|
| Space, Enter | Pick up the focused card; drop it when one is being carried |
| Arrow keys | Nudge the carried card 16px in that direction |
| Escape | Cancel — the card stays where it was |

Two honest caveats. The arrow keys move a drag *point*, not a slot: the carried card travels in 16px steps, so crossing a full card or a column boundary takes several presses — the indicator bar shows where the card currently stands, and the live region speaks only at pick-up, drop, and cancel, not on every step. And keys are ignored while a modifier is held or while focus sits in an editable control, so the board never swallows shortcuts or typing.

After a keyboard drop the card remounts under its new column and takes focus back, so the reader lands on the card they just moved rather than at the top of the document. A pointer drop does not move focus.

### Announcements

The board carries one polite live region (`role="status"`), and every drag milestone writes to it: picking a card up announces its position and column, a drop announces the destination and new position — "Moved card to Doing, position 2 of 3" — and a cancel announces that the card stayed put. Arrow-key steps in between are silent; position mid-drag is conveyed visually by the indicator bar. The `announce` function on the template ref writes to the same region, so custom actions (an "add card" button, a programmatic transfer) can speak through the board instead of adding a second live region beside it.

### Card naming

The card `article` has no accessible-name wiring of its own — its name comes from its content, i.e. from what you render in the column's slot. Keep a short text line first in the card so a reader hears something meaningful when a card takes focus; a card that leads with icon-only content is an unnamed stop in the tab order.

### Disabled

`disabled` stops drags and transfers but deliberately leaves the cards focusable and described. The board does not announce refused pick-ups, so pair a frozen board with visible text explaining why it is frozen.
