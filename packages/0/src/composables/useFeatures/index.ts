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
 * - Adapter pattern for external feature flag services (Generic, LaunchDarkly, Flagsmith)
 *
 * Inheritance chain: createRegistry → createSelection → createGroup → createFeatures
 * Integrates with createTokens for token-based features.
 *
 * @example
 * ```ts
 * import { useFeatures } from '@vuetify/v0'
 *
 * const features = useFeatures()
 * features.register({ id: 'new-checkout', value: true })
 * console.log(features.variation('new-checkout'))
 * ```
 */

// Composables
import { createGroup } from '#v0/composables/createGroup'
import { createPluginContext } from '#v0/composables/createPlugin'
import { createTokens } from '#v0/composables/createTokens'

// Utilities
import { isArray, isBoolean, isNumber, isObject, isString, isUndefined } from '#v0/utilities'

// Types
import type { GroupContext, GroupTicket, GroupTicketInput } from '#v0/composables/createGroup'
import type { RegistryOptions } from '#v0/composables/createRegistry'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { FeaturesAdapterFlags, FeaturesAdapter } from '#v0/composables/useFeatures/adapters'
import type { ID, MaybeArray } from '#v0/types'

// Exports
export { FeaturesAdapter } from '#v0/composables/useFeatures/adapters'

export type { FeaturesAdapterFlags, FeaturesAdapterValue } from '#v0/composables/useFeatures/adapters'

/**
 * Input type for feature tickets - what users provide to register().
 */
export interface FeatureTicketInput extends GroupTicketInput {}

/**
 * Output type for feature tickets - what users receive from get().
 */
export type FeatureTicket<Z extends FeatureTicketInput = FeatureTicketInput> = GroupTicket<Z>

export interface FeatureContext<
  Z extends FeatureTicketInput = FeatureTicketInput,
  E extends FeatureTicket<Z> = FeatureTicket<Z>,
> extends Omit<GroupContext<Z, E>, 'register'> {
  /**
   * Get the variation value of a feature, or a fallback if not set.
   *
   * @param id The feature ID.
   * @param fallback The fallback value if the feature has no variation.
   *
   * @example
   * ```ts
   * const features = useFeatures()
   * features.variation('search', 'v1') // 'v2' or the fallback
   * ```
   */
  variation: (id: ID, fallback?: unknown) => unknown
  /**
   * Sync feature flags from an external source.
   *
   * @param flags The flags to sync, typically from an adapter.
   *
   * @remarks This updates existing flags and registers new ones.
   * Use this when adapter flags change to update the registry.
   *
   * @example
   * ```ts
   * features.sync({
   *   checkout: true,
   *   search: { $value: true, $variation: 'v2' },
   * })
   * ```
   */
  sync: (flags: FeaturesAdapterFlags) => void
  /**
   * Register a feature (accepts input type, returns output type).
   *
   * @example
   * ```ts
   * features.register({ id: 'beta', value: false })
   * ```
   */
  register: (registration?: Partial<Z>) => E
  /**
   * Bulk-register multiple features in a single batch.
   *
   * @example
   * ```ts
   * features.onboard([
   *   { id: 'beta', value: false },
   *   { id: 'search', value: { $value: true, $variation: 'v2' } },
   * ])
   * ```
   */
  onboard: (registrations: Partial<Z>[]) => E[]
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
  adapter?: MaybeArray<FeaturesAdapter>
  /**
   * Persist enabled feature flags to storage and restore them on load.
   *
   * @remarks Persists the set of selected flag ids. The storage key is the
   * plugin namespace with the `v0:` prefix stripped (`features`). On load the
   * selection is reconciled against the registered flags and wins over an
   * adapter's first snapshot. Later adapter updates still overlay live remote
   * state.
   *
   * @default false
   */
  persist?: boolean
}

function isEnabled (value: unknown): boolean | undefined {
  if (isBoolean(value)) return value
  if (isObject(value) && isBoolean(value.$value)) return value.$value

  return undefined
}

/**
 * Creates a new features instance.
 *
 * @param options The options for the features instance.
 * @returns A new features instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-features
 *
 * @example
 * ```ts
 * import { createFeatures } from '@vuetify/v0'
 *
 * const features = createFeatures({
 *   features: {
 *     'dark-mode': true,
 *     'theme-color': { $variation: 'blue' },
 *   },
 * })
 * ```
 */
export function createFeatures (_options: FeatureOptions = {}): FeatureContext {
  const { features, ...options } = _options

  const tokens = createTokens(features, { flat: true })
  const registry = createGroup({ ...options, events: true, reactive: true })

  for (const [id, { value }] of tokens.entries()) {
    register({ id, value } as Partial<FeatureTicketInput>)
  }

  function variation (id: ID, fallback: unknown = null) {
    const ticket = registry.get(id)

    if (!ticket) return fallback

    return isObject(ticket.value) ? ticket.value.$variation ?? fallback : ticket.value ?? fallback
  }

  function register (registration: Partial<FeatureTicketInput> = {} as Partial<FeatureTicketInput>): FeatureTicket {
    const item = {
      value: false,
      ...registration,
    }

    const ticket = registry.register(item as Partial<FeatureTicketInput>)

    if (isEnabled(ticket.value) === true) {
      registry.select(ticket.id)
    }

    return ticket
  }

  function sync (flags: FeaturesAdapterFlags): void {
    for (const [id, value] of Object.entries(flags)) {
      const existing = registry.get(id)

      if (existing) {
        const enabled = isEnabled(value)

        registry.upsert(id, { value } as Partial<FeatureTicket>)

        if (enabled === true) {
          registry.select(id)
        } else if (enabled === false) {
          // Explicit off — drain so a disabled ticket still turns off.
          registry.selectedIds.delete(id)
        }
      } else {
        register({ id, value } as Partial<FeatureTicketInput>)
      }
    }
  }

  function onboard (registrations: Partial<FeatureTicketInput>[]): FeatureTicket[] {
    return registry.batch(() => registrations.map(registration => register(registration)))
  }

  return {
    ...registry,
    variation,
    register,
    onboard,
    sync,
    get size () {
      return registry.size
    },
  } as FeatureContext
}

function createFeaturesFallback (): FeatureContext {
  return {
    size: 0,
    variation: (_id: ID, fallback: unknown = null) => fallback,
    sync: () => {},
    onboard: () => [],
    register: () => undefined as unknown as FeatureTicket,
    select: () => {},
    unselect: () => {},
    get: () => undefined,
    has: () => false,
    selectedIds: new Set<ID>(),
    values: () => [],
  } as unknown as FeatureContext
}

function applyPersisted (context: FeatureContext, saved: unknown) {
  if (!isArray(saved)) return

  const wanted = new Set<ID>(saved.filter((id): id is ID => isString(id) || isNumber(id)))

  for (const ticket of context.values()) {
    if (wanted.has(ticket.id)) context.select(ticket.id)
    else context.unselect(ticket.id)
  }
}

const restored = new WeakMap<FeatureContext, unknown>()

export const [createFeaturesContext, createFeaturesPlugin, useFeatures] =
  createPluginContext<FeaturePluginOptions, FeatureContext>(
    'v0:features',
    options => createFeatures(options),
    {
      fallback: () => createFeaturesFallback(),
      persist: context => [...context.selectedIds],
      restore: (context, saved) => {
        restored.set(context, saved)
        applyPersisted(context, saved)
      },
      setup: (context, app, { adapter }) => {
        if (!adapter) return

        for (const a of isArray(adapter) ? adapter : [adapter]) {
          context.sync(a.setup(flags => context.sync(flags)))
          app.onUnmount(() => a.dispose?.())
        }

        // Adapter setup writes after restore. Re-apply so persist wins the
        // first snapshot; later onUpdate calls still overlay live remote state.
        const saved = restored.get(context)
        if (!isUndefined(saved)) applyPersisted(context, saved)
      },
    },
  )
