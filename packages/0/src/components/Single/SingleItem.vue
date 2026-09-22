/**
 * @module SingleItem
 *
 * @see https://0.vuetifyjs.com/components/providers/single
 *
 * @remarks
 * Item component for single-selection contexts. Registers with parent SingleRoot
 * and provides selection state and methods via scoped slot. Automatically
 * unregisters on unmount.
 */

<script lang="ts">
  // Types
  import type { MaybeRefOrGetter } from 'vue'

  export interface SingleItemProps<V = unknown> {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Optional display label (passed through to slot, not used in registration) */
    label?: string
    /** Value associated with this item */
    value?: V
    /** Disables this specific item */
    disabled?: MaybeRefOrGetter<boolean>
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
      'role': 'option'
      'tabindex': 0 | -1
      'aria-selected': boolean
      'aria-disabled': boolean
      'data-selected': true | undefined
      'data-disabled': true | undefined
      'onClick': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  // Context
  import { useSingleRoot } from './SingleRoot.vue'

  // Utilities
  import { onBeforeUnmount, toRef, toValue } from 'vue'

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
  const ticket = single.register({ id, value, disabled: () => toValue(disabled) ?? false })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(single.disabled))

  // ticket.toggle() routes to unselect for a selected item, which honours only
  // the group's disabled (not the ticket's) — guard so a disabled item can't be
  // toggled off via click. Per the enforced components.md handler rule.
  function onClick () {
    if (toValue(isDisabled)) return
    ticket.toggle()
  }

  // aria-selected implies an interactive element, so keyboard users need
  // parity with click — Enter/Space toggle per the WAI-ARIA APG.
  function onKeydown (e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    onClick()
  }

  onBeforeUnmount(() => {
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
      'role': 'option',
      'tabindex': toValue(isDisabled) ? -1 : 0,
      'aria-selected': toValue(ticket.isSelected),
      'aria-disabled': toValue(isDisabled),
      'data-selected': toValue(ticket.isSelected) || undefined,
      'data-disabled': toValue(isDisabled) || undefined,
      'onClick': onClick,
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
