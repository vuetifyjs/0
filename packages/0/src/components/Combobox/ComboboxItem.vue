/**
 * @module ComboboxItem
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Option component for the combobox dropdown. Registers with the parent selection
 * context (including the rendered element) and provides selection state via
 * scoped slots. Element ID follows `${rootId}-option-${ticketId}` for
 * `aria-activedescendant`.
 *
 * Uses `v-show` (not `v-if`) to keep items registered with the selection context
 * even when filtered out, so virtual focus can track them correctly.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxRoot } from './ComboboxRoot.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { onBeforeUnmount, toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { MaybeElementRef } from '#v0/composables/toElement'
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
    /** Host element when renderless. Virtual focus uses this instead of the Atom node. */
    el?: MaybeElementRef
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
      'aria-disabled': boolean
      'data-selected': true | undefined
      'data-highlighted': '' | undefined
      'data-disabled': true | undefined
      'data-id': string
      'onClick': () => void
      'onPointerdown': (e: PointerEvent) => void
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
    renderless,
    el: _el,
  } = defineProps<ComboboxItemProps<V>>()

  const root = useComboboxRoot(namespace)
  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(_el) ?? toElement(atomRef.value?.element) ?? null)

  const ticket = root.selection.register({ id, value, disabled: () => toValue(disabled) ?? false, el })

  const elementId = `${root.id}-option-${ticket.id}`
  const isSelected = toRef(() => toValue(ticket.isSelected))
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(root.disabled))
  const isHighlighted = toRef(() => root.cursor.highlightedId.value === ticket.id)
  const isFiltered = toRef(() => root.filtered.value.has(ticket.id))

  function onClick () {
    if (!toValue(isDisabled)) root.select(ticket.id)
  }

  function onPointerdown (e: PointerEvent) {
    e.preventDefault()
  }

  onBeforeUnmount(() => {
    root.selection.unregister(ticket.id)
  })

  const slotProps = toRef((): ComboboxItemSlotProps<V> => ({
    value,
    isSelected: isSelected.value,
    isHighlighted: isHighlighted.value,
    isDisabled: isDisabled.value,
    isFiltered: isFiltered.value,
    select: () => root.select(ticket.id),
    attrs: {
      'id': elementId,
      'role': 'option',
      'aria-selected': isSelected.value,
      'aria-disabled': isDisabled.value,
      'data-selected': isSelected.value || undefined,
      'data-highlighted': isHighlighted.value ? '' : undefined,
      'data-disabled': isDisabled.value || undefined,
      'data-id': String(ticket.id),
      'onClick': onClick,
      'onPointerdown': onPointerdown,
    },
  }))
</script>

<template>
  <Atom
    v-show="isFiltered"
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
