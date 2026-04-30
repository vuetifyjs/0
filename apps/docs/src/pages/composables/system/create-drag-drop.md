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

`createDragDrop` is a per-scope factory: each parent that wants its own DnD context (a kanban board, a sortable tree, a splitter) calls it once and provides the result via `provideDragDrop`. Sub-components register draggables and zones via `dnd.draggables.register({...})` and `dnd.zones.register({...})` — the returned tickets carry the consumer-facing derived state (`attrs`, `isDragging`, `isOver`, `willAccept`, `indicator`).

## Examples

The basic example demonstrates a single-type drag scope with two zones. Pick up an item with the pointer or keyboard (Space / Enter) and drop it in the other list. Zones declare `orientation: 'vertical'` to opt into list-style index resolution — the `onDrop` callback receives `position.index` indicating where in the destination list the drop landed.

<DocsExample file="basic" />

## API

<DocsApi />
