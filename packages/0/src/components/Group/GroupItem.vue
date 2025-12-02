/**
 * @module GroupItem
 *
 * @remarks
 * Item component for multi-selection groups. Registers with parent GroupRoot
 * and provides selection state and methods via scoped slot. Supports tri-state
 * (selected, unselected, mixed) for checkbox-like behavior. Automatically
 * unregisters on unmount.
 */

<script lang="ts" setup generic="V = unknown">
  // Composables
  import { useGroup } from '#v0/composables/useGroup'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  // Types
  import type { MaybeRef } from 'vue'

  defineOptions({ name: 'GroupItem' })

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
      /** Whether this item is in a mixed/indeterminate state */
      isMixed: boolean
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
      /** Toggle this item's group state */
      toggle: () => void
      /** Set this item to mixed/indeterminate state */
      mix: () => void
      /** Clear mixed/indeterminate state from this item */
      unmix: () => void
    }) => unknown
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:group',
    indeterminate = false,
  } = defineProps<{
    /** Optional display label (passed through to slot, not used in registration) */
    label?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Disables this specific item */
    disabled?: MaybeRef<boolean>
    /** Sets the indeterminate state (for checkboxes) */
    indeterminate?: MaybeRef<boolean>
    /** Value associated with this item */
    value?: V
    /** Namespace for dependency injection */
    namespace?: string
  }>()

  const group = useGroup(namespace)
  const ticket = group.register({ id, value, disabled, indeterminate })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(group.disabled))

  onUnmounted(() => {
    group.unregister(ticket.id)
  })
</script>

<template>
  <slot
    :id="String(ticket.id)"
    :aria-disabled="toValue(isDisabled)"
    :aria-selected="toValue(ticket.isSelected)"
    :disabled="toValue(isDisabled)"
    :is-mixed="toValue(ticket.isMixed)"
    :is-selected="toValue(ticket.isSelected)"
    :label
    :mix="ticket.mix"
    :select="ticket.select"
    :toggle="ticket.toggle"
    :unmix="ticket.unmix"
    :unselect="ticket.unselect"
    :value
  />
</template>
