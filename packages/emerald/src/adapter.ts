/**
 * Runtime counterpart of `scripts/bake-theme.ts` — keep `SAFE_IDENT`,
 * `UNSAFE_CSS`, `V0_ALIAS_KEYS`, `V0_REMAP_KEYS` and `foundations` in lockstep.
 *
 * Two intentional differences from the baked stylesheet:
 * - **Selectors.** Colors land on `[data-theme="<id>"]` only (foundations stay on
 *   `:root`) — on the plugin path the theme system owns that attribute. The bake
 *   script additionally duplicates the color block onto `:root`, because the
 *   zero-config CSS-only path (`import '@paper/emerald/theme.css'`) has no
 *   plugin to set `data-theme`.
 * - **Sanitizer response.** Here a `SAFE_IDENT` / `UNSAFE_CSS` hit skips the
 *   declaration silently: colors are user-supplied at runtime, and v0's own
 *   adapter drops rather than throws. At bake time the input is first-party
 *   `colors.ts`, so the script throws instead — see its header.
 */

// Framework
import { V0StyleSheetThemeAdapter } from '@vuetify/v0'
import { hexToRgb, isUndefined } from '@vuetify/v0/utilities'

// Design-system tokens
import { control, fontFamily, fontSize, icon, motion, radius, shadow, spacing, stroke } from './design-system'

// Types
import type { emeraldColors } from './colors'
import type { Colors } from '@vuetify/v0'

/**
 * Deliberately no `prefix`: every Emerald stylesheet hardcodes `var(--emerald-*)`,
 * so a custom prefix would emit variables nothing reads and unstyle the whole
 * design system.
 */
export interface EmeraldAdapterOptions {
  cspNonce?: string
  stylesheetId?: string
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

/** Color keys mirrored onto `--v0-*` for kit interop (Genesis chrome). */
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
] as const satisfies readonly (keyof typeof emeraldColors)[]

/**
 * Kit alias names whose Emerald source token is named differently — severity and
 * accent roles. Every entry pairs a background with its foreground: emitting one
 * without the other hands kits a contrast bug.
 */
const V0_REMAP_KEYS = {
  'error': 'danger',
  'on-error': 'on-danger',
  'warning': 'alert',
  'on-warning': 'on-alert',
  'accent': 'primary',
  'on-accent': 'on-primary',
  'surface-variant': 'neutral-200',
} as const satisfies Record<string, keyof typeof emeraldColors>

/**
 * Stylesheet adapter used by `createEmeraldPlugin` — not a consumer install step.
 * Apps should `app.use(createEmeraldPlugin())` and/or import `theme.css`.
 * Only hosts that already install `createThemePlugin` need this class when
 * wiring Emerald as their theme adapter.
 */
export class EmeraldStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  readonly v0Aliases: boolean

  constructor (options: EmeraldAdapterOptions = {}) {
    // Order is load-bearing: `stylesheetId` precedes the spread so callers can
    // override it, `prefix` follows so they cannot — a cast past
    // EmeraldAdapterOptions would otherwise unstyle every `var(--emerald-*)`.
    super({ stylesheetId: 'emerald-theme-stylesheet', ...options, prefix: 'emerald' })
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
        for (const [alias, key] of Object.entries(V0_REMAP_KEYS)) {
          if (key in themeColors) {
            lines.push(`  --v0-${alias}: var(--${this.prefix}-${key});`)
          }
        }
      }

      css += `[data-theme="${theme}"] {\n${lines.join('\n')}\n  color: var(--${this.prefix}-on-background);\n}\n`
    }

    if (!isUndefined(isDark)) {
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

  for (const [key, val] of Object.entries(motion)) {
    lines.push(`  --${prefix}-motion-${key}: ${val};`)
  }

  for (const [key, val] of Object.entries(control)) {
    lines.push(`  --${prefix}-control-${key}: ${val};`)
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
