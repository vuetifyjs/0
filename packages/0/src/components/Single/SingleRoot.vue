/**
 * @module SingleRoot
 *
 * @remarks
 * Root component for single-selection contexts. Creates and provides single
 * context to child SingleItem components. Only one item can be selected at
 * a time - selecting a new item automatically deselects the previous one.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
  import type { ID } from '#v0/types'

  export interface SingleRootProps {
    /** Namespace for dependency injection (must match SingleItem namespace) */
    namespace?: string
    /** Disables the entire single instance */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory single behavior:
     * - false (default): No mandatory single enforcement
     * - true: Prevents deselecting the last selected item
     * - `force`: Automatically selects the first non-disabled item on registration
     */
    mandatory?: boolean | 'force'
  }

  export interface SingleRootSlotProps {
    /** Whether the single instance is disabled */
    isDisabled: boolean
    /** Select an item by ID */
    select: (id: ID) => void
    /** Unselect an item by ID */
    unselect: (id: ID) => void
    /** Toggle an item's single state by ID */
    toggle: (id: ID) => void
    /** Attributes to bind to the root element */
    attrs: {
      'aria-multiselectable': false
    }
  }

  export const [useSingleRoot, provideSingleRoot] = createContext<SingleContext<SingleTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSingle } from '#v0/composables/useSingle'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SingleRoot' })

  defineSlots<{
    default: (props: SingleRootSlotProps) => any
  }>()

  const {
    namespace = 'v0:single',
    disabled = false,
    enroll = false,
    mandatory = false,
  } = defineProps<SingleRootProps>()

  const model = defineModel<T | T[]>()

  const single = createSingle({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(single, model, { multiple: false })

  provideSingleRoot(namespace, single)

  const slotProps = toRef((): SingleRootSlotProps => ({
    isDisabled: toValue(single.disabled),
    select: single.select,
    unselect: single.unselect,
    toggle: single.toggle,
    attrs: {
      'aria-multiselectable': false,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
