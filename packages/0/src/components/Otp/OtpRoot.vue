/**
 * @module OtpRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/otp
 *
 * @remarks
 * Root component for one-time-password / verification-code inputs. Creates
 * OTP context via createOtp, provides it to child components (Item,
 * HiddenInput), bridges v-model, and tracks per-item element refs so
 * Item can move focus between boxes (auto-advance, backspace-back, paste
 * distribution).
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import OtpHiddenInput from './OtpHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createOtp } from '#v0/composables/createOtp'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { mergeProps, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { OtpContext, OtpPattern } from '#v0/composables/createOtp'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  export interface OtpRootContext extends OtpContext {
    /** Form field name */
    readonly name?: string
    /** Resolved per-character pattern */
    pattern: Readonly<Ref<OtpPattern>>
    /** Whether interaction is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether the field is readonly */
    isReadonly: Readonly<Ref<boolean>>
    /** Register an Item's focusable element for focus movement between boxes */
    registerItemEl: (index: number, el: Element | null) => void
    /** Move focus to the item at `index`, clamped to [0, length). No-op if unregistered. */
    focusItem: (index: number) => void
  }

  export interface OtpRootProps extends AtomProps {
    /** Joined OTP value */
    modelValue?: string
    /** Number of characters (default: 6) */
    length?: number
    /** Per-character pattern (default: 'numeric') */
    pattern?: OtpPattern
    /** Disable interaction */
    disabled?: MaybeRefOrGetter<boolean>
    /** Show value, prevent changes */
    readonly?: MaybeRefOrGetter<boolean>
    /** Accessible name for the group */
    ariaLabel?: string
    /** ID of element that labels this group */
    ariaLabelledby?: string
    /** Form field name — triggers hidden input */
    name?: string
    /**
     * Fire when the joined value first reaches `length`. Decisional —
     * return / resolve `false` to reject (clears value, sets error).
     */
    onComplete?: (value: string) => boolean | void | PromiseLike<boolean | void>
    /** Namespace for context provision */
    namespace?: string
  }

  export interface OtpRootSlotProps {
    /** The joined OTP value */
    value: string
    /** Number of characters */
    length: number
    /** Whether the value is complete and pattern-valid */
    isComplete: boolean
    /** Whether an async onComplete is in flight */
    isValidating: boolean
    /** Whether the field is disabled */
    isDisabled: boolean
    /** Whether the field is readonly */
    isReadonly: boolean
    /** Attributes to bind to the group element */
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-disabled': boolean
      'aria-busy': true | undefined
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'data-complete': true | undefined
    }
  }

  export const [useOtpRoot, provideOtpRoot] = createContext<OtpRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'OtpRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: OtpRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    length = 6,
    pattern = 'numeric',
    disabled = false,
    readonly: _readonly = false,
    ariaLabel,
    ariaLabelledby,
    name,
    onComplete,
    namespace = 'v0:otp:root',
  } = defineProps<OtpRootProps>()

  const model = defineModel<string>({ default: '' })

  const otp = createOtp({
    value: model,
    // Wrap reactive props as getters — createOtp reads length/pattern via
    // toValue(), so bare scalar snapshots would freeze them at mount.
    length: toRef(() => length),
    pattern: toRef(() => pattern),
    disabled: () => toValue(disabled),
    readonly: () => toValue(_readonly),
    onComplete,
  })

  const itemEls = new Map<number, Element>()

  function registerItemEl (index: number, el: Element | null) {
    if (el) itemEls.set(index, el)
    else itemEls.delete(index)
  }

  function focusItem (index: number) {
    const max = toValue(otp.length) - 1
    const clamped = Math.min(Math.max(index, 0), max)
    const el = itemEls.get(clamped) as HTMLElement | undefined
    el?.focus()
  }

  const isDisabled = toRef(() => toValue(disabled))
  const isReadonly = toRef(() => toValue(_readonly))

  const context: OtpRootContext = {
    ...otp,
    name,
    pattern: toRef(() => pattern),
    isDisabled,
    isReadonly,
    registerItemEl,
    focusItem,
  }

  provideOtpRoot(namespace, context)

  const locale = useLocale()

  const slotProps = toRef((): OtpRootSlotProps => ({
    value: otp.value.value,
    length: otp.length.value,
    isComplete: otp.isComplete.value,
    isValidating: otp.isValidating.value,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
    attrs: {
      'role': 'group',
      'aria-label': ariaLabelledby ? undefined : (ariaLabel || (locale.ti('Otp.label') ?? 'Verification code')),
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-disabled': isDisabled.value,
      'aria-busy': otp.isValidating.value ? true : undefined,
      'data-disabled': isDisabled.value ? true : undefined,
      'data-readonly': isReadonly.value ? true : undefined,
      'data-complete': otp.isComplete.value ? true : undefined,
    },
  }))

  defineExpose({
    /** Move focus to the item at `index`, clamped to [0, length). */
    focusItem,
  })
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <OtpHiddenInput v-if="name" />
</template>
