/**
 * @module useFeatures
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @remarks
 * Feature flag system with boolean and token-based features.
 *
 * Key features:
 * - Boolean features (true/false activation)
 * - Token features with $variation support
 * - Auto-selection of enabled features
 * - Multi-select support for feature combinations
 * - Perfect for A/B testing, progressive rollout, feature toggles
 * - Adapter pattern for external feature flag services
 *
 * Inheritance chain: useRegistry → createSelection → createGroup → createFeatures
 * Integrates with useTokens for token-based features.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createGroup } from '#v0/composables/createGroup'
import { createTokens } from '#v0/composables/createTokens'

// Utilities
import { isBoolean, isFunction, isObject } from '#v0/utilities'

// Types
import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
import type { RegistryOptions } from '#v0/composables/createRegistry'
import type { TokenCollection, TokenValue } from '#v0/composables/createTokens'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { FeaturesAdapterInterface, FeaturesAdapterFlags } from '#v0/composables/useFeatures/adapters'
import type { ID } from '#v0/types'
import type { App } from 'vue'

// Exports
export type { FeaturesAdapterFlags, FeaturesAdapterInterface, FeaturesAdapterValue } from '#v0/composables/useFeatures/adapters'
export {
  FeaturesAdapter,
  FlagsmithFeatureAdapter,
  LaunchDarklyFeatureAdapter,
  PostHogFeatureAdapter,
} from '#v0/composables/useFeatures/adapters'

export interface FeatureTicket extends GroupTicket<TokenValue> {}

export interface FeatureContext<Z extends FeatureTicket = FeatureTicket> extends GroupContext<Z> {
  /**
   * Get the variation value of a feature, or a fallback if not set.
   *
   * @param id The feature ID.
   * @param fallback The fallback value if the feature has no variation.
   */
  variation: (id: ID, fallback?: unknown) => unknown
  /**
   * Sync feature flags from an external source.
   *
   * @param flags The flags to sync, typically from an adapter.
   *
   * @remarks This updates existing flags and registers new ones.
   * Use this when adapter flags change to update the registry.
   */
  sync: (flags: FeaturesAdapterFlags) => void
}

export interface FeatureOptions extends RegistryOptions {
  /**
   * Static feature flags to register.
   */
  features?: Record<ID, boolean | TokenCollection>
}

export interface FeatureContextOptions extends FeatureOptions {
  namespace?: string
}

export interface FeaturePluginOptions extends FeatureContextOptions {
  /**
   * Feature flag adapter for external services.
   *
   * @remarks Adapters provide dynamic flag values from external services.
   */
  adapter?: FeaturesAdapterInterface
}

/**
 * Creates a new features instance.
 *
 * @param options The options for the features instance.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```ts
 * import { createFeatures } from '@vuetify/v0'
 *
 * const [useFeatures, provideFeaturesContext, context] = createFeatures({
 *   namespace: 'v0:features',
 *   features: {
 *     'dark-mode': true,
 *     'theme-color': { $variation: 'blue' },
 *   },
 * })
 * ```
 */
export function createFeatures<
  Z extends FeatureTicket = FeatureTicket,
  E extends FeatureContext<Z> = FeatureContext<Z>,
> (_options: FeatureOptions = {}): E {
  const { features, ...options } = _options

  const tokens = createTokens(features, { flat: true })
  const registry = createGroup<Z, E>({ ...options, reactive: true })

  for (const [id, { value }] of tokens.entries()) {
    register({ id, value } as Partial<Z>)
  }

  function variation (id: ID, fallback: unknown = null) {
    const ticket = registry.get(id)

    if (!ticket) return fallback

    return isObject(ticket.value) ? ticket.value.$variation ?? fallback : ticket.value ?? fallback
  }

  function register (registration: Partial<Z> = {}): Z {
    const item: Partial<Z> = {
      value: false,
      ...registration,
    }

    const ticket = registry.register(item)

    if (
      (isBoolean(ticket.value) && ticket.value === true) || (
        isObject(ticket.value) && (
          isBoolean(ticket.value.$value) &&
          ticket.value.$value === true
        )
      )
    ) {
      registry.select(ticket.id)
    }

    return ticket
  }

  function sync (flags: FeaturesAdapterFlags): void {
    for (const [id, value] of Object.entries(flags)) {
      const existing = registry.get(id)

      if (existing) {
        const shouldSelect = isBoolean(value)
          ? value === true
          : isObject(value) && isBoolean(value.$value) && value.$value === true

        registry.upsert(id, { value } as Partial<Z>)

        if (shouldSelect) {
          registry.select(id)
        } else {
          registry.unselect(id)
        }
      } else {
        register({ id, value } as Partial<Z>)
      }
    }
  }

  return {
    ...registry,
    variation,
    register,
    sync,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new features context.
 *
 * @param options The options for the features context.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```ts
 * import { createFeaturesContext } from '@vuetify/v0'
 *
 * export const [useFeatures, provideFeatures, context] = createFeaturesContext({
 *   namespace: 'app:features',
 *   features: {
 *     'dark-mode': true,
 *     'theme-color': { $variation: 'blue' },
 *   },
 * })
 * ```
 */
export function createFeaturesContext<
  Z extends FeatureTicket = FeatureTicket,
  E extends FeatureContext<Z> = FeatureContext<Z>,
> (_options: FeatureContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:features', ...options } = _options
  const [useFeaturesContext, _provideFeaturesContext] = createContext<E>(namespace)
  const context = createFeatures<Z, E>(options)

  function provideFeaturesContext (_context: E = context, app?: App): E {
    return _provideFeaturesContext(_context, app)
  }

  return createTrinity<E>(useFeaturesContext, provideFeaturesContext, context)
}

/**
 * Creates a new features plugin.
 *
 * @param options The options for the features plugin.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createFeaturesPlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(
 *   createFeaturesPlugin({
 *     features: {
 *       'dark-mode': true,
 *       'theme-color': { $variation: 'blue' },
 *     },
 *   })
 * )
 *
 * app.mount('#app')
 * ```
 */
export function createFeaturesPlugin<
  Z extends FeatureTicket = FeatureTicket,
  E extends FeatureContext<Z> = FeatureContext<Z>,
> (_options: FeaturePluginOptions = {}) {
  const { namespace = 'v0:features', adapter, ...options } = _options
  const [, provideFeaturesContext, context] = createFeaturesContext<Z, E>({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideFeaturesContext(context, app)
    },
    setup: (app: App) => {
      if (!adapter) return

      const initialFlags = adapter.setup(flags => {
        context.sync(flags)
      })

      context.sync(initialFlags)

      if (isFunction(adapter.dispose)) {
        app.onUnmount(() => adapter.dispose!())
      }
    },
  })
}

/**
 * Returns the current features instance.
 *
 * @param namespace The namespace for the features context. Defaults to `v0:features`.
 * @template Z The type of the feature ticket.
 * @returns The current features instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useFeatures } from '@vuetify/v0'
 *
 *   const features = useFeatures()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Features: {{ features.get('dark-mode') }}</p>
 *     <p>Theme Color: {{ features.variation('theme-color') }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useFeatures<
  Z extends FeatureTicket = FeatureTicket,
  E extends FeatureContext<Z> = FeatureContext<Z>,
> (namespace = 'v0:features'): E {
  return useContext<E>(namespace)
}
