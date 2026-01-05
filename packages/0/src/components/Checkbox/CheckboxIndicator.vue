/**
 * @module CheckboxIndicator
 *
 * @remarks
 * Checkbox component with dual-mode support:
 * - **Standalone mode**: Uses v-model for boolean state
 * - **Group mode**: Registers with parent CheckboxRoot for multi-selection
 *
 * Automatically detects parent context and adapts behavior accordingly.
 * Provides proper ARIA attributes for accessibility including tri-state support.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { genId } from '#v0/utilities'
  import { computed, inject, onUnmounted, toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'
  import type { MaybeRef } from 'vue'

  export interface CheckboxIndicatorProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Optional display label (passed through to slot) */
    label?: string
    /** Value associated with this checkbox (used in group mode) */
    value?: unknown
    /** Disables this checkbox */
    disabled?: boolean
    /** Sets the indeterminate state (group mode only) */
    indeterminate?: MaybeRef<boolean>
    /** Namespace for dependency injection */
    namespace?: string
  }

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
    /** Set this checkbox to mixed/indeterminate state (group mode only) */
    mix: () => void
    /** Clear mixed/indeterminate state (group mode only) */
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
  defineOptions({ name: 'CheckboxIndicator' })

  defineSlots<{
    default: (props: CheckboxIndicatorSlotProps<V>) => unknown
  }>()

  const {
    as = 'button',
    renderless,
    id = genId(),
    label,
    value,
    disabled = false,
    indeterminate = false,
    namespace = 'v0:checkbox',
  } = defineProps<CheckboxIndicatorProps>()

  // Dual-mode: try to inject group context, null if standalone
  const group = inject<GroupContext<GroupTicket> | null>(namespace, null)
  const model = defineModel<boolean>()

  // Group mode: register with parent
  const ticket = group?.register({ id, value, disabled, indeterminate })

  // Unified state computations
  const isChecked = computed(() => {
    if (ticket) return toValue(ticket.isSelected)
    return model.value ?? false
  })

  const isMixed = computed(() => {
    if (ticket) return toValue(ticket.isMixed)
    return false
  })

  const isDisabled = computed(() => {
    if (group && ticket) {
      return toValue(ticket.disabled) || toValue(group.disabled)
    }
    return disabled
  })

  // State helpers
  const dataState = computed(() => {
    if (isMixed.value) return 'indeterminate'
    return isChecked.value ? 'checked' : 'unchecked'
  })

  // Actions
  function toggle () {
    if (isDisabled.value) return

    if (ticket) {
      ticket.toggle()
    } else {
      model.value = !model.value
    }
  }

  function check () {
    if (isDisabled.value) return

    if (ticket) {
      ticket.select()
    } else {
      model.value = true
    }
  }

  function uncheck () {
    if (isDisabled.value) return

    if (ticket) {
      ticket.unselect()
    } else {
      model.value = false
    }
  }

  function mix () {
    if (isDisabled.value || !ticket) return
    ticket.mix()
  }

  function unmix () {
    if (isDisabled.value || !ticket) return
    ticket.unmix()
  }

  // Cleanup
  onUnmounted(() => {
    if (ticket && group) {
      group.unregister(ticket.id)
    }
  })

  const slotProps = toRef((): CheckboxIndicatorSlotProps<V> => ({
    id: String(id),
    label,
    value: value as V | undefined,
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    check,
    uncheck,
    toggle,
    mix,
    unmix,
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
