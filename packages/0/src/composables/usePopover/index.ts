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
import { V0PopoverAdapter, derivePlacement } from '#v0/composables/usePopover/adapters'

// Utilities
import { useId } from '#v0/utilities'
import { onMounted, onScopeDispose, shallowRef, toRef, toValue, watch } from 'vue'

// Exports
export { derivePlacement, PopoverAdapter, V0PopoverAdapter } from '#v0/composables/usePopover/adapters'
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
   * bring your own engine (floating-ui, Popper, etc.) — v0 ships none.
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
  attachAnchor: (el: MaybeRefOrGetter<HTMLElement | null | undefined>) => void
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

  const anchorEl = shallowRef<HTMLElement | null | undefined>()
  const contentEl = shallowRef<HTMLElement | null | undefined>()
  const placement = toRef(() => derivePlacement(positionArea))

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

  function attachAnchor (el: MaybeRefOrGetter<HTMLElement | null | undefined>) {
    watch(() => toValue(el), value => {
      anchorEl.value = value
    }, { immediate: true })
  }

  function attach (el: MaybeRefOrGetter<HTMLElement | null | undefined>) {
    watch(() => toValue(el), value => {
      contentEl.value = value
    }, { immediate: true })

    attachContentEvents(el)
  }

  /* v8 ignore start -- browser popover API */
  function attachContentEvents (el: MaybeRefOrGetter<HTMLElement | null | undefined>) {
    onMounted(() => {
      const element = toValue(el)
      if (isOpen.value) {
        element?.showPopover?.()
      }
    })

    watch(isOpen, value => {
      const element = toValue(el)
      if (!element?.isConnected) return
      if (value === element.matches?.(':popover-open')) return

      if (value) {
        element.showPopover?.()
      } else {
        element.hidePopover?.()
      }
    })

    useEventListener<ToggleEvent>(
      el,
      'toggle',
      (e: ToggleEvent) => {
        const element = toValue(el)
        if (!element?.isConnected) return
        isOpen.value = e.newState === 'open'
      },
    )
  }
  /* v8 ignore stop */

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
