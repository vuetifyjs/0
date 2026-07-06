<script lang="ts">
  // Framework
  import { useId } from '@vuetify/v0'

  // Context
  import { useDatePickerGrid } from './EmDatePickerGrid.vue'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef } from 'vue'

  export interface EmDatePickerCellProps {
    selected?: boolean
    disabled?: boolean
    today?: boolean
    weekday?: boolean
    outside?: boolean
    start?: boolean
    end?: boolean
    between?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerCell' })

  const {
    selected = false,
    disabled = false,
    today = false,
    weekday = false,
    outside = false,
    start = false,
    end = false,
    between = false,
  } = defineProps<EmDatePickerCellProps>()

  const id = useId()
  const cell = useTemplateRef<HTMLElement>('cell')
  const grid = useDatePickerGrid()

  if (!weekday && grid) {
    grid.register({ id, el: cell, disabled: () => disabled })

    onBeforeUnmount(() => grid.unregister(id))
  }

  const tabindex = toRef(() => {
    if (weekday) return undefined
    if (!grid) return 0

    return grid.isTabbable(id) ? 0 : -1
  })

  const active = toRef(() => selected || start || end)

  function onFocus () {
    if (weekday) return

    grid?.focus(id)
  }
</script>

<template>
  <component
    :is="weekday ? 'span' : 'button'"
    ref="cell"
    :aria-current="today ? 'date' : undefined"
    :aria-selected="weekday ? undefined : (active || between)"
    class="emerald-date-picker__cell"
    :data-between="between || undefined"
    :data-disabled="disabled || undefined"
    :data-end="end || undefined"
    :data-outside="outside || undefined"
    :data-selected="selected || undefined"
    :data-start="start || undefined"
    :data-today="today || undefined"
    :data-weekday="weekday || undefined"
    :disabled="weekday ? undefined : (disabled || undefined)"
    :role="weekday ? 'columnheader' : 'gridcell'"
    :tabindex
    :type="weekday ? undefined : 'button'"
    @focus="onFocus"
  >
    <slot />
  </component>
</template>

<style scoped>
.emerald-date-picker__cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  padding: 0 var(--emerald-spacing-xs);
  border: none;
  border-radius: var(--emerald-radius-xs);
  background: transparent;
  font-family: inherit;
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
  cursor: pointer;
  overflow: clip;
}

.emerald-date-picker__cell:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-date-picker__cell[data-weekday] {
  font-weight: var(--emerald-text-b2-bold-weight);
  cursor: default;
}

.emerald-date-picker__cell:not([data-weekday]):not([data-disabled]):not([data-selected]):not([data-start]):not([data-end]):not([data-between]):hover {
  background: var(--emerald-neutral-200);
}

.emerald-date-picker__cell[data-today]:not([data-selected]):not([data-start]):not([data-end]) {
  outline: var(--emerald-stroke-s) solid var(--emerald-primary-600);
  outline-offset: calc(-1 * var(--emerald-stroke-s));
  font-weight: 600;
}

.emerald-date-picker__cell[data-selected],
.emerald-date-picker__cell[data-start],
.emerald-date-picker__cell[data-end] {
  background: var(--emerald-primary-600);
  color: var(--emerald-on-primary);
  font-weight: 600;
}

.emerald-date-picker__cell[data-start] {
  border-radius: var(--emerald-radius-xs) 0 0 var(--emerald-radius-xs);
}

.emerald-date-picker__cell[data-end] {
  border-radius: 0 var(--emerald-radius-xs) var(--emerald-radius-xs) 0;
}

.emerald-date-picker__cell[data-start][data-end] {
  border-radius: var(--emerald-radius-xs);
}

.emerald-date-picker__cell[data-between] {
  background: var(--emerald-primary-200);
  border-radius: 0;
  color: var(--emerald-on-surface);
  font-weight: 600;
}

.emerald-date-picker__cell[data-outside] {
  color: var(--emerald-neutral-400);
}

.emerald-date-picker__cell[data-disabled] {
  color: var(--emerald-neutral-400);
  font-weight: var(--emerald-text-b2-weight);
  cursor: not-allowed;
}
</style>
