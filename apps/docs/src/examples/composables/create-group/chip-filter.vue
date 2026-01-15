<script setup lang="ts">
  import { createGroup } from '@vuetify/v0'
  import { computed } from 'vue'

  const tags = [
    { id: 'vue', label: 'Vue', color: 'bg-emerald-500' },
    { id: 'react', label: 'React', color: 'bg-sky-500' },
    { id: 'svelte', label: 'Svelte', color: 'bg-orange-500' },
    { id: 'angular', label: 'Angular', color: 'bg-red-500' },
    { id: 'solid', label: 'Solid', color: 'bg-blue-500' },
    { id: 'qwik', label: 'Qwik', color: 'bg-violet-500' },
  ]

  const group = createGroup()
  const tickets = group.onboard(tags.map(t => ({ id: t.id, value: t })))

  const checkboxIcon = computed(() => {
    if (group.isAllSelected.value) return 'i-lucide-check-square'
    if (group.isMixed.value) return 'i-lucide-minus-square'
    return 'i-lucide-square'
  })

  const results = computed(() => {
    if (group.isNoneSelected.value) return tags
    return tags.filter(t => group.selected(t.id))
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Header with tri-state checkbox -->
    <div class="flex items-center justify-between">
      <button
        class="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
        @click="group.toggleAll()"
      >
        <div
          class="size-5 transition-transform"
          :class="checkboxIcon"
          :style="{ transform: group.isMixed.value ? 'rotate(-90deg)' : 'rotate(0deg)' }"
        />
        <span>{{ group.isAllSelected.value ? 'Clear all' : 'Select all' }}</span>
      </button>
      <span class="text-xs text-on-surface-variant">
        {{ group.selectedIds.size }} / {{ group.size }} selected
      </span>
    </div>

    <!-- Chip cloud -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="ticket in tickets"
        :key="ticket.id"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200"
        :class="[
          ticket.isSelected.value
            ? 'bg-surface text-on-surface border-primary scale-105'
            : 'bg-surface text-on-surface-variant border-divider hover:border-primary/50'
        ]"
        @click="ticket.toggle()"
      >
        <span
          class="size-2 rounded-full transition-opacity duration-200"
          :class="[ticket.value.color, ticket.isSelected.value ? 'opacity-100' : 'opacity-50']"
        />
        {{ ticket.value.label }}
        <span
          class="i-lucide-check size-3.5 transition-all duration-200"
          :class="ticket.isSelected.value ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
        />
      </button>
    </div>

    <!-- Results preview -->
    <div class="pt-4 border-t border-divider">
      <p class="text-xs text-on-surface-variant mb-2">
        {{ group.isNoneSelected.value ? 'Showing all' : 'Filtered results' }}:
      </p>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in results"
          :key="tag.id"
          class="px-2 py-0.5 text-xs rounded bg-surface-variant text-on-surface-variant"
        >
          {{ tag.label }}
        </span>
      </div>
    </div>
  </div>
</template>
