<script setup lang="ts">
  import { mdiPencilOutline } from '@mdi/js'

  import type { ID } from '@vuetify/v0'

  interface EditEntry {
    row: ID
    column: string
    from: unknown
    to: unknown
  }

  defineProps<{
    history: { id?: ID, value: EditEntry }[]
    size: number
  }>()
</script>

<template>
  <div
    v-if="size > 0"
    class="border border-divider rounded-lg overflow-hidden"
  >
    <div class="px-3 py-2 bg-surface-tint text-xs font-medium border-b border-divider flex items-center justify-between">
      <span>Edit history</span>
      <span class="text-on-surface-variant tabular-nums">{{ size }} / 50</span>
    </div>

    <div class="divide-y divide-divider text-xs max-h-40 overflow-y-auto">
      <div
        v-for="(entry, index) in history"
        :key="entry.id ?? index"
        class="px-3 py-2 flex items-center gap-3"
      >
        <span class="text-on-surface-variant w-16 truncate">{{ entry.value.column }}</span>
        <span class="text-on-surface-variant line-through tabular-nums">{{ entry.value.from }}</span>
        <span class="text-on-surface-variant">&rarr;</span>
        <span class="text-primary font-medium tabular-nums">{{ entry.value.to }}</span>
      </div>
    </div>
  </div>

  <div
    v-else
    class="text-xs text-on-surface-variant flex items-center gap-1.5"
  >
    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
      <path :d="mdiPencilOutline" fill="currentColor" />
    </svg>

    <span>Click any cell to edit. Enter or clicking away commits, Escape cancels, Ctrl+Z / Ctrl+Y to undo or redo.</span>
  </div>
</template>
