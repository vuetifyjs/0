/**
 * @module ExpansionPanelRoot
 *
 * @remarks
 * Root component for managing expansion panel state using the createSelection composable.
 * Provides context to child ExpansionPanelItem components and supports both single and
 * multi-expansion modes with v-model binding.
 *
 * Built on createSelection composable. Supports mandatory selection (prevent collapsing
 * last item) and auto-enrollment of items on registration.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { createSelection } from '#v0/composables/createSelection'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { type Ref, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/createSelection'
  import type { ID } from '#v0/types'

  export interface ExpansionPanelOptionsContext {
    /** Disabled state of the entire expansion panel */
    isDisabled: Readonly<Ref<boolean>>
  }

  export interface ExpansionPanelRootProps extends AtomProps {
    /** Namespace for dependency injection (default: 'v0:expansion-panel') */
    namespace?: string
    /** Disables the entire expansion panel instance and all items */
    disabled?: boolean
    /** Auto-expand non-disabled items when registered */
    enroll?: boolean
    /**
     * Mandatory expansion behavior:
     * - false (default): All panels can be collapsed
     * - true: Prevents collapsing the last expanded panel
     * - 'force': Automatically expands the first non-disabled panel
     */
    mandatory?: boolean | 'force'
    /**
     * Enable multi-expansion mode
     * - false (default): Single panel expanded at a time (accordion mode)
     * - true: Multiple panels can be expanded simultaneously
     * Note: Changes v-model type from T to T[]
     */
    multiple?: boolean
  }

  export interface ExpansionPanelRootSlotProps {
    /** Disables the entire expansion panel instance and all registered items */
    isDisabled: Readonly<Ref<boolean>>
    /** Select a panel by ID */
    select: (id: ID) => void
    /** Unselect a panel by ID */
    unselect: (id: ID) => void
    /** Toggle a panel's expansion state by ID */
    toggle: (id: ID) => void
  }

  export const [useExpansionPanelRoot, provideExpansionPanelRoot] = createContext<SelectionContext<SelectionTicket>>()
</script>

/**
 * Generic type parameter T represents the value type for v-model binding.
 * When multiple=false, v-model type is T.
 * When multiple=true, v-model type is T[].
 */
<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'ExpansionPanelRoot' })

  defineSlots<{
    default: (props: ExpansionPanelRootSlotProps) => any
  }>()

  defineEmits<{
    /** Emitted when the expanded panels change */
    'update:model-value': T | T[]
  }>()

  const {
    as,
    renderless,
    namespace = 'v0:expansion-panel',
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = false,
  } = defineProps<ExpansionPanelRootProps>()

  const model = defineModel<T | T[]>()

  const isDisabled = toRef(() => disabled)

  const selection = createSelection({
    disabled: isDisabled,
    enroll,
    mandatory,
    multiple,
    events: true,
  })

  useProxyModel(selection, model, { multiple })

  const slotProps = toRef((): ExpansionPanelRootSlotProps => ({
    isDisabled,
    select: selection.select,
    unselect: selection.unselect,
    toggle: selection.toggle,
  }))

  provideExpansionPanelRoot(namespace, selection)
</script>

<template>
  <Atom
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
