/**
 * @module TreeviewSelectAll
 *
 * @remarks
 * A "select all" checkbox that binds to its parent TreeviewRoot's
 * aggregate state. Automatically reflects isAllSelected/isMixed state
 * and calls toggleAll on click. Does NOT register as a tree item.
 *
 * Must be used within a Treeview.Root component. Lives outside the tree
 * (before/after Treeview.List).
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { provideTreeviewItem } from './TreeviewItem.vue'
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Utilities
  import { shallowRef, toRef, toValue } from 'vue'

  // Types
  import type { NestedTicket } from '#v0/composables/createNested'
  import type { TreeviewSelectAllProps, TreeviewSelectAllSlotProps } from './types'

  defineOptions({ name: 'TreeviewSelectAll' })

  defineSlots<{
    default: (props: TreeviewSelectAllSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    label,
    disabled = false,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewSelectAllProps>()

  const nested = useTreeviewRoot(namespace)

  const isAllSelected = toRef(() => nested.isAllSelected.value)
  const isMixed = toRef(() => nested.isMixed.value)
  const isDisabled = toRef(() => disabled || toValue(nested.disabled))
  const state = toRef((): 'checked' | 'unchecked' | 'indeterminate' =>
    isMixed.value
      ? 'indeterminate'
      : (isAllSelected.value ? 'checked' : 'unchecked'),
  )

  function onClick () {
    if (isDisabled.value) return
    nested.toggleAll()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    if (isDisabled.value) return
    nested.toggleAll()
  }

  // Provide mock TreeviewItemContext so Treeview.Indicator works as a child
  provideTreeviewItem(namespace, {
    ticket: {
      isSelected: isAllSelected,
      isMixed,
      toggle: nested.toggleAll,
      select: nested.selectAll,
      unselect: nested.unselectAll,
    } as unknown as NestedTicket,
    isDisabled,
    hasContent: shallowRef(false),
  })

  const slotProps = toRef((): TreeviewSelectAllSlotProps => ({
    label,
    isAllSelected: isAllSelected.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    selectAll: nested.selectAll,
    unselectAll: nested.unselectAll,
    toggleAll: nested.toggleAll,
    attrs: {
      'role': 'checkbox',
      'aria-checked': isMixed.value ? 'mixed' : isAllSelected.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': label || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': state.value,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
