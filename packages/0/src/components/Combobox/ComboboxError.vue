/**
 * @module ComboboxError
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Error message component for the Combobox component.
 * Renders validation error messages from the parent Combobox.Root.
 * Connected to Combobox.Control via aria-errormessage.
 * Uses aria-live="polite" for screen reader announcements.
 * Must be used within a Combobox.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Utilities
  import { mergeProps, onBeforeUnmount, onMounted, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxErrorProps extends AtomProps {
    /** Namespace for connecting to parent Combobox.Root */
    namespace?: string
  }

  export interface ComboboxErrorSlotProps {
    /** ID for this error element */
    id: string
    /** Current error messages */
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
  defineOptions({ name: 'ComboboxError', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ComboboxErrorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:combobox',
  } = defineProps<ComboboxErrorProps>()

  const context = useComboboxContext(namespace)
  const errors = context.errors

  onMounted(() => {
    context.hasError.value = true
  })

  onBeforeUnmount(() => {
    context.hasError.value = false
  })

  const slotProps = toRef((): ComboboxErrorSlotProps => ({
    id: context.errorId,
    errors: errors.value,
    attrs: {
      'id': context.errorId,
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
