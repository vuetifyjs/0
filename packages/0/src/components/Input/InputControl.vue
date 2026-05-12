/**
 * @module InputControl
 *
 * @see https://0.vuetifyjs.com/components/forms/input
 *
 * @remarks
 * Native input element for the Input component.
 * Must be used within an Input.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useInputRoot } from './InputRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface InputControlProps extends AtomProps {
    namespace?: string
  }

  export interface InputControlSlotProps {
    /** Current input value */
    value: string
    /** Whether this input is focused */
    isFocused: boolean
    /** Whether this input is disabled */
    isDisabled: boolean
    /** Whether this input is readonly */
    isReadonly: boolean
    /** Pre-computed attributes for the input element */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'InputControl', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: InputControlSlotProps) => any
  }>()

  const {
    as = 'input',
    renderless,
    namespace = 'v0:input:root',
  } = defineProps<InputControlProps>()

  const root = useInputRoot(namespace)

  function onInput (e: Event) {
    const target = e.target as HTMLInputElement
    root.value.value = target.value
  }

  function onFocus () {
    root.isFocused.value = true
  }

  function onBlur () {
    root.isFocused.value = false
  }

  const describedby = toRef(() => {
    return root.hasDescription.value ? root.descriptionId : undefined
  })

  const controlAttrs = toRef((): Record<string, unknown> => {
    const invalid = root.isValid.value === false
    const disabled = root.isDisabled.value
    const readonly = root.isReadonly.value
    const isFocused = root.isFocused.value

    return {
      'id': root.id,
      'type': root.type,
      'name': root.name,
      'value': root.value.value,
      'form': root.form,
      'disabled': disabled || undefined,
      'readonly': readonly || undefined,
      'required': root.required || undefined,
      'aria-invalid': invalid || undefined,
      'aria-label': root.label || undefined,
      'aria-describedby': describedby.value,
      'aria-errormessage': (root.hasError.value && root.errors.value.length > 0) ? root.errorId : undefined,
      'aria-required': root.required || undefined,
      'data-state': invalid ? 'invalid' : (root.isValid.value === true ? 'valid' : 'pristine'),
      'data-focused': isFocused ? true : undefined,
      'data-disabled': disabled ? true : undefined,
      'data-readonly': readonly ? true : undefined,
      'onInput': onInput,
      'onFocus': onFocus,
      'onBlur': onBlur,
    }
  })

  const slotProps = toRef((): InputControlSlotProps => ({
    value: root.value.value,
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
