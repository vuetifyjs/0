<script setup lang="ts">
  import { ref } from 'vue'
  import { createModel, useProxyModel } from '@vuetify/v0'

  const value = ref('Apple')

  const store = createModel()

  store.register({ id: 'fruit', value })
  store.select('fruit')

  useProxyModel(store, value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <input
      v-model="value"
      class="rounded-lg border border-divider bg-surface px-3 py-2 text-sm font-mono text-on-surface outline-none focus:border-primary"
    >

    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">Store</div>

      <div class="grid grid-cols-2 gap-1 text-xs">
        <span class="text-on-surface-variant/60">Ref</span>
        <span class="font-mono text-on-surface">{{ value ?? 'undefined' }}</span>
        <span class="text-on-surface-variant/60">Selected ID</span>
        <span class="font-mono text-on-surface">{{ [...store.selectedIds][0] ?? '—' }}</span>
        <span class="text-on-surface-variant/60">Store value</span>
        <span class="font-mono text-on-surface">{{ [...store.selectedValues.value][0] ?? '—' }}</span>
      </div>
    </div>
  </div>
</template>
