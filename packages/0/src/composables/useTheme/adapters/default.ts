import { IN_BROWSER } from '#v0/constants/globals'
import type { ThemeAdapter } from './adapter'
import type { Colors } from '../index'

export interface V0ThemeOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

export class V0ThemeAdapter implements ThemeAdapter {
  cspNonce?: string
  stylesheetId = 'v0-theme-stylesheet'
  prefix = 'v0-theme'

  constructor (options: V0ThemeOptions = {}) {
    this.cspNonce = options.cspNonce
    this.stylesheetId = options.stylesheetId ?? this.stylesheetId
    this.prefix = options.prefix ?? this.prefix
  }

  update (colors: Colors): void {
    if (!IN_BROWSER) return

    this.upsert(this.generate(colors))
  }

  generate (colors: Colors): string {
    const vars = Object.entries(colors)
      .map(([key, val]) => `  --${this.prefix}-${key}: ${val};`)
      .join('\n')

    return `:root {\n${vars}\n}`
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
