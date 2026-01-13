/**
 * @module RadioRoot
 *
 * @remarks
 * Root component for individual radio buttons. Must be used within a
 * Radio.Group component which provides the single-selection context.
 * Provides radio context to child Radio.Indicator components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRef, Ref } from 'vue'

  /** Visual state of the radio for styling purposes */
  export type RadioState = 'checked' | 'unchecked'

  export interface RadioRootContext {
    /** Unique identifier */
    readonly id: ID
    /** Optional display label */
    readonly label?: string
    /** Value associated with this radio */
    readonly value: unknown
    /** Form field name (triggers auto hidden input when provided) */
    readonly name?: string
    /** Associate with form by ID */
    readonly form?: string
    /** Whether this radio is currently checked */
    isChecked: Readonly<Ref<boolean>>
    /** Whether this radio is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Check this radio */
    select: () => void
  }

  export interface RadioRootProps<V = unknown> extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Optional display label (passed through to slot) */
    label?: string
    /** Value associated with this radio (required for group selection) */
    value?: V
    /** Form field name - triggers auto hidden input when provided */
    name?: string
    /** Associate with form by ID */
    form?: string
    /** Disables this radio */
    disabled?: MaybeRef<boolean>
    /** Namespace for context provision to children (Indicator, HiddenInput) */
    namespace?: string
    /** Namespace for connecting to parent Radio.Group */
    groupNamespace?: string
    /** ID of element that labels this radio */
    ariaLabelledby?: string
    /** ID of element that describes this radio */
    ariaDescribedby?: string
    /** Whether the radio has an invalid value */
    ariaInvalid?: boolean
  }

  export interface RadioRootSlotProps<V = unknown> {
    /** Unique identifier */
    id: ID
    /** Optional display label */
    label?: string
    /** Value associated with this radio */
    value: V | undefined
    /** Whether this radio is currently checked */
    isChecked: boolean
    /** Whether this radio is disabled */
    isDisabled: boolean
    /** Check this radio */
    select: () => void
    /** Attributes to bind to the radio element */
    attrs: {
      'type': 'button' | undefined
      'role': 'radio'
      'aria-checked': boolean
      'aria-disabled': boolean | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'aria-invalid': boolean | undefined
      'tabindex': 0 | -1
      'data-state': RadioState
      'data-disabled': true | undefined
      'data-radio-id': ID
    }
  }

  export const [useRadioRoot, provideRadioRoot] = createContext<RadioRootContext>()
</script>

<script setup lang="ts" generic="V = unknown">
  // Components
  import { useRadioGroup } from './RadioGroup.vue'
  import RadioHiddenInput from './RadioHiddenInput.vue'

  // Utilities
  import { genId } from '#v0/utilities'
  import { onUnmounted, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  defineOptions({ name: 'RadioRoot', inheritAttrs: false })

  const attrs = useAttrs()
  const rootRef = useTemplateRef<AtomExpose>('root')

  defineSlots<{
    default: (props: RadioRootSlotProps<V>) => any
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
    name: _name,
    form,
    disabled = false,
    namespace = 'v0:radio:root',
    groupNamespace = 'v0:radio:group',
  } = defineProps<RadioRootProps<V>>()

  const group = useRadioGroup(groupNamespace)

  const name = _name ?? group.name

  // Register with parent group (el ref for focus management)
  // Note: Vue auto-unwraps exposed refs when accessed via template ref
  const el = toRef(() => (rootRef.value?.element as unknown as HTMLElement | null) ?? undefined)
  const ticket = group.register({ id, value, disabled, el })

  const isChecked = toRef(() => toValue(ticket.isSelected))
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(group.disabled))
  const dataState = toRef((): RadioState => isChecked.value ? 'checked' : 'unchecked')
  // Roving tabindex: tabbable if selected, or first non-disabled when none selected
  const isTabbable = toRef(() => {
    if (toValue(group.disabled)) return false
    if (toValue(ticket.disabled)) return false
    if (toValue(ticket.isSelected)) return true
    if (group.selectedIds.size > 0) return false
    // First non-disabled item is tabbable when none selected
    for (const item of group.values()) {
      if (!toValue(item.disabled)) return item.id === id
    }
    return false
  })

  function select () {
    if (isDisabled.value) return

    ticket.select()
  }

  function onClick () {
    select()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault()
      select()
      return
    }

    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    if (!keys.includes(e.key)) return

    e.preventDefault()

    const items = [...group.values()].filter(item => !toValue(item.disabled))
    const currentIndex = items.findIndex(item => item.id === id)
    if (currentIndex === -1) return

    let nextIndex: number
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
    } else {
      nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1
    }

    const nextItem = items[nextIndex]
    if (!nextItem) return

    nextItem.select()
    toValue(nextItem.el)?.focus()
  }

  onUnmounted(() => {
    group.unregister(ticket.id)
  })

  const context: RadioRootContext = {
    id,
    label,
    value,
    name,
    form,
    isChecked,
    isDisabled,
    select,
  }

  provideRadioRoot(namespace, context)

  const slotProps = toRef((): RadioRootSlotProps<V> => ({
    id,
    label,
    value,
    isChecked: isChecked.value,
    isDisabled: isDisabled.value,
    select,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': 'radio',
      'aria-checked': isChecked.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'aria-invalid': ariaInvalid || undefined,
      'tabindex': isTabbable.value ? 0 : -1,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
      'data-radio-id': id,
    },
  }))
</script>

<template>
  <Atom
    ref="root"
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>

  <RadioHiddenInput v-if="name" />
</template>
