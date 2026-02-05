<script setup lang="ts">
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'

  const registry = createRegistry({ events: true, reactive: true })
  const proxy = useProxyRegistry(registry)
  const ticket = registry.register({ id: 'item-1', value: 0 })

  function update () {
    ticket.value++
  }
</script>

<template>
  <div class="p-4 border border-success rounded">
    <div class="flex items-baseline justify-between">
      <h3 class="text-success font-semibold">With reactive: true</h3>
      <p class="text-2xl font-bold text-success">{{ proxy.values[0]?.value }}</p>
    </div>
    <p class="text-sm text-on-surface-variant">Updates correctly</p>
    <button
      class="mt-3 px-3 py-1.5 bg-success text-on-success rounded"
      @click="update"
    >
      Update
    </button>
    <p class="text-sm text-on-surface-variant mt-2">
      Actual: {{ ticket.value }}
    </p>
  </div>
</template>
