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
 * - Type-safe overloads: adapter type is inferred when provided
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
 *
 * @example Custom adapter
 * ```ts
 * import type { DateAdapter } from '@vuetify/v0'
 *
 * class DateFnsAdapter implements DateAdapter<Date> {
 *   // ... implementation
 * }
 *
 * // Type is inferred as DateContext<Date>
 * const ctx = createDate({ adapter: new DateFnsAdapter() })
 * ```
 */

// Factories
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '#v0/composables/createContext'

// Composables
import { useLocale } from '#v0/composables/useLocale'

// Adapters
import { V0DateAdapter } from '#v0/composables/useDate/adapters'

// Utilities
import { getCurrentInstance, computed, watchEffect, onScopeDispose } from 'vue'

// Types
import type { DateAdapter } from '#v0/composables/useDate/adapters'
import type { App, ComputedRef } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { Temporal } from '@js-temporal/polyfill'

// Exports
export type { DateAdapter } from '#v0/composables/useDate/adapters'
export { V0DateAdapter } from '#v0/composables/useDate/adapters'

// ============================================
// Type Definitions
// ============================================

/** The default date type when using V0DateAdapter */
type DefaultDateType = Temporal.PlainDateTime

export interface DateContext<T = DefaultDateType> {
  /** The date adapter instance */
  adapter: DateAdapter<T>
  /** Current locale (reactive, synced with useLocale if available) */
  locale: ComputedRef<string | undefined>
}

/** Base options shared by all overloads */
interface DateOptionsBase {
  /** Locale for formatting (defaults to useLocale's selected locale or 'en-US') */
  locale?: string
  /** Map from app locale IDs to adapter locale strings */
  localeMap?: Record<string, string>
}

/** Options when providing a custom adapter - T is inferred from adapter */
export interface DateOptionsWithAdapter<T> extends DateOptionsBase {
  /** Custom date adapter instance */
  adapter: DateAdapter<T>
}

/** Options when using the default V0DateAdapter */
export interface DateOptionsDefault extends DateOptionsBase {
  /** When omitted, V0DateAdapter is used */
  adapter?: undefined
}

/** Union type for implementation */
export type DateOptions<T = DefaultDateType> = DateOptionsDefault | DateOptionsWithAdapter<T>

/** Context options with namespace */
export interface DateContextOptionsWithAdapter<T> extends DateOptionsWithAdapter<T> {
  namespace?: string
}

export interface DateContextOptionsDefault extends DateOptionsDefault {
  namespace?: string
}

export type DateContextOptions<T = DefaultDateType> = DateContextOptionsDefault | DateContextOptionsWithAdapter<T>

/** Plugin options */
export type DatePluginOptions<T = DefaultDateType> = DateContextOptions<T>

// ============================================
// Constants
// ============================================

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

// ============================================
// Helpers
// ============================================

/**
 * Determines if a locale string is a valid Intl locale (contains region).
 * Examples: 'en-US' -> true, 'en' -> false, 'zh-Hans-CN' -> true
 */
function isIntlLocale (locale: string): boolean {
  return locale.includes('-')
}

/**
 * Resolves the effective locale from various sources.
 */
function resolveLocale (
  localeContext: ReturnType<typeof useLocale> | null,
  defaultLocale: string | undefined,
  adapterLocale: string | undefined,
  localeMap: Record<string, string>,
): string {
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
  const fallbackLocale = defaultLocale ?? adapterLocale ?? 'en-US'

  if (isIntlLocale(fallbackLocale)) {
    return fallbackLocale
  }

  return localeMap[fallbackLocale] ?? fallbackLocale
}

/**
 * Creates the internal date context implementation.
 * @internal
 */
function createDateInternal<T> (
  adapter: DateAdapter<T>,
  defaultLocale: string | undefined,
  localeMap: Record<string, string>,
): DateContext<T> {
  // Try to get locale from useLocale if available
  let localeContext: ReturnType<typeof useLocale> | null = null

  try {
    if (getCurrentInstance()) {
      localeContext = useLocale()
    }
  } catch {
    // useLocale not available, use default
  }

  const locale = computed(() => resolveLocale(
    localeContext,
    defaultLocale,
    adapter.locale,
    localeMap,
  ))

  // Keep adapter locale in sync (only when in component scope)
  if (getCurrentInstance()) {
    const stop = watchEffect(() => {
      const loc = locale.value

      if (loc && adapter.locale !== loc) {
        adapter.locale = loc
      }
    })
    onScopeDispose(stop, true)
  } else {
    // Outside component: sync once, no reactive watch
    const loc = locale.value
    if (loc && adapter.locale !== loc) {
      adapter.locale = loc
    }
  }

  return { adapter, locale }
}

// ============================================
// createDate
// ============================================

/**
 * Creates a new date context with the default V0DateAdapter.
 *
 * @param options Optional locale configuration.
 * @returns A date context using Temporal.PlainDateTime.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * const { adapter } = createDate()
 * const today = adapter.date() // Temporal.PlainDateTime
 *
 * // With locale options
 * const { adapter: deAdapter } = createDate({ locale: 'de-DE' })
 * ```
 */
export function createDate (options?: DateOptionsDefault): DateContext<DefaultDateType>

/**
 * Creates a new date context with a custom adapter.
 *
 * @param options Options including the custom adapter.
 * @template T The date type used by the adapter (inferred from adapter).
 * @returns A date context with the adapter's date type.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * class DateFnsAdapter implements DateAdapter<Date> { ... }
 *
 * // Type is inferred as DateContext<Date>
 * const { adapter } = createDate({ adapter: new DateFnsAdapter() })
 * const today = adapter.date() // Date
 * ```
 */
export function createDate<T> (options: DateOptionsWithAdapter<T>): DateContext<T>

// Implementation
export function createDate<T = DefaultDateType> (
  options?: DateOptions<T>,
): DateContext<T> {
  const opts = options ?? {}
  const localeMap = opts.localeMap ?? defaultLocaleMap

  // Discriminate between overloads
  if (opts.adapter) {
    // Custom adapter provided - T is inferred from adapter
    return createDateInternal(opts.adapter, opts.locale, localeMap)
  }

  // Default adapter - T = DefaultDateType (guaranteed by overloads)
  // Note: Type assertion is safe - overloads guarantee correct types at call sites
  const adapter = new V0DateAdapter()
  return createDateInternal(adapter, opts.locale, localeMap) as unknown as DateContext<T>
}

// ============================================
// createDateFallback
// ============================================

/**
 * Creates a fallback date context for when useDate is called outside of a Vue component.
 *
 * @returns A fallback date context with V0DateAdapter.
 * @internal
 */
export function createDateFallback (): DateContext<DefaultDateType> {
  const adapter = new V0DateAdapter()

  return {
    adapter,
    locale: computed(() => adapter.locale ?? 'en-US'),
  }
}

// ============================================
// createDateContext
// ============================================

/**
 * Creates a new date context trinity with the default V0DateAdapter.
 *
 * @param options Optional locale and namespace configuration.
 * @returns A trinity [useContext, provideContext, defaultContext].
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 */
export function createDateContext (
  options?: DateContextOptionsDefault,
): ContextTrinity<DateContext<DefaultDateType>>

/**
 * Creates a new date context trinity with a custom adapter.
 *
 * @param options Options including the custom adapter.
 * @template T The date type used by the adapter (inferred from adapter).
 * @returns A trinity [useContext, provideContext, defaultContext].
 *
 * @example
 * ```ts
 * const [useAppDate, provideAppDate] = createDateContext({
 *   adapter: new DateFnsAdapter(),
 *   namespace: 'app:date',
 * })
 * ```
 */
export function createDateContext<T> (
  options: DateContextOptionsWithAdapter<T>,
): ContextTrinity<DateContext<T>>

// Implementation
export function createDateContext<T = DefaultDateType> (
  options?: DateContextOptions<T>,
): ContextTrinity<DateContext<T>> {
  const opts = options ?? {}
  const namespace = ('namespace' in opts ? opts.namespace : undefined) ?? 'v0:date'

  const [useDateContext, _provideDateContext] = createContext<DateContext<T>>(namespace)

  // Create context based on whether adapter is provided
  // Note: Type assertion is safe - overloads guarantee correct types at call sites
  const context: DateContext<T> = opts.adapter
    ? createDate({ ...opts, adapter: opts.adapter } as DateOptionsWithAdapter<T>)
    : createDate(opts as DateOptionsDefault) as unknown as DateContext<T>

  function provideDateContext (_context: DateContext<T> = context, app?: App): DateContext<T> {
    return _provideDateContext(_context, app)
  }

  return createTrinity<DateContext<T>>(useDateContext, provideDateContext, context)
}

// ============================================
// createDatePlugin
// ============================================

/**
 * Creates a new date plugin with the default V0DateAdapter.
 *
 * @param options Optional locale and namespace configuration.
 * @returns A Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```ts
 * const app = createApp(App)
 * app.use(createDatePlugin())
 *
 * // With options
 * app.use(createDatePlugin({ locale: 'de-DE' }))
 * ```
 */
export function createDatePlugin (
  options?: DateContextOptionsDefault,
): ReturnType<typeof createPlugin>

/**
 * Creates a new date plugin with a custom adapter.
 *
 * @param options Options including the custom adapter.
 * @template T The date type used by the adapter (inferred from adapter).
 * @returns A Vue plugin.
 *
 * @example
 * ```ts
 * app.use(createDatePlugin({
 *   adapter: new DateFnsAdapter(),
 *   locale: 'en-US',
 * }))
 * ```
 */
export function createDatePlugin<T> (
  options: DateContextOptionsWithAdapter<T>,
): ReturnType<typeof createPlugin>

// Implementation
export function createDatePlugin<T = DefaultDateType> (
  options?: DatePluginOptions<T>,
) {
  const opts = options ?? {}
  const namespace = ('namespace' in opts ? opts.namespace : undefined) ?? 'v0:date'

  // Note: Type assertion is safe - overloads guarantee correct types at call sites
  const [, provideDateContext, context] = opts.adapter
    ? createDateContext({ ...opts, adapter: opts.adapter } as DateContextOptionsWithAdapter<T>)
    : createDateContext({ ...opts, namespace } as DateContextOptionsDefault) as unknown as ContextTrinity<DateContext<T>>

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideDateContext(context, app)
    },
  })
}

// ============================================
// useDate
// ============================================

/**
 * Returns the current date context.
 *
 * When called inside a component with a provided date context (via plugin or provider),
 * returns that context. Otherwise, returns a fallback context with V0DateAdapter.
 *
 * @param namespace The namespace to look up (defaults to 'v0:date').
 * @returns The current date context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useDate } from '@vuetify/v0'
 *
 * const { adapter, locale } = useDate()
 * const today = adapter.date()
 * </script>
 * ```
 */
export function useDate (namespace?: string): DateContext<DefaultDateType>

/**
 * Returns the current date context with a specific type.
 *
 * Use this overload when you've registered a custom adapter via plugin
 * and need the correct return type.
 *
 * @param namespace The namespace to look up.
 * @template T The expected date type from the registered adapter.
 * @returns The current date context.
 *
 * @example
 * ```ts
 * // When DateFnsAdapter was registered via createDatePlugin
 * const { adapter } = useDate<Date>('app:date')
 * ```
 */
export function useDate<T> (namespace: string): DateContext<T>

// Implementation
export function useDate<T = DefaultDateType> (namespace = 'v0:date'): DateContext<T> {
  // Note: Type assertion is safe - overloads guarantee correct types at call sites
  const fallback = createDateFallback() as unknown as DateContext<T>

  if (!getCurrentInstance()) return fallback

  try {
    return useContext<DateContext<T>>(namespace, fallback)
  } catch {
    return fallback
  }
}
