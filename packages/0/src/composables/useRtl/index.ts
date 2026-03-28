/**
 * @module useRtl
 *
 * @remarks
 * RTL (right-to-left) direction composable with adapter pattern.
 *
 * Key features:
 * - Reactive boolean direction state
 * - Plugin trinity pattern (createRtlContext, createRtlPlugin, useRtl)
 * - Adapter pattern for DOM integration (dir attribute)
 * - Subtree overrides via context provision
 *
 * Independent from useLocale — Vuetify connects them via adapter.
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'

// Adapters
import { Vuetify0RtlAdapter } from '#v0/composables/useRtl/adapters/v0'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { RtlAdapter } from './adapters'
import type { Ref } from 'vue'

// Exports
export { Vuetify0RtlAdapter } from '#v0/composables/useRtl/adapters'

export type { RtlAdapter, RtlAdapterSetupContext } from '#v0/composables/useRtl/adapters'

export interface RtlContext {
  /** Writable ref — true = RTL, false = LTR */
  isRtl: Ref<boolean>
  /** Convenience method to flip direction */
  toggle: () => void
}

export interface RtlOptions {
  /** Initial direction. Defaults to false (LTR). */
  default?: boolean
  /** Adapter for framework-specific side-effects. */
  adapter?: RtlAdapter
  /** Target element or selector for dir attribute. Defaults to documentElement. */
  target?: string | HTMLElement | null
}

export interface RtlContextOptions extends RtlOptions {
  namespace?: string
}

export interface RtlPluginOptions extends RtlContextOptions {
  persist?: boolean
}

/**
 * Creates a new RTL direction instance.
 *
 * @param options The options for the RTL instance.
 * @returns A new RTL context with reactive direction state.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-rtl
 */
export function createRtl (options: RtlOptions = {}): RtlContext {
  const isRtl = shallowRef(options.default ?? false)

  function toggle () {
    isRtl.value = !isRtl.value
  }

  return { isRtl, toggle }
}

export function createRtlFallback (): RtlContext {
  return {
    isRtl: shallowRef(false),
    toggle: () => {},
  }
}

export const [createRtlContext, createRtlPlugin, useRtl] =
  createPluginContext<RtlPluginOptions, RtlContext>(
    'v0:rtl',
    options => createRtl(options),
    {
      fallback: () => createRtlFallback(),
      setup: (context, app, { adapter = new Vuetify0RtlAdapter(), target }) => {
        adapter.setup(app, context, target)
      },
      persist: ctx => ctx.isRtl.value,
      restore: (ctx, saved) => {
        ctx.isRtl.value = saved as boolean
      },
    },
  )
