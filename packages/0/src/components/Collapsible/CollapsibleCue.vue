/**
 * @module CollapsibleCue
 *
 * @see https://0.vuetifyjs.com/components/disclosure/collapsible
 *
 * @remarks
 * Visual cue for open/close state. Typically a chevron icon that rotates
 * when the collapsible opens. Exposes `data-state="open|closed"` for
 * CSS-driven styling. Decorative only — `aria-hidden` by default.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useCollapsible } from './CollapsibleRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface CollapsibleCueProps extends AtomProps {
    namespace?: string
  }

  export interface CollapsibleCueSlotProps {
    isOpen: boolean
    attrs: {
      'aria-hidden': true
      'data-state': 'open' | 'closed'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CollapsibleCue' })

  defineSlots<{
    default: (props: CollapsibleCueSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:collapsible',
  } = defineProps<CollapsibleCueProps>()

  const context = useCollapsible(namespace)

  const slotProps = toRef((): CollapsibleCueSlotProps => ({
    isOpen: context.open.value,
    attrs: {
      'aria-hidden': true,
      'data-state': context.open.value ? 'open' : 'closed',
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
