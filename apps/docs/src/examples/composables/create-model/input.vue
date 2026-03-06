<script setup lang="ts">
  import { ref } from 'vue'
  import { createModel, useProxyModel } from '@vuetify/v0'

  const value = ref('Apple')

  const store = createModel()

  store.register({ id: 'a', value: 'Apple' })
  store.register({ id: 'b', value: 'Banana' })
  store.register({ id: 'c', value: 'Cherry' })

  useProxyModel(store, value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <input
      v-model="value"
      class="rounded-lg border border-divider bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
      placeholder="Type a fruit name..."
    >

    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">Store</span>
      </div>

      <div class="grid grid-cols-2 gap-1 text-xs">
        <span class="text-on-surface-variant/60">Value</span>
        <span class="font-mono text-on-surface">{{ value ?? 'undefined' }}</span>
        <span class="text-on-surface-variant/60">Matched ID</span>
        <span class="font-mono text-on-surface">{{ [...store.selectedIds][0] ?? '—' }}</span>
      </div>
    </div>

    <div class="flex gap-2">
      <button
        v-for="ticket in store.values()"
        :key="ticket.id"
        class="rounded-md border px-3 py-1.5 text-xs transition-colors"
        :class="ticket.isSelected.value
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider bg-surface text-on-surface-variant hover:bg-surface-variant/50 cursor-pointer'"
        @click="value = String(ticket.value)"
      >
        {{ ticket.value }}
      </button>
    </div>
  </div>
</template>
