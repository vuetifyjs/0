/**
 * @module usePopover
 *
 * @see https://0.vuetifyjs.com/composables/system/use-popover
 *
 * @remarks
 * Composable for native popover API behavior with CSS anchor positioning.
 * Manages open/close state, anchor styles, content attributes, and
 * bidirectional sync between reactive state and native popover events.
 *
 * Key features:
 * - Native popover API (showPopover/hidePopover)
 * - CSS anchor positioning (position-area, position-try-fallbacks)
 * - Toggle event sync for native state changes
 * - SSR-safe (no DOM ops outside browser)
 * - Optional external isOpen ref for v-model integration
 *
 * Perfect for building select, combobox, tooltip, and menu components
 * without wrapping the Popover compound component.
 */

// Composables
import { useEventListener } from '#v0/composables/useEventListener'
import { useTimer } from '#v0/composables/useTimer'

// Utilities
import { useId } from '#v0/utilities'
import { onMounted, shallowRef, toRef, toValue, watch } from 'vue'

// Types
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
  /** Delay in ms before showing the popover. @default 0 */
  showDelay?: number
  /** Delay in ms before hiding the popover. @default 0 */
  hideDelay?: number
}

export interface PopoverReturn {
  /** Whether the popover is open */
  isOpen: Ref<boolean>
  /** Unique ID for the popover */
  id: string
  /** Open the popover */
  open: () => void
  /** Close the popover */
  close: () => void
  /** Toggle open/close */
  toggle: () => void
  /** Styles to spread on the activator element (anchor-name) */
  anchorStyles: Readonly<Ref<Record<string, string>>>
  /** Attrs to spread on the content element (id, popover) */
  contentAttrs: Readonly<Ref<{ id: string, popover: '' }>>
  /** Styles to spread on the content element (positioning) */
  contentStyles: Readonly<Ref<Record<string, string>>>
  /** Attach to a content element — wires show/hide watch + toggle event sync */
  attach: (el: MaybeRefOrGetter<HTMLElement | null | undefined>) => void
}

export function usePopover (options: PopoverOptions = {}): PopoverReturn {
  const {
    id: _id,
    positionArea = 'bottom',
    positionTry = 'most-width bottom',
    showDelay = 0,
    hideDelay = 0,
  } = options

  const id = _id ?? useId()
  const isOpen = options.isOpen ?? shallowRef(false)

  const showTimer = showDelay > 0
    ? useTimer(() => {
        isOpen.value = true
      }, { duration: showDelay })
    : undefined
  const hideTimer = hideDelay > 0
    ? useTimer(() => {
        isOpen.value = false
      }, { duration: hideDelay })
    : undefined

  function open () {
    hideTimer?.stop()

    if (showTimer) {
      showTimer.start()
    } else {
      isOpen.value = true
    }
  }

  function close () {
    showTimer?.stop()

    if (hideTimer) {
      hideTimer.start()
    } else {
      isOpen.value = false
    }
  }

  function toggle () {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  const anchorStyles = toRef(() => ({
    anchorName: `--${id}`,
  }))

  const contentAttrs = toRef((): { id: string, popover: '' } => ({
    id,
    popover: '',
  }))

  const contentStyles = toRef(() => ({
    'position': 'fixed',
    'margin': 'unset',
    'inset-area': positionArea,
    'position-area': positionArea,
    'position-anchor': `--${id}`,
    'position-try-fallbacks': positionTry,
  }))

  /* v8 ignore start -- browser popover API */
  function attach (el: MaybeRefOrGetter<HTMLElement | null | undefined>) {
    onMounted(() => {
      const element = toValue(el)
      if (isOpen.value) {
        element?.showPopover()
      }
    })

    watch(isOpen, value => {
      const element = toValue(el)
      // Guard against operations on disconnected elements (e.g., during unmount)
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
        // Guard against events firing during unmount
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
    anchorStyles,
    contentAttrs,
    contentStyles,
    attach,
  }
}
