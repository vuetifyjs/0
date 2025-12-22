/**
 * @module SelectionItem
 *
 * @remarks
 * Item component for selection contexts. Registers with parent SelectionRoot
 * and provides selection state and methods via scoped slot. Supports both
 * single and multi-selection modes. Automatically unregisters on unmount.
 */

<script lang="ts">
  // Types
  import type { MaybeRef } from 'vue'

  export interface SelectionItemProps<V = unknown> {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Optional display label (passed through to slot, not used in registration) */
    label?: string
    /** Value associated with this item */
    value?: V
    /** Disables this specific item */
    disabled?: MaybeRef<boolean>
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface SelectionItemSlotProps<V = unknown> {
    /** Unique identifier */
    id: string
    /** Optional display label */
    label?: string
    /** Value associated with this item */
    value: V | undefined
    /** Whether this item is currently selected */
    isSelected: boolean
    /** Whether this item is disabled */
    isDisabled: boolean
    /** Select this item */
    select: () => void
    /** Unselect this item */
    unselect: () => void
    /** Toggle this item's selection state */
    toggle: () => void
    /** Attributes to bind to the item element */
    attrs: {
      'aria-selected': boolean
      'aria-disabled': boolean
      'data-selected': true | undefined
      'data-disabled': true | undefined
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  // Composables
  import { useSelectionRoot } from './SelectionRoot.vue'

  defineOptions({ name: 'SelectionItem' })

  defineSlots<{
    default: (props: SelectionItemSlotProps<V>) => unknown
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:selection',
  } = defineProps<SelectionItemProps<V>>()

  const selection = useSelectionRoot(namespace)
  const ticket = selection.register({ id, value, disabled })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(selection.disabled))

  onUnmounted(() => {
    selection.unregister(ticket.id)
  })

  const slotProps = toRef((): SelectionItemSlotProps<V> => ({
    id: String(ticket.id),
    label,
    value,
    isSelected: toValue(ticket.isSelected),
    isDisabled: toValue(isDisabled),
    select: ticket.select,
    unselect: ticket.unselect,
    toggle: ticket.toggle,
    attrs: {
      'aria-selected': toValue(ticket.isSelected),
      'aria-disabled': toValue(isDisabled),
      'data-selected': toValue(ticket.isSelected) || undefined,
      'data-disabled': toValue(isDisabled) || undefined,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
