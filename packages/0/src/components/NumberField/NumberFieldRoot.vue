/**
 * @module NumberFieldRoot
 *
 * @remarks
 * Root component for number fields. Creates number field context via
 * createNumberField, manages validation timing, and provides context
 * to child components (Input, Increment, Decrement, Scrub, Description, Error).
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createNumberField } from '#v0/composables/createNumberField'

  // Utilities
  import { useId } from '#v0/utilities'
  import { nextTick, toRef, useAttrs, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ValidateEvent, ValidateOn } from '#v0/components/Input'
  import type { FormValidationRule } from '#v0/composables/createForm'
  import type { InputState } from '#v0/composables/createInput'
  import type { NumberFieldContext } from '#v0/composables/createNumberField'
  import type { RuleAlias, StandardSchemaV1 } from '#v0/composables/useRules'
  import type { MaybeArray, ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  export interface NumberFieldRootContext extends NumberFieldContext {
    /** Unique identifier */
    readonly id: ID
    /** Optional display label */
    readonly label?: string
    /** Form field name */
    readonly name?: string
    /** Associate with form by ID */
    readonly form?: string
    /** Whether this field is required */
    readonly required?: boolean
    /** ID for description element (aria-describedby) */
    readonly descriptionId: string
    /** ID for error element (aria-errormessage) */
    readonly errorId: string
    /** Whether a Description sub-component is mounted */
    hasDescription: ShallowRef<boolean>
    /** Whether an Error sub-component is mounted */
    hasError: ShallowRef<boolean>
    /** Whether this field has content */
    isDirty: Readonly<Ref<boolean>>
    /** Whether this field is focused */
    isFocused: ShallowRef<boolean>
    /** Whether this field is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether this field is readonly */
    isReadonly: Readonly<Ref<boolean>>
    /** Merged validation + manual error messages */
    errors: Readonly<Ref<string[]>>
    /** Whether the field is valid (null = unvalidated) */
    isValid: Readonly<Ref<boolean | null>>
    /** Whether the field value hasn't changed since mount/reset */
    isPristine: Readonly<Ref<boolean>>
    /** Whether async validation is in progress */
    isValidating: Readonly<Ref<boolean>>
    /** Validate the field */
    validate: () => Promise<boolean>
    /** Reset the field to initial state */
    reset: () => void
    /** Delay in ms before spin-on-hold starts */
    spinDelay: number
    /** Interval in ms for repeated spin */
    spinRate: number
    /** Whether mouse wheel adjusts value */
    wheel: boolean
  }

  export interface NumberFieldRootProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Optional display label */
    label?: string
    /** Form field name */
    name?: string
    /** Associate with form by ID */
    form?: string
    /** Whether this field is required */
    required?: boolean
    /** Disables this field */
    disabled?: MaybeRefOrGetter<boolean>
    /** Makes this field readonly */
    readonly?: MaybeRefOrGetter<boolean>
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Step increment (default: 1) */
    step?: number
    /** Leap increment for PageUp/PageDown */
    leap?: number
    /** Wrap around at boundaries */
    wrap?: boolean
    /** BCP 47 locale tag (default: 'en-US') */
    locale?: string
    /** Intl.NumberFormat options */
    format?: Intl.NumberFormatOptions
    /** Whether commit() clamps to min/max (default: true) */
    clamp?: boolean
    /** Validation rules */
    rules?: (FormValidationRule | RuleAlias | StandardSchemaV1)[]
    /** When to trigger validation */
    validateOn?: ValidateOn
    /** Manual error state override — forces invalid */
    error?: boolean
    /** Manual error messages — merged with rule-based errors */
    errorMessages?: MaybeArray<string>
    /** Delay in ms before spin-on-hold starts (default: 400) */
    spinDelay?: number
    /** Interval in ms for repeated spin (default: 60) */
    spinRate?: number
    /** Whether mouse wheel adjusts value (default: false) */
    wheel?: boolean
    /** Namespace for context provision */
    namespace?: string
  }

  export interface NumberFieldRootSlotProps {
    /** Unique identifier */
    id: ID
    /** Current numeric value */
    value: number | null
    /** Formatted display string */
    display: string
    /** Whether the value can be incremented */
    canIncrement: boolean
    /** Whether the value can be decremented */
    canDecrement: boolean
    /** Whether this field is disabled */
    isDisabled: boolean
    /** Whether this field is readonly */
    isReadonly: boolean
    /** Whether this field is focused */
    isFocused: boolean
    /** Merged error messages */
    errors: string[]
    /** Whether the field is valid */
    isValid: boolean | null
    /** Whether the field value hasn't changed */
    isPristine: boolean
    /** Validate the field */
    validate: () => Promise<boolean>
    /** Reset the field */
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

  export const [useNumberFieldRoot, provideNumberFieldRoot] = createContext<NumberFieldRootContext>()

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
  defineOptions({ name: 'NumberFieldRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: NumberFieldRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: number | null]
  }>()

  const {
    as = 'div',
    renderless,
    id = useId(),
    label,
    name,
    form,
    required,
    disabled = false,
    readonly: _readonly = false,
    min,
    max,
    step,
    leap,
    wrap,
    locale,
    format: formatOptions,
    clamp: shouldClamp,
    rules = [],
    validateOn = 'blur',
    error = false,
    errorMessages,
    spinDelay = 400,
    spinRate = 60,
    wheel = false,
    namespace = 'v0:number-field:root',
  } = defineProps<NumberFieldRootProps>()

  const model = defineModel<number | null>({ default: null })

  const field = createNumberField({
    value: model,
    id,
    label,
    name,
    locale,
    format: formatOptions,
    clamp: shouldClamp,
    disabled,
    readonly: _readonly,
    min,
    max,
    step,
    leap,
    wrap,
    rules,
    error,
    errorMessages,
  })

  const { input } = field

  const parsed = toRef(() => parseValidateOn(validateOn))

  function shouldValidate (trigger: ValidateEvent): boolean {
    const { event, modifier } = parsed.value
    if (event === 'submit') return false
    if (modifier === 'lazy' && !input.isTouched.value) return false
    if (modifier === 'eager' && input.isValid.value === false) return true
    return trigger === event
  }

  watch(input.isFocused, val => {
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

  const context: NumberFieldRootContext = {
    ...field,
    id: input.id,
    label,
    name,
    form,
    required,
    descriptionId: input.descriptionId,
    errorId: input.errorId,
    hasDescription: input.hasDescription,
    hasError: input.hasError,
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
    spinDelay,
    spinRate,
    wheel,
  }

  provideNumberFieldRoot(namespace, context)

  const slotProps = toRef((): NumberFieldRootSlotProps => ({
    id: input.id,
    value: model.value,
    display: field.display.value,
    canIncrement: field.canIncrement.value,
    canDecrement: field.canDecrement.value,
    isDisabled: input.isDisabled.value,
    isReadonly: input.isReadonly.value,
    isFocused: input.isFocused.value,
    errors: input.errors.value,
    isValid: input.isValid.value,
    isPristine: input.isPristine.value,
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
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
