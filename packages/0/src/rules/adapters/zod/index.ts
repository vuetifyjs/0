/**
 * @module rules/adapters/zod
 *
 * @remarks
 * Zod adapter for useRules. Converts Zod schemas to FormValidationRule.
 * Requires `zod` as a peer dependency.
 *
 * @example
 * ```ts
 * import { toRule } from '@vuetify/v0/rules/adapters/zod'
 * import { z } from 'zod'
 *
 * const email = toRule(z.string().email('Must be a valid email'))
 * ```
 */

export * from '#v0/composables/useRules/adapters/zod'
