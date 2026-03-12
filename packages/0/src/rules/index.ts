/**
 * @module rules
 *
 * @remarks
 * Rules composable for @vuetify/v0.
 * Standard Schema objects (Zod v3.24+, Valibot, ArkType) are auto-detected by `resolve()`
 * — both when passed directly and when registered as aliases.
 *
 * @example
 * ```ts
 * import { createRulesPlugin, useRules } from '@vuetify/v0/rules'
 *
 * // Install as plugin
 * app.use(createRulesPlugin({
 *   aliases: { required: (v) => !!v || false },
 * }))
 *
 * // Use in a component
 * const rules = useRules()
 * const resolved = rules.resolve(['required'])
 * ```
 */

export * from '#v0/composables/useRules'
