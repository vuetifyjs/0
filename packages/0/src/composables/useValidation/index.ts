/**
 * @module useValidation
 *
 * @remarks
 * Standalone field validation composable with async rule support.
 *
 * Key features:
 * - Sync and async validation rules
 * - Multiple validation modes (submit, change, combined)
 * - Tri-state isValid (null/true/false)
 * - isPristine tracking
 * - Silent validation mode
 * - Reactive value getter/setter
 *
 * Use this for standalone validation outside of forms.
 * For form-integrated validation, use useForm from createFormContext.
 */

// Utilities
import { shallowRef, toValue } from 'vue'
import { isString } from '#v0/utilities'

// Types
import type { ShallowRef } from 'vue'
import type { ID } from '#v0/types'

export type ValidationResult = string | true | Promise<string | true>

export type ValidationRule = (value: any) => ValidationResult

export interface ValidationOptions {
  id?: ID
  value?: any
  rules?: ValidationRule[]
  validateOn?: 'submit' | 'change' | string
  disabled?: boolean
}

export interface ValidationTicket {
  id: ID
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

// Generate unique IDs for validation tickets
let validationId = 0
function generateId (): ID {
  return `validation-${++validationId}`
}

/**
 * Creates a standalone field validation instance.
 *
 * @param options The options for the validation instance.
 * @returns A validation ticket with reactive state and methods.
 *
 * @remarks
 * This is for standalone validation outside of forms.
 * For form-integrated fields, use createFormContext and its useForm function.
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
  const id = options.id ?? generateId()
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
    id,
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
