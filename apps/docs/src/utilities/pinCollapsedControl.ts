// Utilities
import { nextTick } from 'vue'

const COLLAPSE_CONTROL = [
  '[data-tour="example-toggle"][aria-expanded="true"]',
  '[data-tour="example-expand"][aria-expanded="true"]',
  '.genesis-peek[aria-expanded="true"]',
].join(', ')

/**
 * Keep a collapse control at the viewport position it was clicked from while
 * the region above it shrinks. A reader who opened a long example and
 * collapsed it from the bottom stays on that example.
 */
export function pinCollapsedControl (event: MouseEvent): void {
  const root = event.currentTarget
  const target = event.target
  if (!(root instanceof HTMLElement) || !(target instanceof Element)) return

  const button = target.closest<HTMLElement>(COLLAPSE_CONTROL)
  if (!button || !root.contains(button)) return

  const desired = button.getBoundingClientRect().top
  const observer = new ResizeObserver(() => {
    place(button, desired)
  })
  observer.observe(root)

  let timer = 0
  function stop () {
    observer.disconnect()
    window.clearTimeout(timer)
    ensureVisible(button, root)
  }
  timer = window.setTimeout(stop, 450)

  nextTick(() => {
    if (!button.isConnected) {
      stop()
      return
    }
    place(button, desired)
  })
}

function place (button: HTMLElement, desired: number): void {
  if (!button.isConnected) return
  const delta = button.getBoundingClientRect().top - desired
  if (Math.abs(delta) <= 1) return
  window.scrollBy(0, delta)
}

function ensureVisible (button: HTMLElement, root: HTMLElement): void {
  if (!button.isConnected) return
  const rect = button.getBoundingClientRect()
  const header = headerOffset()
  if (rect.bottom > header && rect.top < window.innerHeight) return

  const top = window.scrollY + root.getBoundingClientRect().top - header
  window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
}

function headerOffset (): number {
  const raw = getComputedStyle(document.documentElement).scrollPaddingTop
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : 48
}
