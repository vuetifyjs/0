// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { ReducedMotionAdapter } from './adapter'

// Utilities
import { watch } from 'vue'

// Types
import type { ReducedMotionAdapterSetupContext } from './adapter'
import type { App } from 'vue'

// Structural @unhead seam — duck-typed on purpose so v0 takes no dependency on @unhead types.
interface HeadInput {
  bodyAttrs: { 'data-reduced-motion': string }
}

interface HeadEntry {
  dispose?: () => void
  patch?: (input: HeadInput) => void
}

interface Head {
  push: (input: HeadInput) => HeadEntry
}

function payload (reduced: boolean): 'reduce' | 'no-preference' {
  return reduced ? 'reduce' : 'no-preference'
}

/**
 * Default reduced-motion adapter. In the browser it writes
 * `document.body.dataset.reducedMotion`; on the server it renders the same
 * attribute through `@unhead` so the value is present in the initial HTML.
 */
export class V0ReducedMotionAdapter extends ReducedMotionAdapter {
  setup<T extends ReducedMotionAdapterSetupContext> (app: App, context: T): void {
    if (IN_BROWSER) {
      function sync (reduced: boolean) {
        document.body.dataset.reducedMotion = payload(reduced)
      }

      sync(context.isReduced.value)

      this.dispose = watch(context.isReduced, sync)
    } else {
      const head = (app._context?.provides?.usehead ?? app._context?.provides?.head) as Head | undefined

      if (head?.push) {
        const entry = head.push({ bodyAttrs: { 'data-reduced-motion': payload(context.isReduced.value) } })
        const stop = watch(context.isReduced, reduced => entry.patch?.({ bodyAttrs: { 'data-reduced-motion': payload(reduced) } }))

        this.dispose = () => {
          stop()
          entry.dispose?.()
        }
      }
    }
  }
}
