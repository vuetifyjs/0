/**
 * Scroll to an element by ID with a fixed header offset
 */
export function scrollToAnchor (id: string, offset = 80) {
  const el = document.querySelector(`#${CSS.escape(id)}`)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }
}
