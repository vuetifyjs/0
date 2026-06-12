/**
 * @module useReducedMotion
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-reduced-motion
 *
 * @remarks
 * Reduced-motion plugin composable for respecting or overriding the
 * `prefers-reduced-motion` media query.
 *
 * Key features:
 * - Three-way `mode`: `'system'` (honor OS setting), `'always'` (force reduce),
 *   `'never'` (force full motion)
 * - Reactive `isReduced` boolean — true when motion should be minimized
 * - When installed as a plugin, the default `V0ReducedMotionAdapter` writes
 *   `document.body.dataset.reducedMotion = 'reduce' | 'no-preference'` in the browser.
 *   On the server it renders the same attribute via `@unhead` with the configured
 *   mode — the OS preference is only readable in the browser, so in `'system'` mode
 *   the server value is always `'no-preference'` until client takeover; pair the
 *   attribute selector with a native `@media (prefers-reduced-motion: reduce)` rule
 *   for pre-hydration coverage
 * - SSR-safe: no `window`/`document` access on the server
 *
 * @example
 * ```ts
 * import { createReducedMotionPlugin, useReducedMotion } from '@vuetify/v0'
 *
 * // install once
 * app.use(createReducedMotionPlugin({ mode: 'system' }))
 *
 * // consume anywhere
 * const motion = useReducedMotion()
 * console.log(motion.isReduced.value) // true | false
 * motion.select('never') // override
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { usePrefersReducedMotion } from '#v0/composables/useMediaQuery'

// Adapters
import { V0ReducedMotionAdapter } from '#v0/composables/useReducedMotion/adapters'

// Utilities
import { shallowReadonly, shallowRef, toRef } from 'vue'

// Types
import type { ReducedMotionAdapter } from './adapters'
import type { Ref, ShallowRef } from 'vue'

// Exports
export { ReducedMotionAdapter, V0ReducedMotionAdapter } from '#v0/composables/useReducedMotion/adapters'

export type { ReducedMotionAdapterSetupContext } from '#v0/composables/useReducedMotion/adapters'

export type ReducedMotionMode = 'system' | 'always' | 'never'

export interface ReducedMotionContext {
  /** The active mode. `'system'` defers to the OS media query. Change it with `select`. */
  readonly selectedMode: Readonly<ShallowRef<ReducedMotionMode>>
  /** `true` when motion should be minimized, considering the active `selectedMode`. */
  readonly isReduced: Readonly<Ref<boolean>>
  /**
   * Set the active mode.
   *
   * @example
   * ```ts
   * motion.select('always')
   * ```
   */
  select: (mode: ReducedMotionMode) => void
  /**
   * Stop the OS media-query subscription. Affects every consumer of this context;
   * `isReduced` keeps honoring explicit `always`/`never` modes but stops tracking
   * the OS in `system` mode.
   *
   * @example
   * ```ts
   * motion.dispose()
   * ```
   */
  dispose: () => void
}

export interface ReducedMotionOptions {
  /**
   * Initial mode.
   * - `'system'` (default) — follow `prefers-reduced-motion`
   * - `'always'` — always reduce, overrides OS setting
   * - `'never'` — never reduce, overrides OS setting
   */
  mode?: ReducedMotionMode
  /** Adapter for framework-specific side-effects. Defaults to `V0ReducedMotionAdapter`. */
  adapter?: ReducedMotionAdapter
}

export interface ReducedMotionContextOptions extends ReducedMotionOptions {
  namespace?: string
}

export interface ReducedMotionPluginOptions extends ReducedMotionContextOptions {
  persist?: boolean
}

/**
 * Creates a standalone reduced-motion context.
 *
 * @param options Initial options.
 * @returns A `ReducedMotionContext`.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-reduced-motion
 *
 * @example
 * ```ts
 * import { createReducedMotion } from '@vuetify/v0'
 *
 * const motion = createReducedMotion({ mode: 'system' })
 *
 * console.log(motion.isReduced.value) // true | false
 * motion.select('always')
 * ```
 */
export function createReducedMotion (options: ReducedMotionOptions = {}): ReducedMotionContext {
  const selectedMode = shallowRef<ReducedMotionMode>(options.mode ?? 'system')

  const media = usePrefersReducedMotion()

  const isReduced = toRef(() => {
    if (selectedMode.value === 'always') return true
    if (selectedMode.value === 'never') return false
    return media.matches.value
  })

  function select (value: ReducedMotionMode) {
    selectedMode.value = value
  }

  return {
    selectedMode: shallowReadonly(selectedMode),
    isReduced,
    select,
    dispose: media.stop,
  }
}

function createReducedMotionFallback (): ReducedMotionContext {
  return {
    selectedMode: shallowReadonly(shallowRef<ReducedMotionMode>('system')),
    isReduced: shallowReadonly(shallowRef(false)),
    select: () => {},
    dispose: () => {},
  }
}

export const [createReducedMotionContext, createReducedMotionPlugin, useReducedMotion] =
  createPluginContext<ReducedMotionPluginOptions, ReducedMotionContext>(
    'v0:reduced-motion',
    options => createReducedMotion(options),
    {
      fallback: () => createReducedMotionFallback(),
      persist: context => context.selectedMode.value,
      restore: (context, saved) => {
        if (saved === 'system' || saved === 'always' || saved === 'never') {
          context.select(saved)
        }
      },
      setup: (context, app, { adapter = new V0ReducedMotionAdapter() }) => {
        app.onUnmount(() => context.dispose())

        adapter.setup(app, context)

        app.onUnmount(() => adapter.dispose?.())
      },
    },
  )
