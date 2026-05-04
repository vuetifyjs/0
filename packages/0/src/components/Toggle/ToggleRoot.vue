/**
 * @module ToggleRoot
 *
 * @see https://0.vuetifyjs.com/components/actions/toggle
 *
 * @remarks
 * Pressable toggle button with dual-mode support. In standalone mode,
 * manages a boolean v-model. In group mode, registers with the parent
 * Toggle.Group selection composable and derives pressed state from it.
 * Renders as a native button by default with aria-pressed.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { Ref } from 'vue'

  export interface ToggleRootContext {
    /** Whether this toggle is currently pressed */
    isPressed: Readonly<Ref<boolean>>
    /** Whether this toggle is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Toggle the pressed state */
    toggle: () => void
  }

  export interface ToggleRootProps<V = unknown> extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Selection key when inside a Toggle.Group */
    value?: V
    /** Disables this toggle */
    disabled?: boolean
    /** Namespace for context provision to children (Indicator) */
    namespace?: string
    /** Namespace for connecting to parent Toggle.Group */
    groupNamespace?: string
  }

  export interface ToggleRootSlotProps {
    /** Whether this toggle is currently pressed */
    isPressed: boolean
    /** Whether this toggle is disabled */
    isDisabled: boolean
    /** Toggle the pressed state */
    toggle: () => void
    /** Attributes to bind to the toggle element */
    attrs: {
      'type': 'button' | undefined
      'aria-pressed': boolean
      'aria-disabled': boolean | undefined
      'tabindex': 0 | undefined
      'data-state': 'on' | 'off'
      'data-disabled': true | undefined
    }
  }

  export const [useToggleRoot, provideToggleRoot] = createContext<ToggleRootContext>()
</script>

<script setup lang="ts" generic="V = unknown">
  // Context
  import { useToggleGroup } from './ToggleGroup.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, toValue, useAttrs, watch } from 'vue'

  // Types
  import type { ToggleGroupContext } from './ToggleGroup.vue'

  defineOptions({ name: 'ToggleRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ToggleRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = 'button',
    renderless,
    id = useId(),
    value,
    disabled = false,
    namespace = 'v0:toggle:root',
    groupNamespace = 'v0:toggle:group',
  } = defineProps<ToggleRootProps<V>>()

  // Dual-mode: try to inject group context, null if standalone
  let group: ToggleGroupContext | null = null
  try {
    group = useToggleGroup(groupNamespace)
  } catch {
    // No group context, standalone mode
  }

  const model = defineModel<boolean>()

  // Local pressed state for standalone mode — defineModel reverts to
  // parent prop on re-render in Vue 3.5+, so we need a local source of truth
  const pressed = shallowRef(model.value ?? false)

  watch(() => model.value, v => {
    pressed.value = v ?? false
  })

  // Dual mode: register with group's selection composable
  const ticket = group?.selection.register({ id, value, disabled })

  const isPressed = toRef(() => ticket
    ? toValue(ticket.isSelected)
    : pressed.value,
  )

  const isDisabled = toRef(() => group && ticket
    ? toValue(ticket.disabled) || toValue(group.disabled)
    : disabled,
  )

  function toggle () {
    if (isDisabled.value) return

    if (ticket) {
      ticket.toggle()
    } else {
      pressed.value = !pressed.value
      model.value = pressed.value
    }
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
    ticket?.unregister()
  })

  const context: ToggleRootContext = {
    isPressed,
    isDisabled,
    toggle,
  }

  provideToggleRoot(namespace, context)

  const slotProps = toRef((): ToggleRootSlotProps => ({
    isPressed: isPressed.value,
    isDisabled: isDisabled.value,
    toggle,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-pressed': isPressed.value,
      'aria-disabled': isDisabled.value || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': isPressed.value ? 'on' : 'off',
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
</template>
