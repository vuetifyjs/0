// Types
import type { FormValidationRule } from '#v0/composables/createForm'

/**
 * Minimal duck-typed interface matching Yup's validate method.
 * No import from 'yup' — structurally compatible with any Yup schema.
 */
export interface YupSchema {
  validate: (value: unknown, options?: { abortEarly?: boolean }) => Promise<unknown>
}

/**
 * Converts a Yup schema into a `FormValidationRule`.
 *
 * Always returns a `Promise` since Yup validation is inherently async.
 * Uses `abortEarly: true` to return only the first error message.
 *
 * @param schema Any Yup schema (`yup.string()`, `yup.number()`, etc.)
 * @returns A `FormValidationRule` that resolves to `true` or an error string.
 *
 * @example
 * ```ts
 * import { toRule } from '@vuetify/v0/rules/adapters/yup'
 * import * as yup from 'yup'
 *
 * const minAge = toRule(yup.number().min(18, 'Must be 18 or older'))
 *
 * await minAge(21) // true
 * await minAge(16) // 'Must be 18 or older'
 * ```
 */
export function toRule (schema: YupSchema): FormValidationRule {
  return async (value: unknown) => {
    try {
      await schema.validate(value, { abortEarly: true })
      return true
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message: unknown }).message)
      }
      return 'Invalid value'
    }
  }
}
