// Factories
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '#v0/composables/createContext'

// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Utilities
import { isString } from '#v0/utilities'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
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

export interface LocaleOptions extends LocalePluginOptions {}

export interface LocalePluginOptions<Z extends LocaleRecord = LocaleRecord> {
  adapter?: LocaleAdapter
  default?: ID
  fallback?: ID
  messages?: Record<ID, Z>
}

/**
 * Creates a new locale instance.
 *
 * @param namespace The namespace for the locale instance.
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
> (
  namespace = 'v0:locale',
  options: LocaleOptions = {},
): ContextTrinity<E> {
  const { adapter = new Vuetify0LocaleAdapter(), messages = {} } = options
  const [useLocaleContext, _provideLocaleContext] = createContext<E>(namespace)
  const tokens = useTokens({ ...messages }, { flat: true })
  const registry = useSingle<Z, E>()

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

  const context = {
    ...registry,
    t,
    n,
    get size () {
      return registry.size
    },
  } as E

  function provideLocaleContext (_context: E = context, app?: App): E {
    return _provideLocaleContext(_context, app)
  }

  return createTrinity<E>(useLocaleContext, provideLocaleContext, context)
}

/**
 * Returns the current locale instance.
 *
 * @returns The current locale instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-locale
 */
export function useLocale (): LocaleContext<LocaleTicket> {
  return useContext<LocaleContext<LocaleTicket>>('v0:locale')
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
  const { adapter = new Vuetify0LocaleAdapter(), messages = {}, ...options } = _options
  const [, provideLocaleContext, localeContext] = createLocale<Z, E>('v0:locale', { ...options, adapter, messages })

  return createPlugin({
    namespace: 'v0:locale',
    provide: (app: App) => {
      provideLocaleContext(localeContext, app)
    },
  })
}
