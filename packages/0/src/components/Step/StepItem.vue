/**
 * @module StepItem
 *
 * @remarks
 * Item component for step/stepper contexts. Registers with parent StepRoot
 * and provides selection state and methods via scoped slot. Supports
 * sequential navigation through step controls. Automatically unregisters on unmount.
 */

<script lang="ts" setup generic="V = unknown">
  // Composables
  import { useStep } from '#v0/composables/useStep'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  // Types
  import type { MaybeRef } from 'vue'

  defineOptions({ name: 'StepItem' })

  defineSlots<{
    default: (props: {
      /** Unique identifier (auto-generated if not provided) */
      id: string
      /** Optional display label (passed through to slot, not used in registration) */
      label?: string
      /** Value associated with this item */
      value: V | undefined
      /** Whether this item is currently selected */
      isSelected: boolean
      /** Disables this specific item */
      disabled: boolean
      /** ARIA disabled state */
      ariaSelected: boolean
      /** ARIA selected state */
      ariaDisabled: boolean
      /** Select this item */
      select: () => void
      /** Unselect this item */
      unselect: () => void
      /** Toggle this item's step state */
      toggle: () => void
    }) => unknown
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:step',
  } = defineProps<{
    /** Optional display label (passed through to slot, not used in registration) */
    label?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Disables this specific item */
    disabled?: MaybeRef<boolean>
    /** Value associated with this item */
    value?: V
    /** Namespace for dependency injection */
    namespace?: string
  }>()

  const step = useStep(namespace)
  const ticket = step.register({ id, value, disabled })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(step.disabled))

  onUnmounted(() => {
    step.unregister(ticket.id)
  })
</script>

<template>
  <slot
    :id="String(ticket.id)"
    :aria-disabled="toValue(isDisabled)"
    :aria-selected="toValue(ticket.isSelected)"
    :disabled="toValue(isDisabled)"
    :is-selected="toValue(ticket.isSelected)"
    :label
    :select="ticket.select"
    :toggle="ticket.toggle"
    :unselect="ticket.unselect"
    :value
  />
</template>
