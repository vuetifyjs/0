<script setup lang="ts">
  import { createSelection, useProxyModel } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const selected = shallowRef('blue')

  const colors = [
    { id: 'red', value: 'red', label: 'Red', hex: '#ef4444' },
    { id: 'orange', value: 'orange', label: 'Orange', hex: '#f97316' },
    { id: 'yellow', value: 'yellow', label: 'Yellow', hex: '#eab308' },
    { id: 'green', value: 'green', label: 'Green', hex: '#22c55e' },
    { id: 'blue', value: 'blue', label: 'Blue', hex: '#3b82f6' },
    { id: 'purple', value: 'purple', label: 'Purple', hex: '#a855f7' },
  ]

  const selection = createSelection({ events: true })
  selection.onboard(colors)

  useProxyModel(selection, selected)

  const active = toRef(() =>
    colors.find(c => c.value === selected.value),
  )
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <button
        v-for="ticket in selection.values()"
        :key="ticket.id"
        class="size-10 rounded-full border-2 transition-all"
        :class="ticket.isSelected.value
          ? 'border-on-surface scale-110 shadow-lg'
          : 'border-transparent hover:scale-105'"
        :style="{ backgroundColor: colors.find(c => c.id === ticket.id)?.hex }"
        @click="ticket.select()"
      />
    </div>

    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
        v-model bridge
      </div>

      <div class="grid grid-cols-2 gap-1 text-xs">
        <span class="text-on-surface-variant/60">Ref value</span>
        <span class="font-mono text-on-surface">{{ selected }}</span>

        <span class="text-on-surface-variant/60">Selection value</span>
        <span class="font-mono text-on-surface">{{ [...selection.selectedValues.value][0] ?? '—' }}</span>

        <span class="text-on-surface-variant/60">Active label</span>
        <span class="font-mono text-on-surface">{{ active?.label ?? '—' }}</span>
      </div>
    </div>

    <div class="flex gap-2">
      <button
        v-for="color in colors"
        :key="color.id"
        class="px-2 py-1 text-xs rounded border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
        @click="selected = color.value"
      >
        Set "{{ color.label }}" via ref
      </button>
    </div>
  </div>
</template>
