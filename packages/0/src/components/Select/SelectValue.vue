/**
 * @module SelectValue
 *
 * @remarks
 * Display component for the selected value(s) in a select. Slot-based —
 * consumers provide their own rendering via the default slot. Only renders
 * content when a value is selected. Use alongside Select.Placeholder for
 * empty state text.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSelectContext } from './SelectRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SelectValueProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface SelectValueSlotProps {
    /** The first selected item (ticket) — useful for single select */
    selectedItem: unknown | undefined
    /** All selected items (tickets) — useful for multi select */
    selectedItems: unknown[]
    /** The first selected value — useful for single select */
    selectedValue: unknown | undefined
    /** All selected values — useful for multi select */
    selectedValues: unknown[]
    /** Whether any value is selected */
    hasValue: boolean
    /** Attributes to bind to the value element */
    attrs: Record<string, never>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SelectValue' })

  defineSlots<{
    default: (props: SelectValueSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:select',
  } = defineProps<SelectValueProps>()

  const context = useSelectContext(namespace)

  const items = toRef(() => Array.from(context.selection.selectedItems.value))
  const values = toRef(() => Array.from(context.selection.selectedValues.value))
  const hasValue = toRef(() => context.selection.selectedIds.size > 0)

  const slotProps = toRef((): SelectValueSlotProps => ({
    selectedItem: items.value[0],
    selectedItems: items.value,
    selectedValue: values.value[0],
    selectedValues: values.value,
    hasValue: hasValue.value,
    attrs: {},
  }))
</script>

<template>
  <Atom v-if="hasValue" :as>
    <slot v-bind="slotProps">
      {{ values[0] }}
    </slot>
  </Atom>
</template>
