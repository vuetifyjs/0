<script lang="ts">
  export interface EmDatePickerCellProps {
    selected?: boolean
    disabled?: boolean
    today?: boolean
    weekday?: boolean
    outside?: boolean
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
  } = defineProps<EmDatePickerCellProps>()
</script>

<template>
  <button
    class="emerald-date-picker__cell"
    :data-disabled="disabled || undefined"
    :data-outside="outside || undefined"
    :data-selected="selected || undefined"
    :data-today="today || undefined"
    :data-weekday="weekday || undefined"
    :disabled="disabled || weekday"
    :role="weekday ? 'columnheader' : 'gridcell'"
    :tabindex="weekday ? -1 : 0"
    type="button"
  >
    <slot />
  </button>
</template>

<style>
.emerald-date-picker__cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  background: #ffffff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  cursor: pointer;
  overflow: clip;
}

.emerald-date-picker__cell[data-weekday] {
  font-weight: 600;
  cursor: default;
}

.emerald-date-picker__cell:not([data-weekday]):not([data-disabled]):hover {
  background: rgb(var(--emerald-primary-500-channels, 24 180 140) / 0.1);
}

.emerald-date-picker__cell[data-today]:not([data-selected]) {
  outline: 1px solid var(--emerald-primary-500, #18b48c);
  outline-offset: -1px;
}

.emerald-date-picker__cell[data-selected] {
  background: var(--emerald-primary-500, #18b48c);
  color: #ffffff;
}

.emerald-date-picker__cell[data-outside] {
  color: rgb(0 0 0 / 0.35);
}

.emerald-date-picker__cell[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
