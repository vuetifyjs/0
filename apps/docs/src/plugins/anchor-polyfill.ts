/**
 * CSS Anchor Positioning Polyfill
 *
 * Conditionally loads the @oddbird/css-anchor-positioning polyfill
 * for browsers that don't support native CSS anchor positioning
 * (Safari, Firefox, Chrome < 125).
 *
 * @see https://github.com/oddbird/css-anchor-positioning
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

function supportsAnchorPositioning (): boolean {
  return CSS.supports('anchor-name', '--test')
}

async function loadPolyfill () {
  const { polyfill } = await import('@oddbird/css-anchor-positioning')
  polyfill()
}

if (IN_BROWSER && !supportsAnchorPositioning()) {
  // Load polyfill after initial render to avoid blocking
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadPolyfill(), { timeout: 2000 })
  } else {
    setTimeout(loadPolyfill, 0)
  }
}
