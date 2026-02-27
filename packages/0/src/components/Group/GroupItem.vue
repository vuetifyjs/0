/**
 * @module GroupItem
 *
 * @remarks
 * Item component for multi-selection groups. Registers with parent GroupRoot
 * and provides selection state and methods via scoped slot. Supports tri-state
 * (selected, unselected, mixed) for checkbox-like behavior. Automatically
 * unregisters on unmount.
 */

<script lang="ts">
  // Types
  import type { MaybeRefOrGetter } from 'vue'

  export interface GroupItemProps<V = unknown> {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Optional display label (passed through to slot, not used in registration) */
    label?: string
    /** Value associated with this item */
    value?: V
    /** Disables this specific item */
    disabled?: MaybeRefOrGetter<boolean>
    /** Sets the indeterminate state (for checkboxes) */
    indeterminate?: MaybeRefOrGetter<boolean>
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface GroupItemSlotProps<V = unknown> {
    /** Unique identifier */
    id: string
    /** Optional display label */
    label?: string
    /** Value associated with this item */
    value: V | undefined
    /** Whether this item is currently selected */
    isSelected: boolean
    /** Whether this item is in a mixed/indeterminate state */
    isMixed: boolean
    /** Whether this item is disabled */
    isDisabled: boolean
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
    /** Attributes to bind to the item element */
    attrs: {
      'role': 'checkbox'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean
      'data-selected': true | undefined
      'data-disabled': true | undefined
      'data-mixed': true | undefined
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  // Components
  import { useGroupRoot } from './GroupRoot.vue'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  defineOptions({ name: 'GroupItem' })

  defineSlots<{
    default: (props: GroupItemSlotProps<V>) => unknown
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:group',
    indeterminate = false,
  } = defineProps<GroupItemProps<V>>()

  const group = useGroupRoot(namespace)
  const ticket = group.register({ id, value, disabled, indeterminate })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(group.disabled))

  onUnmounted(() => {
    group.unregister(ticket.id)
  })

  const slotProps = toRef((): GroupItemSlotProps<V> => ({
    id: String(ticket.id),
    label,
    value,
    isSelected: toValue(ticket.isSelected),
    isMixed: toValue(ticket.isMixed),
    isDisabled: toValue(isDisabled),
    select: ticket.select,
    unselect: ticket.unselect,
    toggle: ticket.toggle,
    mix: ticket.mix,
    unmix: ticket.unmix,
    attrs: {
      'role': 'checkbox',
      'aria-checked': toValue(ticket.isMixed) ? 'mixed' : toValue(ticket.isSelected),
      'aria-disabled': toValue(isDisabled),
      'data-selected': toValue(ticket.isSelected) || undefined,
      'data-disabled': toValue(isDisabled) || undefined,
      'data-mixed': toValue(ticket.isMixed) || undefined,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
