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
import { shallowRef, toRef, toValue } from 'vue'

// Types
import type { RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, Ref } from 'vue'

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
  /** Reactive open delay in ms. */
  openDelay: Readonly<Ref<number>>
  /** Reactive close delay in ms. */
  closeDelay: Readonly<Ref<number>>
  /** Reactive skip-window length in ms. */
  skipDelay: Readonly<Ref<number>>
  /** Reactive disabled flag for the region. */
  disabled: Readonly<Ref<boolean>>
  /** True when at least one tooltip is currently open in this region. */
  isAnyOpen: Readonly<Ref<boolean>>
  /**
   * Returns true when the next opening tooltip should skip its open delay.
   *
   * @remarks
   * The skip rule is two-pronged: skip when another tooltip is already open
   * in the region, or skip when the previous tooltip closed within the
   * `skipDelay` window.
   */
  shouldSkipOpenDelay: () => boolean
  /** Register an open tooltip with the region. */
  register: (input?: Partial<RegistryTicketInput>) => RegistryTicket
  /** Unregister a tooltip and stamp the close timestamp. */
  unregister: (id: ID) => void
}

// Internal factory passed to createPluginContext below. The trinity exports
// (`createTooltipContext`, `createTooltipPlugin`, `useTooltip`) are the
// public surface; this factory stays unexported to keep one entry point.
function createTooltip (options: TooltipOptions = {}): TooltipContext {
  const openDelay = toRef(() => Number(toValue(options.openDelay) ?? 700))
  const closeDelay = toRef(() => Number(toValue(options.closeDelay) ?? 150))
  const skipDelay = toRef(() => Number(toValue(options.skipDelay) ?? 300))
  const disabled = toRef(() => Boolean(toValue(options.disabled) ?? false))

  const registry = createRegistry({ reactive: true })
  const lastClosedAt = shallowRef(0)

  const isAnyOpen = toRef(() => registry.size > 0)

  function shouldSkipOpenDelay (): boolean {
    if (isAnyOpen.value) return true
    if (lastClosedAt.value === 0) return false
    return (Date.now() - lastClosedAt.value) < skipDelay.value
  }

  function register (input: Partial<RegistryTicketInput> = {}): RegistryTicket {
    return registry.register(input)
  }

  function unregister (id: ID): void {
    registry.unregister(id)
    lastClosedAt.value = Date.now()
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
  createPluginContext<TooltipOptions & { namespace?: string }, TooltipContext>(
    'v0:tooltip',
    options => createTooltip(options),
  )
