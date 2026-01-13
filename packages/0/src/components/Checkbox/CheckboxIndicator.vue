/**
 * @module CheckboxIndicator
 *
 * @remarks
 * Visual indicator component for checkboxes. Must be used within a
 * Checkbox.Root component which provides the checkbox state and actions.
 * Renders as a span by default and only displays when checked or indeterminate.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { CheckboxState } from './CheckboxRoot.vue'

  export interface CheckboxIndicatorProps extends AtomProps {
    /** Namespace for context injection from parent Checkbox.Root */
    namespace?: string
  }

  export interface CheckboxIndicatorSlotProps {
    /** Whether this checkbox is currently checked */
    isChecked: boolean
    /** Whether this checkbox is in a mixed/indeterminate state */
    isMixed: boolean
    /** Attributes to bind to the indicator element */
    attrs: {
      'data-state': CheckboxState
      'style': { visibility: 'visible' | 'hidden' }
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useCheckboxRoot } from './CheckboxRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'CheckboxIndicator' })

  defineSlots<{
    default: (props: CheckboxIndicatorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:checkbox:root',
  } = defineProps<CheckboxIndicatorProps>()

  // Inject context from Checkbox.Root
  const root = useCheckboxRoot(namespace)

  const isChecked = toRef(() => toValue(root.isChecked))
  const isMixed = toRef(() => toValue(root.isMixed))

  const showIndicator = toRef(() => isChecked.value || isMixed.value)
  const dataState = toRef(() => {
    if (isMixed.value) return 'indeterminate'
    return isChecked.value ? 'checked' : 'unchecked'
  })

  const slotProps = toRef((): CheckboxIndicatorSlotProps => ({
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    attrs: {
      'data-state': dataState.value,
      'style': { visibility: showIndicator.value ? 'visible' : 'hidden' },
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
