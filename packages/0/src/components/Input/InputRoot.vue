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
  import { shallowRef, toRef, toValue, useAttrs, useId, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { FormValidationRule } from '#v0/composables/createForm'
  import type { RuleAlias, StandardSchemaV1 } from '#v0/composables/useRules'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  /** Visual state of the input for styling purposes */
  export type InputState = 'pristine' | 'valid' | 'invalid'

  /** When to trigger validation */
  export type ValidateOn = 'blur' | 'input' | 'submit'

  export interface InputRootContext {
    /** Unique identifier */
    readonly id: ID
    /** Optional display label */
    readonly label?: string
    /** Form field name */
    readonly name?: string
    /** Input type */
    readonly type: string
    /** Placeholder text */
    readonly placeholder?: string
    /** Associate with form by ID */
    readonly form?: string
    /** When validation triggers */
    readonly validateOn: ValidateOn
    /** ID for description element (aria-describedby) */
    readonly descriptionId: string
    /** ID for error element (aria-errormessage) */
    readonly errorId: string
    /** Current input value — write to update both v-model and validation */
    value: Ref<string>
    /** Whether this input is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether this input is readonly */
    isReadonly: Readonly<Ref<boolean>>
    /** Validation errors */
    errors: Readonly<Ref<string[]>>
    /** Whether the field is valid (null = unvalidated) */
    isValid: Readonly<Ref<boolean | null>>
    /** Whether the field value hasn't changed */
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
    /** Placeholder text */
    placeholder?: string
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
    /** Validation errors */
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
      'data-disabled': true | undefined
      'data-readonly': true | undefined
    }
  }

  export const [useInputRoot, provideInputRoot] = createContext<InputRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'InputRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: InputRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: string]
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    label,
    name,
    type = 'text',
    placeholder,
    form,
    disabled = false,
    readonly: readonlyProp = false,
    rules = [],
    validateOn = 'blur',
    namespace = 'v0:input:root',
  } = defineProps<InputRootProps>()

  const model = defineModel<string>({ default: '' })

  const validation = createValidation({ rules, value: model })

  const initialValue = model.value
  const isPristine = shallowRef(true)
  const isDisabled = toRef(() => toValue(disabled) ?? false)
  const isReadonly = toRef(() => toValue(readonlyProp) ?? false)
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  watch(model, val => {
    isPristine.value = val === initialValue

    if (validateOn === 'input') {
      validation.validate()
    }
  })

  function validate () {
    return validation.validate()
  }

  function reset () {
    model.value = initialValue
    isPristine.value = true
    validation.reset()
  }

  const state = toRef((): InputState => {
    if (validation.isValid.value === false) return 'invalid'
    if (validation.isValid.value === true) return 'valid'
    return 'pristine'
  })

  const context: InputRootContext = {
    id,
    label,
    name,
    type,
    placeholder,
    form,
    validateOn,
    descriptionId,
    errorId,
    value: model,
    isDisabled,
    isReadonly,
    errors: validation.errors,
    isValid: validation.isValid,
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
    errors: validation.errors.value,
    isValid: validation.isValid.value,
    isPristine: isPristine.value,
    isValidating: validation.isValidating.value,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
    validate,
    reset,
    attrs: {
      'data-state': state.value,
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
