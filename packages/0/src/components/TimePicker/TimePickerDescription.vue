/**
 * @module TimePickerDescription
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Help text component for time pickers.
 * Auto-connected to the fields via aria-describedby.
 * Must be used within a TimePicker.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTimePickerRoot } from './TimePickerRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TimePickerDescriptionProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Namespace for connecting to parent TimePicker.Root */
    namespace?: string
  }

  export interface TimePickerDescriptionSlotProps {
    /** ID for this description element */
    id: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerDescription', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: TimePickerDescriptionSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    id = useId(),
    namespace = 'v0:time-picker',
  } = defineProps<TimePickerDescriptionProps>()

  const root = useTimePickerRoot(namespace)

  const ticket = root.input.descriptions.register({ id })

  onBeforeUnmount(() => ticket.unregister())

  const descriptionAttrs = toRef(() => ({
    id: root.input.descriptionId,
  }))

  const slotProps = toRef((): TimePickerDescriptionSlotProps => ({
    id: root.input.descriptionId,
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, descriptionAttrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
