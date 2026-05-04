/**
 * @module TreeviewCheckbox
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
 *
 * @remarks
 * Optional tri-state checkbox for treeview selection. Consumes TreeviewItem
 * context. Toggles selection on click. Shows mixed state for partially-selected
 * parent nodes (cascade mode).
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { TreeviewCheckboxProps, TreeviewCheckboxSlotProps } from './types'

  defineOptions({ name: 'TreeviewCheckbox' })

  defineSlots<{
    default: (props: TreeviewCheckboxSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewCheckboxProps>()

  const item = useTreeviewItem(namespace)!

  const slotProps = toRef((): TreeviewCheckboxSlotProps => ({
    isSelected: toValue(item.ticket.isSelected),
    isMixed: toValue(item.ticket.isMixed),
    isDisabled: item.isDisabled.value,
    toggle: item.ticket.toggle,
    select: item.ticket.select,
    unselect: item.ticket.unselect,
    attrs: {
      'role': 'checkbox',
      'aria-checked': toValue(item.ticket.isMixed) ? 'mixed' as const : toValue(item.ticket.isSelected),
      'aria-disabled': item.isDisabled.value || undefined,
      'tabindex': -1,
      'data-selected': toValue(item.ticket.isSelected) || undefined,
      'data-disabled': item.isDisabled.value || undefined,
      'data-mixed': toValue(item.ticket.isMixed) || undefined,
      'onClick': item.ticket.toggle,
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
