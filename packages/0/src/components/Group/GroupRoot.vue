/**
 * @module GroupRoot
 *
 * @remarks
 * Root component for multi-selection groups with tri-state support. Creates
 * and provides group context to child GroupItem components. Supports batch
 * operations (selectAll, unselectAll, toggleAll) and mixed/indeterminate states.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { ID } from '#v0/types'
  import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'

  export interface GroupRootProps {
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
  }

  export interface GroupRootSlotProps {
    /** Whether the group instance is disabled */
    isDisabled: boolean
    /** Whether no items are currently selected */
    isNoneSelected: boolean
    /** Whether all selectable (non-disabled) items are selected */
    isAllSelected: boolean
    /** Whether some but not all selectable items are selected */
    isMixed: boolean
    /** Select an item by ID */
    select: (id: ID | ID[]) => void
    /** Unselect an item by ID */
    unselect: (id: ID | ID[]) => void
    /** Toggle an item's group state by ID */
    toggle: (id: ID | ID[]) => void
    /** Select all selectable (non-disabled) items */
    selectAll: () => void
    /** Unselect all items (respects mandatory option) */
    unselectAll: () => void
    /** Toggle between all selected and none selected */
    toggleAll: () => void
    /** Attributes to bind to the root element */
    attrs: {
      'aria-multiselectable': true
    }
  }

  export const [useGroupRoot, provideGroupRoot] = createContext<GroupContext<GroupTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createGroup } from '#v0/composables/useGroup'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'GroupRoot' })

  defineSlots<{
    default: (props: GroupRootSlotProps) => any
  }>()

  const {
    namespace = 'v0:group',
    disabled = false,
    enroll = false,
    mandatory = false,
  } = defineProps<GroupRootProps>()

  const model = defineModel<T | T[]>()

  const group = createGroup({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(group, model, { multiple: true })

  provideGroupRoot(namespace, group)

  const slotProps = toRef((): GroupRootSlotProps => ({
    isDisabled: toValue(group.disabled),
    isNoneSelected: group.isNoneSelected.value,
    isAllSelected: group.isAllSelected.value,
    isMixed: group.isMixed.value,
    select: group.select,
    unselect: group.unselect,
    toggle: group.toggle,
    selectAll: group.selectAll,
    unselectAll: group.unselectAll,
    toggleAll: group.toggleAll,
    attrs: {
      'aria-multiselectable': true,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
