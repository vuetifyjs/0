/**
 * @module OtpRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/otp
 *
 * @remarks
 * Root component for one-time-password / verification-code inputs. Creates
 * OTP context via createOtp, provides it to child components (Item,
 * HiddenInput), bridges v-model, and keeps an items registry plus
 * `useRovingFocus` so Item can move focus between boxes (auto-advance,
 * arrows, paste). Boxes stay independently tabbable — roving is for
 * arrow/programmatic focus, not a single tabindex.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import OtpHiddenInput from './OtpHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createOtp } from '#v0/composables/createOtp'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { useLocale } from '#v0/composables/useLocale'
  import { useRovingFocus } from '#v0/composables/useRovingFocus'

  // Utilities
  import { clamp, isUndefined } from '#v0/utilities'
  import { mergeProps, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { OtpContext, OtpItemDescriptor, OtpPattern } from '#v0/composables/createOtp'
  import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  export type OtpItemsContext = RegistryContext<
    RegistryTicketInput<Element>,
    RegistryTicket<Element>
  >

  export interface OtpRootContext extends OtpContext {
    /** Form field name */
    readonly name?: string
    /** Resolved per-character pattern */
    pattern: Readonly<Ref<OtpPattern>>
    /** Whether interaction is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether the field is readonly */
    isReadonly: Readonly<Ref<boolean>>
    /** ID of element that describes this group */
    ariaDescribedby: Readonly<Ref<string | undefined>>
    /**
     * Move DOM focus to a box. Omitting `index` focuses the first empty box
     * (or the last box when complete). Clamped to [0, length).
     */
    focus: (index?: number) => void
    /** Roving arrow/Home/End handler. Sync `focusedId` before calling. */
    onKeydown: (e: KeyboardEvent) => void
    /** Roving cursor — set on pointer/tab into a box without calling `focus`. */
    focusedId: ShallowRef<ID | undefined>
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
    /** ID of element that describes this group */
    ariaDescribedby?: string
    /** Form field name — triggers hidden input */
    name?: string
    /** Namespace for context provision */
    namespace?: string
  }

  export type OtpRootEmits = {
    'update:model-value': [value: string]
    /** Joined value first reached `length`. Observational — return values are ignored. */
    'complete': [value: string]
  }

  export interface OtpRootSlotProps {
    /** The joined OTP value */
    value: string
    /** Number of characters */
    length: number
    /** One descriptor per box — v-for this instead of `i in length` */
    items: OtpItemDescriptor[]
    /** Whether the value is complete and pattern-valid */
    isComplete: boolean
    /** Whether the field is disabled */
    isDisabled: boolean
    /** Whether the field is readonly */
    isReadonly: boolean
    /** Attributes to bind to the group element */
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'aria-disabled': boolean
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'data-complete': true | undefined
    }
  }

  export interface OtpRootExpose {
    /**
     * Focus a box by index, or the first empty box when omitted.
     * Clamped to [0, length).
     */
    focus: (index?: number) => void
  }

  export const [useOtpRoot, provideOtpRoot] = createContext<OtpRootContext>()
  export const [useOtpItems, provideOtpItems] = createContext<OtpItemsContext>({ suffix: 'items' })
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
    ariaDescribedby,
    name,
    namespace = 'v0:otp:root',
  } = defineProps<OtpRootProps>()

  const model = defineModel<string>({ default: '' })

  const emit = defineEmits<OtpRootEmits>()

  const otp = createOtp({
    value: model,
    // Wrap reactive props as getters — createOtp reads length/pattern via
    // toValue(), so bare scalar snapshots would freeze them at mount.
    length: toRef(() => length),
    pattern: toRef(() => pattern),
    disabled: () => toValue(disabled),
    readonly: () => toValue(_readonly),
    onComplete: value => {
      emit('complete', value)
    },
  })

  const items = createRegistry<RegistryTicketInput<Element>, RegistryTicket<Element>>()
  const isDisabled = toRef(() => toValue(disabled))
  const isReadonly = toRef(() => toValue(_readonly))

  const roving = useRovingFocus(
    () => items.values().map(ticket => ({
      id: ticket.id,
      el: ticket.value,
      disabled: isDisabled,
    })),
    { orientation: 'horizontal' },
  )

  function focus (index?: number) {
    const max = toValue(otp.length) - 1
    if (max < 0) return
    const raw = isUndefined(index) ? otp.value.value.length : index
    roving.focus(clamp(raw, 0, max))
  }

  const context: OtpRootContext = {
    ...otp,
    name,
    pattern: toRef(() => pattern),
    isDisabled,
    isReadonly,
    ariaDescribedby: toRef(() => ariaDescribedby),
    focus,
    onKeydown: roving.onKeydown,
    focusedId: roving.focusedId,
  }

  provideOtpRoot(namespace, context)
  provideOtpItems(namespace, items)

  const locale = useLocale()

  const slotProps = toRef((): OtpRootSlotProps => ({
    value: otp.value.value,
    length: otp.length.value,
    items: otp.items.value,
    isComplete: otp.isComplete.value,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
    attrs: {
      'role': 'group',
      'aria-label': ariaLabelledby ? undefined : (ariaLabel || (locale.ti('Otp.label') ?? 'Verification code')),
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'aria-disabled': isDisabled.value,
      'data-disabled': isDisabled.value ? true : undefined,
      'data-readonly': isReadonly.value ? true : undefined,
      'data-complete': otp.isComplete.value ? true : undefined,
    },
  }))

  defineExpose<OtpRootExpose>({ focus })
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
