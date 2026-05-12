/**
 * @module createInput
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-input
 *
 * @remarks
 * Shared form field primitive. Owns validation, field state, and ARIA IDs.
 * Extracted from InputRoot.vue — consumed by Input, NumberField, Select, Combobox.
 *
 * No event handling — composables never bind DOM events. Components call
 * validate() and write isFocused/isTouched when they choose.
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { createInput } from '@vuetify/v0'
 *
 * const value = shallowRef('')
 * const input = createInput({ value, label: 'Name', rules: ['required'] })
 * await input.validate()
 * ```
 */

// Composables
import { createRegistry } from '#v0/composables/createRegistry'
import { createValidation } from '#v0/composables/createValidation'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Utilities
import { isNullOrUndefined, isString, useId } from '#v0/utilities'
import { computed, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { FormValidationRule } from '#v0/composables/createForm'
import type { RegistryContext } from '#v0/composables/createRegistry'
import type { RuleAlias, StandardSchemaV1 } from '#v0/composables/useRules'
import type { ID, MaybeArray } from '#v0/types'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

/** Visual state of the input for styling purposes. */
export type InputState = 'pristine' | 'valid' | 'invalid'

export interface InputOptions<T = string> {
  /** Value source — caller owns this ref. */
  value: Ref<T>
  /** Unique identifier (auto-generated if omitted). */
  id?: ID
  /** Display label. */
  label?: string
  /** Form field name. */
  name?: string
  /** Associate with form by ID. */
  form?: string
  /** Whether required. */
  required?: boolean
  /** Disabled state. */
  disabled?: MaybeRefOrGetter<boolean>
  /** Readonly state. */
  readonly?: MaybeRefOrGetter<boolean>
  /** Validation rules. */
  rules?: (FormValidationRule | RuleAlias | StandardSchemaV1)[]
  /** Manual error state override — forces invalid. */
  error?: MaybeRefOrGetter<boolean>
  /** Manual error messages — merged with rule-based errors. */
  errorMessages?: MaybeRefOrGetter<MaybeArray<string> | undefined>
  /** Predicate for "has content". */
  dirty?: (value: T) => boolean
  /** Equality check for pristine tracking. @default === */
  equals?: (a: T, b: T) => boolean
}

export interface InputContext<T = string> {
  readonly id: ID
  readonly label?: string
  readonly name?: string
  readonly form?: string
  readonly required?: boolean

  // ARIA IDs
  readonly descriptionId: string
  readonly errorId: string
  descriptions: RegistryContext
  fieldErrors: RegistryContext
  hasDescription: Readonly<Ref<boolean>>
  hasError: Readonly<Ref<boolean>>

  // Value
  value: Ref<T>

  // Field state
  isDirty: Readonly<Ref<boolean>>
  isFocused: ShallowRef<boolean>
  isDisabled: Readonly<Ref<boolean>>
  isReadonly: Readonly<Ref<boolean>>
  isPristine: Readonly<Ref<boolean>>
  isTouched: ShallowRef<boolean>

  // Validation
  errors: Readonly<Ref<string[]>>
  isValid: Readonly<Ref<boolean | null>>
  isValidating: Readonly<Ref<boolean>>
  validate: () => Promise<boolean>
  reset: () => void

  // Derived
  state: Readonly<Ref<InputState>>
}

export function createInput<T = string> (options: InputOptions<T>): InputContext<T> {
  const {
    value,
    id = useId(),
    label,
    name,
    form,
    required,
    disabled = false,
    readonly: _readonly = false,
    rules = [],
    error = false,
    errorMessages,
    dirty: dirtyFn,
    equals = (a: T, b: T) => a === b,
  } = options

  const validation = createValidation({ rules, value })

  const initialValue = value.value
  const isFocused = shallowRef(false)
  const isTouched = shallowRef(false)
  const descriptions = createRegistry({ reactive: true })
  const fieldErrors = createRegistry({ reactive: true })
  const hasDescription = toRef(() => descriptions.size > 0)
  const hasError = toRef(() => fieldErrors.size > 0)

  const isDisabled = toRef(() => toValue(disabled))
  const isReadonly = toRef(() => toValue(_readonly))
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  const isDirty = toRef(() => {
    if (dirtyFn) return dirtyFn(value.value)
    return isString(value.value) ? value.value.length > 0 : !isNullOrUndefined(value.value)
  })

  const isPristine = shallowRef(true)

  watch(value, val => {
    isPristine.value = equals(val, initialValue)
  }, { flush: 'sync' })

  const errors = computed(() => {
    const manual = toValue(errorMessages)
    const manualArr = manual ? toArray(manual) : []
    return [...manualArr, ...validation.errors.value]
  })

  const isValid = toRef((): boolean | null => {
    if (toValue(error)) return false
    if (errors.value.length > 0 && validation.errors.value.length === 0) return false
    return validation.isValid.value
  })

  const state = toRef((): InputState => {
    if (isValid.value === false) return 'invalid'
    if (isValid.value === true) return 'valid'
    return 'pristine'
  })

  function validate () {
    return validation.validate()
  }

  function reset () {
    value.value = initialValue
    isPristine.value = true
    isTouched.value = false
    validation.reset()
  }

  return {
    id, label, name, form, required,
    descriptionId, errorId, descriptions, fieldErrors, hasDescription, hasError,
    value,
    isDirty, isFocused, isDisabled, isReadonly, isPristine, isTouched,
    errors, isValid, isValidating: validation.isValidating, validate, reset,
    state,
  }
}
