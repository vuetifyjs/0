---
title: createDragDrop - Headless Drag-and-Drop Primitive
meta:
- name: description
  content: Headless drag-and-drop with two registries (draggables and zones), pluggable pointer / keyboard transports, and accessibility-first defaults.
- name: keywords
  content: drag, drop, dnd, kanban, sortable, headless, Vue 3, composable
features:
  category: Composable
  label: 'C: createDragDrop'
  github: /composables/createDragDrop/
  level: 2
related:
  - /composables/registration/create-registry
  - /composables/foundation/create-context
  - /composables/system/use-roving-focus
---

# createDragDrop

Headless drag-and-drop primitive. Owns two registries — draggables and zones — plus the active-drag state.

<DocsPageFeatures :frontmatter />

## Usage

`createDragDrop` is a per-scope factory: each parent that wants its own DnD context (a kanban board, a sortable tree, a splitter) calls it once. The factory auto-provides into the surrounding `setup()` scope, so sub-components reach it via `useDragDrop()` and register draggables and zones via `dnd.draggables.register({...})` and `dnd.zones.register({...})` — the returned tickets carry the consumer-facing derived state (`attrs`, `isDragging`, `isOver`, `willAccept`, `indicator`).

## Examples

::: example
/composables/create-drag-drop/DragItem.vue 1
/composables/create-drag-drop/DropList.vue 2
/composables/create-drag-drop/basic.vue 3

### Basic two-list drag

Pick up an item with the pointer or keyboard (`Space` / `Enter`) and drop it in the other list. The example splits the surface across three files to mirror how a real consumer would compose the primitive: a `DragItem` that registers itself as a draggable, a `DropList` that registers itself as a zone and renders draggables, and a `basic` entry that wires the lists together and owns the data.

The zones declare `orientation: 'vertical'` to opt into list-style index resolution — the `onDrop` callback receives `position.index` indicating where in the destination list the drop landed. While a drag is active the wrapper toggles `cursor-grabbing` so the cursor stays consistent across both lists, and each zone shows a primary-tinted ring + background when it would accept the active drag.

Reach for this shape when you want a sortable list with cross-container moves and headless control over visual affordances. For a single-list reorder, drop the second `DropList`. For more drag types in the same scope (e.g. items *and* their containers), widen the discriminated union — the type narrowing on `drag.type` carries the corresponding `drag.value` through.

| File | Role |
|------|------|
| `DragItem.vue` | Registers itself as a draggable via `dnd.draggables.register({ el, type, value })` and binds the returned ticket's `attrs` |
| `DropList.vue` | Registers itself as a zone via `dnd.zones.register({ el, accept, orientation, onDrop })` and emits `move` events upward |
| `basic.vue` | Owns the lists, calls `createDragDrop()` to provide the context, and handles cross-list moves |
:::

## API

<DocsApi />
