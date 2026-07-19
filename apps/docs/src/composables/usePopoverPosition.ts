// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { ref, shallowRef } from 'vue'

export interface PopoverPositionOptions {
  /** Maximum width of the popover */
  maxWidth?: number
  /** Maximum height of the popover */
  maxHeight?: number
  /** Gap between target and popover */
  gap?: number
  /** Padding from viewport edges */
  padding?: number
}

/**
 * Calculates popover position relative to a target element.
 * Handles viewport clamping and automatic flipping when space is limited.
 */
export function usePopoverPosition (options: PopoverPositionOptions = {}) {
  const {
    maxWidth = 450,
    maxHeight = 400,
    gap = 8,
    padding = 12,
  } = options

  const position = ref({ top: 0, left: 0 })
  const flipped = shallowRef(false)

  /**
   * Calculate position for popover relative to target element.
   * By default positions below the target and centered horizontally, flips
   * above when there isn't enough space below.
   */
  function calculate (target: HTMLElement) {
    if (!IN_BROWSER) return

    const rect = target.getBoundingClientRect()
    const viewportWidth = window.innerWidth

    // Center on the target, then clamp within the viewport
    const min = padding + window.scrollX
    const max = viewportWidth - maxWidth - padding + window.scrollX
    let left = rect.left + rect.width / 2 - maxWidth / 2 + window.scrollX
    left = Math.max(min, Math.min(left, max))

    // Flip above only when there isn't room below but there is above
    const spaceBelow = window.innerHeight - rect.bottom - gap
    const spaceAbove = rect.top - gap
    flipped.value = spaceBelow < maxHeight && spaceAbove > spaceBelow

    position.value = {
      top: flipped.value
        ? rect.top + window.scrollY
        : rect.bottom + window.scrollY + gap,
      left,
    }
  }

  function reset () {
    position.value = { top: 0, left: 0 }
    flipped.value = false
  }

  return {
    position,
    flipped,
    calculate,
    reset,
  }
}
