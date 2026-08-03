/**
 * Prebake dist/theme.css for zero-config install:
 *   import '@paper/emerald/theme.css'
 *
 * Self-contained (no @vuetify/v0 import) so it runs after tsdown without
 * requiring packages/0 dist to be built first.
 *
 * Keep SAFE_IDENT / UNSAFE_CSS / V0_ALIAS_KEYS / V0_REMAP_KEYS / foundations in
 * lockstep with src/adapter.ts.
 *
 * Two intentional differences from the runtime adapter:
 * - **Selectors.** The color block is emitted twice — on `[data-theme="emerald"]`
 *   *and* on `:root`. The zero-config path is a bare CSS import with no plugin to
 *   set `data-theme`, so the `:root` copy is what makes it work; the adapter
 *   emits colors on the attribute block alone because on the plugin path the
 *   theme system owns that attribute.
 * - **Sanitizer response.** The adapter silently skips a `SAFE_IDENT` /
 *   `UNSAFE_CSS` hit because its colors are user-supplied at runtime. Here the
 *   input is first-party `colors.ts`, so any hit is a bug in our own tokens and
 *   must fail the build rather than ship a hollow stylesheet.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { emeraldColors } from '../src/colors'
import {
  control,
  fontFamily,
  fontSize,
  icon,
  motion,
  radius,
  shadow,
  spacing,
  stroke,
} from '../src/design-system'

const SAFE_IDENT = /^[a-zA-Z0-9_-]+$/
/** Mirrors v0 ThemeAdapter.UNSAFE_CSS — keep in lockstep with adapter.ts. */
const UNSAFE_CSS = /url\s*\(|src\s*\(|image\s*\(|image-set\s*\(|cross-fade\s*\(|@import|expression\s*\(|[;{}<>\\]/i

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

const V0_REMAP_KEYS = {
  'error': 'danger',
  'on-error': 'on-danger',
  'warning': 'alert',
  'on-warning': 'on-alert',
  'accent': 'primary',
  'on-accent': 'on-primary',
  'surface-variant': 'neutral-200',
} as const satisfies Record<string, keyof typeof emeraldColors>

function hexToChannels (hex: string): string | null {
  if (!/^#[0-9a-f]{3,8}$/i.test(hex)) return null
  let h = hex.slice(1)
  h = h.length === 3 || h.length === 4 ? h.split('').map(c => c + c).join('').slice(0, 6) : h.slice(0, 6)
  const n = Number.parseInt(h, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

function foundations (): string {
  const lines: string[] = []

  for (const [key, val] of Object.entries(spacing)) {
    lines.push(`  --emerald-spacing-${key}: ${val};`)
  }
  for (const [key, val] of Object.entries(radius)) {
    lines.push(`  --emerald-radius-${key}: ${val};`)
  }
  for (const [key, val] of Object.entries(stroke)) {
    lines.push(`  --emerald-stroke-${key}: ${val};`)
  }
  for (const [key, val] of Object.entries(icon)) {
    lines.push(`  --emerald-icon-${key}: ${val};`)
  }
  for (const [key, val] of Object.entries(shadow)) {
    lines.push(`  --emerald-shadow-${key}: ${val};`)
  }
  for (const [key, val] of Object.entries(motion)) {
    lines.push(`  --emerald-motion-${key}: ${val};`)
  }
  for (const [key, val] of Object.entries(control)) {
    lines.push(`  --emerald-control-${key}: ${val};`)
  }
  lines.push(`  --emerald-font-sans: ${fontFamily.sans};`)
  for (const [key, val] of Object.entries(fontSize)) {
    const [size, meta] = val
    lines.push(
      `  --emerald-text-${key}-size: ${size};`,
      `  --emerald-text-${key}-height: ${meta.lineHeight};`,
      `  --emerald-text-${key}-weight: ${meta.fontWeight};`,
    )
  }

  return `:root {\n${lines.join('\n')}\n}\n`
}

function assert (key: string): void {
  if (!(key in emeraldColors)) {
    throw new Error(`[bake-theme] alias source "${key}" is missing from emeraldColors`)
  }
}

function colorBlock (selector: string): string {
  const lines: string[] = []

  for (const [key, val] of Object.entries(emeraldColors)) {
    // First-party tokens: a sanitizer hit is a bug in colors.ts, not input to filter.
    if (!SAFE_IDENT.test(key)) {
      throw new Error(`[bake-theme] token key "${key}" is not a safe CSS identifier`)
    }
    if (UNSAFE_CSS.test(val)) {
      throw new Error(`[bake-theme] token "${key}" has an unsafe CSS value: ${val}`)
    }

    lines.push(`  --emerald-${key}: ${val};`)
    const channels = hexToChannels(val)
    if (channels) lines.push(`  --emerald-${key}-channels: ${channels};`)
  }

  if (lines.length === 0) {
    throw new Error('[bake-theme] emeraldColors produced no declarations — refusing to write a hollow theme.css')
  }

  // `satisfies` above already ties both tables to real color keys, but tsconfig
  // excludes scripts/** from typecheck — assert at runtime so a renamed token
  // fails the bake instead of emitting an alias pointing at a dead variable.
  for (const key of V0_ALIAS_KEYS) {
    assert(key)
    lines.push(`  --v0-${key}: var(--emerald-${key});`)
  }

  for (const [alias, key] of Object.entries(V0_REMAP_KEYS)) {
    assert(key)
    lines.push(`  --v0-${alias}: var(--emerald-${key});`)
  }

  lines.push('  color: var(--emerald-on-background);')

  return `${selector} {\n${lines.join('\n')}\n}\n`
}

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../dist/theme.css')
const banner = '/* @paper/emerald — prebaked default theme. Generated by scripts/bake-theme.ts. Do not edit. */\n'
const css = banner
  + foundations()
  + colorBlock('[data-theme="emerald"]')
  + colorBlock(':root')
  + ':root {\n  color-scheme: light;\n}\n'

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, css)
console.log(`[bake-theme] wrote ${out} (${css.length} bytes)`)
