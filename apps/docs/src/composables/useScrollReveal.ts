// Framework
import { useIntersectionObserver } from '@vuetify/v0'

// Utilities
import { onMounted } from 'vue'

// Types
import type { Ref } from 'vue'

export interface ScrollRevealOptions {
  /** IntersectionObserver threshold (0-1). Default: 0.15 */
  threshold?: number
  /** Only trigger once. Default: true */
  once?: boolean
}

/**
 * Adds `.is-visible` class to an element when it enters the viewport.
 * Works with `[data-reveal]` and `[data-reveal-stagger]` CSS in tokens.css.
 */
export function useScrollReveal (
  target: Ref<HTMLElement | undefined>,
  options: ScrollRevealOptions = {},
) {
  const { threshold = 0.15, once = true } = options

  const { stop } = useIntersectionObserver(target, entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        if (once) stop()
      }
    }
  }, { threshold })

  return { stop }
}

/**
 * Auto-reveals all `[data-reveal]` and `[data-reveal-stagger]` elements
 * within a container when they scroll into view.
 * Call once in the page component.
 */
export function useAutoReveal (container: Ref<HTMLElement | undefined>) {
  onMounted(() => {
    if (!container.value) return

    const elements = container.value.querySelectorAll('[data-reveal], [data-reveal-stagger]')
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 },
    )

    for (const el of elements) {
      observer.observe(el)
    }
  })
}
