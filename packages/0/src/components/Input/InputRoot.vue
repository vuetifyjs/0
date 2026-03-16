/**
 * @module InputRoot
 *
 * @remarks
 * Root component for text inputs with integrated validation.
 * Creates a validation context internally and provides input context
 * to child components (Control, Description, Error).
 * Auto-registers with parent form via createValidation's useForm() injection.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { createValidation } from '#v0/composables/createValidation'

  // Utilities
  import { isString } from '#v0/utilities'
  import { shallowRef, toRef, toValue, useAttrs, useId, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { FormValidationRule } from '#v0/composables/createForm'
  import type { RuleAlias, StandardSchemaV1 } from '#v0/composables/useRules'
  import type { MaybeArray, ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  /** Visual state of the input for styling purposes */
  export type InputState = 'pristine' | 'valid' | 'invalid'

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
    /** ID for description element (aria-describedby) */
    readonly descriptionId: string
    /** ID for error element (aria-errormessage) */
    readonly errorId: string
    /** Current input value — write to update both v-model and validation */
    value: Ref<string>
    /** Whether this input has content */
    isDirty: Readonly<Ref<boolean>>
    /** Whether this input is isFocused */
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
    /** Whether this input is isFocused */
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
      'data-isFocused': true | undefined
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
    'update:isFocused': [value: boolean]
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
    rules = [],
    validateOn = 'blur',
    error = false,
    errorMessages,
    namespace = 'v0:input:root',
  } = defineProps<InputRootProps>()

  const model = defineModel<string>({ default: '' })
  const { event: triggerEvent, modifier: triggerModifier } = parseValidateOn(validateOn)

  const validation = createValidation({ rules, value: model })

  const initialValue = model.value
  const isPristine = shallowRef(true)
  const isFocused = shallowRef(false)
  const touched = shallowRef(false)
  const isDirty = toRef(() => model.value.length > 0)
  const isDisabled = toRef(() => toValue(disabled) ?? false)
  const isReadonly = toRef(() => toValue(_readonly) ?? false)
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  // Merge manual errorMessages with rule-based validation errors
  const errors = toRef(() => {
    const manual = errorMessages ? (isString(errorMessages) ? [errorMessages] : errorMessages) : []
    return [...manual, ...validation.errors.value]
  })

  // Account for error prop and manual errorMessages in validity
  const isValid = toRef((): boolean | null => {
    if (error) return false
    if (errors.value.length > 0 && validation.errors.value.length === 0) return false
    return validation.isValid.value
  })

  function shouldValidate (trigger: ValidateEvent): boolean {
    if (triggerEvent === 'submit') return false
    if (triggerModifier === 'lazy' && !touched.value) return false
    if (triggerModifier === 'eager' && validation.isValid.value === false) return true
    return trigger === triggerEvent
  }

  // Blur: mark touched, trigger blur-based validation
  watch(isFocused, val => {
    if (val) return
    touched.value = true
    if (shouldValidate('blur')) validation.validate()
  })

  // Input: track pristine, trigger input-based validation
  watch(model, val => {
    isPristine.value = val === initialValue
    if (shouldValidate('input')) validation.validate()
  })

  function validate () {
    return validation.validate()
  }

  function reset () {
    model.value = initialValue
    isPristine.value = true
    touched.value = false
    validation.reset()
  }

  const state = toRef((): InputState => {
    if (isValid.value === false) return 'invalid'
    if (isValid.value === true) return 'valid'
    return 'pristine'
  })

  const context: InputRootContext = {
    id,
    label,
    name,
    type,
    form,
    descriptionId,
    errorId,
    value: model,
    isDirty,
    isFocused,
    isDisabled,
    isReadonly,
    errors,
    isValid,
    isPristine,
    isValidating: validation.isValidating,
    validate,
    reset,
  }

  provideInputRoot(namespace, context)

  const slotProps = toRef((): InputRootSlotProps => ({
    id,
    label,
    value: model.value,
    isDirty: isDirty.value,
    isFocused: isFocused.value,
    errors: errors.value,
    isValid: isValid.value,
    isPristine: isPristine.value,
    isValidating: validation.isValidating.value,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
    validate,
    reset,
    attrs: {
      'data-state': state.value,
      'data-dirty': isDirty.value ? true : undefined,
      'data-isFocused': isFocused.value ? true : undefined,
      'data-disabled': isDisabled.value ? true : undefined,
      'data-readonly': isReadonly.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
