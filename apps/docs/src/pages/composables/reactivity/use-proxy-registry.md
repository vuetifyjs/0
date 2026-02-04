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

```ts
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
| `keys` | <AppSuccessIcon /> | Updates on register/unregister |
| `values` | <AppSuccessIcon /> | Updates on register/unregister/update |
| `entries` | <AppSuccessIcon /> | Updates on any ticket change |
| `size` | <AppSuccessIcon /> | Updates on register/unregister |

> [!TIP] Deep vs shallow
> Pass `{ deep: true }` for `reactive()`, or omit for `shallowReactive()` (default). Shallow is more performant when ticket internals don't need tracking.

<DocsApi />

## Frequently Asked Questions

::: faq
??? Why does the registry need `events: true`?

`useProxyRegistry` listens for `register` and `unregister` events to know when to update reactive properties. Without events, the registry operates silently:

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

Events add minimal overhead but aren't enabled by default since many use cases don't need reactivity. See [createRegistry](/composables/registration/create-registry) for the full events API.

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
| `values` | `unknown[]` | Yes |
| `items` | `Map<ID, Ticket>` | Yes |
| `has(id)` | `boolean` | Yes |
| `get(id)` | `Ticket \| undefined` | Yes |

Mutations (`register`, `unregister`) are pass-through methods that trigger updates via events.

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
  <div v-for="id in proxy.keys" :key="id">
    {{ proxy.get(id)?.value }}
  </div>
</template>
```

If you only read `size`, adding items triggers a re-render. If you iterate `keys`, any registration change triggers a re-render. Structure templates to minimize reactive dependencies.

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
