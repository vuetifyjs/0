/**
 * @module TimePickerSecond
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Second spinbutton, `0`–`59`. Renders only while seconds are on.
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

  export interface TimePickerSecondProps extends AtomProps {
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
  }

  export interface TimePickerSecondSlotProps extends Omit<TimePickerFieldSlotProps, 'value'> {
    /** Value of the field, or `null` while unset. */
    value: number | null
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerSecond' })

  defineSlots<{
    default: (props: TimePickerSecondSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:time-picker',
  } = defineProps<TimePickerSecondProps>()

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
    part="second"
    :renderless
  >
    <slot v-bind="(slotProps as TimePickerSecondSlotProps)" />
  </TimePickerField>
</template>
