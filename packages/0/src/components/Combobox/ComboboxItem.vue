/**
 * @module ComboboxItem
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Option component for the combobox dropdown. Registers with the parent selection
 * context and provides selection state via scoped slots. Element ID follows the
 * pattern `${rootId}-option-${ticketId}` for virtual focus resolution.
 *
 * Uses `v-show` (not `v-if`) to keep items registered with the selection context
 * even when filtered out, so virtual focus can track them correctly.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Utilities
  import { onBeforeUnmount, toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { MaybeRefOrGetter } from 'vue'

  export interface ComboboxItemProps<V = unknown> extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Value associated with this option */
    value?: V
    /** Disables this specific option */
    disabled?: MaybeRefOrGetter<boolean>
  }

  export interface ComboboxItemSlotProps<V = unknown> {
    /** Value associated with this option */
    value: V | undefined
    /** Whether this option is currently selected */
    isSelected: boolean
    /** Whether this option is currently highlighted via virtual focus */
    isHighlighted: boolean
    /** Whether this option is disabled */
    isDisabled: boolean
    /** Whether this option passes the current filter */
    isFiltered: boolean
    /** Select this option */
    select: () => void
    /** Attributes to bind to the option element */
    attrs: {
      'id': string
      'role': 'option'
      'aria-selected': boolean
      'aria-disabled': boolean | undefined
      'data-selected': true | undefined
      'data-highlighted': '' | undefined
      'data-disabled': true | undefined
      'data-id': string
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'ComboboxItem' })

  defineSlots<{
    default: (props: ComboboxItemSlotProps<V>) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:combobox',
    id,
    value,
    disabled,
  } = defineProps<ComboboxItemProps<V>>()

  const context = useComboboxContext(namespace)

  const ticket = context.selection.register({ id, value, disabled })

  const elementId = `${context.id}-option-${ticket.id}`
  const isSelected = toRef(() => toValue(ticket.isSelected))
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(context.disabled))
  const isHighlighted = toRef(() => context.cursor.highlightedId.value === ticket.id)
  const isFiltered = toRef(() => context.filtered.value.has(ticket.id))

  function onClick () {
    if (!toValue(isDisabled)) context.select(ticket.id)
  }

  onBeforeUnmount(() => {
    context.selection.unregister(ticket.id)
  })

  const slotProps = toRef((): ComboboxItemSlotProps<V> => ({
    value,
    isSelected: isSelected.value,
    isHighlighted: isHighlighted.value,
    isDisabled: isDisabled.value,
    isFiltered: isFiltered.value,
    select: () => context.select(ticket.id),
    attrs: {
      'id': elementId,
      'role': 'option',
      'aria-selected': isSelected.value,
      'aria-disabled': isDisabled.value || undefined,
      'data-selected': isSelected.value || undefined,
      'data-highlighted': isHighlighted.value ? '' : undefined,
      'data-disabled': isDisabled.value || undefined,
      'data-id': String(ticket.id),
    },
  }))
</script>

<template>
  <Atom
    v-show="isFiltered"
    v-bind="slotProps.attrs"
    :as
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
