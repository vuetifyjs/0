<script lang="ts">
  // Context
  import TimePickerField from './TimePickerField.vue'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { TimePickerFieldSlotProps } from './TimePickerField.vue'

  export interface TimePickerPeriodProps extends AtomProps {
    /** Namespace for connecting to TimePicker.Root. */
    namespace?: string
  }

  export type TimePickerPeriodSlotProps = TimePickerFieldSlotProps
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
    <slot v-bind="slotProps" />
  </TimePickerField>
</template>
