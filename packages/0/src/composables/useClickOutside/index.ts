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
 *
 * Accessibility: This composable handles pointer interactions only. For accessible
 * components (dialogs, popovers, menus), pair with `useHotkey` for Escape key
 * dismissal per WCAG/APG requirements.
 */

// Composables
import {
  useDocumentEventListener,
  useWindowEventListener,
} from '#v0/composables/useEventListener'

// Utilities
import { isFunction, isNull, isNullOrUndefined, isString } from '#v0/utilities'
import { onScopeDispose, shallowReadonly, shallowRef, toRef, toValue } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { MaybeArray } from '#v0/types'
import type { MaybeRefOrGetter, Ref } from 'vue'

export type ClickOutsideElement = HTMLElement | null | undefined
export type ClickOutsideTarget = MaybeRefOrGetter<ClickOutsideElement>
export type ClickOutsideIgnoreTarget = ClickOutsideTarget | string

export interface UseClickOutsideOptions {
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
   *
   * Note: CSS selectors cannot match across Shadow DOM boundaries due to
   * browser limitations. Use element refs instead when ignoring shadow hosts.
   */
  ignore?: MaybeRefOrGetter<ClickOutsideIgnoreTarget[]>
  /**
   * Use bounding rect instead of DOM containment to detect outside clicks.
   * When true, checks if click coordinates are outside the element's bounding box.
   * Useful for native <dialog> elements where backdrop clicks have the dialog as target.
   * @default false
   */
  bounds?: boolean
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
 *  () => navRef.value?.element,
 *  () => { isOpen.value = false },
 *  { ignore: ['[data-app-bar]'] }
 * )
 * ```
 *
 * @example Native dialog with bounds detection
 * ```ts
 * // For native <dialog> elements, use bounds mode to detect backdrop clicks
 * const dialogRef = useTemplateRef<HTMLDialogElement>('dialog')
 *
 * useClickOutside(
 *   dialogRef,
 *   () => { dialogRef.value?.close() },
 *   { bounds: true }
 * )
 * ```
 */
export function useClickOutside (
  target: MaybeArray<ClickOutsideTarget>,
  handler: (event: PointerEvent | FocusEvent) => void,
  options: UseClickOutsideOptions = {},
): UseClickOutsideReturn {
  const {
    capture = true,
    touchScrollThreshold = 30,
    detectIframe = false,
    ignore = [],
    bounds = false,
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
   */
  function getTargets (): HTMLElement[] {
    const sources = toArray(target)
    return sources
      .map(source => toValue(source))
      .filter((el): el is HTMLElement => !!el && isFunction(el.contains))
  }

  /**
   * Resolve ignore targets to a tuple of [selectors, elements].
   * Called once per event to avoid repeated toValue() calls in hot path.
   */
  function resolveIgnoreTargets (): [string[], Element[]] {
    const ignoreTargets = toValue(ignore)
    if (ignoreTargets.length === 0) return [[], []]

    const selectors: string[] = []
    const elements: Element[] = []

    for (const ignoreTarget of ignoreTargets) {
      if (isString(ignoreTarget)) {
        selectors.push(ignoreTarget)
      } else {
        const ignoreEl = toValue(ignoreTarget)
        if (ignoreEl) elements.push(ignoreEl)
      }
    }

    return [selectors, elements]
  }

  /**
   * Check if an element matches resolved ignore targets.
   */
  function isIgnored (el: Element | null, selectors: string[], elements: Element[]): boolean {
    if (!el) return false /* v8 ignore -- defensive guard */

    for (const selector of selectors) {
      try {
        if (el.matches(selector) || !isNull(el.closest(selector))) return true
      } catch {
        // Invalid selector - silently ignore
      }
    }

    for (const ignoreEl of elements) {
      if (ignoreEl === el || ignoreEl.contains(el)) return true
    }

    return false
  }

  /**
   * Check if any element in the event path should be ignored.
   */
  function shouldIgnore (path: EventTarget[]): boolean {
    const [selectors, elements] = resolveIgnoreTargets()
    if (selectors.length === 0 && elements.length === 0) return false

    return path.some(node => node instanceof Element && isIgnored(node, selectors, elements))
  }

  /**
   * Check if the event target is outside all target elements (DOM containment).
   */
  function isOutside (eventTarget: EventTarget | null): boolean {
    /* v8 ignore start -- defensive guards */
    if (!eventTarget) return false
    if (!(eventTarget instanceof Node)) return false
    /* v8 ignore stop */

    const targets = getTargets()
    if (targets.length === 0) return false

    return targets.every(el => {
      if (isNullOrUndefined(el) || !isFunction(el.contains)) return false
      return el !== eventTarget && !el.contains(eventTarget)
    })
  }

  /**
   * Check if coordinates are outside all target elements' bounding rects.
   */
  function isOutsideBounds (x: number, y: number): boolean {
    const targets = getTargets()
    if (targets.length === 0) return false /* v8 ignore -- edge case: no targets */

    return targets.every(el => {
      const { left, right, top, bottom } = el.getBoundingClientRect()
      return x < left || x > right || y < top || y > bottom
    })
  }

  /**
   * Validate that the target is still in the DOM.
   */
  function isValidTarget (eventTarget: EventTarget | null): eventTarget is Element {
    if (!(eventTarget instanceof Element)) return false /* v8 ignore -- type guard */
    if (!eventTarget.isConnected) return false
    return true
  }

  /* v8 ignore start -- event handlers tested via integration, not unit */
  /**
   * Handle pointerdown - store initial target and position.
   */
  function onPointerDown (event: PointerEvent) {
    if (isPaused.value) return
    if (event.defaultPrevented) return

    initialTarget = event.composedPath()[0] ?? event.target
    startPosition = { x: event.clientX, y: event.clientY }
  }

  /**
   * Handle pointerup - check if it's an outside click.
   */
  function onPointerUp (event: PointerEvent) {
    if (isPaused.value) return
    if (event.defaultPrevented) return
    if (!initialTarget) return

    const pointerdownTarget = initialTarget
    initialTarget = null

    if (!isValidTarget(pointerdownTarget)) return

    const path = event.composedPath()
    const pointerupTarget = path[0] ?? event.target

    if (event.pointerType === 'touch') {
      const dx = Math.abs(event.clientX - startPosition.x)
      const dy = Math.abs(event.clientY - startPosition.y)
      if (dx >= touchScrollThreshold || dy >= touchScrollThreshold) return
    }

    const clickIsOutside = bounds
      ? isOutsideBounds(startPosition.x, startPosition.y) && isOutsideBounds(event.clientX, event.clientY)
      : isOutside(pointerdownTarget) && isOutside(pointerupTarget)

    if (clickIsOutside && !shouldIgnore(path)) {
      handler(event)
    }
  }

  /**
   * Handle window blur - detect focus moving to iframe.
   */
  function onBlur (event: FocusEvent) {
    if (isPaused.value) return
    if (event.defaultPrevented) return

    if (document.activeElement instanceof HTMLIFrameElement) {
      const iframeIsOutside = getTargets().every(el => !el.contains(document.activeElement))
      const [selectors, elements] = resolveIgnoreTargets()

      if (iframeIsOutside && !isIgnored(document.activeElement, selectors, elements)) {
        handler(event)
      }
    }
  }
  /* v8 ignore stop */

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
    if (isPaused.value) return
    isPaused.value = true
    initialTarget = null
    cleanup()
  }

  function resume () {
    if (!isPaused.value) return
    isPaused.value = false
    setup()
  }

  function stop () {
    isPaused.value = true
    initialTarget = null
    cleanup()
  }

  setup()

  onScopeDispose(stop, true)

  return {
    isActive: shallowReadonly(isActive),
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}
