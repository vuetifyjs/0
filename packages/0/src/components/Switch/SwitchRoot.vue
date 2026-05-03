/**
 * @module SwitchRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/switch
 *
 * @remarks
 * Root component for individual switches with dual-mode support:
 * - **Standalone mode**: Uses v-model for boolean state
 * - **Group mode**: Registers with parent Switch.Group for multi-selection
 *
 * Automatically detects parent group context and adapts behavior accordingly.
 * Provides switch context to child Switch.Thumb and Switch.Track components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSwitchGroup } from './SwitchGroup.vue'
  import SwitchHiddenInput from './SwitchHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  /** Visual state of the switch for styling purposes */
  export type SwitchState = 'checked' | 'unchecked' | 'indeterminate'

  export interface SwitchRootContext<V = unknown> {
    /** Unique identifier */
    readonly id: ID
    /** Optional display label */
    readonly label?: string
    /** Value associated with this switch */
    readonly value: V | undefined
    /** Form field name (triggers auto hidden input when provided) */
    readonly name?: string
    /** Associate with form by ID */
    readonly form?: string
    /** Whether this switch is currently on */
    isChecked: Readonly<Ref<boolean>>
    /** Whether this switch is in a mixed/indeterminate state */
    isMixed: Readonly<Ref<boolean>>
    /** Whether this switch is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Turn this switch on */
    select: () => void
    /** Turn this switch off */
    unselect: () => void
    /** Toggle this switch's state */
    toggle: () => void
    /** Set this switch to mixed/indeterminate state (group mode only) */
    mix: () => void
    /** Clear mixed/indeterminate state (group mode only) */
    unmix: () => void
  }

  export interface SwitchRootProps<V = unknown> extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Optional display label (passed through to slot) */
    label?: string
    /** Value associated with this switch (used in group mode and form submission) */
    value?: V
    /** Form field name - triggers auto hidden input when provided */
    name?: string
    /** Associate with form by ID */
    form?: string
    /** Disables this switch */
    disabled?: MaybeRefOrGetter<boolean>
    /** Sets the indeterminate state */
    indeterminate?: MaybeRefOrGetter<boolean>
    /** Namespace for context provision to children (Track, Thumb, HiddenInput) */
    namespace?: string
    /** Namespace for connecting to parent Switch.Group */
    groupNamespace?: string
    /** ID of element that labels this switch */
    ariaLabelledby?: string
    /** ID of element that describes this switch */
    ariaDescribedby?: string
    /** Whether the switch has an invalid value */
    ariaInvalid?: boolean
  }

  export interface SwitchRootSlotProps<V = unknown> {
    /** Unique identifier */
    id: ID
    /** Optional display label */
    label?: string
    /** Value associated with this switch */
    value: V | undefined
    /** Whether this switch is currently on */
    isChecked: boolean
    /** Whether this switch is in a mixed/indeterminate state */
    isMixed: boolean
    /** Whether this switch is disabled */
    isDisabled: boolean
    /** Turn this switch on */
    select: () => void
    /** Turn this switch off */
    unselect: () => void
    /** Toggle this switch's state */
    toggle: () => void
    /** Set this switch to mixed/indeterminate state (group mode only) */
    mix: () => void
    /** Clear mixed/indeterminate state (group mode only) */
    unmix: () => void
    /** Pre-computed ARIA and data attributes for the root element */
    attrs: {
      'type': 'button' | undefined
      'role': 'switch'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'aria-invalid': boolean | undefined
      'tabindex': 0 | undefined
      'data-state': SwitchState
      'data-disabled': true | undefined
    }
  }

  export const [useSwitchRoot, provideSwitchRoot] = createContext<SwitchRootContext<unknown>>()
</script>

<script setup lang="ts" generic="V = unknown">
  defineOptions({ name: 'SwitchRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SwitchRootSlotProps<V>) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = 'button',
    renderless,
    id = useId(),
    ariaLabelledby,
    ariaDescribedby,
    ariaInvalid,
    label,
    value,
    name,
    form,
    disabled = false,
    indeterminate = false,
    namespace = 'v0:switch:root',
    groupNamespace = 'v0:switch:group',
  } = defineProps<SwitchRootProps<V>>()

  let group: GroupContext<GroupTicket> | null = null
  try {
    group = useSwitchGroup(groupNamespace)
  } catch {
    // No group context, standalone mode
  }

  const model = defineModel<boolean>()

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

  onBeforeUnmount(() => {
    if (!ticket || !group) return
    group.unregister(ticket.id)
  })

  const context: SwitchRootContext<V> = {
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

  provideSwitchRoot(namespace, context)

  const slotProps = toRef((): SwitchRootSlotProps<V> => ({
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
      'role': 'switch',
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
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>

  <SwitchHiddenInput v-if="name" />
</template>
