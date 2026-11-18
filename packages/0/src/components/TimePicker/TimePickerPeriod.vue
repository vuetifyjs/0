/**
 * @module TimePickerPeriod
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Meridiem spinbutton. Renders only in a 12-hour cycle. Arrow and Page
 * keys flip it, Home selects AM, and End selects PM. Use it within
 * TimePicker.Root.
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
    /** Id of the spinbutton. Defaults to the Root id plus the part name. */
    id?: string
    /** Accessible name. Falls back to the locale catalog. */
    ariaLabel?: string
    /** Id of the element that labels the spinbutton. Replaces `ariaLabel`. */
    ariaLabelledby?: string
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
    id,
    ariaLabel,
    ariaLabelledby,
  } = defineProps<TimePickerPeriodProps>()

  const fieldRef = useTemplateRef<AtomExpose>('field')

  // Untyped on purpose: with `AtomExpose` as the type argument,
  // vue-component-meta reports no props, slots, or events for the file.
  defineExpose({
    get element () {
      return (fieldRef.value?.element ?? null) as HTMLElement | null
    },
  })
</script>

<template>
  <TimePickerField
    :id
    ref="field"
    v-slot="slotProps"
    :aria-label
    :aria-labelledby
    :as
    :namespace
    part="period"
    :renderless
  >
    <slot v-bind="(slotProps as TimePickerPeriodSlotProps)" />
  </TimePickerField>
</template>
