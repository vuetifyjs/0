/**
 * @module ExpansionPanelRoot
 *
 * @remarks
 * Root component for managing expansion panel state using the useSelection composable.
 * Provides context to child ExpansionPanelItem components and supports both single and
 * multi-expansion modes with v-model binding.
 *
 * Built on createSelectionContext from useSelection composable system. Supports mandatory
 * selection (prevent collapsing last item) and auto-enrollment of items on registration.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSelectionContext } from '#v0/composables/useSelection'

  // Utilities
  import { computed, toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'
  import type { AtomProps } from '#v0/components/Atom'

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
    disabled: boolean
    /** Whether multiple panels can be expanded */
    multiple: boolean
    /** Select a panel by ID */
    select: (id: ID) => void
    /** Unselect a panel by ID */
    unselect: (id: ID) => void
    /** Toggle a panel's expansion state by ID */
    toggle: (id: ID) => void
    /** ARIA multiselectable state */
    ariaMultiselectable: boolean
  }
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

  const [, provideExpansionControl, context] = createSelectionContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    multiple,
    events: true,
  })

  const bindableProps = computed<ExpansionPanelRootSlotProps>(() => ({
    disabled: toValue(context.disabled),
    multiple,
    select: context.select,
    unselect: context.unselect,
    toggle: context.toggle,
    ariaMultiselectable: multiple,
  }))

  useProxyModel(context, model, { multiple })

  provideExpansionControl(context)
</script>

<template>
  <Atom
    :aria-multiselectable="bindableProps.ariaMultiselectable"
    :as
    :disabled="bindableProps.disabled"
    :multiple="bindableProps.multiple"
    :renderless
    :select="bindableProps.select"
    :toggle="bindableProps.toggle"
    :unselect="bindableProps.unselect"
  >
    <slot v-bind="bindableProps" />
  </Atom>
</template>
