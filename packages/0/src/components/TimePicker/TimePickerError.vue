/**
 * @module TimePickerError
 *
 * @see https://0.vuetifyjs.com/components/forms/time-picker
 *
 * @remarks
 * Error message component for time pickers.
 * Renders validation error messages from the parent TimePicker.Root's validation context.
 * The fields point at it with aria-errormessage.
 * Uses aria-live="polite" for screen reader announcements.
 * Use it within a TimePicker.Root component.
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

  export interface TimePickerErrorProps extends AtomProps {
    /** Unique identifier. The component generates one when you pass none. */
    id?: string
    /** Namespace for connecting to parent TimePicker.Root */
    namespace?: string
  }

  export interface TimePickerErrorSlotProps {
    /** Current validation error messages */
    errors: string[]
    /** Attributes for the error element */
    attrs: {
      'id': string
      'aria-live': 'polite'
      'data-state': 'visible' | 'hidden'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TimePickerError', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: TimePickerErrorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    id = useId(),
    namespace = 'v0:time-picker',
  } = defineProps<TimePickerErrorProps>()

  const root = useTimePickerRoot(namespace)
  const errors = root.input.errors

  const ticket = root.input.fieldErrors.register({ id })

  onBeforeUnmount(() => ticket.unregister())

  const slotProps = toRef((): TimePickerErrorSlotProps => ({
    errors: errors.value,
    attrs: {
      'id': root.input.errorId,
      'aria-live': 'polite',
      'data-state': errors.value.length > 0 ? 'visible' : 'hidden',
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
