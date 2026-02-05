<script setup lang="ts">
  /**
   * Pattern 3: reactive: true
   *
   * Enable ticket-level reactivity. Tickets become shallowReactive,
   * so direct mutations trigger re-renders.
   *
   * Combine with useProxyRegistry for both collection AND ticket reactivity.
   */
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'

  const registry = createRegistry({ events: true, reactive: true })
  const proxy = useProxyRegistry(registry)

  // Seed initial data
  registry.register({ id: 'item-1', value: 'Click to edit me', clicks: 0 })
  registry.register({ id: 'item-2', value: 'Or edit me!', clicks: 0 })

  let count = 2

  function add () {
    registry.register({
      id: `item-${++count}`,
      value: `Item ${count}`,
      clicks: 0,
    })
  }

  function clickItem (item: { value: string, clicks: number }) {
    // Direct mutation works because reactive: true makes tickets shallowReactive
    item.clicks++
    item.value = `Clicked ${item.clicks} time${item.clicks === 1 ? '' : 's'}`
  }
</script>

<template>
  <div>
    <button
      class="px-3 py-1.5 bg-primary text-on-primary rounded"
      @click="add"
    >
      Add Item
    </button>

    <p class="text-success mt-4">
      Items: {{ proxy.size }}
    </p>

    <ul class="mt-2 space-y-1">
      <li
        v-for="item in proxy.values"
        :key="item.id"
        class="px-2 py-1 bg-surface-container rounded cursor-pointer hover:bg-surface-container-high transition-colors"
        @click="clickItem(item)"
      >
        {{ item.value }}
        <span class="text-sm text-on-surface-variant ml-2">
          ({{ item.clicks }} clicks)
        </span>
      </li>
    </ul>

    <p class="text-sm text-on-surface-variant mt-4">
      Click items to update them. Mutations work because tickets are shallowReactive.
    </p>
  </div>
</template>
