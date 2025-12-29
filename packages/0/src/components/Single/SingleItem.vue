/**
 * @module SingleItem
 *
 * @remarks
 * Item component for single-selection contexts. Registers with parent SingleRoot
 * and provides selection state and methods via scoped slot. Automatically
 * unregisters on unmount.
 */

<script lang="ts">
  // Types
  import type { MaybeRef } from 'vue'

  export interface SingleItemProps<V = unknown> {
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

  export interface SingleItemSlotProps<V = unknown> {
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
    /** Toggle this item's single state */
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
  // Components
  import { useSingleRoot } from './SingleRoot.vue'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  defineOptions({ name: 'SingleItem' })

  defineSlots<{
    default: (props: SingleItemSlotProps<V>) => unknown
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:single',
  } = defineProps<SingleItemProps<V>>()

  const single = useSingleRoot(namespace)
  const ticket = single.register({ id, value, disabled })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(single.disabled))

  onUnmounted(() => {
    single.unregister(ticket.id)
  })

  const slotProps = toRef((): SingleItemSlotProps<V> => ({
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
