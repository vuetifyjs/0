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
   * By default positions above the target and centered horizontally, flips
   * below when there isn't enough space above.
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

    // Flip below only when there isn't room above but there is below
    const spaceAbove = rect.top - gap
    const spaceBelow = window.innerHeight - rect.bottom - gap
    flipped.value = spaceAbove < maxHeight && spaceBelow > spaceAbove

    position.value = {
      top: flipped.value
        ? rect.bottom + window.scrollY + gap
        : rect.top + window.scrollY,
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
