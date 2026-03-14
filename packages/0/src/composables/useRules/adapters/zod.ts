// Types
import type { FormValidationRule } from '#v0/composables/useRules'

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
 * Returns the first issue message on failure.
 *
 * For Zod v3.24+ which implements Standard Schema, prefer using schemas
 * directly in `rules` arrays — they're auto-detected. This adapter is
 * for older Zod versions or when explicit conversion is needed.
 *
 * @param schema Any Zod schema (`z.string()`, `z.number()`, etc.)
 * @returns A `FormValidationRule` that resolves to `true` or an error string.
 *
 * @example
 * ```ts
 * import { z } from 'zod'
 * import { toZodRule } from '@vuetify/v0/rules/adapters/zod'
 *
 * const email = toZodRule(z.string().email('Must be a valid email'))
 *
 * email('test@example.com') // Promise<true>
 * email('not-an-email')     // Promise<'Must be a valid email'>
 * ```
 */
export function toZodRule (schema: ZodSchema): FormValidationRule {
  return async (value: unknown) => {
    const result = await schema.safeParseAsync(value)

    if (result.success) return true

    return result.error.issues[0]?.message ?? 'Invalid value'
  }
}
