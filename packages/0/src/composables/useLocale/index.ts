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

// Factories
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '#v0/composables/createContext'

// Composables
import { createSingle } from '#v0/composables/useSingle'
import { createTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Utilities
import { getCurrentInstance } from 'vue'
import { isString } from '#v0/utilities'

// Types
import type { SingleContext, SingleOptions, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { TokenCollection } from '#v0/composables/useTokens'
import type { LocaleAdapter } from './adapters'
import type { App } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'

// Exports
export type { LocaleAdapter } from '#v0/composables/useLocale/adapters'

export { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters'

export type LocaleRecord = TokenCollection

export type LocaleTicket = SingleTicket

export interface LocaleContext<Z extends LocaleTicket> extends SingleContext<Z> {
  t: (key: string, ...params: unknown[]) => string
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
  const tokens = createTokens(messages, { flat: true })
  const registry = createSingle<Z, E>(options)

  for (const id in messages) {
    registry.register({ id, value: messages[id] } as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  function t (key: string, ...params: unknown[]): string {
    const locale = registry.selectedId.value

    if (!locale) return key

    const ticket = registry.get(locale)
    const messages = ticket?.value as TokenCollection | undefined
    const message = messages?.[key]

    // If the key exists in messages, resolve it with token references
    // Otherwise, use the key itself as a template string
    const template = isString(message) ? resolve(locale, message) : key

    return adapter.t(template, ...params)
  }

  function n (value: number, ...params: unknown[]): string {
    return adapter.n(value, registry.selectedId.value, ...params)
  }

  function resolve (locale: ID, str: string): string {
    return str.replace(/{([a-zA-Z0-9.-_]+)}/g, (match, key) => {
      const [prefix, ...rest] = key.split('.')
      const path = rest.join('.')

      const prefixTicket = registry.get(prefix)
      const target = prefixTicket ? prefix : locale
      const name = prefixTicket ? path : key

      const targetTicket = registry.get(target)
      const messages = targetTicket?.value as TokenCollection | undefined
      const resolved = messages?.[name]

      if (isString(resolved)) {
        return resolve(target, resolved)
      }

      const alias = `{${key}}`
      if (tokens.isAlias(alias)) {
        const result = tokens.resolve(alias)
        return isString(result) ? result : match
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
    t: (key: string) => key,
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

  if (!getCurrentInstance()) return fallback

  try {
    return useContext<E>(namespace, fallback)
  } catch {
    return fallback
  }
}
