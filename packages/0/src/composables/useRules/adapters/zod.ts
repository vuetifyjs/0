// Types
import type { FormValidationRule } from '#v0/composables/createForm'

/**
 * Minimal duck-typed interface matching Zod's safeParseAsync return.
 * No import from 'zod' — structurally compatible with any Zod schema.
 */
interface ZodIssue {
  message: string
}

interface ZodError {
  issues: ZodIssue[]
}

interface ZodSafeParseSuccess {
  success: true
}

interface ZodSafeParseError {
  success: false
  error: ZodError
}

type ZodSafeParseResult = ZodSafeParseSuccess | ZodSafeParseError

export interface ZodSchema {
  safeParseAsync: (value: unknown) => Promise<ZodSafeParseResult>
}

/**
 * Converts a Zod schema into a `FormValidationRule`.
 *
 * Uses `safeParseAsync` so both sync and async Zod schemas are supported.
 * The first issue message is returned on failure.
 *
 * @param schema Any Zod schema (`z.string()`, `z.number()`, etc.)
 * @returns A `FormValidationRule` that resolves to `true` or an error string.
 *
 * @example
 * ```ts
 * import { toRule } from '@vuetify/v0/rules/adapters/zod'
 * import { z } from 'zod'
 *
 * const email = toRule(z.string().email('Must be a valid email'))
 *
 * email('test@example.com') // Promise<true>
 * email('not-an-email')     // Promise<'Must be a valid email'>
 * ```
 */
export function toRule (schema: ZodSchema): FormValidationRule {
  return async (value: unknown) => {
    const result = await schema.safeParseAsync(value)

    if (result.success) return true

    return result.error.issues[0]?.message ?? 'Invalid value'
  }
}
