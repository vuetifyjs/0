// Framework
import { V0StyleSheetThemeAdapter } from '@vuetify/v0'
import { hexToRgb } from '@vuetify/v0/utilities'

// Types
import type { Colors } from '@vuetify/v0'

export interface EmeraldAdapterOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

const SAFE_IDENT = /^[a-zA-Z0-9_-]+$/
const UNSAFE_CSS = /url\s*\(|@import|expression\s*\(|[{}]/i

export class EmeraldStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  constructor (options: EmeraldAdapterOptions = {}) {
    super({ prefix: 'emerald', stylesheetId: 'emerald-theme-stylesheet', ...options })
  }

  override generate (colors: Record<string, Colors>, isDark?: boolean): string {
    let css = ''

    for (const theme in colors) {
      if (!SAFE_IDENT.test(theme)) continue
      const themeColors = colors[theme]
      if (!themeColors) continue

      const lines: string[] = []

      for (const [key, val] of Object.entries(themeColors)) {
        if (!SAFE_IDENT.test(key) || UNSAFE_CSS.test(val)) continue

        lines.push(`  --${this.prefix}-${key}: ${val};`)

        const channels = toChannels(val)
        if (channels) lines.push(`  --${this.prefix}-${key}-channels: ${channels};`)
      }

      css += `[data-theme="${theme}"] {\n${lines.join('\n')}\n  color: var(--${this.prefix}-on-background);\n}\n`
    }

    if (isDark !== undefined) {
      css += `:root {\n  color-scheme: ${isDark ? 'dark' : 'light'};\n}\n`
    }

    return css
  }
}

function toChannels (hex: string): string | null {
  if (!/^#[0-9a-f]{3,8}$/i.test(hex)) return null
  const { r, g, b } = hexToRgb(hex)
  return `${r} ${g} ${b}`
}
