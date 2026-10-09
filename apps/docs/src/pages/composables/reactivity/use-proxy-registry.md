---
title: useProxyRegistry - Reactive Registry Wrapper for Vue 3
meta:
- name: description
  content: Vue 3 reactive proxy wrapper for registry collections. Automatically updates refs when items are registered or unregistered from the registry system.
- name: keywords
  content: useProxyRegistry, registry, reactive, composable, Vue, state management
features:
  category: Composable
  label: 'E: useProxyRegistry'
  github: /composables/useProxyRegistry/
  level: 3
related:
  - /composables/registration/create-registry
---

# useProxyRegistry

A reactive proxy wrapper for registry collections that automatically updates refs when items are registered or unregistered.

<DocsPageFeatures :frontmatter />

## Usage

The `useProxyRegistry` composable creates reactive objects that automatically sync with a registry's state. It listens for registry changes and updates the reactive properties accordingly, making it ideal for template-driven UIs that need to react to registry mutations.

**Important:** The registry must have `events: true` enabled for the proxy to receive updates.

```ts collapse no-filename
import { createRegistry, useProxyRegistry } from '@vuetify/v0'

const registry = createRegistry({ events: true })
const proxy = useProxyRegistry(registry)

registry.register({ value: 'Item 1' })
registry.register({ value: 'Item 2' })

console.log(proxy.size) // 2
console.log(proxy.keys) // [id1, id2]
```

## Architecture

`useProxyRegistry` creates a reactive proxy over registry collections:

```mermaid "Proxy Registry Flow"
flowchart LR
  createRegistry --> events[register/unregister events]
  events --> useProxyRegistry
  useProxyRegistry --> reactive[reactive object]
  reactive --> template[Vue template]
```

## Reactivity

`useProxyRegistry` returns a **fully reactive object** that syncs with registry events. Use it to expose registry data in Vue templates.

| Property | Reactive | Notes |
| - | :-: | - |
| `keys` | <AppSuccessIcon /> | Updates on register, unregister, update, clear, and reindex |
| `values` | <AppSuccessIcon /> | Same events as `keys` |
| `entries` | <AppSuccessIcon /> | Same events as `keys` |
| `size` | <AppSuccessIcon /> | Same events as `keys` |

> [!TIP] Deep vs shallow
> Pass `{ deep: true }` and `values` and `entries` are wrapped in `reactive()`. Omit it and the proxy returns the raw arrays. The registry must be created with `events: true`.

## Examples

::: gn-example
/composables/use-proxy-registry/notification-center

### Notification Center

A notification center that manages an event-sourced list of items through `createRegistry` with `events: true` and exposes them reactively to the template via `useProxyRegistry`. Three notifications are seeded with `onboard()` on mount; the + Add button calls `registry.register()` with a random message and type; clicking the mail icon calls `registry.upsert()` to flip the `read` flag; dismiss calls `registry.unregister()`. The template iterates `proxy.values` — a reactive array that updates automatically on every registry mutation without any manual `watch` or event subscription in the component.

The debug panel at the top shows `proxy.size`, `proxy.keys`, and a `toRef`-derived `unread` count, making the reactivity boundary visible: all three update the moment the registry changes, driven entirely by the event bridge `useProxyRegistry` installs. The unread badge on the header demonstrates that derived values — computed from `proxy.values` via `toRef` — are also reactive without extra wiring.

Use `useProxyRegistry` any time a registry's contents need to drive a `v-for` or a reactive count in a template. `reactive: true` also tracks `values()`, because that method reads a version ref before it returns a cached array. The proxy is the event-driven snapshot: `keys`, `values`, `entries`, and `size`. For selection composables like `createSingle` or `createGroup`, pass the selection instance directly since they extend `createRegistry` and support `events: true` the same way.

:::

## FAQ

::: faq
??? Why does the registry need `events: true`?

`useProxyRegistry` listens for `register:ticket`, `unregister:ticket`, `update:ticket`, `clear:registry`, and `reindex:registry`. Without `events: true`, the registry operates silently:

```ts
// Without events - proxy never updates
const registry = createRegistry()
const proxy = useProxyRegistry(registry)
registry.register({ value: 'item' })
console.log(proxy.size) // 0 - stale!

// With events - proxy stays in sync
const registry = createRegistry({ events: true })
const proxy = useProxyRegistry(registry)
registry.register({ value: 'item' })
console.log(proxy.size) // 1 - correct
```

Events add minimal overhead but aren't enabled by default since many use cases don't need reactivity. See `createRegistry` for the full events API.

??? What's the performance cost compared to raw createRegistry?

Two costs to consider:

| Operation | Raw Registry | With Proxy |
| - | - | - |
| `register/unregister` | O(1) | O(1) + event emit + ref update |
| Property access | Direct Map/Set | Ref unwrap (negligible) |

The proxy adds one event listener and updates refs on mutations. For most apps, this is insignificant. If you're registering thousands of items per second, benchmark your specific case.

```mermaid "Proxy Overhead"
flowchart LR
    R[register call] --> E[emit event]
    E --> P[proxy listener]
    P --> U[update refs]
    U --> V[Vue reactivity]
```

??? Which properties are reactive on the proxy?

All read properties from the underlying registry:

| Property | Type | Reactive |
| - | - | - |
| `size` | `number` | Yes |
| `keys` | `ID[]` | Yes |
| `values` | ticket array | Yes |
| `entries` | `[ID, Ticket][]` | Yes |

Mutations (`register`, `unregister`, `move`) are called on the underlying registry instance — not through the proxy. The proxy automatically syncs via registry events.

??? Does the proxy re-render on every registry change?

Vue's reactivity is granular. Components only re-render when they access properties that changed:

```vue
<template>
  <!-- Only re-renders when size changes -->
  <span>{{ proxy.size }} items</span>
</template>
```

```vue
<template>
  <!-- Re-renders when any item changes -->
  <div v-for="ticket in proxy.values" :key="ticket.id">
    {{ ticket.value }}
  </div>
</template>
```

If you only read `size`, adding items triggers a re-render. If you iterate `keys`, any registration change triggers a re-render. Structure templates to minimize reactive dependencies.

??? Why not just use reactive: true on the registry?

`reactive: true` reads a version ref at the start of `values()`, including when the result is cached, so a render that reads `values()` stays subscribed to structural changes.

`useProxyRegistry` is the other path. It listens for registry events and exposes `keys`, `values`, `entries`, and `size`. The registry must be created with `events: true`.

```ts
const single = createSingle({ events: true })
const proxy = useProxyRegistry(single)
```

Use `reactive: true` when you also want per-ticket field updates through `upsert`. Use the proxy when you want a snapshot of keys, values, entries, and size.

??? Can I use useProxyRegistry with selection composables?

Yes. Selection composables extend `createRegistry`, so they work with `useProxyRegistry` if events are enabled:

```ts
import { createSelection, useProxyRegistry } from '@vuetify/v0'

const selection = createSelection({ events: true, multiple: true })
const proxy = useProxyRegistry(selection)

// Reactive access to registered items
proxy.size // Updates when items register/unregister

// Selection-specific state is still on the original
selection.selectedIds // Set of selected IDs
```

The proxy only exposes registry properties. For reactive selection state, use the selection instance directly or create a custom reactive wrapper.
:::

<DocsApi />
