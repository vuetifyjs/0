/**
 * @module SelectionRoot
 *
 * @remarks
 * Root component for generic selection contexts. Creates and provides selection
 * context to child SelectionItem components. Supports both single and multi-selection
 * modes via the `multiple` prop.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { ID } from '#v0/types'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'

  export interface SelectionRootProps {
    /** Namespace for dependency injection (must match SelectionItem namespace) */
    namespace?: string
    /** Disables the entire selection instance */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory selection behavior:
     * - false (default): No mandatory selection enforcement
     * - true: Prevents deselecting the last selected item
     * - `force`: Automatically selects the first non-disabled item on registration
     */
    mandatory?: boolean | 'force'
    /** Enable multi-selection mode (array v-model) */
    multiple?: boolean
  }

  export interface SelectionRootSlotProps {
    /** Whether the selection instance is disabled */
    isDisabled: boolean
    /** Enable multi-selection mode (array v-model) */
    multiple: boolean
    /** Select an item by ID */
    select: (id: ID) => void
    /** Unselect an item by ID */
    unselect: (id: ID) => void
    /** Toggle an item's selection state by ID */
    toggle: (id: ID) => void
    /** Attributes to bind to the root element */
    attrs: {
      'aria-multiselectable': boolean
    }
  }

  export const [useSelectionRoot, provideSelectionRoot] = createContext<SelectionContext<SelectionTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSelection } from '#v0/composables/useSelection'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SelectionRoot' })

  defineSlots<{
    default: (props: SelectionRootSlotProps) => any
  }>()

  const {
    namespace = 'v0:selection',
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = false,
  } = defineProps<SelectionRootProps>()

  const model = defineModel<T | T[]>()

  const selection = createSelection({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    multiple,
    events: true,
  })

  useProxyModel(selection, model, { multiple })

  provideSelectionRoot(namespace, selection)

  const slotProps = toRef((): SelectionRootSlotProps => ({
    isDisabled: toValue(selection.disabled),
    multiple,
    select: selection.select,
    unselect: selection.unselect,
    toggle: selection.toggle,
    attrs: {
      'aria-multiselectable': multiple,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
