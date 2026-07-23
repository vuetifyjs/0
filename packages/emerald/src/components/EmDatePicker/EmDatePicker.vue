<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmDatePickerValue = Date | [Date | null, Date | null] | null

  export interface EmDatePickerProps extends V0PaperProps {
    modelValue?: EmDatePickerValue
    disabled?: boolean
    range?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePicker' })

  // TODO(emerald): wire createCalendar/useDate once v0 ships a DatePicker primitive
  const { disabled = false, range = false, ...paperProps } = defineProps<EmDatePickerProps>()

  const model = defineModel<EmDatePickerValue>({ default: null })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-date-picker"
    :data-disabled="disabled || undefined"
    :data-range="range || undefined"
  >
    <slot :model />
  </V0Paper>
</template>

<style scoped>
.emerald-date-picker {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--emerald-spacing-s);
  width: 266px;
  /* TODO(token): spec horizontal padding is 7px — no spacing token between 3xs (2px) and 2xs (4px) fits */
  padding: var(--emerald-spacing-s) 7px;
  border-radius: var(--emerald-radius-s);
  background: var(--emerald-surface);
  box-shadow: var(--emerald-shadow-m);
  overflow: clip;
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
}

.emerald-date-picker[data-range] {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  width: fit-content;
  column-gap: var(--emerald-spacing-xl);
}

.emerald-date-picker[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
