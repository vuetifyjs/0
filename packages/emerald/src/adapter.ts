// Framework
import { V0StyleSheetThemeAdapter } from '@vuetify/v0'
import { hexToRgb } from '@vuetify/v0/utilities'

// Tokens
import { fontFamily, fontSize, icon, radius, shadow, spacing, stroke } from './theme'

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
    let css = foundations(this.prefix)

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

function foundations (prefix: string): string {
  const lines: string[] = []

  for (const [key, val] of Object.entries(spacing)) {
    lines.push(`  --${prefix}-spacing-${key}: ${val};`)
  }

  for (const [key, val] of Object.entries(radius)) {
    lines.push(`  --${prefix}-radius-${key}: ${val};`)
  }

  for (const [key, val] of Object.entries(stroke)) {
    lines.push(`  --${prefix}-stroke-${key}: ${val};`)
  }

  for (const [key, val] of Object.entries(icon)) {
    lines.push(`  --${prefix}-icon-${key}: ${val};`)
  }

  for (const [key, val] of Object.entries(shadow)) {
    lines.push(`  --${prefix}-shadow-${key}: ${val};`)
  }

  lines.push(`  --${prefix}-font-sans: ${fontFamily.sans};`)

  for (const [key, val] of Object.entries(fontSize)) {
    const [size, meta] = val
    lines.push(`  --${prefix}-text-${key}-size: ${size};`, `  --${prefix}-text-${key}-height: ${meta.lineHeight};`, `  --${prefix}-text-${key}-weight: ${meta.fontWeight};`)
  }

  return `:root {\n${lines.join('\n')}\n}\n`
}

function toChannels (hex: string): string | null {
  if (!/^#[0-9a-f]{3,8}$/i.test(hex)) return null
  const { r, g, b } = hexToRgb(hex)
  return `${r} ${g} ${b}`
}
