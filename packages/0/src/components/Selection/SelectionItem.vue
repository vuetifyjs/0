/**
 * @module SelectionItem
 *
 * @see https://0.vuetifyjs.com/components/providers/selection
 *
 * @remarks
 * Item component for selection contexts. Registers with parent SelectionRoot
 * and provides selection state and methods via scoped slot. Supports both
 * single and multi-selection modes. Automatically unregisters on unmount.
 */

<script lang="ts">
  // Types
  import type { MaybeRefOrGetter } from 'vue'

  export interface SelectionItemProps<V = unknown> {
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
  import { useSelectionRoot } from './SelectionRoot.vue'

  // Utilities
  import { onBeforeUnmount, toRef, toValue } from 'vue'

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
  const ticket = selection.register({ id, value, disabled: () => toValue(disabled) ?? false })
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(selection.disabled))

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
