// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useGroup } from '#v0/composables/useGroup'
import { useTokens } from '#v0/composables/useTokens'

// Utilities
import { isBoolean, isObject } from '#v0/utilities'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { GroupContext, GroupTicket } from '#v0/composables/useGroup'
import type { ID } from '#v0/types'
import type { App } from 'vue'
import type { TokenCollection, TokenValue } from '#v0/composables/useTokens'

export interface FeatureTicket extends GroupTicket {
  value: TokenValue
}

export interface FeatureContext<Z extends FeatureTicket = FeatureTicket> extends GroupContext<Z> {
  /* Get the variation value of a feature, or a fallback if not set */
  variation: (id: ID, fallback?: any) => any
}

export interface FeatureOptions extends FeaturePluginOptions {}

export interface FeaturePluginOptions {
  features?: Record<ID, boolean | TokenCollection>
}

/**
 * Creates a new features instance.
 *
 * @param namespace The namespace to use for the features instance.
 * @param options The options for the features instance.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-features
 *
 * @example
 * ```ts
 * import { createFeatures } from '@vuetify/v0'
 *
 * const [useFeatures, provideFeaturesContext] = createFeatures('v0:features', {
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
> (
  namespace = 'v0:features',
  options: FeatureOptions = {},
): ContextTrinity<E> {
  const [useFeaturesContext, _provideFeaturesContext] = createContext<E>(namespace)
  const tokens = useTokens(options.features, { flat: true })
  const registry = useGroup<Z, E>()

  for (const [id, { value }] of tokens.entries()) {
    register({ id, value } as Partial<Z>)
  }

  function variation (id: ID, fallback: any = null) {
    const ticket = registry.get(id)

    if (!ticket) return fallback

    return isObject(ticket.value) ? ticket.value.$variation ?? fallback : fallback
  }

  function register (registration: Partial<Z> = {}): Z {
    const item: Partial<Z> = {
      value: false,
      ...registration,
    }

    const ticket = registry.register(item)

    if (
      isBoolean(ticket.value) || (
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

  const context = {
    ...registry,
    variation,
    register,
  } as E

  function provideFeaturesContext (_context: E = context, app?: App) {
    return _provideFeaturesContext(_context, app)
  }

  return createTrinity<E>(useFeaturesContext, provideFeaturesContext, context)
}

/**
 * Returns the current features instance.
 *
 * @template Z The type of the feature ticket.
 * @returns The current features instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-features
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
export function useFeatures<Z extends FeatureTicket = FeatureTicket> (): FeatureContext<Z> {
  return useContext<FeatureContext<Z>>('v0:features')
}

/**
 * Creates a new features plugin.
 *
 * @param options The options for the features plugin.
 * @template Z The type of the feature ticket.
 * @template E The type of the feature context.
 * @returns A new features plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-features
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
> (options: FeaturePluginOptions = {}) {
  const [, provideFeaturesContext, context] = createFeatures<Z, E>('v0:features', options)

  return createPlugin({
    namespace: 'v0:features',
    provide: (app: App) => {
      provideFeaturesContext(context, app)
    },
  })
}
