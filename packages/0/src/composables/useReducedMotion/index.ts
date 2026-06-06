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
 * - Three-way `mode`: `'system'` (honour OS setting), `'always'` (force reduce),
 *   `'never'` (force full motion)
 * - Reactive `reduced` boolean — true when motion should be minimised
 * - `current` reflects the effective OS-level value regardless of mode override
 * - Side-effects `document.body.dataset.reducedMotion = 'reduce' | 'no-preference'`
 *   when installed as a plugin, so CSS selectors and Paper/Vuetify can react
 * - SSR-safe: resolves to `false` server-side
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
 * console.log(motion.reduced.value) // true | false
 * motion.setMode('never') // override
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { usePrefersReducedMotion } from '#v0/composables/useMediaQuery'

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { computed, shallowRef, watch } from 'vue'

// Types
import type { ComputedRef, Ref, ShallowRef } from 'vue'

export type ReducedMotionMode = 'system' | 'always' | 'never'

export interface ReducedMotionContext {
  /** The current mode. `'system'` defers to the OS media query. */
  readonly mode: Readonly<ShallowRef<ReducedMotionMode>>
  /** `true` when motion should be minimised, considering the active `mode`. */
  readonly reduced: ComputedRef<boolean>
  /**
   * The raw OS media query result, regardless of `mode`.
   * Useful for analytics or diagnostic displays.
   */
  readonly current: Readonly<Ref<boolean>>
  /** Change the active mode at runtime. */
  setMode: (mode: ReducedMotionMode) => void
}

export interface ReducedMotionOptions {
  /**
   * Initial mode.
   * - `'system'` (default) — follow `prefers-reduced-motion`
   * - `'always'` — always reduce, overrides OS setting
   * - `'never'` — never reduce, overrides OS setting
   */
  mode?: ReducedMotionMode
}

export interface ReducedMotionPluginOptions extends ReducedMotionOptions {
  namespace?: string
  persist?: boolean
}

/**
 * Creates a standalone reduced-motion context.
 *
 * @param options Initial options.
 * @returns A `ReducedMotionContext`.
 */
export function createReducedMotion (options: ReducedMotionOptions = {}): ReducedMotionContext {
  const mode = shallowRef<ReducedMotionMode>(options.mode ?? 'system')

  const { matches: systemReduced } = usePrefersReducedMotion()
  const current = systemReduced as Readonly<Ref<boolean>>

  const reduced = computed<boolean>(() => {
    if (mode.value === 'always') return true
    if (mode.value === 'never') return false
    return current.value
  })

  function setMode (value: ReducedMotionMode): void {
    mode.value = value
  }

  return { mode, reduced, current, setMode }
}

function createReducedMotionFallback (): ReducedMotionContext {
  return {
    mode: shallowRef('system'),
    reduced: computed(() => false),
    current: shallowRef(false),
    setMode: () => {},
  }
}

export const [createReducedMotionContext, createReducedMotionPlugin, useReducedMotion] =
  createPluginContext<ReducedMotionPluginOptions, ReducedMotionContext>(
    'v0:reduced-motion',
    options => createReducedMotion(options),
    {
      fallback: () => createReducedMotionFallback(),
      setup: (context, app) => {
        if (!IN_BROWSER) return

        function sync (reduced: boolean): void {
          document.body.dataset.reducedMotion = reduced ? 'reduce' : 'no-preference'
        }

        sync(context.reduced.value)
        const stop = watch(context.reduced, sync)
        app.onUnmount(stop)
      },
    },
  )
