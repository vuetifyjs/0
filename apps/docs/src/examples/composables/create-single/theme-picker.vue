<script setup lang="ts">
  import { createSingle } from '@vuetify/v0'
  import { toRef } from 'vue'

  interface Theme {
    name: string
    bg: string
    fg: string
    accent: string
  }

  const themes: Theme[] = [
    { name: 'Ocean', bg: '#0f172a', fg: '#e2e8f0', accent: '#38bdf8' },
    { name: 'Forest', bg: '#14532d', fg: '#dcfce7', accent: '#4ade80' },
    { name: 'Sunset', bg: '#431407', fg: '#fed7aa', accent: '#fb923c' },
    { name: 'Lavender', bg: '#2e1065', fg: '#e9d5ff', accent: '#a78bfa' },
    { name: 'Slate', bg: '#1e293b', fg: '#cbd5e1', accent: '#94a3b8' },
  ]

  const picker = createSingle({ mandatory: true })
  const tickets = picker.onboard(
    themes.map(t => ({ id: t.name.toLowerCase(), value: t })),
  )
  picker.seek('first')?.select()

  const selected = toRef(() => picker.selectedValue.value as Theme | undefined)
</script>

<template>
  <div class="space-y-4">
    <!-- Theme cards -->
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="ticket in tickets"
        :key="ticket.id"
        class="rounded-lg p-3 text-center transition-all border-2"
        :class="ticket.isSelected.value
          ? 'border-primary scale-105 shadow-md'
          : 'border-transparent hover:border-divider'"
        :style="{
          backgroundColor: ticket.value.bg,
          color: ticket.value.fg,
        }"
        @click="ticket.select()"
      >
        <div
          class="size-6 rounded-full mx-auto mb-2"
          :style="{ backgroundColor: ticket.value.accent }"
        />
        <span class="text-xs font-medium">{{ ticket.value.name }}</span>
      </button>
    </div>

    <!-- Preview -->
    <div
      v-if="selected"
      class="rounded-lg p-4 transition-colors"
      :style="{ backgroundColor: selected.bg, color: selected.fg }"
    >
      <p class="text-sm font-semibold mb-1">
        {{ selected.name }} Theme
      </p>
      <p class="text-xs opacity-70 mb-3">
        Preview of the selected color palette.
      </p>
      <div class="flex gap-2">
        <span
          class="px-3 py-1 rounded text-xs font-medium"
          :style="{ backgroundColor: selected.accent, color: selected.bg }"
        >
          Primary
        </span>
        <span
          class="px-3 py-1 rounded text-xs font-medium border"
          :style="{ borderColor: selected.accent, color: selected.accent }"
        >
          Outline
        </span>
      </div>
    </div>

    <!-- State -->
    <div class="text-xs text-on-surface-variant space-y-0.5">
      <p>
        selectedId: <span class="text-on-surface font-medium">{{ picker.selectedId.value }}</span>
      </p>
      <p>
        selectedIndex: <span class="text-on-surface font-medium">{{ picker.selectedIndex.value }}</span>
      </p>
      <p>
        registered: <span class="text-on-surface font-medium">{{ picker.size }}</span>
      </p>
    </div>
  </div>
</template>
