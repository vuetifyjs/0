/**
 * @module useRules
 *
 * @remarks
 * Validation rule alias composable with locale-aware error messages.
 *
 * Key features:
 * - 11 built-in validation aliases (required, email, number, etc.)
 * - String and tuple alias resolution to FormValidationRule[]
 * - Locale-aware error messages via useLocale integration
 * - Token registry for default message storage and per-instance overrides
 * - Custom alias registration
 * - Trinity pattern for DI
 * - Plugin factory for app-level installation
 *
 * Integrates with createForm for validation rule types, useLocale for i18n,
 * and createTokens for message storage.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createTokens } from '#v0/composables/createTokens'
import { useLocale } from '#v0/composables/useLocale'

// Utilities
import { instanceExists, isFunction, isString } from '#v0/utilities'

// Types
import type { FormValidationRule } from '#v0/composables/createForm'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App } from 'vue'

export type { FormValidationRule } from '#v0/composables/createForm'

type TranslateFn = (key: string, params?: Record<string, unknown>, fallback?: string) => string

/**
 * Default English messages for built-in rules.
 * Stored in a token registry to allow per-instance overrides via the `messages` option.
 */
const DEFAULT_MESSAGES: Record<string, string> = {
  required: 'Field is required',
  email: 'Must be a valid email',
  number: 'Must be a number',
  integer: 'Must be an integer',
  capital: 'Must be in capital letters',
  maxLength: 'Must be {0} characters or fewer',
  minLength: 'Must be at least {0} characters',
  strictLength: 'Must be exactly {0} characters',
  exclude: 'Character {0} is not allowed',
  notEmpty: 'Must not be empty',
  pattern: 'Invalid format',
}

export type RuleBuilderWithoutOptions = (err?: string) => FormValidationRule

export type RuleBuilderWithOptions<T = any> = (options: T, err?: string) => FormValidationRule

/** Union of all builder types — used as the index signature type for RuleAliases */
export type RuleBuilder = RuleBuilderWithoutOptions | RuleBuilderWithOptions

/**
 * A rule alias: either a string name or a tuple of [name, ...params].
 */
export type RuleAlias = string | [string, ...unknown[]]

/**
 * Input accepted by resolve(): alias strings, alias tuples, or raw validation functions.
 */
export type RuleInput = RuleAlias | FormValidationRule

export interface RuleAliases {
  [name: string]: RuleBuilder
  required: RuleBuilderWithoutOptions
  email: RuleBuilderWithoutOptions
  number: RuleBuilderWithoutOptions
  integer: RuleBuilderWithoutOptions
  capital: RuleBuilderWithoutOptions
  maxLength: RuleBuilderWithOptions<number>
  minLength: RuleBuilderWithOptions<number>
  strictLength: RuleBuilderWithOptions<number>
  exclude: RuleBuilderWithOptions<string[]>
  notEmpty: RuleBuilderWithoutOptions
  pattern: RuleBuilderWithOptions<RegExp>
}

export interface RulesContext {
  /** Resolve alias strings/tuples to FormValidationRule[]. Functions pass through. */
  resolve: (rules: RuleInput[]) => FormValidationRule[]
  /** The merged alias map (built-in + custom). */
  aliases: RuleAliases
}

export interface RulesOptions {
  /** Custom aliases to merge over built-ins. */
  aliases?: Partial<RuleAliases>
  /** Override default error messages for built-in rules. Keys match alias names. */
  messages?: Record<string, string>
}

export interface RulesContextOptions extends RulesOptions {
  namespace?: string
}

export interface RulesPluginOptions extends RulesContextOptions {}

/**
 * Creates built-in rule aliases using the provided translate function.
 */
function createAliases (t: TranslateFn): RuleAliases {
  return ({
    required: (err?: string) => {
      return (v: unknown) => {
        return v === 0 || !!v || t('rules.required', undefined, err)
      }
    },
    email: (err?: string) => {
      return (v: unknown) => {
        return !v || (isString(v) && /^.+@\S+\.\S+$/.test(v)) || t('rules.email', undefined, err)
      }
    },
    number: (err?: string) => {
      return (v: unknown) => {
        const str = String(v ?? '')
        return !str || !Number.isNaN(Number(str)) || t('rules.number', undefined, err)
      }
    },
    integer: (err?: string) => {
      return (v: unknown) => {
        return /^[\d]*$/.test(String(v ?? '')) || t('rules.integer', undefined, err)
      }
    },
    capital: (err?: string) => {
      return (v: unknown) => {
        return /^[A-Z]*$/.test(String(v ?? '')) || t('rules.capital', undefined, err)
      }
    },
    maxLength: (len: number, err?: string) => {
      return (v: unknown) => {
        const val = v as { length?: number } | null | undefined
        return !val || (val.length != null && val.length <= len) || t('rules.maxLength', { 0: len }, err)
      }
    },
    minLength: (len: number, err?: string) => {
      return (v: unknown) => {
        const val = v as { length?: number } | null | undefined
        return !val || (val.length != null && val.length >= len) || t('rules.minLength', { 0: len }, err)
      }
    },
    strictLength: (len: number, err?: string) => {
      return (v: unknown) => {
        const val = v as { length?: number } | null | undefined
        return !val || (val.length != null && val.length === len) || t('rules.strictLength', { 0: len }, err)
      }
    },
    exclude: (forbidden: string[], err?: string) => {
      return (v: unknown) => {
        const str = String(v ?? '')
        for (const char of forbidden) {
          if (str.includes(char)) {
            return t('rules.exclude', { 0: char }, err)
          }
        }
        return true
      }
    },
    notEmpty: (err?: string) => {
      return (v: unknown) => {
        const val = v as { length?: number } | null | undefined
        return (!!val && val.length != null && val.length > 0) || t('rules.notEmpty', undefined, err)
      }
    },
    pattern: (re: RegExp, err?: string) => {
      return (v: unknown) => {
        return !v || re.test(String(v)) || t('rules.pattern', undefined, err)
      }
    },
  }) as RuleAliases
}

function createResolve (aliases: RuleAliases) {
  return function resolve (rules: RuleInput[]): FormValidationRule[] {
    const result: FormValidationRule[] = []

    for (const rule of rules) {
      if (isFunction(rule)) {
        result.push(rule as FormValidationRule)
        continue
      }

      let name: string
      let params: unknown[]

      if (isString(rule)) {
        name = rule
        params = []
      } else {
        name = rule[0]
        params = rule.slice(1)
      }

      // Strip $ prefix for backward compatibility with Vuetify 3
      if (name.startsWith('$')) {
        name = name.slice(1)
      }

      const builder = aliases[name]

      if (builder) {
        result.push((builder as (...args: unknown[]) => FormValidationRule)(...params))
      }
    }

    return result
  }
}

function interpolate (template: string, params?: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    return params && name in params ? String(params[name]) : match
  })
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
 * const rules = createRules()
 *
 * // Use aliases directly
 * const required = rules.aliases.required()
 * const minLen = rules.aliases.minLength(3)
 *
 * // Resolve alias strings/tuples to validation functions
 * const resolved = rules.resolve(['required', ['minLength', 3]])
 * ```
 */
export function createRules (_options: RulesOptions = {}): RulesContext {
  const { messages = {}, aliases: customAliases } = _options

  const tokens = createTokens({ rules: { ...DEFAULT_MESSAGES, ...messages } })

  let locale: ReturnType<typeof useLocale> | undefined

  try {
    if (instanceExists()) {
      locale = useLocale()
    }
  } catch {
    // useLocale not available
  }

  function t (key: string, params?: Record<string, unknown>, fallback?: string): string {
    const tokenMsg = tokens.get(key)?.value as string | undefined

    if (locale) return locale.t(key, params, fallback ?? tokenMsg)

    const template = fallback ?? tokenMsg ?? key

    return interpolate(template, params)
  }

  const aliases = {
    ...createAliases(t),
    ...customAliases,
  } as RuleAliases

  return { resolve: createResolve(aliases), aliases }
}

/**
 * Creates a fallback rules instance for use outside component scope.
 * Uses the token registry with default English messages and no locale lookup.
 */
export function createRulesFallback (): RulesContext {
  const tokens = createTokens({ rules: DEFAULT_MESSAGES })

  function t (key: string, params?: Record<string, unknown>, fallback?: string): string {
    const tokenMsg = tokens.get(key)?.value as string | undefined
    const template = fallback ?? tokenMsg ?? key

    return interpolate(template, params)
  }

  const aliases = createAliases(t)

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
 *     phone: (err?) => (v) => /^\d{10}$/.test(String(v)) || (err ?? 'Invalid phone'),
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
 *   messages: {
 *     required: 'This field cannot be empty',
 *   },
 *   aliases: {
 *     phone: (err?) => (v) => /^\d{10}$/.test(String(v)) || (err ?? 'Invalid phone'),
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
      // Called inside app.runWithContext() — useLocale() will resolve if locale plugin is installed
      const context = createRules(options)
      _provideRulesContext(context, app)
    },
  })
}

/**
 * Returns the current rules context.
 * Falls back to a standalone instance with default English messages if no context is provided.
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
 *   const resolved = rules.resolve(['required', ['minLength', 3]])
 * </script>
 * ```
 */
export function useRules (namespace = 'v0:rules'): RulesContext {
  if (!instanceExists()) return createRulesFallback()

  return useContext<RulesContext>(namespace, createRulesFallback())
}
