/**
 * @module TreeviewRoot
 *
 * @remarks
 * Root component for treeview. Creates and provides a createNested context
 * to child TreeviewItem components. Bridges v-model for selection, open,
 * and active state. Renderless — no DOM output.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { NestedContext, NestedTicket } from '#v0/composables/createNested'
  import type { TreeviewRootProps, TreeviewRootSlotProps } from './types'

  export const [useTreeviewRoot, provideTreeviewRoot] = createContext<NestedContext<NestedTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { createNested } from '#v0/composables/createNested'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'TreeviewRoot' })

  defineSlots<{
    default: (props: TreeviewRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    namespace = 'v0:treeview',
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = true,
    open = 'multiple',
    openAll = false,
    reveal = false,
    selection = 'cascade',
    active = 'single',
  } = defineProps<TreeviewRootProps>()

  const model = defineModel<T | T[]>()

  const nested = createNested({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    multiple,
    open,
    openAll,
    reveal,
    selection,
    active,
    events: true,
  })

  useProxyModel(nested, model, { multiple: true })

  provideTreeviewRoot(namespace, nested)

  const slotProps = toRef((): TreeviewRootSlotProps => ({
    isDisabled: toValue(nested.disabled),
    isNoneSelected: nested.isNoneSelected.value,
    isAllSelected: nested.isAllSelected.value,
    isMixed: nested.isMixed.value,
    select: nested.select,
    unselect: nested.unselect,
    toggle: nested.toggle,
    selectAll: nested.selectAll,
    unselectAll: nested.unselectAll,
    expandAll: nested.expandAll,
    collapseAll: nested.collapseAll,
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
