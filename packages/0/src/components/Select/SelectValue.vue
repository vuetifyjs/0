/**
 * @module SelectValue
 *
 * @remarks
 * Display component for the selected value(s) in a select. Slot-based only —
 * does not resolve display text from values. Consumers provide their own
 * rendering via the default slot. Shows placeholder when nothing is selected.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface SelectValueProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Text shown when no value is selected */
    placeholder?: string
  }

  export interface SelectValueSlotProps {
    /** Array of currently selected IDs */
    selectedIds: ID[]
    /** Whether any value is selected */
    hasValue: boolean
    /** Placeholder text */
    placeholder: string | undefined
    /** Attributes to bind to the value element */
    attrs: Record<string, never>
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSelectContext } from './SelectRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'SelectValue' })

  defineSlots<{
    default: (props: SelectValueSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:select',
    placeholder,
  } = defineProps<SelectValueProps>()

  const context = useSelectContext(namespace)

  const selectedIds = toRef(() => Array.from(context.selection.selectedIds))
  const hasValue = toRef(() => context.selection.selectedIds.size > 0)

  const slotProps = toRef((): SelectValueSlotProps => ({
    selectedIds: selectedIds.value,
    hasValue: hasValue.value,
    placeholder,
    attrs: {},
  }))
</script>

<template>
  <Atom :as>
    <slot v-bind="slotProps">
      {{ hasValue ? '' : placeholder }}
    </slot>
  </Atom>
</template>
