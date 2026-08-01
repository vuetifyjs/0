import { control, fontFamily, fontSize, motion, radius, shadow, spacing, stroke } from './theme'

// Types
import type { SemanticKey } from './theme'

const PREFIX = 'onyx'

const V0_ALIASES: ReadonlyArray<readonly [v0Key: string, onKey: SemanticKey]> = [
  ['background', 'background'],
  ['on-background', 'foreground'],
  ['surface', 'card'],
  ['on-surface', 'card-foreground'],
  ['surface-tint', 'muted'],
  ['on-surface-variant', 'muted-foreground'],
  ['primary', 'primary'],
  ['on-primary', 'primary-foreground'],
  ['pre', 'muted'],
  ['warning', 'warning'],
  ['success', 'success'],
  ['info', 'info'],
  ['error', 'destructive'],
  ['accent', 'brand'],
]

// mirrors v0 ThemeAdapter's UNSAFE_CSS guard (packages/0/src/composables/useTheme/adapters/adapter.ts)
const UNSAFE_CSS = /url\s*\(|src\s*\(|image\s*\(|image-set\s*\(|cross-fade\s*\(|@import|expression\s*\(|[;{}<>\\]/i

function safe (value: string): boolean {
  return !UNSAFE_CSS.test(value)
}

function group (name: string, values: Record<string, string>): string[] {
  return Object.entries(values).map(([key, value]) => `  --${PREFIX}-${name}-${key}: ${value};`)
}

type FontSize = Record<string, readonly [string, { readonly lineHeight: string, readonly weight?: string }]>

function fontSizeVars (values: FontSize): string[] {
  const lines: string[] = []

  for (const [key, [size, meta]] of Object.entries(values)) {
    lines.push(`  --${PREFIX}-text-${key}-size: ${size};`, `  --${PREFIX}-text-${key}-height: ${meta.lineHeight};`)
    if (meta.weight) lines.push(`  --${PREFIX}-text-${key}-weight: ${meta.weight};`)
  }

  return lines
}

export function foundations (): string {
  const lines = [
    ...group('radius', radius),
    ...group('spacing', spacing),
    ...group('stroke', stroke),
    ...group('shadow', shadow),
    ...group('font', fontFamily),
    ...fontSizeVars(fontSize),
    ...group('motion', motion),
    ...group('control', control),
  ]

  return `:root {\n${lines.join('\n')}\n}\n`
}

export function block (selector: string, colors: Record<string, string>, dark?: boolean): string {
  const lines: string[] = []

  for (const [key, value] of Object.entries(colors)) {
    if (!safe(value)) continue
    lines.push(`  --${PREFIX}-${key}: ${value};`)
  }

  for (const [v0Key, onKey] of V0_ALIASES) {
    lines.push(`  --v0-${v0Key}: var(--${PREFIX}-${onKey});`)
  }

  lines.push(`  color-scheme: ${dark ? 'dark' : 'light'};`, `  color: var(--${PREFIX}-foreground);`)

  return `${selector} {\n${lines.join('\n')}\n}\n`
}
