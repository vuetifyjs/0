<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSelectionContext } from '#v0/composables/useSelection'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'

  defineOptions({ name: 'ExpansionPanelRoot' })

  defineSlots<{
    default: (props: {
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
    }) => any
  }>()

  const {
    namespace = 'v0:expansion-panel',
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = false,
  } = defineProps<{
    /** Namespace for dependency injection (must match ExpansionPanelItem namespace) */
    namespace?: string
    /** Disables the entire expansion panel instance */
    disabled?: boolean
    /** Auto-expand non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory expansion behavior:
     * - false (default): All panels can be collapsed
     * - true: Prevents collapsing the last expanded panel
     * - `force`: Automatically expands the first non-disabled panel on registration
     */
    mandatory?: boolean | 'force'
    /**
     * Expansion mode:
     * - false (default): Single panel expanded at a time (accordion mode)
     * - true: Multiple panels can be expanded simultaneously
     */
    multiple?: boolean
  }>()

  const model = defineModel<T | T[]>()

  const [, provideExpansionControl, context] = createSelectionContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    multiple,
    events: true,
  })

  useProxyModel(context, model, { multiple })

  provideExpansionControl(context)
</script>

<template>
  <slot
    :aria-multiselectable="multiple"
    :disabled="toValue(context.disabled)"
    :multiple="multiple"
    :select="context.select"
    :toggle="context.toggle"
    :unselect="context.unselect"
  />
</template>
