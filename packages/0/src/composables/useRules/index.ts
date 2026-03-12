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
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useLocale } from '#v0/composables/useLocale'

// Adapters
import { isStandardSchema, toRule } from './adapters/standard'

// Utilities
import { instanceExists, isFunction } from '#v0/utilities'

// Types
import type { FormValidationRule } from '#v0/composables/createForm'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { StandardSchemaV1 } from './adapters/standard'
import type { App } from 'vue'

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

export interface RulesPluginOptions extends RulesContextOptions {}

/**
 * Wraps an alias predicate so that `false` results are
 * resolved to a locale-aware error message via `$rules.<name>`.
 *
 * - `true` → pass
 * - `string` → fail with that message
 * - `false` → fail, look up message from locale
 */
function wrapAlias (
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
        result.push(wrapAlias(rule as string, predicate, locale))
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

/**
 * Creates a new rules context using the Trinity pattern.
 *
 * @param options The options for the rules context.
 * @returns A Trinity tuple: [useRulesContext, provideRulesContext, rulesContext]
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-rules
 *
 * @example
 * ```ts
 * import { createRulesContext } from '@vuetify/v0'
 *
 * export const [useAppRules, provideAppRules, appRules] = createRulesContext({
 *   namespace: 'app:rules',
 *   aliases: {
 *     phone: (v) => /^\d{10}$/.test(String(v)) || false,
 *   },
 * })
 * ```
 */
export function createRulesContext (_options: RulesContextOptions = {}): ContextTrinity<RulesContext> {
  const { namespace = 'v0:rules', ...options } = _options
  const [_useRulesContext, _provideRulesContext] = createContext<RulesContext>(namespace)

  const context = createRules(options)

  function provideRulesContext (_context: RulesContext = context, app?: App): RulesContext {
    return _provideRulesContext(_context, app)
  }

  return createTrinity<RulesContext>(_useRulesContext, provideRulesContext, context)
}

/**
 * Creates a Vue plugin that provides a rules context to the entire app.
 *
 * @param options The options for the rules plugin.
 * @returns A Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-rules
 *
 * @example
 * ```ts
 * import { createRulesPlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createRulesPlugin({
 *   aliases: {
 *     required: (v) => !!v || false,
 *   },
 * }))
 * ```
 */
export function createRulesPlugin (_options: RulesPluginOptions = {}) {
  const { namespace = 'v0:rules', ...options } = _options
  const [, _provideRulesContext] = createContext<RulesContext>(namespace)

  return createPlugin({
    namespace,
    provide: (app: App) => {
      const context = createRules(options)
      _provideRulesContext(context, app)
    },
  })
}

/**
 * Returns the current rules context.
 * Falls back to a standalone instance if no context is provided.
 *
 * @param namespace The namespace for the rules context. Defaults to `'v0:rules'`.
 * @returns The current rules context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-rules
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useRules } from '@vuetify/v0'
 *
 *   const rules = useRules()
 * </script>
 * ```
 */
export function useRules (namespace = 'v0:rules'): RulesContext {
  if (!instanceExists()) return createRulesFallback()

  return useContext<RulesContext>(namespace, createRulesFallback())
}
