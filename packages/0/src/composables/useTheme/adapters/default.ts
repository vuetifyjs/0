// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { ThemeAdapter } from './adapter'

export interface V0ThemeOptions {
  cspNonce?: string
  stylesheetId?: string
}

export class V0ThemeAdapter implements ThemeAdapter {
  cspNonce?: string
  stylesheetId = 'v0-theme-stylesheet'

  constructor (options: V0ThemeOptions = {}) {
    this.cspNonce = options.cspNonce
    this.stylesheetId = options.stylesheetId ?? this.stylesheetId
  }

  upsert (styles: string): void {
    if (!IN_BROWSER) return

    let styleEl = document.querySelector(this.stylesheetId) as HTMLStyleElement | null

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = this.stylesheetId.startsWith('#') ? this.stylesheetId.slice(1) : this.stylesheetId

      if (this.cspNonce) styleEl.setAttribute('nonce', this.cspNonce)

      document.head.append(styleEl)
    }

    styleEl.textContent = styles
  }
}
