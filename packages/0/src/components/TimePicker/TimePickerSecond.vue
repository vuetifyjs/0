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

  export type TimePickerSecondSlotProps = TimePickerFieldSlotProps
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
    part="second"
    :renderless
  >
    <slot v-bind="slotProps" />
  </TimePickerField>
</template>
