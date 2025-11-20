/**
 * @module useDate
 *
 * @remarks
 * Date adapter composable for parsing, formatting, and manipulating dates.
 * Provides a framework-agnostic date API through the adapter pattern.
 *
 * Key features:
 * - Adapter-based architecture for flexible date library integration
 * - Default Temporal adapter for modern date/time operations
 * - Comprehensive date manipulation API (arithmetic, comparison, formatting)
 * - Trinity pattern for dependency injection
 * - Locale-aware formatting
 * - Immutable operations (all methods return new date instances)
 *
 * The composable follows the adapter pattern similar to useTheme, useLogger, and useLocale,
 * allowing different date implementations (Temporal, date-fns, luxon, etc.) while
 * maintaining a consistent API.
 *
 * @example
 * ```ts
 * // Direct usage with default Temporal adapter
 * const date = useDate()
 * const today = date.date()
 * const tomorrow = date.addDays(today, 1)
 * const formatted = date.format(today, 'fullDate')
 *
 * // Create custom context with specific locale
 * const [useFrenchDate, provideFrenchDate] = createDate({
 *   namespace: 'french-date',
 *   locale: 'fr-FR'
 * })
 * ```
 */

// Factories
import { createContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Adapters
import { TemporalAdapter } from './adapters/temporal'
import { TemporalDateTimeAdapter } from './adapters/temporal-datetime'

// Types
import type { Temporal } from '@js-temporal/polyfill'
import type { DateAdapter, DateAdapterOptions, DateContext, DateOptions } from './types'

/**
 * Default namespace for date context
 */
const DEFAULT_NAMESPACE = 'v0:date'

/**
 * Create a date adapter instance from options
 */
function createAdapter<T = Temporal.PlainDate>(
  options: DateOptions<T> = {}
): DateAdapter<T> {
  if (options.adapter) {
    // If adapter is a constructor, instantiate it
    if (typeof options.adapter === 'function') {
      return new options.adapter(options)
    }
    // If adapter is an instance, return it
    return options.adapter
  }

  // Default to Temporal adapter
  return new TemporalAdapter(options) as unknown as DateAdapter<T>
}

/**
 * Create a date context with trinity pattern
 *
 * @param options - Date configuration options
 * @returns Trinity tuple: [use function, provide function, default context]
 *
 * @example
 * ```ts
 * const [useAppDate, provideAppDate, defaultDate] = createDate({
 *   namespace: 'app:date',
 *   locale: 'en-US',
 *   firstDayOfWeek: 1 // Monday
 * })
 *
 * // In app setup
 * provideAppDate(app)
 *
 * // In component
 * const date = useAppDate()
 * const today = date.date()
 * ```
 */
export function createDate<T = Temporal.PlainDate>(
  options: DateOptions<T> = {}
): readonly [
  () => DateContext<T>,
  (context?: DateContext<T>) => void,
  DateContext<T>
] {
  const namespace = options.namespace ?? DEFAULT_NAMESPACE
  let adapter = createAdapter(options)

  // Create base context
  const [useContext, provideContext] = createContext<DateContext<T>>(namespace)

  // Helper to copy all methods from adapter to context
  function copyAdapterMethods(source: DateAdapter<T>, target: DateContext<T>) {
    // Get all property names including methods from prototype chain
    const proto = Object.getPrototypeOf(source)
    const propertyNames = Object.getOwnPropertyNames(proto)

    propertyNames.forEach(key => {
      if (key !== 'constructor' && key !== 'setLocale') {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key)
        if (descriptor && typeof descriptor.value === 'function') {
          // Bind method to original adapter instance
          // @ts-expect-error - Dynamic property assignment
          target[key] = descriptor.value.bind(source)
        } else if (descriptor && descriptor.get) {
          // Copy getter
          Object.defineProperty(target, key, descriptor)
        }
      }
    })

    // Also copy own properties (like locale)
    Object.keys(source).forEach(key => {
      if (key !== 'setLocale') {
        // @ts-expect-error - Dynamic property assignment
        target[key] = source[key]
      }
    })
  }

  // Create date context with reactive locale
  const context = {} as DateContext<T>

  // Copy all adapter methods
  copyAdapterMethods(adapter, context)

  // Add setLocale method
  const setLocaleMethod = (locale: string) => {
    // Recreate adapter with new locale
    const newAdapter = createAdapter({
      ...options,
      locale,
    })

    // Update adapter reference
    adapter = newAdapter

    // Update all methods and properties
    copyAdapterMethods(newAdapter, context)

    // Re-add setLocale since copyAdapterMethods skips it
    context.setLocale = setLocaleMethod
  }

  context.setLocale = setLocaleMethod

  // Create trinity
  const [use, provide] = createTrinity<DateContext<T>, DateContext<T>>(
    useContext,
    provideContext,
    context
  )

  return [use, provide, context] as const
}

/**
 * Default date context using Temporal adapter
 */
const [useDate, provideDate, defaultDate] = createDate({
  namespace: DEFAULT_NAMESPACE,
})

export { useDate, provideDate, defaultDate }

// Export types
export type { DateAdapter, DateAdapterOptions, DateContext, DateOptions }

// Export adapters
export { TemporalAdapter, TemporalDateTimeAdapter }
