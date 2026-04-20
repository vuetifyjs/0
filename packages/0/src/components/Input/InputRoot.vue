/**
 * @module InputRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/input
 *
 * @remarks
 * Root component for text inputs with integrated validation.
 * Composes createInput for field state, validation, and ARIA IDs.
 * Provides context to child components (Control, Description, Error).
 * Auto-registers with parent form via createValidation's useForm() injection.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createInput } from '#v0/composables/createInput'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, nextTick, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { FormValidationRule } from '#v0/composables/createForm'
  import type { InputState } from '#v0/composables/createInput'
  import type { RegistryContext } from '#v0/composables/createRegistry'
  import type { RuleAlias, StandardSchemaV1 } from '#v0/composables/useRules'
  import type { MaybeArray, ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  /** Base validation trigger event */
  export type ValidateEvent = 'blur' | 'input' | 'submit'

  /** When to trigger validation, with optional lazy/eager modifier */
  export type ValidateOn =
    | ValidateEvent
    | 'lazy' | 'eager'
    | 'blur lazy' | 'input lazy' | 'submit lazy'
    | 'blur eager' | 'input eager' | 'submit eager'
    | 'lazy blur' | 'lazy input' | 'lazy submit'
    | 'eager blur' | 'eager input' | 'eager submit'

  export interface InputRootContext {
    /** Unique identifier */
    readonly id: ID
    /** Optional display label */
    readonly label?: string
    /** Form field name */
    readonly name?: string
    /** Input type */
    readonly type: string
    /** Associate with form by ID */
    readonly form?: string
    /** Whether this input is required */
    readonly required?: boolean
    /** ID for description element (aria-describedby) */
    readonly descriptionId: string
    /** ID for error element (aria-errormessage) */
    readonly errorId: string
    /** Registry of mounted Description sub-components */
    descriptions: RegistryContext
    /** Registry of mounted Error sub-components */
    fieldErrors: RegistryContext
    /** Whether a Description sub-component is mounted */
    hasDescription: Readonly<Ref<boolean>>
    /** Whether an Error sub-component is mounted */
    hasError: Readonly<Ref<boolean>>
    /** Current input value — write to update both v-model and validation */
    value: Ref<string>
    /** Whether this input has content */
    isDirty: Readonly<Ref<boolean>>
    /** Whether this input is focused */
    isFocused: ShallowRef<boolean>
    /** Whether this input is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether this input is readonly */
    isReadonly: Readonly<Ref<boolean>>
    /** Merged validation + manual error messages */
    errors: Readonly<Ref<string[]>>
    /** Whether the field is valid (null = unvalidated, accounts for error prop) */
    isValid: Readonly<Ref<boolean | null>>
    /** Whether the field value hasn't changed since mount/reset */
    isPristine: Readonly<Ref<boolean>>
    /** Whether async validation is in progress */
    isValidating: Readonly<Ref<boolean>>
    /** Validate the input */
    validate: () => Promise<boolean>
    /** Reset the input to initial state */
    reset: () => void
  }

  export interface InputRootProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Optional display label */
    label?: string
    /** Form field name */
    name?: string
    /** Input type */
    type?: string
    /** Associate with form by ID */
    form?: string
    /** Disables this input */
    disabled?: MaybeRefOrGetter<boolean>
    /** Makes this input readonly */
    readonly?: MaybeRefOrGetter<boolean>
    /** Whether this input is required */
    required?: boolean
    /** Validation rules */
    rules?: (FormValidationRule | RuleAlias | StandardSchemaV1)[]
    /** When to trigger validation */
    validateOn?: ValidateOn
    /** Manual error state override — forces invalid regardless of validation */
    error?: boolean
    /** Manual error messages — merged with rule-based errors */
    errorMessages?: MaybeArray<string>
    /** Namespace for context provision to children */
    namespace?: string
  }

  export interface InputRootSlotProps {
    /** Unique identifier */
    id: ID
    /** Optional display label */
    label?: string
    /** Current input value */
    value: string
    /** Whether this input has content */
    isDirty: boolean
    /** Whether this input is focused */
    isFocused: boolean
    /** Merged error messages */
    errors: string[]
    /** Whether the field is valid */
    isValid: boolean | null
    /** Whether the field value hasn't changed */
    isPristine: boolean
    /** Whether async validation is in progress */
    isValidating: boolean
    /** Whether this input is disabled */
    isDisabled: boolean
    /** Whether this input is readonly */
    isReadonly: boolean
    /** Validate the input */
    validate: () => Promise<boolean>
    /** Reset the input */
    reset: () => void
    /** Attributes to bind to the root element */
    attrs: {
      'data-state': InputState
      'data-dirty': true | undefined
      'data-focused': true | undefined
      'data-disabled': true | undefined
      'data-readonly': true | undefined
    }
  }

  export const [useInputRoot, provideInputRoot] = createContext<InputRootContext>()

  function parseValidateOn (value: ValidateOn) {
    const parts = String(value).split(' ')
    let event: ValidateEvent = 'blur'
    let modifier: 'lazy' | 'eager' | undefined

    for (const part of parts) {
      if (part === 'lazy' || part === 'eager') modifier = part
      else if (part === 'blur' || part === 'input' || part === 'submit') event = part
    }

    return { event, modifier }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'InputRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: InputRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: string]
    'update:focused': [value: boolean]
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    label,
    name,
    type = 'text',
    form,
    disabled = false,
    readonly: _readonly = false,
    required,
    rules = [],
    validateOn = 'blur',
    error = false,
    errorMessages,
    namespace = 'v0:input:root',
  } = defineProps<InputRootProps>()

  const model = defineModel<string>({ default: '' })
  const focused = defineModel<boolean>('focused', { default: false })

  const input = createInput({
    value: model,
    id,
    label,
    name,
    form,
    required,
    disabled,
    readonly: _readonly,
    rules,
    error,
    errorMessages,
  })

  const parsed = toRef(() => parseValidateOn(validateOn))

  function shouldValidate (trigger: ValidateEvent): boolean {
    const { event, modifier } = parsed.value
    if (event === 'submit') return false
    if (modifier === 'lazy' && !input.isTouched.value) return false
    if (modifier === 'eager' && input.isValid.value === false) return true
    return trigger === event
  }

  watch(input.isFocused, val => {
    focused.value = val
    if (val) return
    input.isTouched.value = true
    if (shouldValidate('blur')) input.validate()
  })

  let resetting = false

  watch(model, () => {
    if (!resetting && shouldValidate('input')) input.validate()
  })

  function reset () {
    resetting = true
    input.reset()
    nextTick(() => {
      resetting = false
    })
  }

  const context: InputRootContext = {
    id: input.id,
    label,
    name,
    type,
    form,
    required,
    descriptionId: input.descriptionId,
    errorId: input.errorId,
    descriptions: input.descriptions,
    fieldErrors: input.fieldErrors,
    hasDescription: input.hasDescription,
    hasError: input.hasError,
    value: model,
    isDirty: input.isDirty,
    isFocused: input.isFocused,
    isDisabled: input.isDisabled,
    isReadonly: input.isReadonly,
    errors: input.errors,
    isValid: input.isValid,
    isPristine: input.isPristine,
    isValidating: input.isValidating,
    validate: input.validate,
    reset,
  }

  provideInputRoot(namespace, context)

  const slotProps = toRef((): InputRootSlotProps => ({
    id: input.id,
    label,
    value: model.value,
    isDirty: input.isDirty.value,
    isFocused: input.isFocused.value,
    errors: input.errors.value,
    isValid: input.isValid.value,
    isPristine: input.isPristine.value,
    isValidating: input.isValidating.value,
    isDisabled: input.isDisabled.value,
    isReadonly: input.isReadonly.value,
    validate: input.validate,
    reset,
    attrs: {
      'data-state': input.state.value,
      'data-dirty': input.isDirty.value ? true : undefined,
      'data-focused': input.isFocused.value ? true : undefined,
      'data-disabled': input.isDisabled.value ? true : undefined,
      'data-readonly': input.isReadonly.value ? true : undefined,
    },
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
</template>
