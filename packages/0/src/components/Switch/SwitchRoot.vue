/**
 * @module SwitchRoot
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

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRef, Ref } from 'vue'

  /** Visual state of the switch for styling purposes */
  export type SwitchState = 'checked' | 'unchecked' | 'indeterminate'

  export interface SwitchRootContext<V = unknown> {
    readonly id: ID
    readonly label?: string
    readonly value: V | undefined
    readonly name?: string
    readonly form?: string
    isChecked: Readonly<Ref<boolean>>
    isMixed: Readonly<Ref<boolean>>
    isDisabled: Readonly<Ref<boolean>>
    select: () => void
    unselect: () => void
    toggle: () => void
    mix: () => void
    unmix: () => void
  }

  export interface SwitchRootProps<V = unknown> extends AtomProps {
    id?: ID
    label?: string
    value?: V
    name?: string
    form?: string
    disabled?: MaybeRef<boolean>
    indeterminate?: MaybeRef<boolean>
    namespace?: string
    groupNamespace?: string
    ariaLabelledby?: string
    ariaDescribedby?: string
    ariaInvalid?: boolean
  }

  export interface SwitchRootSlotProps<V = unknown> {
    id: ID
    label?: string
    value: V | undefined
    isChecked: boolean
    isMixed: boolean
    isDisabled: boolean
    select: () => void
    unselect: () => void
    toggle: () => void
    mix: () => void
    unmix: () => void
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
  // Components
  import { useSwitchGroup } from './SwitchGroup.vue'
  import SwitchHiddenInput from './SwitchHiddenInput.vue'

  // Utilities
  import { onUnmounted, toRef, toValue, useAttrs, useId } from 'vue'

  // Types
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'

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

  onUnmounted(() => {
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
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>

  <SwitchHiddenInput v-if="name" />
</template>
