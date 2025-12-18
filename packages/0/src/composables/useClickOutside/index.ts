/**
 * @module useClickOutside
 *
 * @remarks
 * Detects clicks outside of specified element(s) with automatic cleanup.
 *
 * Key features:
 * - Two-phase detection (pointerdown → pointerup) prevents drag-out false positives
 * - Touch scroll threshold ignores swipes/scrolls on mobile
 * - Capture phase listeners work with stopPropagation
 * - Pause/resume/stop functionality
 * - Optional iframe focus detection
 * - SSR-safe (no-op when not in browser)
 *
 * Common use cases: closing popovers, dropdowns, modals, and menus.
 */

// Composables
import {
  useDocumentEventListener,
  useWindowEventListener,
} from '#v0/composables/useEventListener'

// Utilities
import { isRef, shallowReadonly, shallowRef, toRef, toValue } from 'vue'
import { isNull, isString } from '#v0/utilities'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export type ClickOutsideElement = HTMLElement | Ref<HTMLElement | null | undefined> | null | undefined
export type ClickOutsideTarget = MaybeRefOrGetter<ClickOutsideElement>
export type ClickOutsideIgnoreTarget = ClickOutsideTarget | string

export interface UseClickOutsideOptions {
  /**
   * Whether the listener is active.
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * Use capture phase for event listeners.
   * Ensures detection works even when inner elements call stopPropagation.
   * @default true
   */
  capture?: boolean
  /**
   * Touch movement threshold in pixels.
   * If finger moves more than this distance, it's treated as a scroll, not a tap.
   * Only applies to touch interactions.
   * @default 30
   */
  touchScrollThreshold?: number
  /**
   * Detect focus moving to iframes as an outside click.
   * Useful when iframes are outside the target elements.
   * @default false
   */
  detectIframe?: boolean
  /**
   * Elements to ignore when detecting outside clicks.
   * Accepts element refs, getters, or CSS selector strings.
   * Clicks on these elements (or their descendants) won't trigger the handler.
   */
  ignore?: MaybeRefOrGetter<ClickOutsideIgnoreTarget[]>
}

export interface UseClickOutsideReturn {
  /**
   * Whether the listener is currently active
   */
  readonly isActive: Readonly<Ref<boolean>>
  /**
   * Whether the listener is currently paused
   */
  readonly isPaused: Readonly<Ref<boolean>>
  /**
   * Pause listening (stops detection but keeps state)
   */
  pause: () => void
  /**
   * Resume listening
   */
  resume: () => void
  /**
   * Stop listening and clean up
   */
  stop: () => void
}

/**
 * Detects clicks outside of the specified element(s).
 *
 * Uses two-phase detection (pointerdown → pointerup) to prevent false positives
 * when users drag from inside to outside an element.
 *
 * @param target Element ref(s) to detect clicks outside of. Accepts a single ref/getter or array of refs/getters.
 * @param handler Callback invoked when a click outside is detected.
 * @param options Configuration options.
 * @returns An object with methods to control the listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-click-outside
 *
 * @example Native element ref
 * ```ts
 * const menuRef = useTemplateRef<HTMLElement>('menu')
 *
 * useClickOutside(menuRef, () => { isOpen.value = false })
 * ```
 *
 * @example Component ref (e.g., Atom)
 * ```ts
 * const atomRef = useTemplateRef<AtomExpose>('atom')
 *
 * // Pass the exposed element TemplateRef via getter
 * useClickOutside(
 *   () => atomRef.value?.element,
 *   () => { isOpen.value = false }
 * )
 * ```
 *
 * @example Multiple targets
 * ```ts
 * const popoverRef = useTemplateRef<AtomExpose>('popover')
 * const anchorRef = useTemplateRef<HTMLElement>('anchor')
 *
 * useClickOutside(
 *   [() => popoverRef.value?.element, anchorRef],
 *   () => { isOpen.value = false }
 * )
 * ```
 *
 * @example Ignoring elements (CSS selectors or refs)
 * ```ts
 * useClickOutside(
 *   () => navRef.value?.element,
 *   () => { isOpen.value = false },
 *   { ignore: ['[data-app-bar]', '.toast-container'] }
 * )
 * ```
 */
export function useClickOutside (
  target: ClickOutsideTarget | readonly ClickOutsideTarget[],
  handler: (event: Event) => void,
  options: UseClickOutsideOptions = {},
): UseClickOutsideReturn {
  const {
    enabled = true,
    capture = true,
    touchScrollThreshold = 30,
    detectIframe = false,
    ignore = [],
  } = options

  const isPaused = shallowRef(false)
  const isActive = toRef(() => !isPaused.value)

  let initialTarget: EventTarget | null = null
  let startPosition = { x: 0, y: 0 }
  let cleanupPointerDown: (() => void) | undefined
  let cleanupPointerUp: (() => void) | undefined
  let cleanupBlur: (() => void) | undefined

  /**
   * Resolve target(s) to an array of HTMLElements.
   * Handles nested refs (e.g., getter returning a TemplateRef).
   */
  function getTargets (): HTMLElement[] {
    const sources = Array.isArray(target) ? target : [target]
    return sources
      .map(source => {
        const value = toValue(source)
        // Handle getters that return refs (e.g., () => atom.value?.element)
        return isRef(value) ? value.value : value
      })
      .filter((el): el is HTMLElement => el != null)
  }

  /**
   * Check if the event should be ignored based on ignore list.
   */
  function shouldIgnore (event: PointerEvent | FocusEvent): boolean {
    const ignoreTargets = toValue(ignore)
    if (ignoreTargets.length === 0) return false

    const path = 'composedPath' in event ? event.composedPath() : []

    return ignoreTargets.some(ignoreTarget => {
      if (isString(ignoreTarget)) {
        // CSS selector
        return Array.from(document.querySelectorAll(ignoreTarget)).some(el => {
          return el === event.target || path.includes(el)
        })
      }
      // Element ref or getter
      const value = toValue(ignoreTarget)
      const el = isRef(value) ? value.value : value
      return el && (el === event.target || path.includes(el))
    })
  }

  /**
   * Check if the event target is outside all target elements.
   */
  function isOutside (eventTarget: EventTarget | null): boolean {
    if (!eventTarget) return false
    if (!(eventTarget instanceof Node)) return false

    const targets = getTargets()
    if (targets.length === 0) return false

    return targets.every(el => {
      return el !== eventTarget && !el.contains(eventTarget)
    })
  }

  /**
   * Validate that the target is still in the DOM.
   */
  function isValidTarget (eventTarget: EventTarget | null): eventTarget is Element {
    if (!(eventTarget instanceof Element)) return false
    if (!eventTarget.isConnected) return false
    if (!eventTarget.getRootNode().contains(eventTarget)) return false
    return true
  }

  /**
   * Handle pointerdown - store initial target and position.
   */
  function onPointerDown (event: PointerEvent) {
    if (isPaused.value) return
    if (!toValue(enabled)) return
    if (event.defaultPrevented) return

    initialTarget = event.composedPath()[0] ?? event.target
    startPosition = { x: event.clientX, y: event.clientY }
  }

  /**
   * Handle pointerup - check if it's an outside click.
   */
  function onPointerUp (event: PointerEvent) {
    if (isPaused.value) return
    if (!toValue(enabled)) return
    if (event.defaultPrevented) return
    if (!initialTarget) return

    const pointerdownTarget = initialTarget
    initialTarget = null

    if (!isValidTarget(pointerdownTarget)) return

    const pointerupTarget = event.composedPath()[0] ?? event.target

    if (event.pointerType === 'touch') {
      const dx = Math.abs(event.clientX - startPosition.x)
      const dy = Math.abs(event.clientY - startPosition.y)
      if (dx >= touchScrollThreshold || dy >= touchScrollThreshold) return
    }

    if (isOutside(pointerdownTarget) && isOutside(pointerupTarget) && !shouldIgnore(event)) {
      handler(event)
    }
  }

  /**
   * Check if an element is in the ignore list.
   */
  function isIgnored (el: Element | null): boolean {
    if (!el) return false

    const ignoreTargets = toValue(ignore)
    if (ignoreTargets.length === 0) return false

    return ignoreTargets.some(ignoreTarget => {
      if (isString(ignoreTarget)) {
        return el.matches(ignoreTarget) || !isNull(el.closest(ignoreTarget))
      }
      const value = toValue(ignoreTarget)
      const ignoreEl = isRef(value) ? value.value : value
      return ignoreEl && (ignoreEl === el || ignoreEl.contains(el))
    })
  }

  /**
   * Handle window blur - detect focus moving to iframe.
   */
  function onBlur (event: FocusEvent) {
    if (isPaused.value) return
    if (!toValue(enabled)) return
    if (event.defaultPrevented) return

    if (document.activeElement instanceof HTMLIFrameElement) {
      const iframeIsOutside = getTargets().every(el => !el.contains(document.activeElement))

      if (iframeIsOutside && !isIgnored(document.activeElement)) {
        handler(event)
      }
    }
  }

  function setup () {
    cleanupPointerDown = useDocumentEventListener('pointerdown', onPointerDown, capture)
    cleanupPointerUp = useDocumentEventListener('pointerup', onPointerUp, capture)

    if (!detectIframe) return

    cleanupBlur = useWindowEventListener('blur', onBlur, capture)
  }

  function cleanup () {
    cleanupPointerDown?.()
    cleanupPointerUp?.()
    cleanupBlur?.()
    cleanupPointerDown = undefined
    cleanupPointerUp = undefined
    cleanupBlur = undefined
  }

  function pause () {
    isPaused.value = true
    initialTarget = null
    cleanup()
  }

  function resume () {
    isPaused.value = false
    setup()
  }

  function stop () {
    cleanup()
  }

  setup()

  return {
    isActive: shallowReadonly(isActive),
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}
