<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmDatePickerProps extends V0PaperProps {
    modelValue?: Date | null
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePicker' })

  // TODO(emerald): wire createCalendar/useDate once v0 ships a DatePicker primitive
  const { disabled = false, ...paperProps } = defineProps<EmDatePickerProps>()

  const model = defineModel<Date | null>({ default: null })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-date-picker"
    :data-disabled="disabled || undefined"
  >
    <slot :model />
  </V0Paper>
</template>

<style>
.emerald-date-picker {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 234px;
  padding: 12px 7px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow:
    0 1px 3px rgb(5 0 18 / 0.12),
    0 1px 5px rgb(5 0 18 / 0.2);
  overflow: clip;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: #000000;
}

.emerald-date-picker[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
