/**
 * @module OtpItem
 *
 * @see https://0.vuetifyjs.com/components/forms/otp
 *
 * @remarks
 * A single character box within an OTP field. Consumes Otp context,
 * renders its character from `value[index]`, and handles auto-advance
 * on input, backspace-back navigation, arrow-key movement between
 * boxes, and paste distribution across siblings starting at this box.
 *
 * In renderless mode Atom does not mount an element, so this Item never
 * registers a focus target by itself. The consumer must call
 * `registerItemEl(index, el)` (via `useOtpRoot`) with the real input;
 * otherwise auto-advance, arrow, and paste-focus no-op. `onFocus`
 * registers `e.target` as a best-effort for the focused box when slot
 * attrs are spread onto the input.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useOtpRoot } from './OtpRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { OtpItemState } from '#v0/composables/createOtp'

  export interface OtpItemProps extends AtomProps {
    /** 0-based position within the OTP value */
    index: number
    /** Namespace for context injection from parent Otp.Root */
    namespace?: string
  }

  export interface OtpItemSlotProps {
    /** This box's current character, or '' when empty */
    value: string
    /** Fill state for this box */
    state: OtpItemState
    /** Whether the field is disabled */
    isDisabled: boolean
    /** Whether the field is readonly */
    isReadonly: boolean
    /** Pre-computed attributes for binding */
    attrs: {
      'type': 'text'
      'inputmode': 'numeric' | 'text'
      'autocomplete': 'one-time-code'
      'maxlength': 1
      'value': string
      'disabled': true | undefined
      'readonly': true | undefined
      'aria-label': string
      'aria-invalid': true | undefined
      'aria-describedby': string | undefined
      'data-state': OtpItemState
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'onBeforeinput': (e: InputEvent) => void
      'onInput': (e: Event) => void
      'onKeydown': (e: KeyboardEvent) => void
      'onPaste': (e: ClipboardEvent) => void
      'onFocus': (e: FocusEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OtpItem', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: OtpItemSlotProps) => any
  }>()

  const {
    as = 'input',
    renderless,
    index,
    namespace = 'v0:otp:root',
  } = defineProps<OtpItemProps>()

  const root = useOtpRoot(namespace)
  const locale = useLocale()

  const atomRef = useTemplateRef<AtomExpose>('item')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  watch(el, next => {
    root.registerItemEl(index, next)
  })

  onBeforeUnmount(() => {
    root.registerItemEl(index, null)
  })

  const char = toRef(() => root.value.value[index] ?? '')
  const state = toRef((): OtpItemState => char.value === '' ? 'empty' : 'filled')

  function onBeforeinput (e: InputEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return
    if (root.isValidating.value) {
      e.preventDefault()
      return
    }
    if (!e.data || e.data.length !== 1) return
    if (!root.accepts(e.data)) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    const at = Math.min(index, root.value.value.length)
    root.write(at, e.data)
    root.focusItem(at + 1)
  }

  function onInput (e: Event) {
    const target = e.target as HTMLInputElement

    if (root.isDisabled.value || root.isReadonly.value || root.isValidating.value) {
      target.value = char.value
      return
    }

    const text = target.value

    if (text === '') {
      root.write(index, '')
      return
    }

    if (text.length > 1) {
      const previous = root.value.value.length
      const written = root.distribute(text, index)
      if (written > 0) root.focusItem(Math.min(index, previous) + written)
      // Vue skips the patch when this box's model char didn't change.
      target.value = char.value
      return
    }

    const entered = text.at(-1)!

    if (!root.accepts(entered)) {
      // A rejected write leaves the model untouched, so Vue skips the patch
      // and the stale keystroke would linger in the DOM.
      target.value = char.value
      return
    }

    const at = Math.min(index, root.value.value.length)
    root.write(at, entered)
    root.focusItem(at + 1)
    target.value = char.value
  }

  function onFocus (e: FocusEvent) {
    const target = e.target as HTMLInputElement
    root.registerItemEl(index, target)
    target.select()
  }

  function onKeydown (e: KeyboardEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      root.focusItem(index - 1)
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      root.focusItem(index + 1)
      return
    }

    if (root.isValidating.value) {
      if (e.key === 'Backspace') e.preventDefault()
      return
    }

    if (e.key === 'Backspace') {
      const target = e.target as HTMLInputElement
      if (target.value === '') {
        e.preventDefault()
        root.write(index - 1, '')
        root.focusItem(index - 1)
      }
    }
  }

  function onPaste (e: ClipboardEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return
    e.preventDefault()
    const text = e.clipboardData?.getData('text') ?? ''
    const previous = root.value.value.length
    const written = root.distribute(text, index)
    if (written > 0) root.focusItem(Math.min(index, previous) + written)
  }

  const slotProps = toRef((): OtpItemSlotProps => ({
    value: char.value,
    state: state.value,
    isDisabled: root.isDisabled.value,
    isReadonly: root.isReadonly.value,
    attrs: {
      'type': 'text',
      'inputmode': root.pattern.value === 'numeric' ? 'numeric' : 'text',
      'autocomplete': 'one-time-code',
      'maxlength': 1,
      'value': char.value,
      'disabled': root.isDisabled.value || undefined,
      'readonly': root.isReadonly.value || undefined,
      'aria-label': locale.ti('Otp.itemLabel', { index: index + 1, length: root.length.value }) ?? `Digit ${index + 1} of ${root.length.value}`,
      'aria-invalid': root.input.isValid.value === false || undefined,
      'aria-describedby': root.ariaDescribedby.value || undefined,
      'data-state': state.value,
      'data-disabled': root.isDisabled.value ? true : undefined,
      'data-readonly': root.isReadonly.value ? true : undefined,
      'onBeforeinput': onBeforeinput,
      'onInput': onInput,
      'onKeydown': onKeydown,
      'onPaste': onPaste,
      'onFocus': onFocus,
    },
  }))
</script>

<template>
  <Atom
    ref="item"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
