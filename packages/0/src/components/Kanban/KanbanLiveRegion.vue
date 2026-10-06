/**
 * @module KanbanLiveRegion
 *
 * @see https://0.vuetifyjs.com/components/data/kanban
 *
 * @remarks
 * Polite live region for move announcements: pick-up, each keyboard step,
 * drop, cancel, and rejected moves (a column's `accept` or `disabled` gate).
 * Without it mounted, moves still work but are not announced. Usually
 * visually hidden.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useKanbanRoot } from './KanbanRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface KanbanLiveRegionProps extends AtomProps {
    /** Namespace for context injection from Kanban.Root */
    namespace?: string
  }

  export interface KanbanLiveRegionSlotProps {
    /** Latest announcement */
    text: string
    /** Attributes to bind to the live region element */
    attrs: {
      'role': 'status'
      'aria-live': 'polite'
      'aria-atomic': true
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'KanbanLiveRegion', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default?: (props: KanbanLiveRegionSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:kanban',
  } = defineProps<KanbanLiveRegionProps>()

  const root = useKanbanRoot(namespace)

  const slotProps = toRef((): KanbanLiveRegionSlotProps => ({
    text: root.message.value,
    attrs: {
      'role': 'status',
      'aria-live': 'polite',
      'aria-atomic': true,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps">{{ slotProps.text }}</slot>
  </Atom>
</template>
