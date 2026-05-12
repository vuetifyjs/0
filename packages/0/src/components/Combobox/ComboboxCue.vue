/**
 * @module ComboboxCue
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Visual cue for open/close state. Typically a chevron icon that rotates
 * when the dropdown opens. Exposes `data-state="open|closed"` for
 * CSS-driven styling. Decorative only — `aria-hidden` by default.
 * Clicking toggles the dropdown.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxCueProps extends AtomProps {
    namespace?: string
  }

  export interface ComboboxCueSlotProps {
    isOpen: boolean
    attrs: {
      'aria-hidden': true
      'data-state': 'open' | 'closed'
      'onClick': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxCue' })

  defineSlots<{
    default: (props: ComboboxCueSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:combobox',
  } = defineProps<ComboboxCueProps>()

  const context = useComboboxContext(namespace)

  function onClick () {
    if (!toValue(context.disabled)) context.toggle()
  }

  const slotProps = toRef((): ComboboxCueSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'aria-hidden': true,
      'data-state': context.isOpen.value ? 'open' : 'closed',
      'onClick': onClick,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
