/**
 * @module rules/adapters/yup
 *
 * @remarks
 * Yup adapter for useRules. Converts Yup schemas to FormValidationRule.
 * Requires `yup` as a peer dependency.
 *
 * @example
 * ```ts
 * import { toRule } from '@vuetify/v0/rules/adapters/yup'
 * import * as yup from 'yup'
 *
 * const minAge = toRule(yup.number().min(18, 'Must be 18 or older'))
 * ```
 */

export * from '#v0/composables/useRules/adapters/yup'
