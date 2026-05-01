/**
 * @module useTooltip
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-tooltip
 *
 * @remarks
 * Region-scoped tooltip coordination plugin. Holds shared delay defaults and
 * a small registry of currently-open tooltips so individual tooltip instances
 * can skip their open delay when another tooltip is already visible (the
 * "warmup" pattern from React Aria / Radix).
 *
 * Use the plugin form (`app.use(createTooltipPlugin())`) for app-wide
 * defaults, or the `<Tooltip>` provider component for region-scoped
 * overrides.
 *
 * @example
 * ```ts
 * import { createTooltipPlugin } from '@vuetify/v0'
 *
 * app.use(createTooltipPlugin({ openDelay: 500 }))
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isNull } from '#v0/utilities'
import { getCurrentScope, onScopeDispose, shallowRef, toRef, toValue } from 'vue'

// Types
import type { RegistryTicket } from '#v0/composables/createRegistry'
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, Ref } from 'vue'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

function now (): number {
  return IN_BROWSER ? performance.now() : Date.now()
}

/**
 * Options accepted by the tooltip factory.
 *
 * @example
 * ```ts
 * import { createTooltipPlugin } from '@vuetify/v0'
 *
 * app.use(createTooltipPlugin({ openDelay: 500, closeDelay: 100 }))
 * ```
 */
export interface TooltipOptions {
  /** Default open delay in ms. @default 700 */
  openDelay?: MaybeRefOrGetter<number>
  /** Default close delay in ms. @default 150 */
  closeDelay?: MaybeRefOrGetter<number>
  /** Window in ms after a tooltip closes during which the next open is instant. @default 300 */
  skipDelay?: MaybeRefOrGetter<number>
  /** Disable all tooltips in this region. @default false */
  disabled?: MaybeRefOrGetter<boolean>
}

export interface TooltipContext {
  /**
   * Reactive open delay in ms.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * console.log(tooltip.openDelay.value)
   * ```
   */
  openDelay: Readonly<Ref<number>>
  /**
   * Reactive close delay in ms.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * console.log(tooltip.closeDelay.value)
   * ```
   */
  closeDelay: Readonly<Ref<number>>
  /**
   * Reactive skip-window length in ms.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * console.log(tooltip.skipDelay.value)
   * ```
   */
  skipDelay: Readonly<Ref<number>>
  /**
   * Reactive disabled flag for the region.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * if (tooltip.disabled.value) return
   * ```
   */
  disabled: Readonly<Ref<boolean>>
  /**
   * True when at least one tooltip is currently open in this region.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * watch(tooltip.isAnyOpen, open => console.log(open))
   * ```
   */
  isAnyOpen: Readonly<Ref<boolean>>
  /**
   * Returns true when the next opening tooltip should skip its open delay.
   *
   * @remarks
   * The skip rule is two-pronged: skip when another tooltip is already open
   * in the region, or skip when the previous tooltip closed within the
   * `skipDelay` window.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * const delay = tooltip.shouldSkipOpenDelay() ? 0 : tooltip.openDelay.value
   * ```
   */
  shouldSkipOpenDelay: () => boolean
  /**
   * Register an open tooltip with the region.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * const ticket = tooltip.register({ id: 'tooltip:1' })
   * ```
   */
  register: (input?: Partial<RegistryTicket>) => RegistryTicket
  /**
   * Unregister a tooltip and stamp the close timestamp.
   *
   * @example
   * ```ts
   * const tooltip = useTooltip()
   * tooltip.unregister(ticket.id)
   * ```
   */
  unregister: (id: ID) => void
}

export interface TooltipContextOptions extends TooltipOptions {
  namespace?: string
}

export interface TooltipPluginOptions extends TooltipContextOptions {
  // No persist field today; declared for parity with sibling plugins.
}

// Internal factory passed to createPluginContext below. The trinity exports
// (`createTooltipContext`, `createTooltipPlugin`, `useTooltip`) are the
// public surface; this factory stays unexported to keep one entry point.
function createTooltip (options: TooltipOptions = {}): TooltipContext {
  const openDelay = toRef(() => toValue(options.openDelay) ?? 700)
  const closeDelay = toRef(() => toValue(options.closeDelay) ?? 150)
  const skipDelay = toRef(() => toValue(options.skipDelay) ?? 300)
  const disabled = toRef(() => toValue(options.disabled) ?? false)

  const registry = createRegistry({ reactive: true })
  const lastClosedAt = shallowRef<number | null>(null)

  const isAnyOpen = toRef(() => registry.size > 0)

  function shouldSkipOpenDelay (): boolean {
    if (isAnyOpen.value) return true
    if (isNull(lastClosedAt.value)) return false
    const elapsed = now() - lastClosedAt.value
    return elapsed >= 0 && elapsed < skipDelay.value
  }

  function register (input?: Partial<RegistryTicket>): RegistryTicket {
    return registry.register(input)
  }

  function unregister (id: ID): void {
    if (!registry.has(id)) return
    registry.unregister(id)
    lastClosedAt.value = now()
  }

  if (getCurrentScope()) {
    onScopeDispose(() => registry.dispose())
  }

  return {
    openDelay,
    closeDelay,
    skipDelay,
    disabled,
    isAnyOpen,
    shouldSkipOpenDelay,
    register,
    unregister,
  }
}

export const [createTooltipContext, createTooltipPlugin, useTooltip] =
  createPluginContext<TooltipPluginOptions, TooltipContext>(
    'v0:tooltip',
    createTooltip,
  )
