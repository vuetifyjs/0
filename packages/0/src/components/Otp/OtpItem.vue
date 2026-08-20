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

  export type OtpItemState = 'filled' | 'empty'

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
      'data-state': OtpItemState
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'onBeforeinput': (e: InputEvent) => void
      'onInput': (e: Event) => void
      'onKeydown': (e: KeyboardEvent) => void
      'onPaste': (e: ClipboardEvent) => void
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

  const charValue = toRef(() => root.value.value[index] ?? '')
  const state = toRef((): OtpItemState => charValue.value === '' ? 'empty' : 'filled')

  function onBeforeinput (e: InputEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return
    if (!e.data || e.data.length !== 1) return
    if (!root.accepts(e.data)) e.preventDefault()
  }

  function onInput (e: Event) {
    const target = e.target as HTMLInputElement

    if (root.isDisabled.value || root.isReadonly.value || root.isValidating.value) {
      target.value = charValue.value
      return
    }

    const text = target.value

    if (text === '') {
      root.write(index, '')
      return
    }

    const char = text.at(-1)!

    if (!root.accepts(char)) {
      // A rejected write leaves the model untouched, so Vue skips the patch
      // and the stale keystroke would linger in the DOM.
      target.value = charValue.value
      return
    }

    root.write(index, char)
    root.focusItem(index + 1)
  }

  function onKeydown (e: KeyboardEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return

    if (e.key === 'Backspace') {
      const target = e.target as HTMLInputElement
      if (target.value === '') {
        e.preventDefault()
        root.write(index - 1, '')
        root.focusItem(index - 1)
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      root.focusItem(index - 1)
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      root.focusItem(index + 1)
    }
  }

  function onPaste (e: ClipboardEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return
    e.preventDefault()
    const text = e.clipboardData?.getData('text') ?? ''
    const written = root.distribute(text, index)
    // distribute splices at min(value.length, index), so the next empty box
    // sits at that start plus the written count — `index + written` would
    // overshoot when the paste lands before `index` on a shorter value.
    // Computed from the pre-write value: the model ref may update async.
    if (written > 0) root.focusItem(Math.min(root.value.value.length, index) + written)
  }

  const slotProps = toRef((): OtpItemSlotProps => ({
    value: charValue.value,
    state: state.value,
    isDisabled: root.isDisabled.value,
    isReadonly: root.isReadonly.value,
    attrs: {
      'type': 'text',
      'inputmode': root.pattern.value === 'numeric' ? 'numeric' : 'text',
      'autocomplete': 'one-time-code',
      'maxlength': 1,
      'value': charValue.value,
      'disabled': root.isDisabled.value || undefined,
      'readonly': root.isReadonly.value || undefined,
      'aria-label': locale.ti('Otp.itemLabel', { index: index + 1, length: root.length.value }) ?? `Digit ${index + 1} of ${root.length.value}`,
      'data-state': state.value,
      'data-disabled': root.isDisabled.value ? true : undefined,
      'data-readonly': root.isReadonly.value ? true : undefined,
      'onBeforeinput': onBeforeinput,
      'onInput': onInput,
      'onKeydown': onKeydown,
      'onPaste': onPaste,
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
