/**
 * @module ExpansionPanelCue
 *
 * @see https://0.vuetifyjs.com/components/disclosure/expansion-panel
 *
 * @remarks
 * Visual cue for open/close state. Typically a chevron icon that rotates
 * when the panel expands. Exposes `data-state="open|closed"` for
 * CSS-driven styling. Decorative only — `aria-hidden` by default.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useExpansionPanelRoot } from './ExpansionPanelRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ExpansionPanelCueProps extends AtomProps {
    namespace?: string
  }

  export interface ExpansionPanelCueSlotProps {
    isSelected: boolean
    attrs: {
      'aria-hidden': true
      'data-state': 'open' | 'closed'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ExpansionPanelCue' })

  defineSlots<{
    default: (props: ExpansionPanelCueSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:expansion-panel',
  } = defineProps<ExpansionPanelCueProps>()

  const context = useExpansionPanelRoot(namespace)

  const slotProps = toRef((): ExpansionPanelCueSlotProps => ({
    isSelected: context.ticket.isSelected.value,
    attrs: {
      'aria-hidden': true,
      'data-state': context.ticket.isSelected.value ? 'open' : 'closed',
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
