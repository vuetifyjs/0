// Utilities
import { isObject } from '#v0/utilities'

// Types
import type { FormValidationRule } from '#v0/composables/createForm'

/**
 * Minimal duck-typed interface matching the Standard Schema spec (v1).
 * No npm dependency — structurally compatible with Zod (v3.24+), Valibot, ArkType, and others.
 *
 * @see https://standardschema.dev/
 */
interface StandardSchemaIssue {
  message: string
  path?: ReadonlyArray<{ key: PropertyKey }>
}

interface StandardSchemaResult {
  value?: unknown
  issues?: ReadonlyArray<StandardSchemaIssue>
}

export interface StandardSchemaV1 {
  '~standard': {
    version: 1
    vendor: string
    validate: (value: unknown) => StandardSchemaResult | Promise<StandardSchemaResult>
  }
}

/**
 * Type guard for Standard Schema objects.
 * Checks for the `~standard` property that all conforming libraries expose.
 */
export function isStandardSchema (value: unknown): value is StandardSchemaV1 {
  return isObject(value) && '~standard' in value
}

/**
 * Converts a Standard Schema object into a `FormValidationRule`.
 *
 * Handles both sync and async validation. Returns the first issue message on failure.
 *
 * @param schema Any Standard Schema–conforming object (Zod v3.24+, Valibot, ArkType, etc.)
 * @returns A `FormValidationRule` that resolves to `true` or an error string.
 *
 * @example
 * ```ts
 * import { toRule } from '@vuetify/v0/rules'
 * import { z } from 'zod'
 *
 * const email = toRule(z.string().email('Must be a valid email'))
 *
 * await email('test@example.com') // true
 * await email('not-an-email')     // 'Must be a valid email'
 * ```
 */
export function toRule (schema: StandardSchemaV1): FormValidationRule {
  return async (value: unknown) => {
    let result = schema['~standard'].validate(value)

    if (result instanceof Promise) result = await result

    return result.issues?.[0]?.message ?? true
  }
}
