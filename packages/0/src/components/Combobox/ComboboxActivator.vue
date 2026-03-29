/**
 * @module ComboboxActivator
 *
 * @remarks
 * Anchor wrapper for the combobox input and cue. Sets CSS anchor-name for
 * popover positioning. Opens the dropdown on click when not disabled.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxActivatorProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface ComboboxActivatorSlotProps {
    /** Whether the dropdown is open */
    isOpen: boolean
    /** Attributes to bind to the activator element */
    attrs: {
      'data-state': 'open' | 'closed'
      'onClick': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxActivator' })

  defineSlots<{
    default: (props: ComboboxActivatorSlotProps) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:combobox',
  } = defineProps<ComboboxActivatorProps>()

  const context = useComboboxContext(namespace)

  const style = toRef(() => context.popover.anchorStyles.value)

  function onClick () {
    if (!toValue(context.disabled)) context.open()
  }

  const slotProps = toRef((): ComboboxActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'data-state': context.isOpen.value ? 'open' : 'closed',
      'onClick': onClick,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :style
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
