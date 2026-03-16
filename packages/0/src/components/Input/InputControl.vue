/**
 * @module InputControl
 *
 * @remarks
 * Native input element for the Input component.
 * Must be used within an Input.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useInputRoot } from './InputRoot.vue'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { InputState } from './InputRoot.vue'

  export interface InputControlProps extends AtomProps {
    namespace?: string
  }

  export interface InputControlSlotProps {
    /** Current input value */
    value: string
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
    root.set(target.value)
  }

  function onBlur () {
    if (root.validateOn === 'blur') {
      root.validate()
    }
  }

  const state = toRef((): InputState => {
    if (root.isValid.value === false) return 'invalid'
    if (root.isValid.value === true) return 'valid'
    return 'pristine'
  })

  const describedby = toRef(() => {
    const ids = [root.descriptionId]
    if (root.errors.value.length > 0) {
      ids.push(root.errorId)
    }
    return ids.join(' ')
  })

  const controlAttrs = toRef(() => ({
    'id': root.id,
    'type': root.type,
    'name': root.name,
    'value': root.value.value,
    'form': root.form,
    'placeholder': root.placeholder,
    'disabled': root.isDisabled.value || undefined,
    'readonly': root.isReadonly.value || undefined,
    'aria-invalid': root.isValid.value === false || undefined,
    'aria-label': root.label || undefined,
    'aria-describedby': describedby.value,
    'aria-errormessage': root.errors.value.length > 0 ? root.errorId : undefined,
    'data-state': state.value,
    'data-disabled': root.isDisabled.value ? true : undefined,
    'data-readonly': root.isReadonly.value ? true : undefined,
  }))

  const slotProps = toRef((): InputControlSlotProps => ({
    value: root.value.value,
    isDisabled: root.isDisabled.value,
    isReadonly: root.isReadonly.value,
    attrs: controlAttrs.value,
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...controlAttrs }"
    :as
    :renderless
    @blur="onBlur"
    @input="onInput"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
