// Adapters
import { ThemeAdapter } from './adapter'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { Colors } from '../index'

export interface Vuetify0ThemeOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

/**
 * Theme adapter implementation for Vuetify v0 design system.
 * This adapter generates CSS custom properties and injects them into the DOM
 * as a stylesheet, allowing themes to be applied globally.
 */
export class Vuetify0ThemeAdapter extends ThemeAdapter {
  cspNonce?: string
  stylesheetId = 'v0-theme-stylesheet'

  constructor (options: Vuetify0ThemeOptions = {}) {
    super(options.prefix ?? 'v0')
    this.cspNonce = options.cspNonce
    this.stylesheetId = options.stylesheetId ?? this.stylesheetId
  }

  update (colors: Record<string, Colors | undefined>): void {
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
