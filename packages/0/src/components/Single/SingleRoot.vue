<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSingleContext } from '#v0/composables/useSingle'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'

  defineOptions({ name: 'SingleRoot' })

  defineSlots<{
    default: (props: {
      /** Disables the entire single instance and all registered items */
      disabled: boolean
      /** Select an item by ID */
      select: (id: ID) => void
      /** Unselect an item by ID */
      unselect: (id: ID) => void
      /** Toggle an item's single state by ID */
      toggle: (id: ID) => void
      /** ARIA multiselectable state */
      ariaMultiselectable: boolean
    }) => any
  }>()

  const {
    namespace = 'v0:single',
    disabled = false,
    enroll = false,
    mandatory = false,
  } = defineProps<{
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
  }>()

  const model = defineModel<T | T[]>()

  const [, provideSingleControl, context] = createSingleContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(context, model, { multiple: false })

  provideSingleControl(context)
</script>

<template>
  <slot
    :aria-multiselectable="true"
    :disabled="toValue(context.disabled)"
    :select="context.select"
    :toggle="context.toggle"
    :unselect="context.unselect"
  />
</template>
