<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'

  const registry = createRegistry({ events: true })
  const proxy = useProxyRegistry(registry)

  registry.register({ id: 'item-1', value: 'Apple' })

  const brokenSize = ref(0)
  watchEffect(() => {
    brokenSize.value = registry.size
  })

  const workingSize = computed(() => proxy.size)

  let count = 1

  function add () {
    registry.register({
      id: `item-${++count}`,
      value: `Item ${count}`,
    })
  }

  function remove () {
    const values = proxy.values
    if (values.length > 0) {
      registry.unregister(values[values.length - 1].id)
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
          <h3 class="text-error font-semibold">Watching registry.size</h3>
          <p class="text-2xl font-bold text-error">{{ brokenSize }}</p>
        </div>
        <p class="text-sm text-on-surface-variant">Stuck at initial value</p>
      </div>

      <div class="p-4 border border-success rounded">
        <div class="flex items-baseline justify-between">
          <h3 class="text-success font-semibold">Using proxy.size</h3>
          <p class="text-2xl font-bold text-success">{{ workingSize }}</p>
        </div>
        <p class="text-sm text-on-surface-variant">Updates correctly</p>
      </div>
    </div>

    <p class="text-sm text-on-surface-variant mt-4">
      Actual registry size: {{ registry.size }}
    </p>
  </div>
</template>
