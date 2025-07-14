// Adapters
import { BaseThemeAdapter } from './adapter'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { Colors } from '../index'

export interface Vuetify0ThemeOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

export class Vuetify0ThemeAdapter extends BaseThemeAdapter {
  cspNonce?: string
  stylesheetId = 'v0-theme-stylesheet'

  constructor (options: Vuetify0ThemeOptions = {}) {
    super(options.prefix ?? 'v0')
    this.cspNonce = options.cspNonce
    this.stylesheetId = options.stylesheetId ?? this.stylesheetId
  }

  update (colors: Colors): void {
    if (!IN_BROWSER) return

    this.upsert(this.generate(colors))
  }

  upsert (styles: string): void {
    if (!IN_BROWSER) return

    let styleEl = document.querySelector(`#${this.stylesheetId}`) as HTMLStyleElement | null

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = this.stylesheetId.startsWith('#') ? this.stylesheetId.slice(1) : this.stylesheetId

      if (this.cspNonce) styleEl.setAttribute('nonce', this.cspNonce)

      document.head.append(styleEl)
    }

    styleEl.textContent = styles
  }
}
