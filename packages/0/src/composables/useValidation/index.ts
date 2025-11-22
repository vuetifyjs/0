/**
 * @module useValidation
 *
 * @remarks
 * Single field validation composable with async rule support.
 *
 * Key features:
 * - Sync and async validation rules
 * - Multiple validation modes (submit, change, combined)
 * - Tri-state isValid (null/true/false)
 * - isPristine tracking
 * - Silent validation mode
 * - Reactive value getter/setter
 *
 * Can be used standalone or as part of useForm.
 */

// Utilities
import { shallowRef, toValue } from 'vue'
import { isString } from '#v0/utilities'

// Types
import type { ShallowRef } from 'vue'

export type ValidationResult = string | true | Promise<string | true>

export type ValidationRule = (value: any) => ValidationResult

export interface ValidationOptions {
  value?: any
  rules?: ValidationRule[]
  validateOn?: 'submit' | 'change' | string
  disabled?: boolean
}

export interface ValidationTicket {
  value: any
  validate: (silent?: boolean) => Promise<boolean>
  reset: () => void
  validateOn: 'submit' | 'change' | string
  disabled: boolean
  errors: ShallowRef<string[]>
  rules: ValidationRule[]
  isPristine: ShallowRef<boolean>
  isValid: ShallowRef<boolean | null>
  isValidating: ShallowRef<boolean>
}

/**
 * Creates a single field validation instance.
 *
 * @param options The options for the validation instance.
 * @returns A validation ticket with reactive state and methods.
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-validation
 *
 * @example
 * ```ts
 * import { useValidation } from '@vuetify/v0'
 *
 * const email = useValidation({
 *   value: '',
 *   rules: [
 *     v => v.length > 0 || 'Email is required',
 *     v => /@/.test(v) || 'Invalid email format',
 *   ],
 *   validateOn: 'change',
 * })
 *
 * email.value = 'invalid'
 * // Auto-validates on change
 * console.log(email.errors.value) // ['Invalid email format']
 *
 * email.reset()
 * ```
 */
export function useValidation (options: ValidationOptions = {}): ValidationTicket {
  const model = shallowRef(options.value == null ? '' : toValue(options.value))
  const rules = options.rules || []
  const errors = shallowRef<string[]>([])
  const isValidating = shallowRef(false)
  const initialValue = model.value
  const validateOn = options.validateOn || 'submit'
  const disabled = options.disabled || false

  const isPristine = shallowRef(true)
  const isValid = shallowRef<boolean | null>(null)

  function parse (value: string): string[] {
    return value.toLowerCase().split(/\s+/)
  }

  function validatesOn (event: 'submit' | 'change'): boolean {
    return parse(validateOn).includes(event)
  }

  function reset () {
    model.value = initialValue
    errors.value = []
    isPristine.value = true
    isValid.value = null
  }

  async function validate (silent = false): Promise<boolean> {
    if (rules.length === 0) {
      isValid.value = true
      return true
    }

    isValidating.value = true
    try {
      const results = await Promise.all(rules.map(rule => rule(model.value)))
      const errorMessages = results.filter(result => isString(result)) as string[]

      if (!silent) {
        errors.value = errorMessages
        isValid.value = errorMessages.length === 0
        isPristine.value = model.value === initialValue
      }

      return errorMessages.length === 0
    } finally {
      isValidating.value = false
    }
  }

  // Create ticket object
  const ticket: ValidationTicket = {
    rules,
    errors,
    disabled,
    validateOn,
    isValidating,
    isPristine,
    isValid,
    reset,
    validate,
    get value () {
      return model.value
    },
    set value (val) {
      model.value = val
      isPristine.value = val === initialValue
      isValid.value = null

      if (validatesOn('change')) {
        validate()
      }
    },
  }

  return ticket
}
