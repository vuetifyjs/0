// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useContext } from '#v0/factories/createContext'
import { useSingle } from '#v0/composables/useSingle'
import { createTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0LocaleAdapter } from '#v0/composables/useLocale/adapters/v0'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { TokenCollection, TokenTicket, TokenContext } from '#v0/composables/useTokens'
import type { LocaleAdapter } from './adapters'
import type { App } from 'vue'

export type LocaleTicket = SingleTicket

export type LocaleContext = SingleContext & {
  t: (key: string, ...params: unknown[]) => string
  n: (value: number) => string
}

export interface LocalePluginOptions<Z extends TokenCollection = TokenCollection> {
  adapter?: LocaleAdapter
  default?: ID
  fallback?: ID
  messages?: Record<ID, Z>
}

export interface LocalePlugin {
  install: (app: App, ...options: any[]) => any
}

/**
 * Creates a locale registrar for managing locale translations and number formatting.
 *
 * @param namespace The namespace for the locale context.
 * @param options Configuration including adapter and messages.
 * @template Z The type of the locale tickets managed by the registrar.
 * @template E The type of the locale context.
 * @returns An array containing the inject function, provide function, and the locale context.
 */
export function createLocale<
  Z extends LocaleTicket,
  E extends LocaleContext,
> (
  namespace = 'v0:locale',
  options: LocalePluginOptions = {},
) {
  const { adapter = new Vuetify0LocaleAdapter(), messages = {} } = options
  const [useLocaleContext, provideLocaleContext, registrar] = useSingle<Z, E>(namespace)

  function resolve (locale: ID, str: string): string {
    return str.replace(/{([a-zA-Z0-9.-_]+)}/g, (match, linkedKey) => {
      const [linkedLocale, ...rest] = linkedKey.split('.')
      const keyPath = rest.join('.')
      const targetLocale = messages[linkedLocale] ? linkedLocale : locale
      const targetKey = messages[linkedLocale] ? keyPath : linkedKey
      const resolved = messages[targetLocale]?.[targetKey]

      return typeof resolved === 'string' ? resolve(targetLocale, resolved) : match
    })
  }

  function t (key: string, ...params: unknown[]): string {
    const locale = registrar.selectedId.value

    if (!locale) return key

    const message = messages[locale]?.[key]

    // If the key exists in messages, resolve it with token references
    // Otherwise, use the key itself as a template string
    const template = typeof message === 'string' ? resolve(locale, message) : key

    return adapter.t(template, ...params)
  }

  function n (value: number, ...params: unknown[]): string {
    return adapter.n(value, registrar.selectedId.value, ...params)
  }

  return createTrinity<E>(useLocaleContext, provideLocaleContext, {
    ...registrar,
    t,
    n,
  } as E)
}

/**
 * Simple hook to access the locale context.
 *
 * @returns The locale context containing translation and formatting functions.
 */
export function useLocale (): LocaleContext {
  return useContext<LocaleContext>('v0:locale')()
}

/**
 * Creates a locale plugin for Vue applications to manage locale translations and number formatting.
 * Uses the universal plugin factory to eliminate boilerplate code.
 *
 * @param options Configuration for adapter, default locale, and messages.
 * @template Z The type of the locale tickets managed by the registrar.
 * @template E The type of the locale context.
 * @template R The type of the token tickets managed by the registrar.
 * @template O The type of the token context.
 * @returns Vue install function for the plugin
 */
export function createLocalePlugin<
  Z extends LocaleTicket = LocaleTicket,
  E extends LocaleContext = LocaleContext,
  R extends TokenTicket = TokenTicket,
  O extends TokenContext = TokenContext,
> (_options: LocalePluginOptions = {}): LocalePlugin {
  const { adapter = new Vuetify0LocaleAdapter(), messages = {}, ...options } = _options
  const [, provideLocaleTokenContext, tokensContext] = createTokens<R, O>('v0:locale:tokens', messages)
  const [, provideLocaleContext, localeContext] = createLocale<Z, E>('v0:locale', { adapter, messages })

  // Register locales if provided
  if (messages) {
    for (const id in messages) {
      localeContext.register({
        id,
        value: messages[id],
      } as Partial<Z>, id)

      if (id === options.default && !localeContext.selectedId.value) {
        localeContext.select(id as ID)
      }
    }
  }

  return createPlugin<LocalePlugin>({
    namespace: 'v0:locale',
    provide: (app: App) => {
      provideLocaleContext(undefined, localeContext, app)
      provideLocaleTokenContext(undefined, tokensContext, app)
    },
  })
}
