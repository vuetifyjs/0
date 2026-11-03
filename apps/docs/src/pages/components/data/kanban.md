---
title: Kanban - Accessible Drag-and-Drop Board
meta:
- name: description
  content: Headless kanban board for Vue 3. Each column binds its own items. Cards move by pointer or keyboard, and a move event fires when the drop commits.
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

Headless board of movable items in columns. Each column binds its items with `v-model`. Items move by pointer drag or by keyboard, and every committed move writes the new order back.

<DocsPageFeatures :frontmatter />

## Usage

Each column binds its own array with `v-model`. Render that column's `items`, and set each card's `value` to the same entry.

::: gn-example
/components/kanban/basic
:::

`Kanban.List` may only contain `Kanban.Item` elements. Put headers and counters outside the list. The `value` on `Kanban.Item` must be that same array entry (`===`), and every value on the board must be unique. Put `Kanban.Instructions` and `Kanban.LiveRegion` inside the root, visually hidden. `Kanban.Root` emits `move` when a drop commits. Arrow keys and Escape do not.

A pointer drag fades the card (`data-state="dragging"`) and tints a list that can take it (`data-over`). Space or Enter picks the card up (`data-state="grabbed"`). Arrows then move a target. The column and list get `data-target`, and the card it would land beside gets `data-drop`. That insertion line is keyboard only. Add `touch-none` on the card, or a touch drag loses to page panning.

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
| `Kanban.Root` | The board. `label` names it. Emits `move` when a drop commits |
| `Kanban.Column` | One column. `v-model` is its item array. `disabled` freezes it. `accept` refuses cards coming in from other columns |
| `Kanban.List` | Drop zone for that column. Its only element children are `Kanban.Item` |
| `Kanban.Item` | One card. `value` is the array entry the board tracks |
| `Kanban.Instructions` | Keyboard instructions. Each item points at them with `aria-describedby` |
| `Kanban.LiveRegion` | Announces each move |

## Examples

::: gn-example
/components/kanban/wip-limit

### Refusing a column

`accept` on `Kanban.Column` runs when a card would enter from another column. Return `false` to refuse it. It must return a boolean, not a Promise. A Promise is treated as a refusal. A reorder inside the column does not call `accept`.

`disabled` on a column blocks moves into it, out of it, and within it. `disabled` on an item pins that card. `disabled` on the root freezes the board. Arrow keys skip a column that is disabled or that refuses the card. A pointer drop on a refusing column is rejected and announced.

In this board, Doing holds at most two cards, and Shipped is locked.

:::

::: gn-example
/components/kanban/move-log

### Recording a move

`@move` on `Kanban.Root` fires once when a drop commits. The payload is `{ value, from, to, fromIndex, toIndex }`. `value` is the item's bound value. `from` and `to` are column ids. A pointer drop and a keyboard commit emit the same object, whether the card reordered inside one column or changed columns.

Arrow keys only move the preview. Escape cancels it. Tab cancels it and moves focus on. None of those emit `move`. Listen to `move` to record history or sync a server.

:::

## Recipes

### Smallest board

```vue
<script setup lang="ts">
  import { Kanban } from '@vuetify/v0'
  import { ref } from 'vue'

  const todo = ref([{ id: 1, title: 'Write the spec' }])
  const done = ref([{ id: 2, title: 'Kickoff' }])
</script>

<template>
  <Kanban.Root label="Project board">
    <Kanban.Column id="todo" v-slot="{ items }" v-model="todo" label="Todo">
      <Kanban.List>
        <Kanban.Item v-for="card in items" :key="card.id" :value="card">
          {{ card.title }}
        </Kanban.Item>
      </Kanban.List>
    </Kanban.Column>

    <Kanban.Column id="done" v-slot="{ items }" v-model="done" label="Done">
      <Kanban.List>
        <Kanban.Item v-for="card in items" :key="card.id" :value="card">
          {{ card.title }}
        </Kanban.Item>
      </Kanban.List>
    </Kanban.Column>

    <Kanban.Instructions class="sr-only" />
    <Kanban.LiveRegion class="sr-only" />
  </Kanban.Root>
</template>
```

### Adding and removing cards

The bound arrays are the board. Push, filter, or replace an array and the column updates. That edit does not emit `move`. The event fires only when a pointer or keyboard drop commits.

```ts
todo.value.push({ id: 6, title: 'New card' })
todo.value = todo.value.filter(card => card.id !== 2)
```

### Swimlanes

`orientation="vertical"` stacks the columns and lays each column's cards out in a row. Left and Right move within a column. Up and Down move between columns. Lists expose `data-orientation` for styling.

## Accessibility

Moves never require a pointer. Each item is focusable and keyboard-movable, every move is announced through `Kanban.LiveRegion`, and `Kanban.Instructions` tells screen-reader users how to start. Render both, visually hidden. Without them, moves still work, and they are silent.

### Keyboard

| Key | Action |
|-----|--------|
| Space / Enter | Pick up the focused item. When it is picked up, move it to the drop target |
| ArrowUp / ArrowDown | Move the drop target one slot within its column. Between columns when `orientation="vertical"` |
| ArrowLeft / ArrowRight | Move the drop target to the previous or next column that can take the item, keeping its index when it fits. Within the column when `orientation="vertical"`. Disabled columns, and columns whose `accept` refuses the item, are skipped. RTL-aware |
| Home / End | Move the drop target to the start or end of its column |
| Escape | Discard the drop target. Nothing moves |
| Tab | Discard the drop target and move focus on |

Each target step is announced. Focus follows the item. When a drop renders it in another column, the new element takes focus.

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
| Item | `data-drop` | `before` \| `after`. The pending keyboard drop lands on this side of the item. Pointer drags do not set it |

## FAQ

::: faq

??? Why is the item not draggable on touch devices?

Pointer drags start from `pointerdown`. The browser's own panning wins unless the item opts out. Add `touch-action: none` (the `touch-none` utility) to the item.

??? Can I use createKanban directly instead?

Yes. Use [createKanban](/composables/data/create-kanban) when the board is not rendered as columns of lists, or when the columns themselves have to be reordered. This component does not reorder columns.

??? Why does my drop land one slot off?

`Kanban.List` resolves the drop index against its direct children. Wrapping items in extra elements, or rendering non-item siblings inside the list, shifts the count. Keep headers and counters outside `Kanban.List`.

:::

<DocsApi />
