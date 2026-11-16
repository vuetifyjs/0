/**
 * @module TimePickerPeriod
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Meridiem spinbutton. Renders only in a 12-hour cycle. Arrow and Page
 * keys flip it, Home selects AM, and End selects PM. Must be used
 * within TimePicker.Root.
 */

<script lang="ts">
  // Context
  import TimePickerField from './TimePickerField.vue'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { TimePeriod } from '#v0/composables/createTimePicker'
  import type { TimePickerFieldSlotProps } from './TimePickerField.vue'

  export interface TimePickerPeriodProps extends AtomProps {
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
  }

  export interface TimePickerPeriodSlotProps extends Omit<TimePickerFieldSlotProps, 'value'> {
    /** Selected meridiem. `aria-valuenow` carries it as `0` for AM and `1` for PM. */
    value: TimePeriod | null
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerPeriod' })

  defineSlots<{
    default: (props: TimePickerPeriodSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:time-picker',
  } = defineProps<TimePickerPeriodProps>()

  const fieldRef = useTemplateRef<AtomExpose>('field')

  defineExpose<AtomExpose>({
    get element () {
      return (fieldRef.value?.element ?? null) as AtomExpose['element']
    },
  })
</script>

<template>
  <TimePickerField
    ref="field"
    v-slot="slotProps"
    :as
    :namespace
    part="period"
    :renderless
  >
    <slot v-bind="(slotProps as TimePickerPeriodSlotProps)" />
  </TimePickerField>
</template>
