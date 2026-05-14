/**
 * @module NumberFieldControl
 *
 * @remarks
 * Native input element for number fields with spinbutton semantics.
 * Handles keyboard navigation (Arrow, Page, Home/End, Shift+Arrow, Enter),
 * text editing, and focus-dependent display (raw while focused, formatted while blurred).
 * Must be used within a NumberField.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { mergeProps, onMounted, shallowRef, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface NumberFieldControlProps extends AtomProps {
    /** Namespace for connecting to parent NumberField.Root */
    namespace?: string
  }

  export interface NumberFieldControlSlotProps {
    /** Current display value */
    value: string
    /** Whether this field is focused */
    isFocused: boolean
    /** Whether this field is disabled */
    isDisabled: boolean
    /** Whether this field is readonly */
    isReadonly: boolean
    /** Pre-computed attributes for the input element */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'NumberFieldControl', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: NumberFieldControlSlotProps) => any
  }>()

  const {
    as = 'input',
    renderless,
    namespace = 'v0:number-field:root',
  } = defineProps<NumberFieldControlProps>()

  const root = useNumberFieldRoot(namespace)

  const leap = Math.max(1, Math.round(root.numeric.leap / root.numeric.step))

  const text = shallowRef('')

  function syncText () {
    text.value = isNull(root.value.value) ? '' : String(root.value.value)
  }

  onMounted(syncText)

  watch(() => root.value.value, syncText)

  const displayValue = toRef(() => {
    return root.isFocused.value ? text.value : root.display.value
  })

  function onBeforeinput (e: InputEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return
    if (!e.data) return

    const input = e.target as HTMLInputElement
    const { value: existing, selectionStart, selectionEnd } = input

    const next = existing.slice(0, selectionStart ?? 0) + e.data + existing.slice(selectionEnd ?? 0)

    // Allow: optional minus at start, digits, optional single decimal point, digits
    if (!/^-?\d*\.?\d*$/.test(next)) {
      e.preventDefault()
    }
  }

  function onInput (e: Event) {
    const target = e.target as HTMLInputElement
    text.value = target.value
  }

  function onFocus () {
    root.isFocused.value = true
    syncText()
  }

  function onBlur () {
    const parsed = root.parse(text.value)
    root.value.value = parsed
    root.commit()
    root.isFocused.value = false
    syncText()
  }

  function onKeydown (e: KeyboardEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return

    if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault()
      if (e.key === 'ArrowUp') root.increment(10)
      else root.decrement(10)
      syncText()
      return
    }

    const actions: Record<string, () => void> = {
      ArrowUp: () => root.increment(),
      ArrowDown: () => root.decrement(),
      PageUp: () => root.increment(leap),
      PageDown: () => root.decrement(leap),
      Home: () => root.floor(),
      End: () => root.ceil(),
      Enter: () => {
        const parsed = root.parse(text.value)
        root.value.value = parsed
        root.commit()
      },
    }

    const action = actions[e.key]
    if (!action) return

    e.preventDefault()
    action()
    syncText()
  }

  function onWheel (e: WheelEvent) {
    if (!root.wheel) return
    if (!root.isFocused.value) return
    if (root.isDisabled.value || root.isReadonly.value) return

    e.preventDefault()

    if (e.deltaY < 0) root.increment()
    else root.decrement()
    syncText()
  }

  const describedby = toRef(() => {
    return root.hasDescription.value ? root.descriptionId : undefined
  })

  const controlAttrs = toRef((): Record<string, unknown> => {
    const invalid = root.isValid.value === false
    const disabled = root.isDisabled.value
    const readonly = root.isReadonly.value
    const isFocused = root.isFocused.value
    const val = root.value.value

    return {
      'id': root.id,
      'role': 'spinbutton',
      'type': 'text',
      'inputmode': 'decimal',
      'name': root.name,
      'value': displayValue.value,
      'form': root.form,
      'disabled': disabled || undefined,
      'readonly': readonly || undefined,
      'required': root.required || undefined,
      'autocomplete': 'off',
      'autocorrect': 'off',
      'spellcheck': false,
      'aria-valuenow': isNull(val) ? undefined : val,
      'aria-valuetext': isNull(val) ? undefined : root.display.value,
      'aria-valuemin': Number.isFinite(root.numeric.min) ? root.numeric.min : undefined,
      'aria-valuemax': Number.isFinite(root.numeric.max) ? root.numeric.max : undefined,
      'aria-invalid': invalid || undefined,
      'aria-label': root.label || undefined,
      'aria-describedby': describedby.value,
      'aria-errormessage': (root.hasError.value && root.errors.value.length > 0) ? root.errorId : undefined,
      'aria-required': root.required || undefined,
      'data-state': invalid ? 'invalid' : (root.isValid.value === true ? 'valid' : 'pristine'),
      'data-focused': isFocused ? true : undefined,
      'data-disabled': disabled ? true : undefined,
      'data-readonly': readonly ? true : undefined,
      onBeforeinput,
      onBlur,
      onFocus,
      onInput,
      onKeydown,
      onWheel,
    }
  })

  const slotProps = toRef((): NumberFieldControlSlotProps => ({
    value: displayValue.value,
    isFocused: root.isFocused.value,
    isDisabled: root.isDisabled.value,
    isReadonly: root.isReadonly.value,
    attrs: controlAttrs.value,
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, controlAttrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
