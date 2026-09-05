/**
 * @module usePopover
 *
 * @see https://0.vuetifyjs.com/composables/system/use-popover
 *
 * @remarks
 * Composable for native popover API behavior with CSS anchor positioning.
 * Manages open/close state, anchor styles, content attributes, bidirectional
 * sync between reactive state and native popover events, and configurable
 * open / close delays via `useDelay`.
 *
 * Key features:
 * - Native popover API (showPopover/hidePopover)
 * - CSS anchor positioning (position-area, position-try-fallbacks) by default,
 *   via a pluggable `PopoverAdapter` seam for JS positioning engines
 * - Reactive open/close delays via `useDelay`
 * - Toggle event sync for native state changes
 * - SSR-safe (no DOM ops outside browser)
 * - Optional external isOpen ref for v-model integration
 *
 * @example
 * ```ts
 * import { usePopover } from '@vuetify/v0'
 *
 * const popover = usePopover({ openDelay: 200, closeDelay: 100 })
 * popover.open()
 * popover.toggle()
 * ```
 *
 * @example Bring your own positioning engine
 * ```ts
 * import { PopoverAdapter, usePopover } from '@vuetify/v0'
 *
 * class MyAdapter extends PopoverAdapter {
 *   setup (context) {
 *     // read context.anchorEl / context.contentEl / context.isOpen /
 *     // context.placement, return a Ref<Record<string, string>> of styles
 *   }
 * }
 *
 * const popover = usePopover({ adapter: new MyAdapter() })
 * ```
 *
 * @example App-wide adapter via createPopoverPlugin
 * ```ts
 * import { createPopoverPlugin } from '@vuetify/v0'
 * import { FloatingUIPopoverAdapter } from '@vuetify/v0/popover/adapters/floating-ui'
 *
 * app.use(createPopoverPlugin({ adapter: new FloatingUIPopoverAdapter() }))
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { useDelay } from '#v0/composables/useDelay'
import { useEventListener } from '#v0/composables/useEventListener'

// Adapters
import { V0PopoverAdapter, toPlacement } from '#v0/composables/usePopover/adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isNullOrUndefined, useId } from '#v0/utilities'
import { computed, onScopeDispose, shallowRef, toRef, toValue, watch } from 'vue'

// Exports
export { PopoverAdapter, toPlacement, V0PopoverAdapter } from '#v0/composables/usePopover/adapters'
export type {
  PopoverAdapterContext,
  PopoverAlign,
  PopoverPlacement,
  PopoverSide,
} from '#v0/composables/usePopover/adapters'

// Types
import type { PopoverAdapter } from '#v0/composables/usePopover/adapters'
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface PopoverOptions {
  /** Auto-generated if not provided */
  id?: string
  /** CSS position-area value @default 'bottom' */
  positionArea?: MaybeRefOrGetter<string | undefined>
  /** CSS position-try-fallbacks value @default 'most-width bottom' */
  positionTry?: MaybeRefOrGetter<string | undefined>
  /** External ref for bidirectional open state (e.g., from defineModel) */
  isOpen?: Ref<boolean>
  /** Delay in ms before opening the popover. @default 0 */
  openDelay?: MaybeRefOrGetter<number>
  /** Delay in ms before closing the popover. @default 0 */
  closeDelay?: MaybeRefOrGetter<number>
  /**
   * Positioning engine. Resolution: per-instance `adapter`, then the
   * `createPopoverPlugin` adapter, then `new V0PopoverAdapter()` (CSS
   * anchor positioning, zero runtime dependency).
   */
  adapter?: PopoverAdapter
}

export interface PopoverReturn {
  /** Whether the popover is open */
  isOpen: Ref<boolean>
  /** Unique ID for the popover */
  id: string
  /** Open the popover (respects openDelay) */
  open: () => void
  /** Close the popover (respects closeDelay) */
  close: () => void
  /** Toggle open/close */
  toggle: () => void
  /** Cancel any pending open or close transition */
  cancel: () => void
  /** Styles to spread on the activator element (anchor-name) */
  anchorStyles: Readonly<Ref<Record<string, string>>>
  /** Attrs to spread on the content element (id, popover) */
  contentAttrs: Readonly<Ref<{ id: string, popover: '' }>>
  /**
   * Styles to spread on the content element. Owned by the active adapter —
   * CSS anchor declarations from `V0PopoverAdapter`, or whatever a custom
   * engine (e.g. Floating UI) returns. Not inherently CSS-anchor styles.
   */
  contentStyles: Readonly<Ref<Record<string, string>>>
  /** Placement intent. Writable so Content can override Root. @default `'bottom'` */
  positionArea: Ref<string>
  /** Fallback positioning. Writable so Content can override Root. @default `'most-width bottom'` */
  positionTry: Ref<string>
  /** Attach to a content element — wires show/hide watch + toggle event sync */
  attach: (el: MaybeRefOrGetter<HTMLElement | null | undefined>) => void
  /** Register the activator/reference element with the positioning adapter */
  attachAnchor: (el: MaybeRefOrGetter<Element | null | undefined>) => void
}

export interface PopoverPluginContext {
  /**
   * App-wide positioning adapter. `undefined` means each `usePopover()`
   * call falls through to `V0PopoverAdapter`.
   *
   * @example
   * ```ts
   * import { createPopoverPlugin } from '@vuetify/v0'
   * import { FloatingUIPopoverAdapter } from '@vuetify/v0/popover/adapters/floating-ui'
   *
   * app.use(createPopoverPlugin({ adapter: new FloatingUIPopoverAdapter() }))
   * ```
   */
  adapter: PopoverAdapter | undefined
}

export interface PopoverPluginContextOptions {
  /** Positioning engine used when a per-instance `adapter` is not passed. */
  adapter?: PopoverAdapter
  namespace?: string
}

export interface PopoverPluginOptions extends PopoverPluginContextOptions {}

function createPopover (options: Omit<PopoverPluginOptions, 'namespace' | 'persist'> = {}): PopoverPluginContext {
  return { adapter: options.adapter }
}

/**
 * Synthesized fallback used when `usePopover()` is called without
 * `app.use(createPopoverPlugin())`. Returns `{ adapter: undefined }` so
 * resolution falls through to `V0PopoverAdapter`.
 *
 * @example
 * ```ts
 * import { createPopoverFallback } from '@vuetify/v0'
 *
 * const plugin = createPopoverFallback()
 * plugin.adapter // undefined
 * ```
 */
export function createPopoverFallback (): PopoverPluginContext {
  return { adapter: undefined }
}

/**
 * Creates a scoped popover plugin context (the first member of the plugin trinity).
 *
 * @example
 * ```ts
 * import { createPopoverContext } from '@vuetify/v0'
 * import { FloatingUIPopoverAdapter } from '@vuetify/v0/popover/adapters/floating-ui'
 *
 * export const [useAppPopover, provideAppPopover, appPopover] = createPopoverContext({
 *   namespace: 'app:popover',
 *   adapter: new FloatingUIPopoverAdapter(),
 * })
 * ```
 *
 * Plugin trinity for an app-wide popover positioning adapter.
 *
 * Namespace is `v0:popover`. Compound `Popover.Root` context lives at
 * `v0:popover:root` so the two do not collide. The generated consumer is
 * module-private; `usePopover()` consults it internally. Fallback is
 * `{ adapter: undefined }`, so zero-config matches today's `V0PopoverAdapter`
 * default.
 *
 * @example
 * ```ts
 * import { createPopoverPlugin } from '@vuetify/v0'
 * import { FloatingUIPopoverAdapter } from '@vuetify/v0/popover/adapters/floating-ui'
 *
 * app.use(createPopoverPlugin({ adapter: new FloatingUIPopoverAdapter() }))
 * ```
 */
const [createPopoverContext, createPopoverPlugin, usePopoverPlugin] =
  createPluginContext<PopoverPluginOptions, PopoverPluginContext>(
    'v0:popover',
    createPopover,
    {
      fallback: () => createPopoverFallback(),
    },
  )

export { createPopoverContext, createPopoverPlugin }

function bindOption (source: MaybeRefOrGetter<string | undefined> | undefined, fallback: string): Ref<string> {
  const override = shallowRef<string>()

  return computed({
    get: () => override.value ?? toValue(source) ?? fallback,
    set: value => {
      override.value = value
    },
  })
}

export function usePopover (options: PopoverOptions = {}): PopoverReturn {
  const plugin = usePopoverPlugin()
  const {
    id: _id,
    openDelay,
    closeDelay,
  } = options

  const adapter = options.adapter ?? plugin.adapter ?? new V0PopoverAdapter()

  const id = _id ?? useId()
  const anchor = `--${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}`
  const isOpen = options.isOpen ?? shallowRef(false)
  const positionArea = bindOption(options.positionArea, 'bottom')
  const positionTry = bindOption(options.positionTry, 'most-width bottom')

  const delay = useDelay(direction => {
    isOpen.value = direction
  }, { openDelay, closeDelay })

  function open () {
    delay.start(true)
  }

  function close () {
    delay.start(false)
  }

  function toggle () {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  function cancel () {
    delay.stop()
  }

  const anchorStyles = toRef(() => ({
    anchorName: anchor,
  }))

  const contentAttrs = toRef((): { id: string, popover: '' } => ({
    id,
    popover: '',
  }))

  const anchorEl = shallowRef<Element | null | undefined>()
  const contentEl = shallowRef<HTMLElement | null | undefined>()
  const placement = toRef(() => toPlacement(positionArea.value))

  const contentStyles = adapter.setup({
    anchorName: anchor,
    anchorEl,
    contentEl,
    isOpen,
    placement,
    positionTry,
  })

  // failSilently: usePopover() is regularly called outside an active effect
  // scope (e.g. directly in tests), which would otherwise warn.
  onScopeDispose(() => adapter.dispose?.(), true)

  // Last attachment wins: re-attaching stops the previous watchers first, and
  // scope-dispose cleanup only resets state it still owns, so a stale scope
  // disposing after a re-attach cannot clobber the live attachment.
  let stopAnchor: (() => void) | undefined
  let stopContent: (() => void) | undefined

  function attachAnchor (el: MaybeRefOrGetter<Element | null | undefined>) {
    stopAnchor?.()

    const handle = watch(() => toValue(el), value => {
      anchorEl.value = value
    }, { immediate: true })

    function stop () {
      handle()

      if (stopAnchor !== stop) return

      stopAnchor = undefined
      anchorEl.value = null
    }

    stopAnchor = stop

    onScopeDispose(stop, true)
  }

  function attach (el: MaybeRefOrGetter<HTMLElement | null | undefined>) {
    stopContent?.()

    const handle = watch(() => toValue(el), value => {
      contentEl.value = value
    }, { immediate: true })

    const events = attachContentEvents(el)

    function stop () {
      handle()
      events()

      if (stopContent !== stop) return

      stopContent = undefined
      contentEl.value = null
    }

    stopContent = stop

    onScopeDispose(stop, true)
  }

  function attachContentEvents (el: MaybeRefOrGetter<HTMLElement | null | undefined>) {
    let current: HTMLElement | undefined

    function hide (element?: HTMLElement | null) {
      if (!IN_BROWSER || isNullOrUndefined(element)) return

      try {
        if (element.matches?.(':popover-open') === false) return
        element.hidePopover?.()
      } catch {
        // hidePopover throws if the node is not a popover or is already hidden
      }
    }

    function sync () {
      if (!IN_BROWSER) return

      const element = toValue(el)

      if (!isNullOrUndefined(current) && current !== element) {
        hide(current)
      }

      current = isNullOrUndefined(element) ? undefined : element

      if (isNullOrUndefined(element)) return

      if (!isOpen.value) {
        hide(element)
        return
      }

      if (!element.isConnected) return
      if (element.matches?.(':popover-open')) return

      element.showPopover?.()
    }

    const handle = watch([isOpen, () => toValue(el)], sync, { immediate: true, flush: 'post' })

    const listener = useEventListener<ToggleEvent>(
      el,
      'toggle',
      (e: ToggleEvent) => {
        const element = toValue(el)
        if (!element?.isConnected) return
        isOpen.value = e.newState === 'open'
      },
    )

    function stop () {
      handle()
      listener()
      hide(toValue(el) ?? current)
    }

    return stop
  }

  return {
    isOpen,
    id,
    open,
    close,
    toggle,
    cancel,
    anchorStyles,
    contentAttrs,
    contentStyles,
    positionArea,
    positionTry,
    attach,
    attachAnchor,
  }
}
