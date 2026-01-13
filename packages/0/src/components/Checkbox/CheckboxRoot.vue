/**
 * @module CheckboxRoot
 *
 * @remarks
 * Root component for individual checkboxes with dual-mode support:
 * - **Standalone mode**: Uses v-model for boolean state
 * - **Group mode**: Registers with parent Checkbox.Group for multi-selection
 *
 * Automatically detects parent group context and adapts behavior accordingly.
 * Provides checkbox context to child Checkbox.Indicator components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRef, Ref } from 'vue'

  /** Visual state of the checkbox for styling purposes */
  export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate'

  export interface CheckboxRootContext<V = unknown> {
    /** Unique identifier */
    readonly id: ID
    /** Optional display label */
    readonly label?: string
    /** Value associated with this checkbox */
    readonly value: V | undefined
    /** Form field name (triggers auto hidden input when provided) */
    readonly name?: string
    /** Associate with form by ID */
    readonly form?: string
    /** Whether this checkbox is currently checked */
    isChecked: Readonly<Ref<boolean>>
    /** Whether this checkbox is in a mixed/indeterminate state */
    isMixed: Readonly<Ref<boolean>>
    /** Whether this checkbox is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Check this checkbox */
    select: () => void
    /** Uncheck this checkbox */
    unselect: () => void
    /** Toggle this checkbox's state */
    toggle: () => void
    /** Set this checkbox to mixed/indeterminate state (group mode only) */
    mix: () => void
    /** Clear mixed/indeterminate state (group mode only) */
    unmix: () => void
  }

  export interface CheckboxRootProps<V = unknown> extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Optional display label (passed through to slot) */
    label?: string
    /** Value associated with this checkbox (used in group mode and form submission) */
    value?: V
    /** Form field name - triggers auto hidden input when provided */
    name?: string
    /** Associate with form by ID */
    form?: string
    /** Disables this checkbox */
    disabled?: MaybeRef<boolean>
    /** Sets the indeterminate state */
    indeterminate?: MaybeRef<boolean>
    /** Namespace for context provision to children (Indicator, HiddenInput) */
    namespace?: string
    /** Namespace for connecting to parent Checkbox.Group */
    groupNamespace?: string
    /** ID of element that labels this checkbox */
    ariaLabelledby?: string
    /** ID of element that describes this checkbox */
    ariaDescribedby?: string
    /** Whether the checkbox has an invalid value */
    ariaInvalid?: boolean
  }

  export interface CheckboxRootSlotProps<V = unknown> {
    /** Unique identifier */
    id: ID
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
    select: () => void
    /** Uncheck this checkbox */
    unselect: () => void
    /** Toggle this checkbox's state */
    toggle: () => void
    /** Set this checkbox to mixed/indeterminate state (group mode only) */
    mix: () => void
    /** Clear mixed/indeterminate state (group mode only) */
    unmix: () => void
    /** Attributes to bind to the checkbox element */
    attrs: {
      'type': 'button' | undefined
      'role': 'checkbox'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'aria-invalid': boolean | undefined
      'tabindex': 0 | undefined
      'data-state': CheckboxState
      'data-disabled': true | undefined
    }
  }

  export const [useCheckboxRoot, provideCheckboxRoot] = createContext<CheckboxRootContext<unknown>>()
</script>

<script setup lang="ts" generic="V = unknown">
  // Components
  import { useCheckboxGroup } from './CheckboxGroup.vue'
  import CheckboxHiddenInput from './CheckboxHiddenInput.vue'

  // Utilities
  import { genId } from '#v0/utilities'
  import { onUnmounted, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'

  defineOptions({ name: 'CheckboxRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: CheckboxRootSlotProps<V>) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = 'button',
    renderless,
    id = genId(),
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    label,
    value,
    name,
    form,
    disabled = false,
    indeterminate = false,
    namespace = 'v0:checkbox:root',
    groupNamespace = 'v0:checkbox:group',
  } = defineProps<CheckboxRootProps<V>>()

  // Dual-mode: try to inject group context, null if standalone
  let group: GroupContext<GroupTicket> | null = null
  try {
    group = useCheckboxGroup(groupNamespace)
  } catch {
    // No group context, standalone mode
  }

  const model = defineModel<boolean>()

  // Dual mode: register with parent
  const ticket = group?.register({ id, value, disabled, indeterminate })

  const isChecked = toRef(() => ticket
    ? toValue(ticket.isSelected)
    : model.value ?? false,
  )

  const isMixed = toRef(() => ticket
    ? toValue(ticket.isMixed)
    : toValue(indeterminate) ?? false,
  )

  const isDisabled = toRef(() => group && ticket
    ? toValue(ticket.disabled) || toValue(group.disabled)
    : toValue(disabled) ?? false,
  )

  const dataState = toRef(() => isMixed.value
    ? 'indeterminate'
    : (isChecked.value ? 'checked' : 'unchecked'),
  )

  function toggle () {
    if (isDisabled.value) return

    if (ticket) {
      ticket.toggle()
    } else {
      model.value = !model.value
    }
  }

  function select () {
    if (isDisabled.value) return

    if (ticket) {
      ticket.select()
    } else {
      model.value = true
    }
  }

  function unselect () {
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

  function onClick () {
    toggle()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key !== ' ') return

    e.preventDefault()
    toggle()
  }

  onUnmounted(() => {
    if (!ticket || !group) return

    group.unregister(ticket.id)
  })

  const context: CheckboxRootContext<V> = {
    id,
    label,
    value,
    name,
    form,
    isChecked,
    isMixed,
    isDisabled,
    select,
    unselect,
    toggle,
    mix,
    unmix,
  }

  provideCheckboxRoot(namespace, context)

  const slotProps = toRef((): CheckboxRootSlotProps<V> => ({
    id,
    label,
    value,
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    select,
    unselect,
    toggle,
    mix,
    unmix,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': 'checkbox',
      'aria-checked': isMixed.value ? 'mixed' : isChecked.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'aria-invalid': ariaInvalid || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>

  <CheckboxHiddenInput v-if="name" />
</template>
