/**
 * @module ButtonRoot
 *
 * @see https://0.vuetifyjs.com/components/actions/button
 *
 * @remarks
 * Root component for buttons with support for disabled, readonly, passive, and loading states.
 * - **Standalone mode**: Renders as a clickable button element
 * - **Group mode**: Registers with parent Button.Group for toggle selection
 *
 * Provides button context to child Loading, Content, Icon, and HiddenInput components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useButtonGroup } from './ButtonGroup.vue'
  import ButtonHiddenInput from './ButtonHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createSingle } from '#v0/composables/createSingle'
  import { useLocale } from '#v0/composables/useLocale'
  import { useTimer } from '#v0/composables/useTimer'

  // Utilities
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, toValue, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/createSelection'
  import type { SingleContext } from '#v0/composables/createSingle'
  import type { Ref } from 'vue'

  export interface ButtonRootContext {
    /** The button's value (for group registration / form submission) */
    value: unknown
    /** Form field name */
    name?: string
    /** Form association ID */
    form?: string
    /** Whether the button is in the loading state (after grace period) */
    isLoading: Readonly<Ref<boolean>>
    /** Whether the button is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether the button is readonly */
    isReadonly: Readonly<Ref<boolean>>
    /** Whether the button is passive */
    isPassive: Readonly<Ref<boolean>>
    /** Whether the button is selected (in group mode) */
    isSelected: Readonly<Ref<boolean>>
    /** Whether the button is an icon-only button */
    isSolo: Ref<boolean>
    /** Internal single selection for Loading/Content visibility */
    single: SingleContext
  }

  export interface ButtonRootProps<V = unknown> extends AtomProps {
    /** Disables the button — fully non-interactive, removed from tab order */
    disabled?: boolean
    /** Non-clickable but looks normal, remains focusable/hoverable */
    readonly?: boolean
    /** Non-clickable, looks disabled via [data-passive], remains focusable/hoverable */
    passive?: boolean
    /** Triggers loading state with grace period before visual indicator */
    loading?: boolean
    /** Duration in ms before loading UI appears (0 to show immediately) */
    grace?: number
    /** Value for use inside Button.Group */
    value?: V
    /** Namespace for context provision to children */
    namespace?: string
    /** Namespace for connecting to parent Button.Group */
    groupNamespace?: string
    /** Form field name — auto-renders HiddenInput when set */
    name?: string
    /** Associate with form by ID */
    form?: string
    /** Accessible label for the button */
    ariaLabel?: string
  }

  export interface ButtonRootSlotProps {
    /** Whether the button is in the loading state (after grace period) */
    isLoading: boolean
    /** Whether the button is disabled */
    isDisabled: boolean
    /** Whether the button is readonly */
    isReadonly: boolean
    /** Whether the button is passive */
    isPassive: boolean
    /** Whether the button is selected (in group mode) */
    isSelected: boolean
    /** Attributes to bind to the button element */
    attrs: {
      'type': 'button' | undefined
      'role': 'button'
      'disabled': true | undefined
      'aria-disabled': true | undefined
      'aria-busy': true | undefined
      'aria-pressed': boolean | undefined
      'aria-label': string | undefined
      'tabindex': 0 | -1 | undefined
      'data-loading': true | undefined
      'data-passive': true | undefined
      'data-readonly': true | undefined
      'data-disabled': true | undefined
      'data-selected': true | undefined
      'data-solo': true | undefined
      'onClick': (() => void) | undefined
    }
  }

  export const [useButtonRoot, provideButtonRoot] = createContext<ButtonRootContext>()
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'ButtonRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ButtonRootSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    disabled = false,
    readonly: _readonly = false,
    passive = false,
    loading = false,
    grace = 0,
    value,
    name,
    form,
    ariaLabel,
    namespace = 'v0:button:root',
    groupNamespace = 'v0:button:group',
  } = defineProps<ButtonRootProps<V>>()

  let group: SelectionContext<SelectionTicket> | null = null
  try {
    group = useButtonGroup(groupNamespace)
  } catch {}

  const ticket = group?.register({ value, disabled })

  const isDisabled = toRef(() => group && ticket
    ? toValue(ticket.disabled) || toValue(group.disabled)
    : disabled,
  )

  const isReadonly = toRef(() => _readonly)
  const isPassive = toRef(() => passive)

  const isSelected = toRef(() => ticket
    ? toValue(ticket.isSelected)
    : false,
  )

  const isLoading = shallowRef(false)

  const timer = useTimer(() => {
    isLoading.value = true
  }, { duration: grace })

  watch(() => loading, active => {
    if (!active) {
      timer.stop()
      isLoading.value = false
    } else if (grace > 0) {
      timer.start()
    } else {
      isLoading.value = true
    }
  }, { immediate: true })

  const single = createSingle({ mandatory: 'force' })
  const isSolo = shallowRef(false)
  const locale = useLocale()

  function onClick () {
    if (isDisabled.value || isReadonly.value || isPassive.value || loading || !ticket) return
    ticket.toggle()
  }

  onBeforeUnmount(() => {
    timer.stop()
    ticket?.unregister()
  })

  const context: ButtonRootContext = {
    value,
    name,
    form,
    isLoading: toRef(() => isLoading.value),
    isDisabled,
    isReadonly,
    isPassive,
    isSelected,
    isSolo,
    single,
  }

  provideButtonRoot(namespace, context)

  const elementAttrs = toRef((): ButtonRootSlotProps['attrs'] => ({
    'type': as === 'button' ? 'button' : undefined,
    'role': 'button',
    'disabled': isDisabled.value ? true : undefined,
    'aria-disabled': isPassive.value ? true : undefined,
    'aria-busy': isLoading.value ? true : undefined,
    'aria-pressed': group ? isSelected.value : undefined,
    'aria-label': ariaLabel || (isSolo.value ? locale.t('Button.label') : undefined),
    'tabindex': isDisabled.value ? -1 : 0,
    'data-loading': isLoading.value ? true : undefined,
    'data-passive': isPassive.value ? true : undefined,
    'data-readonly': isReadonly.value ? true : undefined,
    'data-disabled': isDisabled.value ? true : undefined,
    'data-selected': group && isSelected.value ? true : undefined,
    'data-solo': isSolo.value ? true : undefined,
    'onClick': ticket ? onClick : undefined,
  }))

  const slotProps = toRef((): ButtonRootSlotProps => ({
    isLoading: isLoading.value,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
    isPassive: isPassive.value,
    isSelected: isSelected.value,
    attrs: elementAttrs.value,
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <ButtonHiddenInput v-if="name" />
</template>
