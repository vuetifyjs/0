// Globals
import { IN_BROWSER, SUPPORTS_MATCH_MEDIA } from '#v0/constants/globals'

// Adapters
import { ReducedMotionAdapter } from './adapter'

// Utilities
import { onScopeDispose, watch } from 'vue'

// Types
import type { ReducedMotionAdapterSetupContext } from './adapter'
import type { App } from 'vue'

export class V0ReducedMotionAdapter extends ReducedMotionAdapter {
  setup <T extends ReducedMotionAdapterSetupContext>(
    _app: App,
    context: T,
  ): void {
    if (!IN_BROWSER) return

    // Subscribe to the system media query and forward changes to _systemReduced.
    // The factory already read the initial value synchronously; this listener
    // keeps it live when mode === 'system'.
    if (SUPPORTS_MATCH_MEDIA) {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)')

      function handler (e: MediaQueryListEvent): void {
        context._systemReduced.value = e.matches
      }

      mql.addEventListener('change', handler)
      onScopeDispose(() => mql.removeEventListener('change', handler), true)
    }

    // Sync the body attribute immediately, then keep it in step with `reduced`.
    document.body.dataset.reducedMotion = context.reduced.value ? 'reduce' : 'no-preference'

    const stop = watch(context.reduced, value => {
      document.body.dataset.reducedMotion = value ? 'reduce' : 'no-preference'
    })

    onScopeDispose(stop, true)
  }
}
