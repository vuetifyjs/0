<script setup lang="ts">
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'

  const brokenRegistry = createRegistry()
  const brokenProxy = useProxyRegistry(brokenRegistry)

  const workingRegistry = createRegistry({ events: true })
  const workingProxy = useProxyRegistry(workingRegistry)

  brokenRegistry.register({ id: 'item-1', value: 'Apple' })
  workingRegistry.register({ id: 'item-1', value: 'Apple' })

  let count = 1

  function add () {
    count++
    brokenRegistry.register({ id: `item-${count}`, value: `Item ${count}` })
    workingRegistry.register({ id: `item-${count}`, value: `Item ${count}` })
  }

  function remove () {
    const values = workingProxy.values
    if (values.length > 0) {
      const id = values[values.length - 1].id
      brokenRegistry.unregister(id)
      workingRegistry.unregister(id)
    }
  }
</script>

<template>
  <div>
    <div class="flex justify-center gap-2">
      <button
        class="px-3 py-1.5 border border-primary text-primary rounded"
        @click="remove"
      >
        −
      </button>
      <button
        class="px-3 py-1.5 bg-primary text-on-primary rounded"
        @click="add"
      >
        +
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <div class="p-4 border border-error rounded">
        <div class="flex items-baseline justify-between">
          <h3 class="text-error font-semibold">Without events</h3>
          <p class="text-2xl font-bold text-error">{{ brokenProxy.size }}</p>
        </div>
        <p class="text-sm text-on-surface-variant">Stuck at initial value</p>
      </div>

      <div class="p-4 border border-success rounded">
        <div class="flex items-baseline justify-between">
          <h3 class="text-success font-semibold">With events: true</h3>
          <p class="text-2xl font-bold text-success">{{ workingProxy.size }}</p>
        </div>
        <p class="text-sm text-on-surface-variant">Updates correctly</p>
      </div>
    </div>

    <p class="text-sm text-on-surface-variant mt-4">
      Actual registry size: {{ brokenRegistry.size }}
    </p>
  </div>
</template>
