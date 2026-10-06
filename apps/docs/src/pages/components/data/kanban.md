---
title: Kanban - Accessible Drag-and-Drop Board
meta:
- name: description
  content: Headless kanban board for Vue 3 with per-column v-model, pointer drag, keyboard pick-up and move, accept predicates, and live-region announcements. Built on createKanban.
- name: keywords
  content: kanban, board, drag and drop, sortable, columns, keyboard drag, accessible, Vue 3, headless
features:
  category: Component
  label: 'C: Kanban'
  github: /components/Kanban/
  renderless: false
  level: 2
related:
  - /composables/data/create-kanban
  - /composables/data/create-sortable
  - /composables/system/use-drag-drop
---

# Kanban

Headless board of movable items in columns. Each column binds its items with `v-model`; items move by pointer drag or by keyboard, and every move writes the new order back.

<DocsPageFeatures :frontmatter />

## Usage

Bind each column's item array with `v-model` and render items from the column's `items` slot prop. Style state through data attributes — `data-state` on items, `data-over` on lists.

::: gn-example
/components/kanban/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Kanban } from '@vuetify/v0'
</script>

<template>
  <Kanban.Root>
    <Kanban.Column>
      <Kanban.List>
        <Kanban.Item />
      </Kanban.List>
    </Kanban.Column>

    <Kanban.Instructions />

    <Kanban.LiveRegion />
  </Kanban.Root>
</template>
```

| Part | Role |
|------|------|
| `Kanban.Root` | Owns the [createKanban](/composables/data/create-kanban) board and the pointer [useDragDrop](/composables/system/use-drag-drop) context. Emits `move` |
| `Kanban.Column` | Registers a column. `v-model` is the column's item array; `disabled` and `accept` gate moves |
| `Kanban.List` | Drop zone for one column's items. Must be the direct parent of its `Kanban.Item` elements |
| `Kanban.Item` | A movable item, identified by `value` |
| `Kanban.Instructions` | Keyboard instructions every item references with `aria-describedby` |
| `Kanban.LiveRegion` | Polite live region for move announcements |

## Recipes

### WIP limit and locked column

`accept(value, from, index)` vetoes incoming cross-column moves and must be synchronous; `disabled` freezes a column. Doing refuses a third item and Shipped is locked. A pointer drop on either is rejected and announced; the keyboard target skips them — once Doing is full, ArrowRight from Backlog lands on Review. The pending target is styled from `data-target` on the column and list and `data-drop` on the neighbouring item.

::: gn-example
/components/kanban/wip-limit
:::

### Observing moves

`@move` fires once per drop with `{ value, from, to, fromIndex, toIndex }` — pointer or keyboard, same-column reorder or cross-column transfer. Arrow keys only move a preview, and Escape discards it, so neither emits.

::: gn-example
/components/kanban/move-log
:::

### Item identity

The value bound on `Kanban.Item` is the identity the board tracks. It must equal (`===`) an entry of the parent column's `v-model` array, and every value on the board must be unique. Objects work by reference; strings and numbers work when they are unique. Key the `v-for` by a stable id.

```vue
<template>
  <Kanban.Column v-slot="{ items }" v-model="todo" label="Todo">
    <Kanban.List>
      <Kanban.Item
        v-for="card in items"
        :key="card.id"
        :label="card.title"
        :value="card"
      >
        {{ card.title }}
      </Kanban.Item>
    </Kanban.List>
  </Kanban.Column>
</template>
```

### Changing the board from code

The bound arrays are the source of truth. Push, splice, or replace them and the board reconciles — new values register, removed values unregister, and a reordered array reorders the column. There is no imperative move API on the component; moving an item between two arrays yourself is a move.

```ts
todo.value.push({ id: 6, title: 'New card' })
todo.value = todo.value.filter(card => card.id !== 2)
```

### Swimlanes

`orientation="vertical"` stacks columns vertically and lays items out horizontally. Keyboard arrows follow the layout: Left and Right move within a column, Up and Down move between columns. Lists expose `data-orientation` for styling.

### Keyboard drop preview

While an item is picked up, the arrow keys move a drop target instead of the item, and the board is not touched until Space or Enter commits one move. Style the pending target from data attributes: `data-target` on the target `Kanban.Column` and `Kanban.List`, and `data-drop="before"` on the item the dropped one would land before — or `data-drop="after"` on the last item when it would land at the end. An empty target list carries only `data-target`.

```vue
<template>
  <Kanban.List class="data-[target]:bg-surface-tint">
    <Kanban.Item
      v-for="card in items"
      :key="card.id"
      class="data-[drop=after]:border-b-primary data-[drop=before]:border-t-primary"
      :value="card"
    >
      {{ card.title }}
    </Kanban.Item>
  </Kanban.List>
</template>
```

### Disabling

`disabled` on `Kanban.Root` freezes the whole board, on `Kanban.Column` freezes moves into, out of, and within that column, and on `Kanban.Item` pins one item. Disabled items drop out of the tab order.

## Accessibility

Moves never require a pointer. Each item is focusable and keyboard-movable, every move is announced through `Kanban.LiveRegion`, and `Kanban.Instructions` tells screen-reader users how to start. Render both, visually hidden — without them moves still work but are silent.

### Keyboard

| Key | Action |
|-----|--------|
| Space / Enter | Pick up the focused item; when picked up, move it to the drop target |
| ArrowUp / ArrowDown | Move the drop target one slot within its column (between columns for `orientation="vertical"`) |
| ArrowLeft / ArrowRight | Move the drop target to the previous / next column that can take the item, keeping its index when it fits (within its column for `orientation="vertical"`). Disabled columns and columns whose `accept` refuses the item are skipped. RTL-aware |
| Home / End | Move the drop target to the start / end of its column |
| Escape | Discard the drop target; nothing moves |
| Tab | Discard the drop target and move focus on |

Each target step is announced. Focus follows the item: when a drop re-renders it in another column, the new element takes focus.

### ARIA

| Part | Attribute | Value |
|------|-----------|-------|
| Root | `role` | `group` |
| Root | `aria-label` | `label` prop, or a locale default |
| Column | `role` | `group` |
| Column | `aria-label` | `label` prop |
| List | `role` | `list` |
| Item | `role` | `listitem` |
| Item | `aria-roledescription` | Locale default, `draggable item` |
| Item | `aria-posinset` / `aria-setsize` | Position within the column |
| Item | `aria-describedby` | The `Kanban.Instructions` element, when mounted |
| Item | `aria-disabled` | `true` when the item, its column, or the board is disabled |
| LiveRegion | `role` / `aria-live` | `status` / `polite` |

### Data Attributes

| Part | Attribute | Values |
|------|-----------|--------|
| Root | `data-orientation` | `horizontal` \| `vertical` |
| Root, Column, List, Item | `data-disabled` | Present when disabled |
| List | `data-over` | Present while an accepted pointer drag hovers the list |
| Column, List | `data-target` | Present while a pending keyboard drop would land here |
| List | `data-orientation` | Axis the list's items flow along |
| Item | `data-state` | `grabbed` (keyboard) \| `dragging` (pointer) \| `idle` |
| Item | `data-drop` | `before` \| `after` — the pending keyboard drop lands on this side of the item |

## FAQ

::: faq

??? Why is the item not draggable on touch devices?

Pointer drags start from `pointerdown`; the browser's own panning wins unless the item opts out. Add `touch-action: none` (the `touch-none` utility) to the item.

??? Can I use createKanban directly instead?

Yes. The component is a thin shell over [createKanban](/composables/data/create-kanban) and [useDragDrop](/composables/system/use-drag-drop). Reach for the composables when the board is not rendered as columns of lists — a calendar, a seating chart — or when you need column reordering, which the component does not expose.

??? Why does my drop land one slot off?

`Kanban.List` resolves the drop index against its direct children. Wrapping items in extra elements, or rendering non-item siblings inside the list, shifts the count. Keep headers and counters outside `Kanban.List`.

:::

<DocsApi />
