/**
 * @module TreeviewCheckbox
 *
 * @remarks
 * Optional tri-state checkbox for treeview selection. Consumes TreeviewItem
 * context. Toggles selection on click. Shows mixed state for partially-selected
 * parent nodes (cascade mode).
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
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

  const item = useTreeviewItem(namespace)

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      item.ticket.toggle()
    }
  }

  const slotProps = toRef((): TreeviewCheckboxSlotProps => ({
    isSelected: toValue(item.ticket.isSelected),
    isMixed: toValue(item.ticket.isMixed),
    isDisabled: item.isDisabled.value,
    toggle: item.ticket.toggle,
    select: item.ticket.select,
    unselect: item.ticket.unselect,
    attrs: {
      'role': 'checkbox',
      'aria-checked': toValue(item.ticket.isMixed) ? 'mixed' : toValue(item.ticket.isSelected),
      'aria-disabled': item.isDisabled.value,
      'tabindex': item.isDisabled.value ? -1 : 0,
      'data-selected': toValue(item.ticket.isSelected) || undefined,
      'data-disabled': item.isDisabled.value || undefined,
      'data-mixed': toValue(item.ticket.isMixed) || undefined,
      'onClick': item.ticket.toggle,
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
