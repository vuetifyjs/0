/**
 * @module TreeviewSelectAll
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
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

  // Context
  import { provideTreeviewItem } from './TreeviewItem.vue'
  import { useTreeviewRoot } from './TreeviewRoot.vue'

  // Utilities
  import { shallowRef, toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'
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

  function noop () {}
  const empty: ID[] = []

  // Provide context for Treeview.Indicator
  // SelectAll doesn't register as a tree item, so tree traversal methods
  // return empty results and open/active methods are no-ops.
  // These satisfy TreeviewItemContext contract for Indicator children.
  provideTreeviewItem(namespace, {
    ticket: {
      // RegistryTicket
      id: '__select-all__',
      index: -1,
      value: undefined,
      valueIsIndex: false,
      unregister: noop,
      // SelectionTicket
      disabled: isDisabled,
      isSelected: isAllSelected,
      select: nested.selectAll,
      unselect: nested.unselectAll,
      toggle: nested.toggleAll,
      // GroupTicket
      isMixed,
      mix: noop,
      unmix: noop,
      // NestedTicket
      el: undefined,
      parentId: undefined,
      isOpen: shallowRef(false),
      isActive: shallowRef(false),
      isLeaf: shallowRef(true),
      depth: shallowRef(0),
      open: noop,
      close: noop,
      flip: noop,
      reveal: noop,
      activate: noop,
      deactivate: noop,
      getPath: () => [],
      getAncestors: () => [],
      getDescendants: () => [],
      isAncestorOf: () => false,
      hasAncestor: () => false,
      siblings: () => empty,
      position: () => 0,
    },
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
      'onClick': onClick,
      'onKeydown': onKeydown,
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
