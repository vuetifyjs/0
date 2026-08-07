<script setup lang="ts">
  import { useRovingFocus } from '@vuetify/v0'
  import { computed, useTemplateRef } from 'vue'

  export interface Swatch {
    id: string
    hex: string
    label: string
  }

  const { swatches, columns = 6 } = defineProps<{
    swatches: Swatch[]
    columns?: number
  }>()

  const selected = defineModel<string>()

  const grid = useTemplateRef('grid')

  const rows = computed(() => {
    const result: Swatch[][] = []
    for (let i = 0; i < swatches.length; i += columns) {
      result.push(swatches.slice(i, i + columns))
    }
    return result
  })

  const { focusedId, isTabbable } = useRovingFocus(
    () => swatches.map(s => ({
      id: s.id,
      el: () => grid.value?.querySelector(`[data-id="${s.id}"]`),
    })),
    {
      target: grid,
      columns,
      circular: true,
      onFocus: id => {
        selected.value = String(id)
      },
    },
  )
</script>

<template>
  <div
    ref="grid"
    aria-label="Color palette"
    class="inline-grid gap-1"
    role="grid"
    :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }"
  >
    <div v-for="(row, index) in rows" :key="index" class="contents" role="row">
      <button
        v-for="swatch in row"
        :key="swatch.id"
        :aria-label="swatch.label"
        :aria-selected="selected === swatch.id"
        class="w-8 h-8 rounded-md transition-all outline-none"
        :class="[
          focusedId === swatch.id
            ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface scale-110'
            : selected === swatch.id
              ? 'ring-2 ring-on-surface ring-offset-1 ring-offset-surface'
              : 'hover:scale-105',
        ]"
        :data-id="swatch.id"
        role="gridcell"
        :style="{ backgroundColor: swatch.hex }"
        :tabindex="isTabbable(swatch.id) ? 0 : -1"
        @click="selected = swatch.id"
      />
    </div>
  </div>
</template>
