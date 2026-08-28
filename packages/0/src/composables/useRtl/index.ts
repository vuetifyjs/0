/**
 * @module useRtl
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-rtl
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
 *
 * @example
 * ```ts
 * import { useRtl } from '@vuetify/v0'
 *
 * const { isRtl, toggle } = useRtl()
 * toggle() // flip direction
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'

// Adapters
import { V0RtlAdapter } from '#v0/composables/useRtl/adapters/v0'

// Utilities
import { isBoolean } from '#v0/utilities'
import { shallowRef } from 'vue'

// Types
import type { RtlAdapter } from './adapters'
import type { Ref } from 'vue'

// Exports
export { RtlAdapter, V0RtlAdapter } from '#v0/composables/useRtl/adapters'

export type { RtlAdapterSetupContext } from '#v0/composables/useRtl/adapters'

export interface RtlContext {
  /** Writable ref — true = RTL, false = LTR */
  isRtl: Ref<boolean>
  /** Convenience method to flip direction */
  toggle: () => void
  /**
   * Release adapter resources (watch teardown, unhead entry).
   * Called automatically on `app.unmount` when using the plugin path.
   * Call manually when using a standalone context (`createRtlContext`).
   */
  dispose: () => void
  /** Active RTL adapter. Defaults to `V0RtlAdapter`. */
  adapter: RtlAdapter
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
  const adapter = options.adapter ?? new V0RtlAdapter()
  const isRtl = shallowRef(options.default ?? false)

  function toggle () {
    isRtl.value = !isRtl.value
  }

  return { isRtl, toggle, adapter, dispose: () => adapter.dispose?.() }
}

export function createRtlFallback (): RtlContext {
  const adapter = new V0RtlAdapter()
  return {
    isRtl: shallowRef(false),
    toggle: () => {},
    adapter,
    dispose: () => adapter.dispose?.(),
  }
}

export const [createRtlContext, createRtlPlugin, useRtl] =
  createPluginContext<RtlPluginOptions, RtlContext>(
    'v0:rtl',
    options => createRtl(options),
    {
      inspect: ctx => ({
        adapter: ctx.adapter.constructor.name,
        isRtl: ctx.isRtl,
      }),
      fallback: () => createRtlFallback(),
      setup: (context, app, { target }) => {
        context.adapter.setup(app, context, target)
        app.onUnmount(() => context.adapter.dispose?.())
      },
      persist: ctx => ctx.isRtl.value,
      restore: (ctx, saved) => {
        if (isBoolean(saved)) ctx.isRtl.value = saved
      },
    },
  )
