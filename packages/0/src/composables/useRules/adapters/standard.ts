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
  readonly message: string
  readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }> | undefined
}

interface StandardSchemaResult {
  readonly value?: unknown
  readonly issues?: ReadonlyArray<StandardSchemaIssue> | undefined
}

export interface StandardSchemaV1 {
  readonly '~standard': {
    readonly version: 1
    readonly vendor: string
    readonly validate: (value: unknown) => StandardSchemaResult | Promise<StandardSchemaResult>
  }
}

/**
 * Type guard for Standard Schema objects.
 * Checks for the `~standard` property that all conforming libraries expose.
 *
 * @param value The value to check.
 * @returns `true` if the value conforms to the Standard Schema interface.
 */
/* #__NO_SIDE_EFFECTS__ */
export function isStandardSchema (value: unknown): value is StandardSchemaV1 {
  return isObject(value) && '~standard' in value
}

/**
 * Converts a Standard Schema object into a `FormValidationRule`.
 *
 * Used internally by `resolve()` — both for schemas passed directly and for
 * schemas returned by alias builders. Handles both sync and async validation.
 * Returns the first issue message on failure.
 *
 * @param schema Any Standard Schema-conforming object (Zod v3.24+, Valibot, ArkType, etc.)
 * @returns A `FormValidationRule` that resolves to `true` or an error string.
 *
 * @see https://standardschema.dev/
 */
/* #__NO_SIDE_EFFECTS__ */
export function toRule (schema: StandardSchemaV1): FormValidationRule {
  return async (value: unknown) => {
    let result = schema['~standard'].validate(value)

    if (result instanceof Promise) result = await result

    return result.issues?.[0]?.message ?? true
  }
}
