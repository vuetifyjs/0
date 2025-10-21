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

### Reactivity Options

By default, `useProxyRegistry` uses shallow reactivity for optimal performance:

```ts
const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry)

// proxy.keys is a ShallowRef<ID[]>
// proxy.values is a ShallowRef<Z[]>
```

For deep reactivity (useful when tickets contain nested objects you want to mutate):

```ts
const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry, { deep: true })

// proxy.keys is a Ref<ID[]>
// proxy.values is a Ref<Z[]>
```

### Template Usage

The proxy is particularly useful in Vue templates where reactive data is required:

```vue
<script setup lang="ts">
import { useRegistry, useProxyRegistry } from '@vuetify/v0'

const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry)

registry.register({ value: 'Apple' })
registry.register({ value: 'Banana' })
registry.register({ value: 'Cherry' })
</script>

<template>
  <ul>
    <li v-for="item in proxy.values.value" :key="item.id">
      {{ item.value }}
    </li>
  </ul>
  <p>Total items: {{ proxy.size.value }}</p>
</template>
```

### `keys`

- **Type**
  ```ts
  ShallowRef<ID[]> | Ref<ID[]>
  ```

- **Details**
  A reactive ref containing all registry IDs. Updates automatically when items are registered or unregistered.

- **Example**
  ```ts
  const registry = useRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  const ticket1 = registry.register({ value: 'First' })
  const ticket2 = registry.register({ value: 'Second' })

  console.log(proxy.keys.value) // [ticket1.id, ticket2.id]
  ```

### `values`

- **Type**
  ```ts
  ShallowRef<Z[]> | Ref<Z[]>
  ```

- **Details**
  A reactive ref containing all registry tickets. Updates automatically when items are registered or unregistered.

- **Example**
  ```ts
  const registry = useRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  registry.register({ value: 'Apple' })
  registry.register({ value: 'Banana' })

  console.log(proxy.values.value.map(t => t.value))
  // ['Apple', 'Banana']
  ```

### `entries`

- **Type**
  ```ts
  ShallowRef<[ID, Z][]> | Ref<[ID, Z][]>
  ```

- **Details**
  A reactive ref containing all registry entries as [ID, ticket] tuples. Updates automatically when items are registered or unregistered.

- **Example**
  ```ts
  const registry = useRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  registry.register({ id: 'a', value: 'Apple' })
  registry.register({ id: 'b', value: 'Banana' })

  for (const [id, ticket] of proxy.entries.value) {
    console.log(`${id}: ${ticket.value}`)
  }
  // a: Apple
  // b: Banana
  ```

### `size`

- **Type**
  ```ts
  ShallowRef<number> | Ref<number>
  ```

- **Details**
  A reactive ref containing the count of registered items. Updates automatically when items are registered or unregistered.

- **Example**
  ```ts
  const registry = useRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  console.log(proxy.size.value) // 0

  registry.register({ value: 'Item 1' })
  console.log(proxy.size.value) // 1

  registry.register({ value: 'Item 2' })
  console.log(proxy.size.value) // 2
  ```

## Performance Considerations

### Shallow vs Deep Reactivity

By default, `useProxyRegistry` uses `shallowRef` for better performance. This means:

- Changes to array/ticket references are tracked
- Mutations to ticket properties are NOT tracked
- Use `deep: true` only if you need to mutate ticket properties reactively

```ts
// Shallow (default) - best performance
const proxy = useProxyRegistry(registry)
// Tracked: registry.register(), registry.unregister()
// NOT tracked: ticket.value = 'new value'

// Deep - tracks nested mutations
const proxy = useProxyRegistry(registry, { deep: true })
// Tracked: everything including ticket property mutations
```

### Update Timing

Updates happen synchronously when registry events are emitted:

```ts
const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry)

registry.register({ value: 'A' })
console.log(proxy.size.value) // 1

registry.register({ value: 'B' })
console.log(proxy.size.value) // 2

registry.register({ value: 'C' })
console.log(proxy.size.value) // 3
```

Note: While proxy updates are synchronous, Vue's reactivity system may still batch DOM updates. Use `nextTick()` if you need to wait for the DOM to reflect changes.

### Multiple Proxies

You can create multiple proxy instances on the same registry. Each proxy maintains its own refs but shares the same event subscription:

```ts
const registry = useRegistry({ events: true })
const proxy1 = useProxyRegistry(registry)
const proxy2 = useProxyRegistry(registry, { deep: true })

registry.register({ value: 'Item' })

console.log(proxy1.size.value) // 1
console.log(proxy2.size.value) // 1
```

## Memory Management

The proxy automatically cleans up event listeners when the component/scope is disposed:

```ts
import { effectScope } from 'vue'

const scope = effectScope()

scope.run(() => {
  const registry = useRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  // Proxy subscribes to registry events
})

scope.stop() // Proxy automatically unsubscribes
```

This prevents memory leaks in long-lived applications where components are frequently mounted and unmounted.

## Common Patterns

### Reactive List Rendering

```vue
<script setup lang="ts">
import { useRegistry, useProxyRegistry } from '@vuetify/v0'

const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry)

registry.onboard([
  { value: 'Task 1' },
  { value: 'Task 2' },
  { value: 'Task 3' },
])
</script>

<template>
  <div v-for="(ticket, index) in proxy.values.value" :key="ticket.id">
    <span>{{ index + 1 }}. {{ ticket.value }}</span>
  </div>
</template>
```

### Computed Derived State

```ts
import { computed } from 'vue'

const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry)

const isEmpty = computed(() => proxy.size.value === 0)
const firstItem = computed(() => proxy.values.value[0])
const lastItem = computed(() => proxy.values.value[proxy.size.value - 1])
```

### Watching for Changes

```ts
import { watch } from 'vue'

const registry = useRegistry({ events: true })
const proxy = useProxyRegistry(registry)

watch(() => proxy.size.value, (newSize, oldSize) => {
  console.log(`Registry size changed from ${oldSize} to ${newSize}`)
})
```

## See Also

- [useRegistry](/composables/registration/use-registry) - The underlying registry system
- [useSelection](/composables/selection/use-selection) - Selection-enabled registries
- [useTokens](/composables/registration/use-tokens) - Token management with registries
