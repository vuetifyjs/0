// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Adapters
import { RtlAdapter } from './adapter'

// Utilities
import { isNull, isString } from '#v0/utilities'
import { watch } from 'vue'

// Types
import type { RtlAdapterSetupContext } from './adapter'
import type { App } from 'vue'

// Structural @unhead seam — duck-typed so v0 takes no dependency on @unhead types.
interface RtlHeadInput {
  htmlAttrs: { dir: 'ltr' | 'rtl' }
}

interface HeadEntry {
  dispose?: () => void
  patch?: (input: RtlHeadInput) => void
}

interface Head {
  push: (input: RtlHeadInput) => HeadEntry
}

export class V0RtlAdapter extends RtlAdapter {
  setup <T extends RtlAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null,
  ): void {
    if (IN_BROWSER) {
      if (isNull(target)) return

      const targetEl = target instanceof HTMLElement
        ? target
        : (isString(target)
            ? document.querySelector(target) as HTMLElement | null
            : document.documentElement)

      if (!targetEl) return

      targetEl.dir = context.isRtl.value ? 'rtl' : 'ltr'

      this.dispose = watch(context.isRtl, value => {
        targetEl.dir = value ? 'rtl' : 'ltr'
      })
    } else {
      const head = (app._context?.provides?.usehead ?? app._context?.provides?.head) as Head | undefined

      if (head?.push) {
        const entry = head.push({ htmlAttrs: { dir: context.isRtl.value ? 'rtl' : 'ltr' } })
        const stop = watch(context.isRtl, rtl => entry.patch?.({ htmlAttrs: { dir: rtl ? 'rtl' : 'ltr' } }))
        this.dispose = () => {
          stop()
          entry.dispose?.()
        }
      }
    }
  }
}
