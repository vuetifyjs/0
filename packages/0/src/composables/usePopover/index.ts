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
 */

// Composables
import { useDelay } from '#v0/composables/useDelay'
import { useEventListener } from '#v0/composables/useEventListener'

// Adapters
import { V0PopoverAdapter, toPlacement } from '#v0/composables/usePopover/adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isNullOrUndefined, useId } from '#v0/utilities'
import { onScopeDispose, shallowRef, toRef, toValue, watch } from 'vue'

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
  positionArea?: string
  /** CSS position-try-fallbacks value @default 'most-width bottom' */
  positionTry?: string
  /** External ref for bidirectional open state (e.g., from defineModel) */
  isOpen?: Ref<boolean>
  /** Delay in ms before opening the popover. @default 0 */
  openDelay?: MaybeRefOrGetter<number>
  /** Delay in ms before closing the popover. @default 0 */
  closeDelay?: MaybeRefOrGetter<number>
  /**
   * Positioning engine. @default `new V0PopoverAdapter()` — CSS anchor
   * positioning, zero runtime dependency. Pass a custom `PopoverAdapter` to
   * bring your own engine (floating-ui, Popper, etc.).
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
  /** Styles to spread on the content element — adapter-owned positioning */
  contentStyles: Readonly<Ref<Record<string, string>>>
  /** Attach to a content element — wires show/hide watch + toggle event sync */
  attach: (el: MaybeRefOrGetter<HTMLElement | null | undefined>) => void
  /** Register the activator/reference element with the positioning adapter */
  attachAnchor: (el: MaybeRefOrGetter<Element | null | undefined>) => void
}

export function usePopover (options: PopoverOptions = {}): PopoverReturn {
  const {
    id: _id,
    positionArea = 'bottom',
    positionTry = 'most-width bottom',
    openDelay,
    closeDelay,
    adapter = new V0PopoverAdapter(),
  } = options

  const id = _id ?? useId()
  const anchor = `--${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}`
  const isOpen = options.isOpen ?? shallowRef(false)

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
  const placement = toRef(() => toPlacement(positionArea))

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
    attach,
    attachAnchor,
  }
}
