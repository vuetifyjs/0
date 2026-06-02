/**
 * @module NumberFieldError
 *
 * @remarks
 * Error message component for number fields.
 * Renders validation error messages from the parent NumberField.Root's validation context.
 * Connected to NumberField.Control via aria-errormessage.
 * Uses aria-live="polite" for screen reader announcements.
 * Must be used within a NumberField.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface NumberFieldErrorProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Namespace for connecting to parent NumberField.Root */
    namespace?: string
  }

  export interface NumberFieldErrorSlotProps {
    /** Current validation error messages */
    errors: string[]
    /** Pre-computed attributes for the error element */
    attrs: {
      'id': string
      'aria-live': 'polite'
      'data-state': 'visible' | 'hidden'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'NumberFieldError', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: NumberFieldErrorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    id = useId(),
    namespace = 'v0:number-field:root',
  } = defineProps<NumberFieldErrorProps>()

  const root = useNumberFieldRoot(namespace)
  const errors = root.errors

  const ticket = root.fieldErrors.register({ id })

  onBeforeUnmount(() => ticket.unregister())

  const slotProps = toRef((): NumberFieldErrorSlotProps => ({
    errors: errors.value,
    attrs: {
      'id': root.errorId,
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
