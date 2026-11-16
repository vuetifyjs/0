/**
 * @module TimePickerHour
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Hour spinbutton. Shows `0`–`23`, or `1`–`12` in a 12-hour cycle.
 * Arrow, Page, Home, and End keys move it along its step grid;
 * Backspace and Delete clear it. Must be used within TimePicker.Root.
 */

<script lang="ts">
  // Context
  import TimePickerField from './TimePickerField.vue'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { TimePickerFieldSlotProps } from './TimePickerField.vue'

  export interface TimePickerHourProps extends AtomProps {
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
  }

  export interface TimePickerHourSlotProps extends Omit<TimePickerFieldSlotProps, 'value'> {
    /** Value of the field, or `null` while unset. */
    value: number | null
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerHour' })

  defineSlots<{
    default: (props: TimePickerHourSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:time-picker',
  } = defineProps<TimePickerHourProps>()

  const fieldRef = useTemplateRef<AtomExpose>('field')

  // No type argument: `defineExpose<AtomExpose>` on a non-generic SFC makes
  // vue-component-meta report no props, slots, or events for the file.
  defineExpose({
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
    part="hour"
    :renderless
  >
    <slot v-bind="(slotProps as TimePickerHourSlotProps)" />
  </TimePickerField>
</template>
