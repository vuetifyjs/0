/**
 * @module useLocale
 *
 * @remarks
 * Internationalization (i18n) composable with adapter pattern for message translation.
 *
 * Key features:
 * - Locale selection with createSingle
 * - Token-based message storage with useTokens
 * - Numbered and named placeholder support ({0}, {name})
 * - Number formatting with Intl.NumberFormat
 * - Adapter pattern for integration with i18n providers
 *
 * Integrates with createSingle for locale selection and useTokens for message resolution.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createSingle } from '#v0/composables/createSingle'
import { createTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Utilities
import { instanceExists, isString } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { SingleContext, SingleOptions, SingleTicket } from '#v0/composables/createSingle'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { TokenCollection } from '#v0/composables/useTokens'
import type { ID } from '#v0/types'
import type { LocaleAdapter } from './adapters'
import type { App } from 'vue'

// Exports
export { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters'

export type { LocaleAdapter } from '#v0/composables/useLocale/adapters'

export type LocaleRecord = TokenCollection

export type LocaleTicket = SingleTicket

export interface LocaleContext<Z extends LocaleTicket> extends SingleContext<Z> {
  /**
   * Translate a message key with optional parameters and fallback.
   *
   * @param key - The message key to look up
   * @param params - Optional object with named parameters for interpolation
   * @param fallback - Optional fallback string if key not found in messages
   * @returns The translated and interpolated message
   *
   * @example
   * ```ts
   * // Simple key lookup
   * locale.t('hello') // Returns message for 'hello' or 'hello' if not found
   *
   * // With parameters
   * locale.t('greeting', { name: 'World' }) // 'Hello {name}' → 'Hello World'
   *
   * // With fallback (useful for dynamic keys)
   * locale.t('Pagination.goToPage', { page: 5 }, `Go to page 5`)
   * // If 'pagination.goToPage' exists: uses that message with {page} replaced
   * // If not found: returns 'Go to page 5'
   * ```
   */
  t: (key: string, params?: Record<string, unknown>, fallback?: string) => string
  n: (value: number) => string
}

export interface LocaleOptions<Z extends LocaleRecord = LocaleRecord> extends SingleOptions {
  adapter?: LocaleAdapter
  default?: ID
  fallback?: ID
  messages?: Record<ID, Z>
}
export interface LocaleContextOptions extends LocaleOptions {
  namespace?: string
}

export interface LocalePluginOptions extends LocaleContextOptions {}

/**
 * Creates a new locale instance.
 *
 * @param options The options for the locale instance.
 * @template Z The type of the locale ticket.
 * @template E The type of the locale context.
 * @returns A new locale instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 */
export function createLocale<
  Z extends LocaleTicket = LocaleTicket,
  E extends LocaleContext<Z> = LocaleContext<Z>,
> (_options: LocaleOptions = {}): E {
  const { adapter = new Vuetify0LocaleAdapter(), messages = {}, ...options } = _options
  const tokens = createTokens(messages)
  const registry = createSingle<Z, E>(options)

  for (const id in messages) {
    registry.register({ id } as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  function t (
    key: string,
    params?: Record<string, unknown>,
    fallback?: string,
  ): string {
    const locale = registry.selectedId.value
    const args = toArray(params)

    if (!locale) return adapter.t(fallback ?? key, ...args)

    // Look up the full flattened path in the token registry
    const path = `${locale}.${key}`
    const message = tokens.get(path)?.value

    // If the key exists in messages, resolve it with token references
    // Otherwise, use the fallback or key itself as a template string
    const template = isString(message) ? resolve(locale, message) : (fallback ?? key)

    return adapter.t(template, ...args)
  }

  function n (value: number, ...params: unknown[]): string {
    return adapter.n(value, registry.selectedId.value, ...params)
  }

  function resolve (locale: ID, str: string): string {
    return str.replace(/{([a-zA-Z0-9.-_]+)}/g, (match, key) => {
      // Check if the key starts with a registered locale (cross-locale reference)
      const [prefix, ...rest] = key.split('.')
      const target = registry.has(prefix) ? prefix : locale
      const name = registry.has(prefix) ? rest.join('.') : key

      // Look up the full flattened path in the token registry
      const path = `${target}.${name}`
      const resolved = tokens.get(path)?.value

      if (isString(resolved)) {
        return resolve(target, resolved)
      }

      return match
    })
  }

  return {
    ...registry,
    t,
    n,
    get size () {
      return registry.size
    },
  } as E
}

export function createLocaleFallback<
  Z extends LocaleTicket = LocaleTicket,
  E extends LocaleContext<Z> = LocaleContext<Z>,
> (): E {
  return {
    size: 0,
    t: (
      key: string,
      _params?: Record<string, unknown>,
      fallback?: string,
    ) => fallback ?? key,
    n: String,
  } as unknown as E
}

/**
 * Creates a new locale context.
 *
 * @param options The options for the locale context.
 * @template Z The type of the locale ticket.
 * @template E The type of the locale context.
 * @returns A new locale context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 *
 * @example
 * ```ts
 * import { createLocaleContext } from '@vuetify/v0'
 *
 * export const [useAppLocale, provideAppLocale, appLocale] = createLocaleContext({
 *   namespace: 'app:locale',
 *   messages: {
 *     en: { hello: 'Hello' },
 *     es: { hello: 'Hola' },
 *   },
 * })
 *
 * // In a parent component:
 * provideAppLocale()
 *
 * // In a child component:
 * const locale = useAppLocale()
 * locale.select('es')
 * ```
 */
export function createLocaleContext<
  Z extends LocaleTicket = LocaleTicket,
  E extends LocaleContext<Z> = LocaleContext<Z>,
> (_options: LocaleContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:locale', ...options } = _options
  const [useLocaleContext, _provideLocaleContext] = createContext<E>(namespace)
  const context = createLocale<Z, E>(options)

  function provideLocaleContext (_context: E = context, app?: App): E {
    return _provideLocaleContext(_context, app)
  }

  return createTrinity<E>(useLocaleContext, provideLocaleContext, context)
}

/**
 * Creates a new locale plugin.
 *
 * @param options The options for the locale plugin.
 * @template Z The type of the locale ticket.
 * @template E The type of the locale context.
 * @template R The type of the token ticket.
 * @template O The type of the token context.
 * @returns A new locale plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 */
export function createLocalePlugin<
  Z extends LocaleTicket = LocaleTicket,
  E extends LocaleContext<Z> = LocaleContext<Z>,
> (_options: LocalePluginOptions = {}) {
  const { namespace = 'v0:locale', adapter = new Vuetify0LocaleAdapter(), messages = {}, ...options } = _options
  const [, provideLocaleContext, context] = createLocaleContext<Z, E>({ ...options, namespace, adapter, messages })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideLocaleContext(context, app)
    },
  })
}

/**
 * Returns the current locale instance.
 *
 * @returns The current locale instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 */
export function useLocale<
  Z extends LocaleTicket = LocaleTicket,
  E extends LocaleContext<Z> = LocaleContext<Z>,
> (namespace = 'v0:locale'): E {
  const fallback = createLocaleFallback<Z, E>()

  if (!instanceExists()) return fallback

  try {
    return useContext<E>(namespace, fallback)
  } catch {
    return fallback
  }
}
