/**
 * @module useResizeObserver
 *
 * @see https://0.vuetifyjs.com/composables/system/use-resize-observer
 *
 * @remarks
 * ResizeObserver composable with lifecycle management.
 *
 * Key features:
 * - ResizeObserver API wrapper
 * - `isActive` reactive flag
 * - `once` option for single-fire observation
 * - Pause/resume/stop functionality
 * - Automatic cleanup on unmount
 * - SSR-safe (checks SUPPORTS_OBSERVER)
 * - Hydration-aware
 * - Box model options (content-box/border-box)
 * - Reports `borderBoxSize` and `contentBoxSize` alongside `contentRect`
 *
 * Perfect for responsive components and size-based rendering.
 *
 * @example
 * ```ts
 * import { useTemplateRef } from 'vue'
 * import { useResizeObserver } from '@vuetify/v0'
 *
 * const target = useTemplateRef('target')
 * useResizeObserver(target, entries => {
 *   console.log(entries[0].contentRect.width)
 * })
 * ```
 */

// Composables
import { createObserver } from '#v0/composables/createObserver'

// Globals
import { SUPPORTS_OBSERVER } from '#v0/constants/globals'

// Utilities
import { isString, pxToNumber } from '#v0/utilities'
import { shallowReadonly, shallowRef } from 'vue'

// Types
import type { ObserverReturn } from '#v0/composables/createObserver'
import type { MaybeElementRef } from '#v0/composables/toElement'
import type { Ref } from 'vue'

/**
 * A reported size change for an observed element.
 *
 * `contentRect` always describes the content box, regardless of the `box`
 * option. Read `borderBoxSize` when padding and borders should be included —
 * both arrays are populated on every entry, so `box` selects which box model
 * triggers a callback, not which measurements are available.
 *
 * @example
 * ```ts
 * useResizeObserver(el, ([entry]) => {
 *   entry.contentRect.height        // content box, excludes padding + border
 *   entry.contentBoxSize[0].blockSize   // same value, writing-mode relative
 *   entry.borderBoxSize[0].blockSize    // includes padding + border
 * }, { box: 'border-box' })
 * ```
 */
export interface ResizeObserverEntry {
  contentRect: {
    width: number
    height: number
    top: number
    left: number
  }
  /**
   * The element's border box — content plus padding plus border — in
   * writing-mode-relative `inlineSize` / `blockSize` terms.
   *
   * Unlike `getBoundingClientRect()`, this is a layout measurement and is not
   * scaled by CSS transforms. The array mirrors the native API: one entry per
   * box fragment, so single-fragment elements report `borderBoxSize[0]`.
   */
  borderBoxSize: readonly ResizeObserverSize[]
  /**
   * The element's content box — excluding padding and border — in
   * writing-mode-relative `inlineSize` / `blockSize` terms.
   *
   * Carries the same measurement as `contentRect`, expressed on the logical
   * axes. The array mirrors the native API: one entry per box fragment.
   */
  contentBoxSize: readonly ResizeObserverSize[]
  target: Element
}

export interface ResizeObserverOptions {
  immediate?: boolean
  once?: boolean
  box?: 'content-box' | 'border-box'
}

export interface UseResizeObserverReturn extends ObserverReturn {}

/**
 * Synthesize the entry the observer would report for `el`, for the `immediate`
 * callback that fires before the observer's own first delivery.
 *
 * The box sizes come from `getComputedStyle` rather than
 * `getBoundingClientRect` because resolved lengths are layout values — like the
 * observer, and unlike a client rect, they are not scaled by CSS transforms.
 * `contentRect` keeps its existing client-rect source so callers reading it see
 * no change.
 *
 * Every read is written to tolerate a partial style declaration: an element
 * with no layout box resolves its lengths to `''`, and this runs on whatever
 * `getComputedStyle` returns.
 */
/* #__NO_SIDE_EFFECTS__ */
function measure (el: Element): ResizeObserverEntry {
  const rect = el.getBoundingClientRect()
  const style = getComputedStyle(el)

  const paddingX = pxToNumber(style.paddingLeft) + pxToNumber(style.paddingRight)
  const paddingY = pxToNumber(style.paddingTop) + pxToNumber(style.paddingBottom)
  const borderX = pxToNumber(style.borderLeftWidth) + pxToNumber(style.borderRightWidth)
  const borderY = pxToNumber(style.borderTopWidth) + pxToNumber(style.borderBottomWidth)

  // Resolved width/height follow `box-sizing` — they describe the border box
  // under `border-box` and the content box otherwise — so which box needs the
  // padding and border added depends on which one they already measured.
  const outer = style.boxSizing === 'border-box'
  const resolvedX = pxToNumber(style.width, rect.width)
  const resolvedY = pxToNumber(style.height, rect.height)

  const width = {
    border: outer ? resolvedX : resolvedX + paddingX + borderX,
    content: Math.max(0, outer ? resolvedX - paddingX - borderX : resolvedX),
  }
  const height = {
    border: outer ? resolvedY : resolvedY + paddingY + borderY,
    content: Math.max(0, outer ? resolvedY - paddingY - borderY : resolvedY),
  }

  // Logical axes swap under any vertical writing mode, matching how the
  // observer maps inlineSize/blockSize onto the physical box.
  const vertical = isString(style.writingMode) && style.writingMode.startsWith('vertical')
  const inline = vertical ? height : width
  const block = vertical ? width : height

  return {
    contentRect: {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
    },
    borderBoxSize: [{ inlineSize: inline.border, blockSize: block.border }],
    contentBoxSize: [{ inlineSize: inline.content, blockSize: block.content }],
    target: el,
  }
}

/**
 * A composable that uses the Resize Observer API to detect when an element's
 * size changes.
 *
 * @param target The element to observe.
 * @param callback The callback to execute when the element's size changes.
 * @param options The options for the Resize Observer.
 * @returns An object with methods to control the observer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 * @see https://0.vuetifyjs.com/composables/system/use-resize-observer
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useResizeObserver } from '@vuetify/v0'
 *
 * const el = ref<HTMLElement>()
 * const width = ref(0)
 * const height = ref(0)
 *
 * const { pause, resume, isPaused } = useResizeObserver(
 *   el,
 *   (entries) => {
 *     const entry = entries[0]
 *     if (entry) {
 *       width.value = entry.contentRect.width
 *       height.value = entry.contentRect.height
 *       console.log('Size changed:', width.value, 'x', height.value)
 *     }
 *   },
 *   { immediate: true }
 * )
 *
 * // Pause observation
 * pause()
 *
 * // Resume observation
 * resume()
 * ```
 *
 * @example
 * Measuring the border box — padding and borders included:
 *
 * ```ts
 * useResizeObserver(el, ([entry]) => {
 *   height.value = entry.borderBoxSize[0].blockSize
 * }, { box: 'border-box' })
 * ```
 */
export function useResizeObserver (
  target: MaybeElementRef,
  callback: (entries: ResizeObserverEntry[]) => void,
  options: ResizeObserverOptions = {},
): UseResizeObserverReturn {
  return createObserver(target, callback, {
    supports: SUPPORTS_OBSERVER,
    once: options.once,
    create: cb => new ResizeObserver(entries => {
      cb(entries.map(e => ({
        contentRect: {
          width: e.contentRect.width,
          height: e.contentRect.height,
          top: e.contentRect.top,
          left: e.contentRect.left,
        },
        borderBoxSize: e.borderBoxSize,
        contentBoxSize: e.contentBoxSize,
        target: e.target,
      })))
    }),
    observe: (obs, el) => obs.observe(el, { box: options.box ?? 'content-box' }),
    immediate: options.immediate ? el => [measure(el)] : undefined,
  })
}

export interface UseElementSizeReturn extends UseResizeObserverReturn {
  /**
   * The width of the element in pixels
   */
  readonly width: Readonly<Ref<number>>

  /**
   * The height of the element in pixels
   */
  readonly height: Readonly<Ref<number>>
}

/**
 * A convenience composable that uses the Resize Observer API to track an
 * element's size.
 *
 * @param target The element to observe.
 * @returns An object with the element's width and height.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-resize-observer
 *
 * @example
 * ```ts
 * import { ref, watchEffect } from 'vue'
 * import { useElementSize } from '@vuetify/v0'
 *
 * const box = ref<HTMLElement>()
 * const { width, height } = useElementSize(box)
 *
 * // Width and height are reactive refs
 * watchEffect(() => {
 *   console.log('Box size:', width.value, 'x', height.value)
 * })
 * ```
 */
export function useElementSize (target: MaybeElementRef): UseElementSizeReturn {
  const width = shallowRef(0)
  const height = shallowRef(0)

  const { pause: _pause, resume, stop, isActive, isPaused } = useResizeObserver(
    target,
    entries => {
      const entry = entries[0]
      /* v8 ignore next 4 -- defensive: ResizeObserver always passes an entry array with at least one entry */
      if (entry) {
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
      }
    },
    { immediate: true },
  )

  function pause () {
    width.value = 0
    height.value = 0
    _pause()
  }

  return {
    width: shallowReadonly(width),
    height: shallowReadonly(height),
    isActive: shallowReadonly(isActive),
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}
