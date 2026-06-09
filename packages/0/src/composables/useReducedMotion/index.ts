/**
 * @module useReducedMotion
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-reduced-motion
 *
 * @remarks
 * Reduced-motion plugin that bridges the system `prefers-reduced-motion` media
 * query with an application-level override.
 *
 * Key features:
 * - `mode: 'system' | 'always' | 'never'` — reactive, user-settable
 * - `reduced` — computed boolean; true when motion should be reduced
 * - `current` — derived string `'reduce' | 'no-preference'` (matches CSS keyword)
 * - `[data-reduced-motion="reduce"]` set on `<body>` by the default adapter
 * - SSR-safe: reads matchMedia synchronously on client, false on server
 * - Plugin trinity pattern (createReducedMotionContext / createReducedMotionPlugin / useReducedMotion)
 *
 * @example
 * ```ts
 * import { createReducedMotionPlugin } from '@vuetify/v0'
 *
 * app.use(createReducedMotionPlugin({ default: 'system' }))
 *
 * // inside a component or composable
 * const { mode, reduced } = useReducedMotion()
 * mode.value = 'always'   // force-reduce regardless of system setting
 * console.log(reduced.value) // true
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'

// Adapters
import { V0ReducedMotionAdapter } from '#v0/composables/useReducedMotion/adapters'

// Globals
import { IN_BROWSER, SUPPORTS_MATCH_MEDIA } from '#v0/constants/globals'

// Utilities
import { computed, shallowReadonly, shallowRef } from 'vue'

// Types
import type { ReducedMotionAdapter } from '#v0/composables/useReducedMotion/adapters'
import type { ComputedRef, Ref } from 'vue'

// Exports
export { V0ReducedMotionAdapter } from '#v0/composables/useReducedMotion/adapters'

export type { ReducedMotionAdapter, ReducedMotionAdapterSetupContext } from '#v0/composables/useReducedMotion/adapters'

export type ReducedMotionMode = 'system' | 'always' | 'never'

export interface ReducedMotionContext {
  /** Writable — controls whether reduced motion is active */
  mode: Ref<ReducedMotionMode>
  /** True when motion should be reduced (derived from mode + system media query) */
  readonly reduced: Readonly<ComputedRef<boolean>>
  /** CSS keyword form of reduced — `'reduce'` or `'no-preference'` */
  readonly current: Readonly<ComputedRef<'no-preference' | 'reduce'>>
  /**
   * Internal ref updated by the adapter when mode === 'system'.
   * Not part of the public API — exposed so adapters can write to it.
   * @internal
   */
  _systemReduced: Ref<boolean>
}

export interface ReducedMotionOptions {
  /** Initial mode. Defaults to `'system'`. */
  default?: ReducedMotionMode
  /** Adapter for DOM side-effects (body dataset attribute). */
  adapter?: ReducedMotionAdapter
}

export interface ReducedMotionContextOptions extends ReducedMotionOptions {
  namespace?: string
}

export interface ReducedMotionPluginOptions extends ReducedMotionContextOptions {
  persist?: boolean
}

/**
 * Creates a new reduced-motion context instance.
 *
 * @param options The options for the reduced-motion instance.
 * @returns A new reduced-motion context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-reduced-motion
 */
export function createReducedMotion (options: ReducedMotionOptions = {}): ReducedMotionContext {
  const mode = shallowRef<ReducedMotionMode>(options.default ?? 'system')

  // Read the system media query once synchronously so the initial value is
  // correct without waiting for the adapter's change listener.
  const initialMql = IN_BROWSER && SUPPORTS_MATCH_MEDIA
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

  const _systemReduced = shallowRef(initialMql?.matches ?? false)

  const reduced = computed<boolean>(() => {
    if (mode.value === 'always') return true
    if (mode.value === 'never') return false
    return _systemReduced.value
  })

  const current = computed<'no-preference' | 'reduce'>(() =>
    reduced.value ? 'reduce' : 'no-preference',
  )

  return {
    mode,
    reduced: shallowReadonly(reduced),
    current: shallowReadonly(current),
    _systemReduced,
  }
}

export function createReducedMotionFallback (): ReducedMotionContext {
  const mode = shallowRef<ReducedMotionMode>('system')
  const _systemReduced = shallowRef(false)
  const reduced = computed<boolean>(() => false)
  const current = computed<'no-preference' | 'reduce'>(() => 'no-preference')
  return { mode, reduced: shallowReadonly(reduced), current: shallowReadonly(current), _systemReduced }
}

export const [createReducedMotionContext, createReducedMotionPlugin, useReducedMotion] =
  createPluginContext<ReducedMotionPluginOptions, ReducedMotionContext>(
    'v0:reduced-motion',
    options => createReducedMotion(options),
    {
      fallback: () => createReducedMotionFallback(),
      setup: (context, app, { adapter = new V0ReducedMotionAdapter() }) => {
        adapter.setup(app, context)
      },
      persist: ctx => ctx.mode.value,
      restore: (ctx, saved) => {
        ctx.mode.value = saved as ReducedMotionMode
      },
    },
  )
