<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createStepContext } from '#v0/composables/useStep'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'

  defineOptions({ name: 'StepRoot' })

  defineSlots<{
    default: (props: {
      /** Disables the entire step instance and all registered items */
      disabled: boolean
      /** ARIA multiselectable state */
      ariaMultiselectable: boolean
      /** Select the first item */
      first: () => void
      /** Select the last item */
      last: () => void
      /** Select the next item */
      next: () => void
      /** Select the previous item */
      prev: () => void
      /** Step forward or backward by a specific count */
      step: (count: number) => void
      /** Select an item by ID */
      select: (id: ID) => void
      /** Unselect an item by ID */
      unselect: (id: ID) => void
      /** Toggle an item's step state by ID */
      toggle: (id: ID) => void
    }) => any
  }>()

  const {
    namespace = 'v0:step',
    disabled = false,
    enroll = false,
    mandatory = false,
  } = defineProps<{
    /** Namespace for dependency injection (must match StepItem namespace) */
    namespace?: string
    /** Disables the entire step instance */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory step behavior:
     * - false (default): No mandatory step enforcement
     * - true: Prevents deselecting the last selected item
     * - `force`: Automatically selects the first non-disabled item on registration
     */
    mandatory?: boolean | 'force'
  }>()

  const model = defineModel<T | T[]>()

  const [, provideStepControl, context] = createStepContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(context, model, { multiple: false })

  provideStepControl(context)
</script>

<template>
  <slot
    :aria-multiselectable="true"
    :disabled="toValue(context.disabled)"
    :first="context.first"
    :last="context.last"
    :next="context.next"
    :prev="context.prev"
    :select="context.select"
    :step="context.step"
    :toggle="context.toggle"
    :unselect="context.unselect"
  />
</template>
