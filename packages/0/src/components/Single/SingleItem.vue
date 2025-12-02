/**
 * @module SingleItem
 *
 * @remarks
 * Item component for single-selection contexts. Registers with parent SingleRoot
 * and provides selection state and methods via scoped slot. Automatically
 * unregisters on unmount.
 */

<script lang="ts" setup generic="V = unknown">
  // Composables
  import { useSingle } from '#v0/composables/useSingle'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  // Types
  import type { MaybeRef } from 'vue'

  defineOptions({ name: 'SingleItem' })

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
      /** Toggle this item's single state */
      toggle: () => void
    }) => unknown
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:single',
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

  const single = useSingle(namespace)
  const ticket = single.register({ id, value, disabled })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(single.disabled))

  onUnmounted(() => {
    single.unregister(ticket.id)
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
