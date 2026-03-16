// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isNull, isString } from '#v0/utilities'
import { onScopeDispose, watch } from 'vue'

// Types
import type { RtlAdapter, RtlAdapterSetupContext } from './adapter'
import type { App } from 'vue'

export class Vuetify0RtlAdapter implements RtlAdapter {
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

      const stop = watch(context.isRtl, value => {
        targetEl.dir = value ? 'rtl' : 'ltr'
      })

      onScopeDispose(stop, true)
    } else {
      const head = app._context?.provides?.usehead ?? app._context?.provides?.head

      if (head?.push) {
        head.push({
          htmlAttrs: {
            dir: context.isRtl.value ? 'rtl' : 'ltr',
          },
        })
      }
    }
  }
}
