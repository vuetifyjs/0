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

// Transformers
import { toArray } from '#v0/composables/toArray'

// Utilities
import { isArray, isBoolean, isNumber, isObject, isString } from '#v0/utilities'
import { shallowReactive, shallowRef } from 'vue'

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
  /**
   * Restore every registered flag to its registration default and clear all
   * recorded user intent (with `persist`, the stored overrides are cleared).
   *
   * @remarks Flags disabled after boot stay unselected until re-enabled —
   * selection ops are guarded on disabled tickets.
   *
   * @example
   * ```ts
   * const features = useFeatures()
   * features.toggle('beta')
   * features.reset() // 'beta' back to its registered default
   * ```
   */
  reset: () => void
  /** External feature-flag adapter(s), when the plugin was installed with one. */
  adapter?: MaybeArray<FeaturesAdapter>
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
   * Persist the user's feature-flag overrides to storage and restore them on load.
   *
   * @remarks Persists a delta of user-toggled flags relative to each flag's
   * registration default, shaped `{ enabled: ID[], disabled: ID[] }` — flags
   * the user never touched are not stored and keep following code defaults.
   * Toggling a flag back to its registration default drops it from the delta.
   * The storage key is the plugin namespace with the `v0:` prefix stripped
   * (`features`).
   *
   * On load the delta is applied only to its listed ids; flags that register
   * later (adapter or runtime registrations) receive their saved override at
   * registration time. Entries whose flag is not registered are skipped and
   * pruned from the next persist write. Restored overrides win over an
   * adapter's first snapshot; later adapter updates still overlay live remote
   * state.
   *
   * User intent is recorded through the context's `select` / `unselect` /
   * `toggle` methods; ticket self-methods (`ticket.toggle()`) and the bulk
   * `selectAll` / `unselectAll` / `toggleAll` operations bypass intent
   * tracking — their changes are not persisted and revert to defaults on
   * reload. Toggles on disabled flags no-op and record nothing. `reset()`
   * restores registration defaults in-session and clears the stored delta.
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
 * Persisted shape: the user's overrides relative to registration defaults.
 */
interface FeatureDelta {
  enabled: ID[]
  disabled: ID[]
}

interface FeatureSeam {
  delta: () => FeatureDelta
  restore: (saved: unknown) => void
  replay: () => void
}

// Persistence plumbing stays off the public context surface.
const seams = new WeakMap<FeatureContext, FeatureSeam>()

function coerce (saved: unknown): Map<ID, boolean> | null {
  if (!isObject(saved)) return null

  const map = new Map<ID, boolean>()

  if (isArray(saved.enabled)) {
    for (const id of saved.enabled) {
      if (isString(id) || isNumber(id)) map.set(id, true)
    }
  }

  if (isArray(saved.disabled)) {
    for (const id of saved.disabled) {
      if (isString(id) || isNumber(id)) map.set(id, false)
    }
  }

  return map.size > 0 ? map : null
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
export function createFeatures (_options: FeatureOptions & { adapter?: MaybeArray<FeaturesAdapter> } = {}): FeatureContext {
  const { features, adapter, ...options } = _options

  const tokens = createTokens(features, { flat: true })
  const registry = createGroup({ ...options, events: true, reactive: true })

  // Reactive so the persist watch tracks user intent even while empty.
  const touched = shallowReactive(new Set<ID>())
  const defaults = new Map<ID, boolean>()
  // Ref so the persist watch also tracks restore-map changes — a reset that
  // only drops un-applied entries must still write its clearing to storage.
  const pending = shallowRef<Map<ID, boolean> | null>(null)

  for (const [id, { value }] of tokens.entries()) {
    register({ id, value } as Partial<FeatureTicketInput>)
  }

  function touch (ids: MaybeArray<ID>) {
    for (const id of toArray(ids)) {
      if (registry.has(id)) touched.add(id)
    }
  }

  function select (ids: MaybeArray<ID>) {
    touch(ids)
    registry.select(ids)
  }

  function unselect (ids: MaybeArray<ID>) {
    touch(ids)
    registry.unselect(ids)
  }

  function toggle (ids: MaybeArray<ID>) {
    touch(ids)
    registry.toggle(ids)
  }

  function reset () {
    touched.clear()
    // Drop any un-applied restore entries too — a late registration after a
    // reset must not resurrect a pre-reset persisted override.
    pending.value = null
    registry.reset()

    // Replay the registration baselines so defaults return in-session, not
    // just on the next boot. Selection is empty after registry.reset(), so
    // only baseline-enabled flags need action; the guarded select no-ops for
    // flags disabled after boot — those stay unselected until re-enabled.
    for (const [id, enabled] of defaults) {
      if (enabled) registry.select(id)
    }
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

    // Baseline is the state the flag actually boots with — for a disabled
    // ticket the auto-select no-ops, so isEnabled would record a state the
    // registry never reached and a later no-op toggle would fake a delta.
    defaults.set(ticket.id, registry.selectedIds.has(ticket.id))

    // A late registration picks up its saved override unless the user
    // already toggled the flag this session.
    if (pending.value?.has(ticket.id) && !touched.has(ticket.id)) {
      touched.add(ticket.id)
      if (pending.value.get(ticket.id)) registry.select(ticket.id)
      else registry.unselect(ticket.id)
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

  function replay (force = false) {
    if (!pending.value) return

    for (const [id, enabled] of pending.value) {
      if (!registry.has(id)) continue
      if (!force && touched.has(id)) continue

      touched.add(id)

      if (enabled) registry.select(id)
      else registry.unselect(id)
    }
  }

  function delta (): FeatureDelta {
    // Tracked so a reset that only drops un-applied restore entries still
    // triggers a persist write of the cleared state.
    void pending.value

    const enabled: ID[] = []
    const disabled: ID[] = []

    for (const id of touched) {
      if (!registry.has(id)) continue

      const selected = registry.selectedIds.has(id)

      if (selected === defaults.get(id)) continue

      if (selected) enabled.push(id)
      else disabled.push(id)
    }

    // Always a fresh object — the persist watch writes on reference change,
    // so an empty delta still overwrites a stale stored value after a reset.
    return { enabled, disabled }
  }

  const context = {
    ...registry,
    select,
    unselect,
    toggle,
    reset,
    variation,
    register,
    onboard,
    sync,
    adapter,
    get size () {
      return registry.size
    },
  } as FeatureContext

  seams.set(context, {
    delta,
    restore: saved => {
      pending.value = coerce(saved)
      replay()
    },
    replay: () => replay(true),
  })

  return context
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

export const [createFeaturesContext, createFeaturesPlugin, useFeatures] =
  createPluginContext<FeaturePluginOptions, FeatureContext>(
    'v0:features',
    options => createFeatures(options),
    {
      fallback: () => createFeaturesFallback(),
      persist: context => seams.get(context)?.delta() ?? null,
      restore: (context, saved) => seams.get(context)?.restore(saved),
      inspect: ctx => ({
        adapter: isArray(ctx.adapter)
          ? ctx.adapter.map(item => item.constructor.name)
          : (ctx.adapter?.constructor.name ?? 'none'),
      }),
      setup: (context, app, { adapter }) => {
        if (!adapter) return

        for (const a of isArray(adapter) ? adapter : [adapter]) {
          context.sync(a.setup(flags => context.sync(flags)))
          app.onUnmount(() => a.dispose?.())
        }

        // Adapter setup writes after restore. Re-apply so persist wins the
        // first snapshot; later onUpdate calls still overlay live remote state.
        seams.get(context)?.replay()
      },
    },
  )
