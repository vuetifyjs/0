<script setup lang="ts">
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'

  const registry = createRegistry({ events: true })
  const proxy = useProxyRegistry(registry)
  const ticket = registry.register({ id: 'item-1', value: 0 })

  function update () {
    ticket.value++
  }
</script>

<template>
  <div class="p-4 border border-error rounded">
    <div class="flex items-baseline justify-between">
      <h3 class="text-error font-semibold">Without reactive: true</h3>
      <p class="text-2xl font-bold text-error">{{ proxy.values[0]?.value }}</p>
    </div>
    <p class="text-sm text-on-surface-variant">Stuck at initial value</p>
    <button
      class="mt-3 px-3 py-1.5 bg-error text-on-error rounded"
      @click="update"
    >
      Update
    </button>
    <p class="text-sm text-on-surface-variant mt-2">
      Actual: {{ ticket.value }}
    </p>
  </div>
</template>
