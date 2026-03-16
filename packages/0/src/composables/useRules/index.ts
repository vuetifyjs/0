/**
 * @module useRules
 *
 * @remarks
 * Validation rule composable with Standard Schema support.
 *
 * Key features:
 * - Standard Schema auto-detection (Zod, Valibot, ArkType, etc.)
 * - String alias resolution to FormValidationRule[] via predicate lookup
 * - Custom alias registration (predicates, not builders)
 * - Trinity pattern for DI
 * - Plugin factory for app-level installation
 *
 * Validation return values:
 * - `true` — validation passes
 * - `string` — validation fails, the string IS the error message
 * - `false` — validation fails, error message resolved from locale (`$rules.<name>`)
 *
 * Integrates with createValidation for rule resolution, useLocale for i18n.
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { useLocale } from '#v0/composables/useLocale'

// Adapters
import { isStandardSchema, toRule } from './adapters/standard'

// Utilities
import { instanceExists, isFunction } from '#v0/utilities'

// Types
import type { FormValidationRule } from '#v0/composables/createForm'
import type { StandardSchemaV1 } from './adapters/standard'

export type { FormValidationRule } from '#v0/composables/createForm'
export type { StandardSchemaV1 } from './adapters/standard'
export { isStandardSchema } from './adapters/standard'

/** A rule alias: a string name referencing a registered predicate. */
export type RuleAlias = string

/**
 * Input accepted by resolve(): alias strings, raw validation functions,
 * or Standard Schema objects (Zod v3.24+, Valibot, ArkType, etc.).
 */
export type RuleInput = RuleAlias | FormValidationRule | StandardSchemaV1

/** A map of alias names to predicate functions. */
export interface RuleAliases {
  [name: string]: FormValidationRule
}

export interface RulesContext {
  /** Resolve aliases, functions, and Standard Schema objects to FormValidationRule[]. */
  resolve: (rules: RuleInput[]) => FormValidationRule[]
  /** The alias map (custom aliases registered via options). */
  aliases: RuleAliases
}

export interface RulesOptions {
  /** Custom aliases to register. Each alias is a predicate (FormValidationRule). */
  aliases?: Partial<RuleAliases>
}

export interface RulesContextOptions extends RulesOptions {
  namespace?: string
}

/**
 * Wraps an alias predicate so that `false` results are
 * resolved to a locale-aware error message via `$rules.<name>`.
 *
 * - `true` → pass
 * - `string` → fail with that message
 * - `false` → fail, look up message from locale
 */
function resolveAlias (
  name: string,
  predicate: FormValidationRule,
  locale?: { t: (key: string) => string },
): FormValidationRule {
  return (value: unknown) => {
    const result = predicate(value)

    if (result instanceof Promise) {
      return result.then(resolved => {
        if (resolved === true) return true
        if (resolved === false) return locale?.t(`$rules.${name}`) ?? name
        return resolved
      })
    }

    if (result === true) return true
    if (result === false) return locale?.t(`$rules.${name}`) ?? name
    return result
  }
}

function createResolve (aliases: RuleAliases, locale?: { t: (key: string) => string }) {
  return function resolve (rules: RuleInput[]): FormValidationRule[] {
    const result: FormValidationRule[] = []

    for (const rule of rules) {
      if (isFunction(rule)) {
        result.push(rule as FormValidationRule)
        continue
      }

      if (isStandardSchema(rule)) {
        result.push(toRule(rule))
        continue
      }

      // String alias lookup
      const predicate = aliases[rule as string]

      if (predicate) {
        result.push(resolveAlias(rule as string, predicate, locale))
      }
    }

    return result
  }
}

/**
 * Creates a new rules instance.
 *
 * @param options The options for the rules instance.
 * @returns A new rules instance with resolve() and aliases.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-rules
 *
 * @example
 * ```ts
 * import { createRules } from '@vuetify/v0'
 *
 * const rules = createRules({
 *   aliases: {
 *     required: (v) => !!v || false,
 *   },
 * })
 *
 * // Resolve alias strings to validation functions
 * const resolved = rules.resolve(['required'])
 * ```
 */
export function createRules (_options: RulesOptions = {}): RulesContext {
  const { aliases: customAliases } = _options

  let locale: ReturnType<typeof useLocale> | undefined

  try {
    if (instanceExists()) {
      locale = useLocale()
    }
  } catch {
    // useLocale not available
  }

  const aliases = { ...customAliases } as RuleAliases

  return { resolve: createResolve(aliases, locale), aliases }
}

/**
 * Creates a fallback rules instance for use outside component scope.
 * No locale lookup — `false` returns fall back to the alias name.
 *
 * @returns A standalone rules context with empty aliases.
 */
export function createRulesFallback (): RulesContext {
  const aliases = {} as RuleAliases

  return { resolve: createResolve(aliases), aliases }
}

export const [createRulesContext, createRulesPlugin, useRules] =
  createPluginContext<RulesContextOptions, RulesContext>(
    'v0:rules',
    options => createRules(options),
    { fallback: () => createRulesFallback() },
  )
