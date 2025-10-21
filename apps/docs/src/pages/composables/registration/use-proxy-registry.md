---
meta:
  title: useProxyRegistry
  description: A reactive proxy wrapper for registry collections that automatically updates refs when items are registered or unregistered.
  keywords: useProxyRegistry, registry, reactive, composable, Vue, state management
category: Registration
performance: 0
---

# useProxyRegistry

A reactive proxy wrapper for registry collections that automatically updates refs when items are registered or unregistered.

<DocsPageFeatures />

## Usage

The `useProxyRegistry` composable creates reactive refs that automatically sync with a registry's state. It listens for registry changes and updates the reactive refs accordingly, making it ideal for template-driven UIs that need to react to registry mutations.

**Important:** The registry must have `events: true` enabled for the proxy to receive updates.

```ts
import { useRegistry, useProxyRegistry } from '@vuetify/v0'

const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry)

registry.register({ value: 'Item 1' })
registry.register({ value: 'Item 2' })

console.log(proxy.size.value) // 2
console.log(proxy.keys.value) // [id1, id2]
```

## API


| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry) | The underlying registry system |
| [useSelection](/composables/selection/use-selection) | Selection-enabled registries |
| [useTokens](/composables/registration/use-tokens) | Token management with registries |
### `useProxyRegistry`

- **Type**

  ```ts
  interface ProxyRegistryOptions {
    deep?: boolean
  }

  interface ProxyRegistryContext<Z extends RegistryTicket = RegistryTicket, D extends boolean = false> {
    keys: D extends true ? Ref<ID[]> : ShallowRef<ID[]>
    values: D extends true ? Ref<Z[]> : ShallowRef<Z[]>
    entries: D extends true ? Ref<[ID, Z][]> : ShallowRef<[ID, Z][]>
    size: D extends true ? Ref<number> : ShallowRef<number>
  }

  function useProxyRegistry<
    Z extends RegistryTicket = RegistryTicket,
    D extends boolean = false,
  > (
    registry: RegistryContext<Z>,
    options?: ProxyRegistryOptions & { deep?: D },
  ): ProxyRegistryContext<Z, D>
  ```

- **Details**

  Creates a reactive proxy that wraps a registry's collection data in Vue refs. The proxy automatically subscribes to the registry's `register` and `unregister` events (requires `events: true` on the registry) and updates the reactive refs synchronously whenever the registry changes.

  By default, the proxy uses shallow reactivity (`shallowRef`) for performance. Enable the `deep` option if you need deep reactivity for nested object mutations.

  The proxy automatically cleans up event listeners via `onScopeDispose`, preventing memory leaks when components are unmounted.

- **Parameters**
  - `registry`: A registry instance created with `useRegistry({ events: true })`
  - `options` (optional):
    - `deep`: If `true`, uses `ref()` for deep reactivity instead of `shallowRef()`. Defaults to `false`.

- **Returns**

  A proxy object containing:
  - `keys`: A reactive ref containing all registry IDs
  - `values`: A reactive ref containing all registry tickets
  - `entries`: A reactive ref containing all [ID, ticket] tuples
  - `size`: A reactive ref containing the count of registered items

- **Example**

  ```ts
  import { useRegistry, useProxyRegistry } from '@vuetify/v0'
  import { watchEffect } from 'vue'

  const registry = useRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  watchEffect(() => {
    console.log(`Registry has ${proxy.size.value} items`)
  })

  registry.register({ value: 'First' })  // Logs: Registry has 1 items
  registry.register({ value: 'Second' }) // Logs: Registry has 2 items
  ```
