/**
 * @module usePopoverPosition
 *
 * Viewport-aware positioning for tooltips and dropdowns.
 * Calculates position relative to an anchor element,
 * clamping to viewport edges and flipping when space is limited.
 *
 * SSR-safe, recalculates on scroll/resize.
 */

// Framework
import { clamp, IN_BROWSER, useWindowEventListener } from '@vuetify/v0'

// Utilities
import { readonly, ref, shallowRef, toValue } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface UsePopoverPositionOptions {
  /** The anchor element to position relative to */
  anchor: MaybeRefOrGetter<Element | undefined>

  /** The content element being positioned */
  content: MaybeRefOrGetter<Element | undefined>

  /**
   * Preferred placement relative to anchor
   * @default 'bottom'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right'

  /**
   * Gap between anchor and content in px
   * @default 8
   */
  offset?: number
}

export interface UsePopoverPositionReturn {
  /** Computed CSS position values */
  position: Readonly<Ref<{ top: string, left: string }>>

  /** Whether the placement was flipped due to insufficient space */
  flipped: Readonly<Ref<boolean>>

  /** Manually trigger a recalculation */
  calculate: () => void
}

/**
 * Viewport-aware positioning for floating elements.
 *
 * @example
 * ```ts
 * const anchor = useTemplateRef('anchor')
 * const content = useTemplateRef('content')
 *
 * const { position, flipped } = usePopoverPosition({
 *   anchor,
 *   content,
 *   placement: 'bottom',
 *   offset: 8,
 * })
 * ```
 */
export function usePopoverPosition (options: UsePopoverPositionOptions): UsePopoverPositionReturn {
  const {
    anchor,
    content,
    placement = 'bottom',
    offset = 8,
  } = options

  const position = ref({ top: '0px', left: '0px' })
  const flipped = shallowRef(false)

  function calculate () {
    if (!IN_BROWSER) return

    const anchorEl = toValue(anchor)
    const contentEl = toValue(content)

    if (!anchorEl || !contentEl) return

    const anchorRect = anchorEl.getBoundingClientRect()
    const contentRect = contentEl.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let top: number
    let left: number
    let didFlip = false

    if (placement === 'bottom' || placement === 'top') {
      // Horizontal: center on anchor, clamp to viewport
      left = anchorRect.left + (anchorRect.width - contentRect.width) / 2
      left = clamp(left, 0, viewportWidth - contentRect.width)

      if (placement === 'bottom') {
        const spaceBelow = viewportHeight - anchorRect.bottom - offset
        if (spaceBelow < contentRect.height && anchorRect.top - offset >= contentRect.height) {
          top = anchorRect.top - contentRect.height - offset
          didFlip = true
        } else {
          top = anchorRect.bottom + offset
        }
      } else {
        const spaceAbove = anchorRect.top - offset
        if (spaceAbove < contentRect.height && viewportHeight - anchorRect.bottom - offset >= contentRect.height) {
          top = anchorRect.bottom + offset
          didFlip = true
        } else {
          top = anchorRect.top - contentRect.height - offset
        }
      }
    } else {
      // Vertical: center on anchor, clamp to viewport
      top = anchorRect.top + (anchorRect.height - contentRect.height) / 2
      top = clamp(top, 0, viewportHeight - contentRect.height)

      if (placement === 'right') {
        const spaceRight = viewportWidth - anchorRect.right - offset
        if (spaceRight < contentRect.width && anchorRect.left - offset >= contentRect.width) {
          left = anchorRect.left - contentRect.width - offset
          didFlip = true
        } else {
          left = anchorRect.right + offset
        }
      } else {
        const spaceLeft = anchorRect.left - offset
        if (spaceLeft < contentRect.width && viewportWidth - anchorRect.right - offset >= contentRect.width) {
          left = anchorRect.right + offset
          didFlip = true
        } else {
          left = anchorRect.left - contentRect.width - offset
        }
      }
    }

    // Add scroll offset for absolute positioning
    top += window.scrollY
    left += window.scrollX

    flipped.value = didFlip
    position.value = {
      top: `${top}px`,
      left: `${left}px`,
    }
  }

  useWindowEventListener('scroll', calculate, { passive: true })
  useWindowEventListener('resize', calculate, { passive: true })

  return {
    position: readonly(position),
    flipped: readonly(flipped),
    calculate,
  }
}
