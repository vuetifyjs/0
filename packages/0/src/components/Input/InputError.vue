/**
 * @module InputError
 *
 * @see https://0.vuetifyjs.com/components/forms/input
 *
 * @remarks
 * Error message component for the Input component.
 * Renders validation error messages from the parent Input.Root's validation context.
 * Connected to Input.Control via aria-errormessage.
 * Uses aria-live="polite" for screen reader announcements.
 * Must be used within an Input.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useInputRoot } from './InputRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface InputErrorProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Namespace for connecting to parent Input.Root */
    namespace?: string
  }

  export interface InputErrorSlotProps {
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
  defineOptions({ name: 'InputError', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: InputErrorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    id = useId(),
    namespace = 'v0:input:root',
  } = defineProps<InputErrorProps>()

  const root = useInputRoot(namespace)
  const errors = root.errors

  const ticket = root.fieldErrors.register({ id })

  onBeforeUnmount(() => ticket.unregister())

  const slotProps = toRef((): InputErrorSlotProps => ({
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
