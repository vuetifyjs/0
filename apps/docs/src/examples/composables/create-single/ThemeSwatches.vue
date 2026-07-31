<script setup lang="ts">
  import type { ThemePicker } from './useThemePicker'

  const { picker } = defineProps<{ picker: ThemePicker }>()
</script>

<template>
  <div class="grid grid-cols-5 gap-2">
    <button
      v-for="ticket in picker.tickets"
      :key="ticket.id"
      class="rounded-lg p-3 text-center transition-all border-2"
      :class="ticket.isSelected.value
        ? 'border-primary scale-105 shadow-md'
        : 'border-transparent hover:border-divider'"
      :style="{ backgroundColor: ticket.value.bg, color: ticket.value.fg }"
      @click="ticket.select()"
    >
      <span
        class="size-6 rounded-full mx-auto mb-2 block"
        :style="{ backgroundColor: ticket.value.accent }"
      />

      <span class="text-xs font-medium">{{ ticket.value.name }}</span>
    </button>
  </div>
</template>
