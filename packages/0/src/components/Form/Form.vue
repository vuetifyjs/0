/**
 * @module Form
 *
 * @remarks
 * Form component that coordinates validation across child fields.
 * Wraps createForm and renders a native form element via Atom.
 * Fields using createValidation auto-register via useForm() injection.
 *
 * @see https://0.vuetifyjs.com/components/forms/form
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface FormProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Disables all registered fields */
    disabled?: boolean
    /** Sets all registered fields to readonly */
    readonly?: boolean
  }

  export interface FormSlotProps {
    /** Aggregate validity: null = unvalidated, true = all valid, false = any invalid */
    isValid: boolean | null
    /** Whether any field is currently validating */
    isValidating: boolean
    /** Whether the form is disabled */
    isDisabled: boolean
    /** Whether the form is readonly */
    isReadonly: boolean
    /** Validate all fields and return result */
    submit: () => Promise<boolean>
    /** Reset all field validations */
    reset: () => void
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { provideContext } from '#v0/composables/createContext'
  import { createForm } from '#v0/composables/createForm'

  // Utilities
  import { toRef, toValue, useAttrs, watchEffect } from 'vue'

  // eslint-disable-next-line vue/no-reserved-component-names
  defineOptions({ name: 'Form', inheritAttrs: false })

  defineSlots<{
    default: (props: FormSlotProps) => any
  }>()

  const emit = defineEmits<{
    'update:model-value': [value: boolean | null]
    'submit': [payload: { valid: boolean }]
    'reset': []
  }>()

  const {
    as = 'form',
    namespace = 'v0:form',
    disabled = false,
    readonly = false,
  } = defineProps<FormProps>()

  const model = defineModel<boolean | null>({ default: null })

  const form = createForm({
    disabled: toRef(() => disabled),
    readonly: toRef(() => readonly),
  })

  watchEffect(() => {
    model.value = form.isValid.value
  })

  const attrs = useAttrs()

  provideContext(namespace, form)

  async function onSubmit (event: Event) {
    event.preventDefault()
    const valid = await form.submit()
    emit('submit', { valid })
  }

  function onReset (event: Event) {
    event.preventDefault()
    form.reset()
    emit('reset')
  }

  const slotProps = toRef((): FormSlotProps => ({
    isValid: form.isValid.value,
    isValidating: form.isValidating.value,
    isDisabled: toValue(form.disabled),
    isReadonly: toValue(form.readonly),
    submit: form.submit,
    reset: form.reset,
  }))
</script>

<template>
  <Atom
    :as
    v-bind="attrs"
    @reset="onReset"
    @submit="onSubmit"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
