<script setup lang="ts">
  /**
   * Pattern 1: useProxyRegistry
   *
   * The recommended way to get reactive collection access.
   * Wrap any registry with useProxyRegistry() for template reactivity.
   *
   * IMPORTANT: Requires { events: true } on the registry.
   */
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'

  const registry = createRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  // Seed initial data
  registry.register({ id: 'item-1', value: 'Apple' })
  registry.register({ id: 'item-2', value: 'Banana' })

  let count = 2

  function add () {
    registry.register({
      id: `item-${++count}`,
      value: `Item ${count}`,
    })
  }

  function removeLast () {
    const values = proxy.values
    if (values.length > 0) {
      registry.unregister(values[values.length - 1].id)
    }
  }
</script>

<template>
  <div>
    <div class="flex gap-2">
      <button
        class="px-3 py-1.5 bg-primary text-on-primary rounded"
        @click="add"
      >
        Add Item
      </button>

      <button
        class="px-3 py-1.5 bg-error text-on-error rounded"
        :disabled="proxy.size === 0"
        @click="removeLast"
      >
        Remove Last
      </button>
    </div>

    <p class="text-success mt-4">
      Items: {{ proxy.size }}
      <span class="text-sm text-on-surface-variant">(updates!)</span>
    </p>

    <ul class="mt-2 space-y-1">
      <li
        v-for="item in proxy.values"
        :key="item.id"
        class="px-2 py-1 bg-surface-container rounded"
      >
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>
