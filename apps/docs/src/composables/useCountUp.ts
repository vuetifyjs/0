// Framework
import { IN_BROWSER, useIntersectionObserver } from '@vuetify/v0'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { Ref } from 'vue'

export interface UseCountUpOptions {
  /** Animation duration in ms. Default: 1200 */
  duration?: number
  /** Start value. Default: 0 */
  from?: number
}

/**
 * Animates a number from 0 to target using requestAnimationFrame.
 * Triggers when the target element enters the viewport.
 */
export function useCountUp (
  target: Ref<HTMLElement | undefined>,
  to: number,
  options: UseCountUpOptions = {},
) {
  const { duration = 1200, from = 0 } = options
  const current = shallowRef(from)
  let started = false

  function animate () {
    if (!IN_BROWSER) return

    const start = performance.now()

    function step (now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      current.value = Math.round(from + (to - from) * eased)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  const { stop } = useIntersectionObserver(target, entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && !started) {
        started = true
        animate()
        stop()
      }
    }
  }, { threshold: 0.2 })

  return { current }
}
