---
title: createSortable - Headless Ordered-List State for Vue 3
meta:
- name: description
  content: Headless ordered-list state with move, swap, reorder, and a disabled mutation gate. Built on createModel; emits move:ticket on the registry event bus.
- name: keywords
  content: createSortable, sortable, reorder, move, swap, ordered list, drag and drop, composable, Vue 3
features:
  category: Composable
  label: 'E: createSortable'
  github: /composables/createSortable/
  level: 2
related:
  - /composables/data/create-data-table
  - /composables/registration/create-registry
  - /composables/selection/create-model
  - /composables/system/use-drag-drop
---

# createSortable

Headless ordered-list primitive that owns a registry of value-bearing tickets and exposes `move`, `swap`, and `reorder` mutations. Pure logic — no DnD, no keyboard, no DOM — so consumers can drive it from any input modality.

<DocsPageFeatures :frontmatter />

## Usage

`createSortable` extends `createModel` with mutation primitives over the canonical order. Drag-and-drop wiring composes with [useDragDrop](/composables/system/use-drag-drop); keyboard reorder composes with [useVirtualFocus](/composables/system/use-virtual-focus). Consumers can drive sortable from buttons, gestures, server reconciliation, or undo/redo by calling its mutation methods.

```ts collapse
import { createSortable } from '@vuetify/v0'

import type { SortableTicketInput } from '@vuetify/v0'

interface Task {
  id: number
  label: string
}

interface TaskTicket extends SortableTicketInput {
  value: Task
}

const sortable = createSortable<TaskTicket>()

const [a, b, c] = sortable.onboard([
  { value: { id: 1, label: 'Cut alpha' } },
  { value: { id: 2, label: 'Ship docs' } },
  { value: { id: 3, label: 'Tweet' } },
])

sortable.move(a.id, 2)
sortable.swap(a.id, b.id)
sortable.reorder([b.id, a.id, c.id])
```

## Architecture

`createSortable` extends `createModel`, which extends `createRegistry`. All methods inherited from those layers are available unchanged, except `on` and `off` — those are extended with typed overloads for the `move:ticket` event. See [createModel](/composables/selection/create-model) and [createRegistry](/composables/registration/create-registry) for the full inherited surface.

```mermaid "Sortable Hierarchy"
flowchart TD
  createRegistry --> createModel --> createSortable:::primary
  createSortable --> move["move (override)"]
  createSortable --> swap["swap (additive)"]
  createSortable --> reorder["reorder (additive)"]
  move -- "emits" --> moveEvent["move:ticket"]
  swap -- "emits" --> moveEvent
  reorder -- "emits" --> moveEvent
```

The composable adds four things on top of `createModel`:

| Addition | Layer | Purpose |
|---|---|---|
| `move` override | sortable | Wraps `registry.move` to emit `move:ticket` with `{ ticket, from, to }` |
| `swap(a, b)` | sortable | Two batched `move` calls; emits two `move:ticket` events |
| `reorder(ids)` | sortable | Strict permutation set; throws on length mismatch, unknown id, or duplicate id |
| Typed `on` / `off` | sortable | Overloads narrow `move:ticket` callback payload to `SortableMovePayload<E>` |

> [!TIP]
> The composable always enables `events: true` on the underlying registry, so `move:ticket` works out of the box and `useProxyRegistry` snapshots track moves without extra configuration. Consumer-supplied `events: false` is overridden — sortable's `move:ticket` contract requires events to be on.

## Reactivity

createSortable's surface is mostly imperative — `move`, `swap`, and `reorder` mutate the registry and the reactive updates flow downstream through registry events. The composable bakes in `events: true` so `move:ticket` and the standard registry events fire without extra setup.

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `size` | <AppSuccessIcon /> | Getter — tracks registry count via `useProxyRegistry` or `reactive: true` |
| `disabled` (option) | <AppSuccessIcon /> | `MaybeRefOrGetter<boolean>` — flipping it re-enables `move` / `swap` / `reorder` |
| `move:ticket` event | <AppSuccessIcon /> | Subscribe via `on()`; payload is `SortableMovePayload<E>` with `{ ticket, from, to }` |
| `move(id, toIndex)` | - | Imperative; returns the moved ticket or `undefined` when gated |
| `swap(a, b)` | - | Imperative; emits `move:ticket` twice in a batch |
| `reorder(ids)` | - | Imperative; logs a warning and no-ops on size/unknown/duplicate violations |

> [!TIP] Reactive iteration
> `useProxyRegistry(sortable)` returns a reactive `{ keys, values, entries, size }` snapshot driven by registry events. Templates that iterate it stay in sync with `move`, `swap`, and `reorder` automatically. See [Reactive snapshot for templates](#reactive-snapshot-for-templates).

## Examples

::: gn-example
/composables/create-sortable/usePlaylist.ts 1
/composables/create-sortable/Playlist.vue 2
/composables/create-sortable/playlist.vue 3

### Button and keyboard reorder

A playlist queue reordered two ways from the same state: per-row up and down buttons, and arrow-key presses while a row is focused. Both paths funnel into `sortable.move(id, index)` — the entire mutation surface for this example. The composable owns the order and the move semantics; `Playlist.vue` is pure presentation that calls back into it, so the same logic drives clicks and keystrokes without duplication.

The template iterates `proxy.values` from `useProxyRegistry(sortable)`, a reactive snapshot that re-renders whenever the registry order changes — no manual `watch`, no second copy of the list. Buttons disable at the edges via `:disabled="ticket.index === 0"` and `:disabled="ticket.index === proxy.size - 1"`, and `moveUp` / `moveDown` repeat the bounds check so arrow keys no-op past the ends. Subscribing to the typed `move:ticket` event drives the live status line below the list, and because `TransitionGroup` reuses the keyed DOM nodes, focus rides along with a row as it moves — press the arrow key again to keep nudging it. The `.list-move` transition on `transform` animates the slide.

Reach for this pattern for any user-ordered list where drag is unnecessary: priority queues, column choosers, sidebar section ordering. It builds on [createModel](/composables/selection/create-model) for the value store and [useProxyRegistry](/composables/reactivity/use-proxy-registry) for the reactive view. Upgrade to the drag-and-drop example below — pairing with [useDragDrop](/composables/system/use-drag-drop) — when pointer dragging is required.

| File | Role |
|------|------|
| `usePlaylist.ts` | Owns the sortable instance, track data, the proxy snapshot, the `move:ticket` status line, and bounds-checked `moveUp` / `moveDown` |
| `Playlist.vue` | Renders the ordered rows with up/down buttons and translates arrow-key presses into move calls |
| `playlist.vue` | Wires the composable to the component and shows the live reorder status |

:::

::: gn-example
/composables/create-sortable/dnd/data.ts
/composables/create-sortable/dnd/DraggableItem.vue
/composables/create-sortable/dnd/DnDSortable.vue

### Drag-and-drop reorder

The natural use case. Pair `createSortable` with `useDragDrop`: each item registers as a draggable, the list registers as a drop zone, and the zone's `onDrop` callback maps the drop position to a `sortable.move` call. `createSortable` owns the order; `useDragDrop` owns the input modality.

The split is intentional — it keeps the two primitives independently testable and lets you swap the DnD layer (mouse, touch, keyboard) without touching the order state. `DraggableItem.vue` calls `dnd.draggables.register` per item; `DnDSortable.vue` calls `dnd.zones.register` on the container with an `onDrop` handler that calls `sortable.move(drag.id, position.index ?? 0)`. The drop position is provided by `useDragDrop` — `sortable` never touches the pointer event.

| File | Role |
|------|------|
| `data.ts` | Initial item dataset |
| `DraggableItem.vue` | Per-item draggable registration |
| `DnDSortable.vue` | Container with drop zone, indicator, and `onDrop → sortable.move` wiring |

:::

## Recipes

### Disabling reorder

`disabled` works at two scopes. **Root** (`createSortable({ disabled })`) no-ops `move`, `swap`, and `reorder` for the whole list. **Per-ticket** (`register({ value, disabled: true })`) no-ops `move` and `swap` for that ticket. `reorder` **bypasses** per-ticket `disabled` — it's a bulk operation declaring the canonical order; if you want disabled tickets pinned, exclude their ids from the array. Registration is never gated.

```ts
const sortable = createSortable<Todo>({
  disabled: toRef(() => isReadOnlyMode.value),
})

sortable.move(id, 0)   // no-op when disabled.value === true
```

### Server-reconciled order

`reorder` accepts a strict permutation of currently-registered ids. Use it to apply an authoritative order from the backend without diffing positions yourself.

```ts
const sortable = createSortable<Todo>()
const order = await fetchOrder()       // ID[] from backend
sortable.reorder(order)
```

### Reactive snapshot for templates

`useProxyRegistry` returns a reactive `{ keys, values, entries, size }` snapshot driven by registry events. Because `createSortable` bakes in `events: true`, you do not pass it explicitly.

```ts
const sortable = createSortable<Todo>()
const proxy = useProxyRegistry(sortable)

// proxy.keys, proxy.values, proxy.entries, proxy.size all track moves
```

### Pair with useDragDrop

Wire `useDragDrop`'s `onDrop` callback to `sortable.move` to translate pointer or keyboard drags into reorder mutations. The headless contract keeps the two primitives independent — sortable owns order, drag-drop owns input.

```ts
const sortable = createSortable<Todo>()
const dnd = useDragDrop()

dnd.zones.register({
  el: containerEl,
  accept: ['todo'],
  onDrop: (drag, position) => {
    if (drag.type === 'todo') sortable.move(drag.id, position.index ?? 0)
  },
})
```

A first-class `useSortableDnD` adapter is on the roadmap; until then, wire `useDragDrop`'s callbacks to `sortable.move` directly.

<DocsApi />
