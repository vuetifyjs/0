---
title: createDragDrop - Headless Drag-and-Drop Primitive
meta:
- name: description
  content: Headless drag-and-drop with two registries (draggables and zones), pluggable pointer / keyboard adapters, and accessibility-first defaults.
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

Call `createDragDrop` once per scope (board, tree, splitter); it auto-provides so sub-components inject via `useDragDrop` and register against the same registries.

```ts collapse
import { createDragDrop, useDragDrop } from '@vuetify/v0'

// In the parent scope (e.g. <Kanban.Root>)
const dnd = createDragDrop<{ type: 'card', value: Card }>()

// In a draggable child
const ctx = useDragDrop<{ type: 'card', value: Card }>()
const ticket = ctx.draggables.register({ el, type: 'card', value: card })
// → ticket.attrs, ticket.isDragging, ticket.el

// In a drop-zone child
const zone = ctx.zones.register({
  el,
  accept: ['card'],
  orientation: 'vertical',
  onDrop: (drag, position) => moveCard(drag.value.id, position.index ?? 0),
})
// → zone.attrs, zone.isOver, zone.willAccept, zone.indicator
```

## Architecture

The factory owns three pieces of state and three extension points. Pointer and keyboard adapters observe the DOM and emit a four-call lifecycle (`start`, `move`, `drop`, `cancel`); the factory pipes those through per-ticket and global hooks before mutating `active`.

```mermaid "createDragDrop architecture"
flowchart TD
  subgraph factory["createDragDrop()"]
    direction TB
    draggables[("draggables<br/>(createRegistry)")]
    zones[("zones<br/>(createRegistry)")]
    active["active<br/>(ShallowRef)"]
  end

  subgraph adapters["Adapters (pluggable)"]
    pointer["pointerAdapter"]
    keyboard["keyboardAdapter"]
  end

  subgraph hooks["Lifecycle hooks"]
    direction TB
    onBeforeStart
    onMove
    onBeforeDrop
    onDrop
    onCancel
  end

  child1["&lt;Card /&gt;<br/>useDragDrop().draggables.register"] --> draggables
  child2["&lt;Column /&gt;<br/>useDragDrop().zones.register"] --> zones

  pointer -->|emit| factory
  keyboard -->|emit| factory
  factory --> hooks
  hooks --> active

  active -->|reactive| child1
  active -->|reactive| child2
```

## Adapters

Adapters are pluggable input layers: an adapter observes the DOM (or any other input source) and emits the four lifecycle events the factory consumes. Default adapters are installed automatically.

| Adapter | Import | Default | Description |
|---|---|---|---|
| `pointerAdapter` | `@vuetify/v0` | yes | Pointer Events for mouse, touch, and pen. Optional `threshold` activation distance. |
| `keyboardAdapter` | `@vuetify/v0` | yes | `Space` / `Enter` to pick up and drop, arrow keys to nudge, `Escape` to cancel. Configurable activation keys + step. |

Replace the defaults entirely by passing the `adapters` option:

```ts
import { createDragDrop, pointerAdapter } from '@vuetify/v0'

// Pointer only — disables keyboard.
const dnd = createDragDrop({ adapters: [pointerAdapter()] })
```

To extend rather than replace, list the defaults explicitly alongside your custom adapter:

```ts
createDragDrop({
  adapters: [pointerAdapter(), keyboardAdapter(), myWebXrAdapter()],
})
```

`adapters: []` disables both defaults entirely (useful for server-driven or test scenarios).

A custom adapter implements:

```ts
interface DragDropAdapter<K> {
  install (ctx: DragDropContext<K>, emit: DragDropAdapterEmit<K>): void
  uninstall (): void
}
```

`emit` receives `start(source, origin, via)`, `move(point)`, `drop()`, and `cancel()`. Adapters declare their own `via` value via `Extensible<'pointer' | 'keyboard'>` so consumers reading `active.value.via` can distinguish the input source.

## Reactivity

Every consumer-facing state field is a reactive ref. Reads in templates need `.value`.

| Field | Shape | Updates when |
|---|---|---|
| `dnd.active` | `ShallowRef<ActiveDrag<K> \| null>` | A drag starts, moves, drops, or cancels |
| `dnd.isDragging` | `Ref<boolean>` | `active` becomes non-null / null |
| `ticket.attrs` | `Ref<Record<string, unknown>>` | `data-dragging` toggles when the ticket is the active drag |
| `ticket.isDragging` | `Ref<boolean>` | This specific ticket is the active drag |
| `ticket.el` | `Ref<HTMLElement \| null>` | Mounts / unmounts (registry element-ref pattern) |
| `zone.attrs` | `Ref<Record<string, unknown>>` | `data-over` and `data-accepts` toggle on hover / acceptance |
| `zone.isOver` | `Ref<boolean>` | The active drag's `over` field equals this zone's id |
| `zone.willAccept` | `Ref<boolean>` | An active drag matches this zone's `accept` policy |
| `zone.indicator` | `Ref<DropIndicator \| null>` | While over an oriented zone, computes the index/edge/rect of the resolved drop position |

Indicator computation is `computed`-cached — `getBoundingClientRect` runs once per `active.value` change, not per template read.

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

## Recipes

### Multiple drag types in one scope

Widen the discriminated union — type narrowing on `drag.type` carries the corresponding `drag.value` through, so cards and columns can both be draggable in the same kanban scope without losing payload types.

```ts
type KanbanTypes =
  | { type: 'card', value: Card }
  | { type: 'column', value: Column }

const dnd = createDragDrop<KanbanTypes>()

// Card zone accepts only cards
ctx.zones.register({ el, accept: ['card'], onDrop: (drag) => {
  // drag.type narrows to 'card', drag.value to Card
}})

// Column-row zone accepts only columns
ctx.zones.register({ el, accept: ['column'], orientation: 'horizontal' })
```

### Vetoing drops

Either layer can veto. Per-zone vetoes route the drag through the cancel chain (`onLeave` on the active zone → `onCancel` on the source draggable → global `onCancel`) so consumers can roll back optimistic UI without subscribing to a separate "drop failed" event.

```ts
ctx.zones.register({
  el,
  accept: ['card'],
  onBeforeDrop: (drag) => column.cards.length < column.wipLimit,
})
```

### Custom adapters?

Drop the defaults entirely and forward your own input source. Useful for cross-window drags, file-drop integrations, or programmatic test fixtures.

```ts
const dnd = createDragDrop({ adapters: [myCustomAdapter()] })
```

## Accessibility

WAI-ARIA does not standardize a kanban or "drag list" pattern. The primitive follows the **list-of-lists** convention used by Pragmatic DnD, dnd-kit, and headless-ui:

- Draggable tickets carry `aria-roledescription="draggable"` only — no `aria-grabbed` or `aria-dropeffect`, both deprecated in ARIA 1.1.
- Wrap each drop zone in a container with `role="list"` and the draggable list items with `role="listitem"`.
- Each zone should wire a roving tabindex via [useRovingFocus](/composables/system/use-roving-focus) — one focus stop per zone, arrow keys move between items in the same zone, Tab moves to the next zone.
- Provide a single live region per scope (`<div role="status" aria-live="polite">`) and watch `active` to announce moves ("Card moved to Done, position 2 of 5"). The live region is the consumer's responsibility — the headless contract excludes user-facing strings (PHILOSOPHY §5.5).

The default `keyboardAdapter` honours the standard contract: `Space` / `Enter` to pick up and drop, arrow keys to navigate, `Escape` to cancel.

## FAQ

::: faq

??? Why not use HTML5 drag-and-drop?

Native HTML5 DnD has terrible mobile support, an ugly default ghost element you can't customize cross-browser, no programmatic activation distance, and inconsistent event semantics across input devices. `pointerAdapter` uses Pointer Events instead — uniform mouse, touch, and pen handling, no default ghost (you render whatever you want), and full control over activation thresholds. Plug HTML5 in as a custom adapter if you need cross-window drops or OS file-drag integration; the headless contract doesn't lock it out.

??? When does `position.index` get set?

Only when the over-zone declares `orientation`. Without orientation, the zone is opaque — drops fire with `position.pointer` only. With orientation, the composable measures child rects and resolves an index. Empty oriented zones default `index` to `0` (the only sensible drop position when there's nothing to splice between).

??? How do I pick the right `K` parameter?

`K` is a discriminated union of every drag type the scope handles. For a single type, write `createDragDrop<{ type: 'card', value: Card }>()`. For multiple, union them: `{ type: 'card', value: Card } | { type: 'column', value: Column }`. The types are distributive — narrowing on `drag.type` narrows `drag.value` to the matching variant.

??? Can the same DOM element be both a draggable and a zone?

Yes. Two registrations on the same element work because they live in different registries. The kanban use case relies on this: each column registers as a draggable (`type: 'column'`) for column-reordering and as a zone (`accept: ['card']`) for card drops.

??? What if I need autoscroll, FLIP animations, or multi-select drag?

These don't ship in v1 to keep the surface small. The plugin slot is the extension point — `createDragDrop({ plugins: [autoScroll(), flipAnimations()] })` — and lifecycle hooks let you observe everything from outside the composable. Multi-select drag is best composed with [createSelection](/composables/selection/create-selection) so the selected set is its own first-class concept.

:::

## API

<DocsApi />
