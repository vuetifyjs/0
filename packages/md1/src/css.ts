/**
 * Shared CSS emitters for the runtime adapter (`adapter.ts`) and the bake
 * (`scripts/bake-theme.ts`): one source for the sanitizer, the kit alias
 * tables and the `:root` foundations, so the two outputs cannot drift (the
 * Onyx shape; Emerald keeps two copies in lockstep instead).
 *
 * No runtime import reaches `@vuetify/v0` from here: the module reads the
 * token dictionary and a type from `colors.ts`, nothing else.
 */

import {
  duration,
  durationDesktop,
  durationTablet,
  easing,
  font,
  layout,
  layoutTablet,
  motion,
  md1Breakpoints,
  md1Palette,
  scripts,
  spacing,
  type,
  typeDense,
  typeDesktop,
  typeScriptDesktop,
  typeTall,
} from './design-system'

// Types
import type { md1Colors } from './colors'
import type { Md1TypeTokens } from './design-system'

const PREFIX = 'md1'

/** CSS ident for theme ids and token keys; mirrors v0 `ThemeAdapter.SAFE_IDENT`. */
export const SAFE_IDENT = /^[a-zA-Z0-9_-]+$/
/** Rejected inside token values; mirrors v0 `ThemeAdapter.UNSAFE_CSS`. */
const UNSAFE_CSS = /url\s*\(|src\s*\(|image\s*\(|image-set\s*\(|cross-fade\s*\(|@import|expression\s*\(|[;{}<>\\]|\/\*/i

/**
 * Colour keys mirrored onto `--v0-*` under their own name, for the kits
 * (Genesis) a Material Design 1 page hosts. The severities and `surface-tint` exist for
 * this table alone.
 */
const V0_ALIAS_KEYS = [
  'primary',
  'on-primary',
  'accent',
  'on-accent',
  'surface',
  'surface-tint',
  'background',
  'divider',
  'error',
  'on-error',
  'info',
  'on-info',
  'success',
  'on-success',
  'warning',
  'on-warning',
] as const satisfies readonly (keyof typeof md1Colors)[]

/**
 * Kit alias names whose Material Design 1 source token is named differently. Every
 * background is paired with its foreground: emitting one without the other
 * hands kits a contrast bug.
 */
const V0_REMAP_KEYS = {
  'secondary': 'accent',
  'on-secondary': 'on-accent',
  'on-surface': 'text-primary',
  'surface-variant': 'app-bar',
  'on-surface-variant': 'text-secondary',
  'on-background': 'text-primary',
  'border': 'divider',
  'pre': 'app-bar',
} as const satisfies Record<string, keyof typeof md1Colors>

const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGB = /^rgba?\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*(?:[\s,/]\s*[\d.]+%?\s*)?\)$/i

/**
 * `r g b` of a single colour, hex or `rgb()` / `rgba()`, with any alpha
 * dropped: the `-channels` triplet exists so consumers choose their own alpha
 * (`rgb(var(--md1-primary-channels) / 12%)`). Multi-part values such as
 * the elevations return `null` and get no triplet.
 */
function channels (value: string): string | null {
  if (HEX.test(value)) {
    let hex = value.slice(1)
    if (hex.length < 6) hex = [...hex].map(c => c + c).join('')
    const n = Number.parseInt(hex.slice(0, 6), 16)
    return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
  }

  const match = RGB.exec(value)
  return match ? `${match[1]} ${match[2]} ${match[3]}` : null
}

function flat (values: Record<string, string>): string[] {
  return Object.entries(values).map(([key, value]) => `  --${PREFIX}-${key}: ${value};`)
}

function group (name: string, values: Record<string, string>): string[] {
  return Object.entries(values).map(([key, value]) => `  --${PREFIX}-${name}-${key}: ${value};`)
}

function typeVars (styles: Record<string, Partial<Md1TypeTokens>>): string[] {
  const lines: string[] = []

  for (const [style, tokens] of Object.entries(styles)) {
    for (const [prop, value] of Object.entries(tokens)) {
      lines.push(`  --${PREFIX}-type-${style}-${prop}: ${value};`)
    }
  }

  return lines
}

function rule (selector: string, lines: string[]): string {
  return `${selector} {\n${lines.join('\n')}\n}\n`
}

function media (query: string, css: string): string {
  return `@media ${query} {\n${css.replace(/^(?=.)/gm, '  ')}}\n`
}

function langs (languages: readonly string[]): string {
  return languages.map(language => `:lang(${language})`).join(', ')
}

/** The handset / tablet split of layout/responsive-ui. */
const TABLET = `(min-width: ${md1Breakpoints[600]}px)`
/** Mouse and keyboard as the primary input: the spec's desktop column. */
const DESKTOP = '(pointer: fine)'
const DENSE = langs(scripts.dense.languages)
const TALL = langs(scripts.tall.languages)

/**
 * Theme-independent tokens on `:root`: the palette, the font stack and type
 * scale, motion, spacing and layout. Then the switches the spec keys on the
 * environment, each re-declaring only the tokens that change: tablet keylines
 * and durations, desktop durations and type sizes, and the dense and tall
 * script scales on `:lang()`, which rescope a subtree the same way.
 */
export function foundations (): string {
  const root = [
    ...flat(md1Palette),
    ...group('font', font),
    ...typeVars(type),
    ...group('easing', easing),
    ...group('duration', duration),
    ...flat(motion),
    ...group('spacing', spacing),
    ...flat(layout),
  ]

  return rule(':root', root)
    + media(TABLET, rule(':root', flat(layoutTablet)))
    + media(`${TABLET} and (pointer: coarse)`, rule(':root', group('duration', durationTablet)))
    + media(DESKTOP, rule(':root', [...group('duration', durationDesktop), ...typeVars(typeDesktop)]))
    + rule(DENSE, [`  --${PREFIX}-font-family: ${scripts.dense.family};`, ...typeVars(typeDense)])
    + rule(TALL, [`  --${PREFIX}-font-family: ${scripts.tall.family};`, ...typeVars(typeTall)])
    + media(DESKTOP, rule(`${DENSE}, ${TALL}`, typeVars(typeScriptDesktop)))
}

interface BlockOptions {
  /** Emit the `--v0-*` kit aliases (SPEC.md "The v0 bridge"). Default `true`. */
  aliases?: boolean
  /**
   * Throw on a sanitizer hit, an empty block or a missing alias source instead
   * of skipping it. The bake sets this: its input is first-party `colors.ts`,
   * so a hit is a bug in our own tokens. The adapter keeps the default and
   * skips, because its colours are user-supplied at runtime.
   */
  strict?: boolean
}

function present (key: string, colors: Record<string, string>, strict: boolean): boolean {
  if (key in colors) return true
  if (strict) throw new Error(`[md1] alias source "${key}" is missing from the theme color map`)
  return false
}

/** One theme's colour block: every key as `--md1-<key>` and `-channels`, the kit aliases, and the body ink. */
export function block (selector: string, colors: Record<string, string>, options: BlockOptions = {}): string {
  const { aliases = true, strict = false } = options
  const lines: string[] = []

  for (const [key, value] of Object.entries(colors)) {
    if (!SAFE_IDENT.test(key)) {
      if (strict) throw new Error(`[md1] token key "${key}" is not a safe CSS identifier`)
      continue
    }

    if (UNSAFE_CSS.test(value)) {
      if (strict) throw new Error(`[md1] token "${key}" has an unsafe CSS value: ${value}`)
      continue
    }

    lines.push(`  --${PREFIX}-${key}: ${value};`)

    const triplet = channels(value)
    if (triplet) lines.push(`  --${PREFIX}-${key}-channels: ${triplet};`)
  }

  if (lines.length === 0) {
    if (strict) throw new Error(`[md1] ${selector} produced no declarations; refusing to write a hollow theme`)
    return ''
  }

  if (aliases) {
    for (const key of V0_ALIAS_KEYS) {
      if (present(key, colors, strict)) lines.push(`  --v0-${key}: var(--${PREFIX}-${key});`)
    }

    for (const [alias, key] of Object.entries(V0_REMAP_KEYS)) {
      if (present(key, colors, strict)) lines.push(`  --v0-${alias}: var(--${PREFIX}-${key});`)
    }
  }

  lines.push(`  color: var(--${PREFIX}-text-primary);`)

  return rule(selector, lines)
}
