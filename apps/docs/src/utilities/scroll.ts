// Composables
import { useSettings } from '@/composables/useSettings'

/**
 * Composable that provides a scroll-to-anchor function respecting reduced motion preferences.
 */
export function useScrollToAnchor () {
  const { prefersReducedMotion } = useSettings()

  /**
   * Scroll to an element by ID with a fixed header offset
   */
  function scrollToAnchor (id: string, offset = 80) {
    const el = document.querySelector(`#${CSS.escape(id)}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
    }
  }

  return { scrollToAnchor }
}
