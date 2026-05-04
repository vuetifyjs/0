/**
 * @module SelectValue
 *
 * @see https://0.vuetifyjs.com/components/forms/select
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

  // Context
  import { useSelectContext } from './SelectRoot.vue'

  // Utilities
  import { isArray, isNullOrUndefined } from '#v0/utilities'
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
  const hasSelected = toRef(() => context.selection.selectedIds.size > 0)

  // Fall back to raw model value when items haven't registered yet (useLazy)
  const pendingValues = toRef(() => {
    const mv = context.modelValue.value
    if (isNullOrUndefined(mv)) return []
    return isArray(mv) ? mv : [mv]
  })

  const hasValue = toRef(() => hasSelected.value || pendingValues.value.length > 0)

  const slotProps = toRef((): SelectValueSlotProps => {
    const resolved = hasSelected.value
    return {
      selectedItem: resolved ? items.value[0] : undefined,
      selectedItems: resolved ? items.value : [],
      selectedValue: resolved ? values.value[0] : pendingValues.value[0],
      selectedValues: resolved ? values.value : pendingValues.value,
      hasValue: hasValue.value,
      attrs: {},
    }
  })
</script>

<template>
  <Atom v-if="hasValue" :as>
    <slot v-bind="slotProps">
      {{ values[0] }}
    </slot>
  </Atom>
</template>
