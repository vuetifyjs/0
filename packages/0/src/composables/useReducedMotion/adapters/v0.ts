// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { ReducedMotionAdapter } from './adapter'

// Utilities
import { watch } from 'vue'

// Types
import type { ReducedMotionAdapterSetupContext } from './adapter'
import type { App } from 'vue'

/**
 * Default reduced-motion adapter. In the browser it writes
 * `document.body.dataset.reducedMotion`; on the server it renders the same
 * attribute through `@unhead` so the value is present in the initial HTML.
 */
export class V0ReducedMotionAdapter extends ReducedMotionAdapter {
  setup<T extends ReducedMotionAdapterSetupContext> (app: App, context: T): void {
    if (IN_BROWSER) {
      function sync (reduced: boolean) {
        document.body.dataset.reducedMotion = reduced ? 'reduce' : 'no-preference'
      }

      sync(context.isReduced.value)

      this.dispose = watch(context.isReduced, sync)
    } else {
      const head = app._context?.provides?.usehead ?? app._context?.provides?.head

      if (head?.push) {
        const entry = head.push({
          bodyAttrs: {
            'data-reduced-motion': context.isReduced.value ? 'reduce' : 'no-preference',
          },
        })

        this.dispose = () => entry.dispose?.()
      }
    }
  }
}
