<script lang="ts" setup>
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSelectionContext } from '#v0/composables/useSelection'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'

  defineOptions({ name: 'SelectionRoot' })

  defineSlots<{
    default: (props: {
      /** Disables the entire selection instance and all registered items */
      disabled: boolean
      /** Enable multi-selection mode (array v-model) */
      multiple: boolean
      /** Select an item by ID */
      select: (id: ID) => void
      /** Unselect an item by ID */
      unselect: (id: ID) => void
      /** Toggle an item's selection state by ID */
      toggle: (id: ID) => void
      /** ARIA multiselectable state */
      ariaMultiselectable: boolean
    }) => any
  }>()

  const {
    namespace = 'v0:selection',
    disabled = false,
    enroll = false,
    multiple = false,
  } = defineProps<{
    /** Namespace for dependency injection (must match SelectionItem namespace) */
    namespace?: string
    /** Disables the entire selection instance */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /** Enable multi-selection mode (array v-model) */
    multiple?: boolean
  }>()

  const model = defineModel<unknown | unknown[]>()

  const [, provideSelectionControl, context] = createSelectionContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    multiple,
    events: true,
  })

  useProxyModel(context, model, { multiple })

  provideSelectionControl(context)
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
