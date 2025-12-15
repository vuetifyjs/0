/**
 * @module useDate
 *
 * @remarks
 * Date manipulation composable with adapter pattern for date operations.
 *
 * Key features:
 * - Adapter pattern for date library abstraction
 * - Temporal API as default adapter (modern, immutable dates)
 * - Locale-aware formatting via Intl.DateTimeFormat
 * - Integration with useLocale for automatic locale sync
 *
 * @example
 * ```ts
 * import { createDatePlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createDatePlugin())
 *
 * // In a component:
 * const { adapter } = useDate()
 * const today = adapter.date()
 * const formatted = adapter.format(today, 'fullDate')
 * ```
 */

// Factories
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '#v0/composables/createContext'

// Composables
import { useLocale } from '#v0/composables/useLocale'

// Adapters
import { V0DateAdapter } from './adapters'

// Utilities
import { getCurrentInstance, computed, watchEffect } from 'vue'

// Types
import type { DateAdapter } from './adapters'
import type { App, ComputedRef } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'

// Exports
import type { Temporal } from '@js-temporal/polyfill'
export type { DateAdapter } from '#v0/composables/useDate/adapters'
export { V0DateAdapter } from '#v0/composables/useDate/adapters'
export { createVuetify3DateBridge } from '#v0/composables/useDate/bridge'
export type { Vuetify3DateAdapter, Vuetify3DateBridgeOptions } from '#v0/composables/useDate/bridge'

export interface DateContext<T = Temporal.PlainDateTime> {
  /** The date adapter instance */
  adapter: DateAdapter<T>
  /** Current locale (reactive, synced with useLocale if available) */
  locale: ComputedRef<string | undefined>
}

export interface DateOptions<T = Temporal.PlainDateTime> {
  /** Date adapter instance (defaults to V0DateAdapter) */
  adapter?: DateAdapter<T>
  /** Locale for formatting (defaults to useLocale's selected locale or 'en-US') */
  locale?: string
  /** Map from app locale IDs to adapter locale strings */
  localeMap?: Record<string, string>
}

export interface DateContextOptions<T = Temporal.PlainDateTime> extends DateOptions<T> {
  namespace?: string
}

export interface DatePluginOptions<T = Temporal.PlainDateTime> extends DateContextOptions<T> {}

/**
 * Default locale mapping from short locale codes to Intl locale strings.
 * Only used when useLocale provides a short code without region (e.g., 'en' instead of 'en-US').
 */
const defaultLocaleMap: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ru: 'ru-RU',
  ar: 'ar-SA',
}

/**
 * Determines if a locale string is a valid Intl locale (contains region).
 * Examples: 'en-US' -> true, 'en' -> false, 'zh-Hans-CN' -> true
 */
function isIntlLocale (locale: string): boolean {
  return locale.includes('-')
}

/**
 * Creates a new date instance.
 *
 * @param options The options for the date instance.
 * @template T The date type used by the adapter. Must be compatible with the provided adapter.
 *              When using the default V0DateAdapter, this must be Temporal.PlainDateTime.
 * @template E The type of the date context.
 * @returns A new date instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 */
export function createDate<
  T extends Temporal.PlainDateTime = Temporal.PlainDateTime,
  E extends DateContext<T> = DateContext<T>,
> (_options: DateOptions<T> = {}): E {
  const {
    adapter = new V0DateAdapter() as unknown as DateAdapter<T>,
    locale: defaultLocale,
    localeMap = defaultLocaleMap,
  } = _options

  // Try to get locale from useLocale if available
  let localeContext: ReturnType<typeof useLocale> | null = null

  try {
    if (getCurrentInstance()) {
      localeContext = useLocale()
    }
  } catch {
    // useLocale not available, use default
  }

  const locale = computed(() => {
    // Priority: 1. useLocale selection, 2. default option, 3. adapter default
    const currentLocale = localeContext?.selectedId?.value

    if (currentLocale != null) {
      const localeStr = String(currentLocale)

      // If it's already an Intl locale (has region like 'en-US'), use directly
      // Otherwise, look up in localeMap (for short codes like 'en')
      if (isIntlLocale(localeStr)) {
        return localeStr
      }

      return localeMap[localeStr] ?? localeStr
    }

    // Apply same logic to default/fallback locale
    const fallbackLocale = defaultLocale ?? adapter.locale ?? 'en-US'

    if (isIntlLocale(fallbackLocale)) {
      return fallbackLocale
    }

    return localeMap[fallbackLocale] ?? fallbackLocale
  })

  // Keep adapter locale in sync
  watchEffect(() => {
    const loc = locale.value

    if (loc && adapter.locale !== loc) {
      adapter.locale = loc
    }
  })

  return {
    adapter,
    locale,
  } as E
}

/**
 * Creates a fallback date context for when useDate is called outside of a Vue component.
 *
 * @template T The date type used by the adapter. Must extend Temporal.PlainDateTime.
 * @template E The type of the date context.
 * @returns A fallback date context with V0DateAdapter.
 */
export function createDateFallback<
  T extends Temporal.PlainDateTime = Temporal.PlainDateTime,
  E extends DateContext<T> = DateContext<T>,
> (): E {
  const adapter = new V0DateAdapter() as unknown as DateAdapter<T>

  return {
    adapter,
    locale: computed(() => adapter.locale ?? 'en-US'),
  } as E
}

/**
 * Creates a new date context with trinity pattern.
 *
 * @param options The options for the date context.
 * @template T The date type used by the adapter.
 * @template E The type of the date context.
 * @returns A new date context trinity [useContext, provideContext, defaultContext].
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * import { createDateContext } from '@vuetify/v0'
 *
 * export const [useAppDate, provideAppDate, appDate] = createDateContext({
 *   namespace: 'app:date',
 *   locale: 'en-US',
 * })
 *
 * // In a parent component:
 * provideAppDate()
 *
 * // In a child component:
 * const { adapter } = useAppDate()
 * ```
 */
export function createDateContext<
  T extends Temporal.PlainDateTime = Temporal.PlainDateTime,
  E extends DateContext<T> = DateContext<T>,
> (_options: DateContextOptions<T> = {}): ContextTrinity<E> {
  const { namespace = 'v0:date', ...options } = _options
  const [useDateContext, _provideDateContext] = createContext<E>(namespace)
  const context = createDate<T, E>(options)

  function provideDateContext (_context: E = context, app?: App): E {
    return _provideDateContext(_context, app)
  }

  return createTrinity<E>(useDateContext, provideDateContext, context)
}

/**
 * Creates a new date plugin for app-level installation.
 *
 * @param options The options for the date plugin.
 * @template T The date type used by the adapter.
 * @template E The type of the date context.
 * @returns A Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 */
export function createDatePlugin<
  T extends Temporal.PlainDateTime = Temporal.PlainDateTime,
  E extends DateContext<T> = DateContext<T>,
> (_options: DatePluginOptions<T> = {}) {
  const { namespace = 'v0:date', ...options } = _options
  const [, provideDateContext, context] = createDateContext<T, E>({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideDateContext(context, app)
    },
  })
}

/**
 * Returns the current date context.
 *
 * @param namespace The namespace to look up (defaults to 'v0:date').
 * @template T The date type used by the adapter.
 * @template E The type of the date context.
 * @returns The current date context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 */
export function useDate<
  T extends Temporal.PlainDateTime = Temporal.PlainDateTime,
  E extends DateContext<T> = DateContext<T>,
> (namespace = 'v0:date'): E {
  const fallback = createDateFallback<T, E>()

  if (!getCurrentInstance()) return fallback

  try {
    return useContext<E>(namespace, fallback)
  } catch {
    return fallback
  }
}
