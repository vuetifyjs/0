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
  /**
   * When true (default), also emit `--v0-*` aliases for color roles kits
   * (Genesis) consume so DS chrome inherits brand colors. See DESIGN_SYSTEMS.md
   * "Kit interop".
   */
  v0Aliases?: boolean
}

const SAFE_IDENT = /^[a-zA-Z0-9_-]+$/
/** Mirrors v0 ThemeAdapter.UNSAFE_CSS — keep in lockstep. */
const UNSAFE_CSS = /url\s*\(|src\s*\(|image\s*\(|image-set\s*\(|cross-fade\s*\(|@import|expression\s*\(|[;{}<>\\]/i

/**
 * Color keys mirrored onto `--v0-*` for kit interop (Genesis chrome).
 * Severity remaps (warning/error/accent) are handled separately below.
 */
const V0_ALIAS_KEYS = [
  'primary',
  'on-primary',
  'secondary',
  'on-secondary',
  'background',
  'on-background',
  'surface',
  'on-surface',
  'on-surface-variant',
  'surface-tint',
  'divider',
  'border',
  'pre',
  'danger',
  'on-danger',
  'alert',
  'on-alert',
  'success',
  'on-success',
  'info',
  'on-info',
] as const

export class EmeraldStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  readonly v0Aliases: boolean

  constructor (options: EmeraldAdapterOptions = {}) {
    super({ prefix: 'emerald', stylesheetId: 'emerald-theme-stylesheet', ...options })
    this.v0Aliases = options.v0Aliases !== false
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

      if (this.v0Aliases) {
        for (const key of V0_ALIAS_KEYS) {
          if (key in themeColors) {
            lines.push(`  --v0-${key}: var(--${this.prefix}-${key});`)
          }
        }
        // Severity / accent remaps kits use for callouts (names differ)
        if ('alert' in themeColors) lines.push(`  --v0-warning: var(--${this.prefix}-alert);`)
        if ('danger' in themeColors) lines.push(`  --v0-error: var(--${this.prefix}-danger);`)
        if ('primary' in themeColors) lines.push(`  --v0-accent: var(--${this.prefix}-primary);`)
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
    lines.push(
      `  --${prefix}-text-${key}-size: ${size};`,
      `  --${prefix}-text-${key}-height: ${meta.lineHeight};`,
      `  --${prefix}-text-${key}-weight: ${meta.fontWeight};`,
    )
  }

  return `:root {\n${lines.join('\n')}\n}\n`
}

function toChannels (hex: string): string | null {
  if (!/^#[0-9a-f]{3,8}$/i.test(hex)) return null
  const { r, g, b } = hexToRgb(hex)
  return `${r} ${g} ${b}`
}
