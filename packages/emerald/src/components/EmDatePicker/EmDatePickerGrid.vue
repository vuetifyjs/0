<script lang="ts">
  // Framework
  import { createContext, useRovingFocus } from '@vuetify/v0'

  // Utilities
  import { shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { ID, RovingItem } from '@vuetify/v0'

  export interface EmDatePickerGridProps {}

  export interface EmDatePickerGridContext {
    register: (item: RovingItem) => void
    unregister: (id: ID) => void
    isTabbable: (id: ID) => boolean
    focus: (id: ID) => void
  }

  export const [useDatePickerGrid, provideDatePickerGrid] = createContext<EmDatePickerGridContext | null>('emerald:date-picker-grid', null)
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerGrid' })

  const grid = useTemplateRef<HTMLElement>('grid')
  const cells = shallowRef<RovingItem[]>([])

  const roving = useRovingFocus(() => cells.value, {
    columns: 7,
    target: grid,
  })

  provideDatePickerGrid({
    register (item) {
      cells.value = [...cells.value, item]
    },
    unregister (id) {
      cells.value = cells.value.filter(item => item.id !== id)
    },
    isTabbable: roving.isTabbable,
    focus: roving.focus,
  })
</script>

<template>
  <div ref="grid" class="emerald-date-picker__grid" role="grid">
    <slot />
  </div>
</template>

<style scoped>
.emerald-date-picker__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: center;
  justify-items: center;
  gap: var(--emerald-spacing-2xs);
  width: 100%;
}
</style>
