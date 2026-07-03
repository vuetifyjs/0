// Globals
import { IN_BROWSER } from '#v0/constants/globals'

import { ThemeAdapter } from './adapter'

// Utilities
import { isNull, isString } from '#v0/utilities'
import { watch } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { Colors } from '../index'
import type { ThemeAdapterSetupContext } from './adapter'
import type { App } from 'vue'

// Structural @unhead seam — duck-typed so v0 takes no dependency on @unhead types.
interface ThemeHeadInput {
  htmlAttrs: { 'data-theme': string }
  style: Array<{ innerHTML: string, id: string, nonce?: string }>
}

interface HeadEntry {
  dispose?: () => void
}

interface Head {
  push: (input: ThemeHeadInput) => HeadEntry
}

export interface Vuetify0ThemeOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

/**
 * Theme adapter that injects CSS custom properties via adoptedStyleSheets.
 * Best for SPAs where SSR hydration is not a concern.
 */
export class V0StyleSheetThemeAdapter extends ThemeAdapter {
  cspNonce?: string
  sheet?: CSSStyleSheet

  constructor (options: Vuetify0ThemeOptions = {}) {
    super(options.prefix ?? 'v0')
    this.cspNonce = options.cspNonce
    this.stylesheetId = options.stylesheetId ?? this.stylesheetId
  }

  setup <T extends ThemeAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null,
  ): void {
    if (IN_BROWSER) {
      // Inject styles synchronously to prevent flash of unstyled content
      this.update(context.colors.value, context.isDark.value)

      const stopWatch = watch([context.colors, context.isDark], ([colors, isDark]) => {
        this.update(colors, isDark)
      })

      if (isNull(target)) {
        this.dispose = () => {
          stopWatch()
          this.detach()
        }
        return
      }

      const targetEl = target instanceof HTMLElement
        ? target
        : (isString(target)
            ? document.querySelector(target) as HTMLElement | null
            : (app._container as HTMLElement | undefined) || document.querySelector('#app') as HTMLElement | null || document.body)

      if (!targetEl) {
        this.dispose = () => {
          stopWatch()
          this.detach()
        }
        return
      }

      // Set data-theme synchronously to prevent flash
      if (context.selectedId.value) {
        targetEl.dataset.theme = String(context.selectedId.value)
      }

      const stopTheme = watch(context.selectedId, id => {
        if (!id) return
        targetEl.dataset.theme = String(id)
      })

      this.dispose = () => {
        stopWatch()
        stopTheme()
        this.detach()
      }
    } else {
      const head = (app._context?.provides?.usehead ?? app._context?.provides?.head) as Head | undefined

      if (head?.push) {
        const id = context.selectedId.value
        const entry = head.push({
          htmlAttrs: {
            'data-theme': id ? String(id) : '',
          },
          style: [{
            innerHTML: this.generate(context.colors.value, context.isDark.value),
            id: this.stylesheetId,
            ...(this.cspNonce ? { nonce: this.cspNonce } : {}),
          }],
        })

        if (entry?.dispose) this.dispose = entry.dispose
      }
    }
  }

  update (
    colors: Record<ID, Colors>,
    isDark?: boolean,
  ): void {
    if (!IN_BROWSER) return

    this.upsert(this.generate(colors, isDark))
  }

  upsert (styles: string): void {
    if (!IN_BROWSER) return

    if (!this.sheet) {
      this.sheet = new CSSStyleSheet()
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.sheet]
    }
    this.sheet.replaceSync(styles)
  }

  private detach (): void {
    if (!IN_BROWSER) return

    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== this.sheet)
    this.sheet = undefined
  }
}
