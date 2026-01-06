/**
 * @module CheckboxGroup
 *
 * @remarks
 * Group component for managing multiple checkboxes with tri-state support.
 * Provides group context to child Checkbox.Root components. Supports batch
 * operations (selectAll, unselectAll, toggleAll) and mixed/indeterminate states.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'
  import type { ID } from '#v0/types'

  export interface CheckboxGroupProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Disables the entire checkbox group */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory checkbox behavior:
     * - false (default): No mandatory enforcement
     * - true: Prevents deselecting the last selected item
     * - `force`: Automatically selects the first non-disabled item on registration
     */
    mandatory?: boolean | 'force'
  }

  export interface CheckboxGroupSlotProps {
    /** Whether the checkbox group is disabled */
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
    /** Toggle an item's selection state by ID */
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

  export const [useCheckboxGroup, provideCheckboxGroup] = createContext<GroupContext<GroupTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { createGroup } from '#v0/composables/useGroup'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'CheckboxGroup' })

  defineSlots<{
    default: (props: CheckboxGroupSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    namespace = 'v0:checkbox:group',
    disabled = false,
    enroll = false,
    mandatory = false,
  } = defineProps<CheckboxGroupProps>()

  const model = defineModel<T | T[]>()

  const group = createGroup({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(group, model, { multiple: true })

  provideCheckboxGroup(namespace, group)

  const slotProps = toRef((): CheckboxGroupSlotProps => ({
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
