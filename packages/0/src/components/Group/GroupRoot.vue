/**
 * @module GroupRoot
 *
 * @remarks
 * Root component for multi-selection groups with tri-state support. Creates
 * and provides group context to child GroupItem components. Supports batch
 * operations (selectAll, unselectAll, toggleAll) and mixed/indeterminate states.
 */

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createGroupContext } from '#v0/composables/useGroup'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'

  defineOptions({ name: 'GroupRoot' })

  defineSlots<{
    default: (props: {
      /** Disables the entire group instance and all registered items */
      disabled: boolean
      /** Select an item by ID */
      select: (id: ID | ID[]) => void
      /** Unselect an item by ID */
      unselect: (id: ID | ID[]) => void
      /** Toggle an item's group state by ID */
      toggle: (id: ID | ID[]) => void
      /** Whether no items are currently selected */
      isNoneSelected: boolean
      /** Whether all selectable (non-disabled) items are selected */
      isAllSelected: boolean
      /** Whether some but not all selectable items are selected */
      isMixed: boolean
      /** Select all selectable (non-disabled) items */
      selectAll: () => void
      /** Unselect all items (respects mandatory option) */
      unselectAll: () => void
      /** Toggle between all selected and none selected */
      toggleAll: () => void
      /** ARIA multiselectable state */
      ariaMultiselectable: boolean
    }) => any
  }>()

  const {
    namespace = 'v0:group',
    disabled = false,
    enroll = false,
    mandatory = false,
  } = defineProps<{
    /** Namespace for dependency injection (must match GroupItem namespace) */
    namespace?: string
    /** Disables the entire group instance */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory group behavior:
     * - false (default): No mandatory group enforcement
     * - true: Prevents deselecting the last selected item
     * - `force`: Automatically selects the first non-disabled item on registration
     */
    mandatory?: boolean | 'force'
  }>()

  const model = defineModel<T | T[]>()

  const [, provideGroupControl, context] = createGroupContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(context, model, { multiple: true })

  provideGroupControl(context)
</script>

<template>
  <slot
    :aria-multiselectable="true"
    :disabled="toValue(context.disabled)"
    :is-all-selected="context.isAllSelected.value"
    :is-mixed="context.isMixed.value"
    :is-none-selected="context.isNoneSelected.value"
    :select="context.select"
    :select-all="context.selectAll"
    :toggle="context.toggle"
    :toggle-all="context.toggleAll"
    :unselect="context.unselect"
    :unselect-all="context.unselectAll"
  />
</template>
