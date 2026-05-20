<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmDatePickerProps extends AtomProps {
    modelValue?: Date | null
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePicker' })

  // TODO(emerald): wire createCalendar/useDate once v0 ships a DatePicker primitive
  const {
    disabled = false,
    as = 'div',
    renderless = false,
  } = defineProps<EmDatePickerProps>()

  const model = defineModel<Date | null>({ default: null })
</script>

<template>
  <Atom
    :as
    class="emerald-date-picker"
    :data-disabled="disabled || undefined"
    :renderless
  >
    <slot :model />
  </Atom>
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
