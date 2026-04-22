// Framework
import { IN_BROWSER, useIntersectionObserver } from '@vuetify/v0'

// Utilities
import { shallowRef, toValue, watchEffect } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface UseCountUpOptions {
  /** Animation duration in ms. Default: 1200 */
  duration?: number
  /** Start value. Default: 0 */
  from?: number
}

/**
 * Animates a number from 0 to target using requestAnimationFrame.
 * Triggers when the target element enters the viewport and `to` is > 0.
 */
export function useCountUp (
  target: Ref<HTMLElement | undefined>,
  to: MaybeRefOrGetter<number>,
  options: UseCountUpOptions = {},
) {
  const { duration = 1200, from = 0 } = options
  const current = shallowRef(from)
  let started = false
  const visible = shallowRef(false)

  function animate (end: number) {
    if (!IN_BROWSER) return

    const start = performance.now()

    function step (now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      current.value = Math.round(from + (end - from) * eased)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  const { stop } = useIntersectionObserver(target, entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        visible.value = true
        stop()
      }
    }
  }, { threshold: 0.2 })

  watchEffect(() => {
    const end = toValue(to)
    if (!started && visible.value && end > 0) {
      started = true
      animate(end)
    }
  })

  return { current }
}
