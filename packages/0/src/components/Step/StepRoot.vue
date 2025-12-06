/**
 * @module StepRoot
 *
 * @remarks
 * Root component for step/stepper navigation. Creates and provides step
 * context to child StepItem components. Extends single selection with
 * sequential navigation methods (first, last, next, prev, step).
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { ID } from '#v0/types'
  import type { StepContext, StepTicket } from '#v0/composables/useStep'

  export interface StepRootProps {
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
  }

  export interface StepRootSlotProps {
    /** Whether the step instance is disabled */
    isDisabled: boolean
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
    /** Attributes to bind to the root element */
    attrs: {
      'aria-multiselectable': false
    }
  }

  export const [useStepRoot, provideStepRoot] = createContext<StepContext<StepTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createStep } from '#v0/composables/useStep'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'StepRoot' })

  defineSlots<{
    default: (props: StepRootSlotProps) => any
  }>()

  const {
    namespace = 'v0:step',
    disabled = false,
    enroll = false,
    mandatory = false,
  } = defineProps<StepRootProps>()

  const model = defineModel<T | T[]>()

  const step = createStep({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(step, model, { multiple: false })

  provideStepRoot(namespace, step)

  const slotProps = toRef((): StepRootSlotProps => ({
    isDisabled: toValue(step.disabled),
    first: step.first,
    last: step.last,
    next: step.next,
    prev: step.prev,
    step: step.step,
    select: step.select,
    unselect: step.unselect,
    toggle: step.toggle,
    attrs: {
      'aria-multiselectable': false,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
