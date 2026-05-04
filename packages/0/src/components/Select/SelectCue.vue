/**
 * @module SelectCue
 *
 * @see https://0.vuetifyjs.com/components/forms/select
 *
 * @remarks
 * Visual cue for open/close state. Typically a chevron icon that rotates
 * when the dropdown opens. Exposes `data-state="open|closed"` for
 * CSS-driven styling. Decorative only — `aria-hidden` by default.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSelectContext } from './SelectRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SelectCueProps extends AtomProps {
    namespace?: string
  }

  export interface SelectCueSlotProps {
    isOpen: boolean
    attrs: {
      'aria-hidden': true
      'data-state': 'open' | 'closed'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SelectCue' })

  defineSlots<{
    default: (props: SelectCueSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:select',
  } = defineProps<SelectCueProps>()

  const context = useSelectContext(namespace)

  const slotProps = toRef((): SelectCueSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'aria-hidden': true,
      'data-state': context.isOpen.value ? 'open' : 'closed',
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
