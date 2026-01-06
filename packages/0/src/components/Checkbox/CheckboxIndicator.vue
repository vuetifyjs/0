/**
 * @module CheckboxIndicator
 *
 * @remarks
 * Visual indicator component for checkboxes. Must be used within a
 * Checkbox.Root component which provides the checkbox state and actions.
 * Renders as a button by default with proper ARIA attributes.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface CheckboxIndicatorProps extends AtomProps {}

  export interface CheckboxIndicatorSlotProps<V = unknown> {
    /** Unique identifier */
    id: string
    /** Optional display label */
    label?: string
    /** Value associated with this checkbox */
    value: V | undefined
    /** Whether this checkbox is currently checked */
    isChecked: boolean
    /** Whether this checkbox is in a mixed/indeterminate state */
    isMixed: boolean
    /** Whether this checkbox is disabled */
    isDisabled: boolean
    /** Check this checkbox */
    check: () => void
    /** Uncheck this checkbox */
    uncheck: () => void
    /** Toggle this checkbox's state */
    toggle: () => void
    /** Set this checkbox to mixed/indeterminate state */
    mix: () => void
    /** Clear mixed/indeterminate state */
    unmix: () => void
    /** Attributes to bind to the checkbox element */
    attrs: {
      'role': 'checkbox'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean | undefined
      'tabindex': 0 | undefined
      'data-state': 'checked' | 'unchecked' | 'indeterminate'
      'data-disabled': '' | undefined
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  // Components
  import { useCheckboxRoot } from './CheckboxRoot.vue'

  // Utilities
  import { computed, toRef, toValue } from 'vue'

  defineOptions({ name: 'CheckboxIndicator' })

  defineSlots<{
    default: (props: CheckboxIndicatorSlotProps<V>) => unknown
  }>()

  const {
    as = 'button',
    renderless,
  } = defineProps<CheckboxIndicatorProps>()

  // Inject context from Checkbox.Root
  const root = useCheckboxRoot('v0:checkbox:root')

  const isChecked = computed(() => toValue(root.isChecked))
  const isMixed = computed(() => toValue(root.isMixed))
  const isDisabled = computed(() => toValue(root.isDisabled))

  // State helpers
  const dataState = computed(() => {
    if (isMixed.value) return 'indeterminate'
    return isChecked.value ? 'checked' : 'unchecked'
  })

  const slotProps = toRef((): CheckboxIndicatorSlotProps<V> => ({
    id: root.id,
    label: root.label,
    value: root.value as V | undefined,
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    check: root.check,
    uncheck: root.uncheck,
    toggle: root.toggle,
    mix: root.mix,
    unmix: root.unmix,
    attrs: {
      'role': 'checkbox',
      'aria-checked': isMixed.value ? 'mixed' : isChecked.value,
      'aria-disabled': isDisabled.value || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? '' : undefined,
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
