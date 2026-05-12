/**
 * @module TreeviewCue
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
 *
 * @remarks
 * Visual cue for expand/collapse state. Consumes TreeviewItem context.
 * Self-hides when no TreeviewContent is present (leaf nodes).
 * Exposes data-state="open|closed" for CSS-driven styling (e.g. chevron rotation).
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { TreeviewCueProps, TreeviewCueSlotProps } from './types'

  defineOptions({ name: 'TreeviewCue' })

  defineSlots<{
    default: (props: TreeviewCueSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewCueProps>()

  const item = useTreeviewItem(namespace)!

  const isOpen = toRef(() => toValue(item.ticket.isOpen))
  const state = toRef((): 'open' | 'closed' => isOpen.value ? 'open' : 'closed')

  const slotProps = toRef((): TreeviewCueSlotProps => ({
    isOpen: isOpen.value,
    isLeaf: !item.hasContent.value,
    attrs: {
      'aria-hidden': true,
      'data-state': state.value,
      'style': { visibility: item.hasContent.value ? 'visible' : 'hidden' },
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
