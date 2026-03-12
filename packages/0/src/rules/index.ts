/**
 * @module rules
 *
 * @remarks
 * Rules composable for @vuetify/v0.
 * Standard Schema objects (Zod v3.24+, Valibot, ArkType) are auto-detected by `resolve()`.
 * Use `toRule()` for standalone conversion outside `resolve()`.
 *
 * @example
 * ```ts
 * import { createRulesPlugin, useRules } from '@vuetify/v0/rules'
 * import { toRule } from '@vuetify/v0/rules'
 * ```
 */

export * from '#v0/composables/useRules'
