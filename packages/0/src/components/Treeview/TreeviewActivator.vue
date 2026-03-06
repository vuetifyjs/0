/**
 * @module TreeviewActivator
 *
 * @remarks
 * Click-to-toggle trigger for a treeview item. Consumes TreeviewItem context
 * and calls ticket.flip() on click. Renders a button by default with ARIA
 * attributes for expand/collapse state.
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { TreeviewActivatorProps, TreeviewActivatorSlotProps } from './types'

  defineOptions({ name: 'TreeviewActivator' })

  defineSlots<{
    default: (props: TreeviewActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewActivatorProps>()

  const item = useTreeviewItem(namespace)

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      item.ticket.flip()
    }
  }

  const slotProps = toRef((): TreeviewActivatorSlotProps => ({
    isOpen: toValue(item.ticket.isOpen),
    isLeaf: toValue(item.ticket.isLeaf),
    isDisabled: item.isDisabled.value,
    flip: item.ticket.flip,
    attrs: {
      'role': as === 'button' ? undefined : 'button',
      'tabindex': item.isDisabled.value ? -1 : 0,
      'aria-expanded': toValue(item.ticket.isLeaf) ? undefined : toValue(item.ticket.isOpen),
      'aria-disabled': item.isDisabled.value,
      'data-disabled': item.isDisabled.value || undefined,
      'data-open': toValue(item.ticket.isOpen) || undefined,
      'disabled': as === 'button' ? item.isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': item.ticket.flip,
      onKeydown,
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
