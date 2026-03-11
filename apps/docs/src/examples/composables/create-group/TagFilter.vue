<script setup lang="ts">
  import { mdiCheck, mdiCheckboxBlankOutline, mdiCheckboxIntermediate, mdiCheckboxMarked } from '@mdi/js'
  import { toRef } from 'vue'

  import { createTagFilter, tags } from './context'

  const group = createTagFilter()
  const tickets = group.onboard(tags)

  const icon = toRef(() => {
    if (group.isAllSelected.value) return mdiCheckboxMarked
    if (group.isMixed.value) return mdiCheckboxIntermediate
    return mdiCheckboxBlankOutline
  })

  defineExpose({ group, tickets })
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button
        class="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
        @click="group.toggleAll()"
      >
        <svg class="size-5" viewBox="0 0 24 24">
          <path :d="icon" fill="currentColor" />
        </svg>
        <span>{{ group.isAllSelected.value ? 'Clear all' : 'Select all' }}</span>
      </button>

      <span class="text-xs text-on-surface-variant">
        {{ group.selectedIds.size }} / {{ group.size }} selected
      </span>
    </div>

    <!-- Chips -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="ticket in tickets"
        :key="ticket.id"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200"
        :class="[
          ticket.isSelected.value
            ? 'bg-surface text-on-surface border-primary'
            : 'bg-surface text-on-surface-variant border-divider hover:border-primary/50',
        ]"
        @click="ticket.toggle()"
      >
        <span
          class="size-2 rounded-full transition-opacity duration-200"
          :class="ticket.isSelected.value ? 'opacity-100' : 'opacity-50'"
          :style="{ backgroundColor: ticket.color }"
        />

        {{ ticket.value }}

        <svg
          class="size-3.5 transition-all duration-200"
          :class="ticket.isSelected.value ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
          viewBox="0 0 24 24"
        >
          <path :d="mdiCheck" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>
