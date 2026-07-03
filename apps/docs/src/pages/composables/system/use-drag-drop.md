---
title: useDragDrop - Headless Drag-and-Drop Primitive
meta:
- name: description
  content: Headless drag-and-drop with two registries (draggables and zones), pluggable pointer / keyboard adapters, and accessibility-first defaults.
- name: keywords
  content: drag, drop, dnd, kanban, sortable, headless, Vue 3, composable
features:
  category: Composable
  label: 'E: useDragDrop'
  github: /composables/useDragDrop/
  level: 2
related:
  - /composables/registration/create-registry
  - /composables/foundation/create-context
  - /composables/system/use-roving-focus
---

# useDragDrop

Headless drag-and-drop primitive. Owns two registries — draggables and zones — plus the active-drag state.

<DocsPageFeatures :frontmatter />

## Usage

Call `useDragDrop` once per scope and pass the returned context to children that register draggables or zones.

```vue playground collapse no-filename useDragDrop
<script setup lang="ts">
  import { useDragDrop } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  const dnd = useDragDrop<{ type: 'card', value: string }>()

  const draggable = useTemplateRef<HTMLElement>('draggable')
  const dropzone = useTemplateRef<HTMLElement>('dropzone')

  dnd.draggables.register({
    el: draggable,
    type: 'card',
    value: 'card-1',
  })

  dnd.zones.register({
    el: dropzone,
    accept: ['card'],
    orientation: 'vertical',
    onDrop: (drag, position) => {
      console.log(drag.value, position.index) // 'card-1', 0
    },
  })
</script>

<template>
  <div
    ref="draggable"
    data-draggable
    aria-roledescription="draggable"
  >
    Card
  </div>

  <div ref="dropzone" data-dropzone>
    Drop zone
  </div>
</template>
```

## Adapters

Adapters are pluggable input layers: an adapter observes the DOM (or any other input source) and emits the four lifecycle events the factory consumes. Default adapters are installed automatically.

| Adapter | Import | Description |
|---|---|---|
| `PointerAdapter` | `@vuetify/v0` | Pointer Events for mouse, touch, and pen (default) |
| `KeyboardAdapter` | `@vuetify/v0` | Keyboard activation (default) |
| `DragDropAdapter` | `@vuetify/v0` | Abstract base class for custom adapters — see [Custom adapters](#custom-adapters) |

### PointerAdapter

Pointer Events for mouse, touch, and pen. Installed by default.

| Option | Type | Default | Description |
|---|---|---|---|
| `threshold` | `number` | `0` | Drag-activation distance in px. Set non-zero to require a minimum movement before the drag starts — useful for distinguishing drags from clicks. |

```ts
import { useDragDrop, PointerAdapter } from '@vuetify/v0'

const dnd = useDragDrop({ adapters: [new PointerAdapter({ threshold: 8 })] })
```

### KeyboardAdapter

Keyboard activation: `Space` / `Enter` to pick up and drop, arrow keys to nudge, `Escape` to cancel. Installed by default.

| Option | Type | Default | Description |
|---|---|---|---|
| `activate` | `string[]` | `[' ', 'Enter']` | Keys that pick up an idle draggable and drop the active one. |
| `step` | `number` | `16` | Pixel step per arrow-key press. |

```ts
import { useDragDrop, KeyboardAdapter } from '@vuetify/v0'

const dnd = useDragDrop({ adapters: [new KeyboardAdapter({ step: 32 })] })
```

### Replacing the defaults

To use only one adapter, pass it explicitly. The default array is replaced entirely:

```ts
import { useDragDrop, PointerAdapter } from '@vuetify/v0'

// Pointer only — keyboard disabled.
const dnd = useDragDrop({ adapters: [new PointerAdapter()] })
```

To extend instead of replace, list the defaults alongside your custom adapter:

```ts
import { useDragDrop, PointerAdapter, KeyboardAdapter } from '@vuetify/v0'
import { TouchAdapter } from './touch-adapter'

useDragDrop({
  adapters: [new PointerAdapter(), new KeyboardAdapter(), new TouchAdapter()],
})
```

`adapters: []` disables both defaults entirely — useful for server-driven or test scenarios.

### Custom adapters

Extend the abstract `DragDropAdapter` base for shared `cleanup` + `dispose()` lifecycle and the `locate()` DOM-walk helper:

```ts
import { DragDropAdapter } from '@vuetify/v0'
import type { DragDropAdapterContext, DragType } from '@vuetify/v0'

class TouchAdapter<Z extends DragType = DragType> extends DragDropAdapter<Z> {
  setup (context: DragDropAdapterContext<Z>): void {
    // observe input, then call:
    //   context.emit.start(source, origin, 'touch')
    //   context.emit.move(point)
    //   context.emit.drop()
    //   context.emit.cancel()
    this.cleanup = () => { /* tear down listeners */ }
  }
}
```

`context.emit` exposes `start(source, origin, via)`, `move(point)`, `drop()`, and `cancel()` — call these as input arrives. Adapters declare their own `via` value (typed as `DragVia`) so consumers reading `active.value.via` can distinguish the input source. `DragVia` is `Extensible<'pointer' | 'keyboard'>` — additional modalities (e.g. `'touch'`, `'gamepad'`) flow through without type-level coordination.

## Architecture

The factory owns four pieces of state (`draggables`, `zones`, `active`, `isDragging`) plus a public `cancel()` action, and three extension points (adapters, plugins, lifecycle hooks). Pointer and keyboard adapters observe the DOM and emit a four-call lifecycle (`start`, `move`, `drop`, `cancel`); the factory pipes those through per-ticket and global hooks before mutating `active`.

```mermaid "useDragDrop architecture"
flowchart TD
  subgraph factory["useDragDrop()"]
    direction TB
    draggables[("draggables<br/>(createRegistry)")]
    zones[("zones<br/>(createRegistry)")]
    active["active<br/>(ShallowRef)"]
  end

  subgraph adapters["Adapters (pluggable)"]
    pointer["PointerAdapter"]
    keyboard["KeyboardAdapter"]
  end

  subgraph hooks["Lifecycle hooks"]
    direction TB
    onBeforeStart
    onMove
    onBeforeDrop
    onDrop
    onCancel
  end

  child1["&lt;Card /&gt;<br/>dnd.draggables.register"] --> draggables
  child2["&lt;Column /&gt;<br/>dnd.zones.register"] --> zones

  pointer -->|emit| factory
  keyboard -->|emit| factory
  factory --> hooks
  hooks --> active

  active -->|reactive| child1
  active -->|reactive| child2
```

## Reactivity

### Reactive fields

Every consumer-facing state field is a reactive ref <AppSuccessIcon />. Reads in templates need `.value`.

| Field | Shape | Updates when |
|---|---|---|
| `dnd.active` | `Readonly<ShallowRef<ActiveDrag<Z> \| null>>` | A drag starts, moves, drops, or cancels |
| `dnd.active.value.via` | `DragVia` | Source modality (`'pointer'`, `'keyboard'`, or any extension)[^drag-via-usage] |
| `dnd.isDragging` | `Readonly<Ref<boolean>>` | `active` becomes non-null / null |
| `ticket.isDragging` | `Readonly<Ref<boolean>>` | This specific ticket is the active drag |
| `ticket.el` | `Readonly<Ref<HTMLElement \| null>>` | Mounts / unmounts (registry element-ref pattern) |
| `zone.isOver` | `Readonly<Ref<boolean>>` | The active drag's `over` field equals this zone's id |
| `zone.willAccept` | `Readonly<Ref<boolean>>` | An active drag matches this zone's `accept` policy |
| `zone.indicator` | `Readonly<Ref<DropIndicator \| null>>` | While over an oriented zone, computes the index/edge/rect of the resolved drop position |
| `zone.el` | `Readonly<Ref<HTMLElement \| null>>` | Mounts / unmounts (registry element-ref pattern) |

[^drag-via-usage]: Read this to branch keyboard-only behaviors like focus restoration.

Indicator rects are cached per zone; `getBoundingClientRect` runs only when the zone resizes or its children mount/unmount, not on each pointer move.

### Methods

| Method | Purpose |
|---|---|
| `dnd.cancel()` | Programmatically cancel the active drag. Fires the cancel chain[^drag-cancel-chain] with `reason: 'cancel'`. No-op when no drag is active. |

[^drag-cancel-chain]: `onLeave` on the over-zone → per-draggable `onCancel` → global `onCancel`.

### DOM attributes

The composable does not produce attribute objects — consumers wire data attributes themselves so the design-system layer can choose its own keys. The canonical wiring is:

**Draggable element:**
- `data-draggable` (always)
- `aria-roledescription="draggable"` (always)
- `data-dragging` toggled while `ticket.isDragging.value` is true
- `touch-action: none` (CSS or `style="touch-action: none"`) so the browser doesn't pan/zoom on pointer drag

**Drop zone element:**
- `data-dropzone` (always)
- `data-over` toggled while `zone.isOver.value` is true
- `data-accepts` toggled while both `zone.isOver.value && zone.willAccept.value` are true

## Examples

::: gn-example collapse
/composables/use-drag-drop/DragItem.vue 1
/composables/use-drag-drop/DropList.vue 2
/composables/use-drag-drop/basic.vue 3

### Basic two-list drag

Pick up an item with the pointer or keyboard (`Space` / `Enter`) and drop it in the other list. The example splits the surface across three files to mirror how a real consumer would compose the primitive: a `DragItem` that registers itself as a draggable, a `DropList` that registers itself as a zone and renders draggables, and a `basic` entry that wires the lists together and owns the data.

The zones declare `orientation: 'vertical'` to opt into list-style index resolution — the `onDrop` callback receives `position.index` indicating where in the destination list the drop landed. While a drag is active the wrapper toggles `cursor-grabbing` so the cursor stays consistent across both lists, and each zone shows a primary-tinted ring + background when it would accept the active drag.

Reach for this shape when you want a sortable list with cross-container moves and headless control over visual affordances. For a single-list reorder, drop the second `DropList`. For more drag types in the same scope (e.g. items *and* their containers), widen the discriminated union — the type narrowing on `drag.type` carries the corresponding `drag.value` through.

Need to share the context across deeply nested components without prop-threading? Wrap the parent's `useDragDrop()` call with your own `provide`/`inject` pair (Vue's standard DI pattern) and call `inject` from descendants. A first-class `createDragDropContext()` trinity factory may ship later — see the [createSelectionContext](/composables/selection/create-selection) precedent for the shape it would take.

| File | Role |
|------|------|
| `DragItem.vue` | Receives the shared `dnd` context as a prop and registers itself as a draggable via `dnd.draggables.register({ el, type, value })` |
| `DropList.vue` | Receives the shared `dnd` context as a prop, registers itself as a zone via `dnd.zones.register({ el, accept, orientation, onDrop })`, and emits `move` events upward |
| `basic.vue` | Owns the lists, calls `useDragDrop()` to create the context, threads it to children, and handles cross-list moves |
:::

## Recipes

### Multiple drag types in one scope

Default to a single type per scope (`useDragDrop<{ type: 'card', value: Card }>()`) — every draggable and zone shares one shape, every callback narrows trivially. Widen `Z` to a discriminated union only when you need cross-type interactions in the same scope (e.g. a kanban where cards drop on columns *and* columns drop on a column-row); a separate `useDragDrop()` per scope is cleaner whenever the types don't meet.

When you do widen, type narrowing on `drag.type` carries the corresponding `drag.value` through, so each variant keeps its payload shape across `onDrop` and `accept`.

```ts
type KanbanTypes =
  | { type: 'card', value: Card }
  | { type: 'column', value: Column }

const dnd = useDragDrop<KanbanTypes>()

// Card zone accepts only cards
dnd.zones.register({ el, accept: ['card'], onDrop: (drag, position) => {
  // drag.type narrows to 'card', drag.value to Card
}})

// Column-row zone accepts only columns
dnd.zones.register({ el, accept: ['column'], orientation: 'horizontal' })
```

### Vetoing drops

Either layer can veto. Per-zone vetoes route the drag through the cancel chain (`onLeave` on the active zone → `onCancel` on the source draggable → global `onCancel`) so consumers can roll back optimistic UI without subscribing to a separate "drop failed" event. Both `onCancel` callbacks (per-draggable and global) receive a second argument `reason: 'cancel' | 'reject'` — `'reject'` when the cancel was triggered by a drop veto, `'cancel'` for user-initiated aborts (Escape, programmatic `dnd.cancel()`).

> [!TIP]
> All hooks fire AFTER `dnd.active.value` is cleared to `null` — read the `drag` argument inside `onDrop`, `onCancel`, and `onLeave`-during-cancel rather than re-reading the reactive ref. The cleared-before-notify ordering prevents re-entrance loops when a hook calls `dnd.cancel()` or unregisters a ticket.

`accept` (function form) must return synchronously — predicates that return a Promise / thenable are rejected with a console warning. Wrap async work in `onBeforeDrop` instead, returning `false` to veto.

```ts
dnd.zones.register({
  el,
  accept: ['card'],
  onBeforeDrop: (drag) => column.cards.length < column.wipLimit,
})

// Per-draggable cancel can react to the reason:
dnd.draggables.register({
  el,
  type: 'card',
  value: card,
  onCancel: (drag, reason) => {
    if (reason === 'reject') notify()
  },
})
```

## Accessibility

WAI-ARIA does not standardize a kanban or "drag list" pattern. The primitive follows the **list-of-lists** convention used by Pragmatic DnD, dnd-kit, and headless-ui:

- Draggable tickets carry `aria-roledescription="draggable"` only — no `aria-grabbed` or `aria-dropeffect`, both deprecated in ARIA 1.1.
- Wrap each drop zone in a container with `role="list"` and the draggable list items with `role="listitem"`.
- Each zone should wire a roving tabindex via [useRovingFocus](/composables/system/use-roving-focus) — one focus stop per zone, arrow keys move between items in the same zone, Tab moves to the next zone.
- Provide a single live region per scope (`<div role="status" aria-live="polite">`) and watch `active` to announce moves ("Card moved to Done, position 2 of 5"). The live region is the consumer's responsibility — the headless contract excludes user-facing strings (PHILOSOPHY §5.5).

The default `KeyboardAdapter` honours the standard contract: `Space` / `Enter` to pick up and drop, arrow keys to nudge the drag point by `step` px (default 16), `Escape` to cancel.

### Post-drop focus

After a successful keyboard drop, the moved element is typically replaced by the consumer's `onDrop` handler — focus then lands on `<body>`, breaking keyboard flow. Restore it explicitly: in `onDrop`, after mutating the source list, call `nextTick` and refocus the new element by id (or rely on `useRovingFocus` to refocus the active item). Branch on `drag.via === 'keyboard'` (the first argument to `onDrop`) so the restoration only runs for keyboard drags, not pointer drags. `dnd.active.value` is already `null` inside `onDrop` / `onCancel` — read the `drag` argument instead.

## FAQ

::: faq

??? Why not use HTML5 drag-and-drop?

Native HTML5 DnD has terrible mobile support, an ugly default ghost element you can't customize cross-browser, no programmatic activation distance, and inconsistent event semantics across input devices. `PointerAdapter` uses Pointer Events instead — uniform mouse, touch, and pen handling, no default ghost (you render whatever you want), and full control over activation thresholds. Plug HTML5 in as a custom adapter if you need cross-window drops or OS file-drag integration; the headless contract doesn't lock it out.

??? When does `position.index` get set?

Only when the over-zone declares `orientation`. Without orientation, the zone is opaque — drops fire with `position.pointer` only. With orientation, the composable measures child rects and resolves an index. Empty oriented zones default `index` to `0` (the only sensible drop position when there's nothing to splice between).

??? How do I pick the right `Z` parameter?

`Z` is a discriminated union of every drag type the scope handles. For a single type, write `useDragDrop<{ type: 'card', value: Card }>()`. For multiple, union them: `{ type: 'card', value: Card } | { type: 'column', value: Column }`. The types are distributive — narrowing on `drag.type` narrows `drag.value` to the matching variant.

??? Can the same DOM element be both a draggable and a zone?

Yes. Two registrations on the same element work because they live in different registries. The kanban use case relies on this: each column registers as a draggable (`type: 'column'`) for column-reordering and as a zone (`accept: ['card']`) for card drops.

??? What if I need autoscroll, FLIP animations, or multi-select drag?

These don't ship in v1 to keep the surface small. The plugin slot is the extension point — `useDragDrop({ plugins: [scroll(), flip()] })` — and lifecycle hooks let you observe everything from outside the composable. Multi-select drag is best composed with [createSelection](/composables/selection/create-selection) so the selected set is its own first-class concept.

:::

<DocsApi />
