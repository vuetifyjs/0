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

// mirrors v0 ThemeAdapter's SAFE_IDENT guard (same file) — colors.ts's palette() merges consumer-
// supplied theme objects (createOnyxPlugin({ themes })), so a caller-controlled key reaches this
// loop; the base adapter validates both key and value, this loop only validated value until now.
const SAFE_IDENT = /^[a-zA-Z0-9_-]+$/

function safe (value: string): boolean {
  return !UNSAFE_CSS.test(value)
}

function group (name: string, values: Record<string, string>): string[] {
  return Object.entries(values).map(([key, value]) => `  --${PREFIX}-${name}-${key}: ${value};`)
}

type FontSize = Record<string, readonly [string, { readonly lineHeight: string, readonly weight?: string, readonly letterSpacing?: string }]>

function fontSizeVars (values: FontSize): string[] {
  const lines: string[] = []

  for (const [key, [size, meta]] of Object.entries(values)) {
    lines.push(`  --${PREFIX}-text-${key}-size: ${size};`, `  --${PREFIX}-text-${key}-height: ${meta.lineHeight};`)
    if (meta.weight) lines.push(`  --${PREFIX}-text-${key}-weight: ${meta.weight};`)
    if (meta.letterSpacing) lines.push(`  --${PREFIX}-text-${key}-tracking: ${meta.letterSpacing};`)
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
    if (!SAFE_IDENT.test(key) || !safe(value)) continue
    lines.push(`  --${PREFIX}-${key}: ${value};`)
  }

  for (const [v0Key, onKey] of V0_ALIASES) {
    lines.push(`  --v0-${v0Key}: var(--${PREFIX}-${onKey});`)
  }

  lines.push(`  color-scheme: ${dark ? 'dark' : 'light'};`, `  color: var(--${PREFIX}-foreground);`)

  return `${selector} {\n${lines.join('\n')}\n}\n`
}

// Required deliverable, not optional polish (direction-a.md §9): hairline borders measure only
// 1.28:1 (dark) / 1.42:1 (light) against their surface, deliberately below the 3:1 non-text floor
// since this direction demotes borders to decoration everywhere else. Under prefers-contrast:
// more, --onyx-border is promoted to hairline-strong in both themes, and the dark girdle (whose
// baseline 0.055 alpha is the whole point of the design, but too faint for this preference) is
// raised to 0.14. Light mode's girdle is already near-opaque at rest (0.9-1 alpha) — "raising" it
// further isn't meaningful, so only the border promotion applies there.
export function contrastMore (): string {
  return `@media (prefers-contrast: more) {
  :root, [data-theme="${PREFIX}"] {
    --${PREFIX}-border: var(--${PREFIX}-hairline-strong);
    --${PREFIX}-girdle: inset 0 1px 0 0 rgb(247 240 226 / 0.14);
  }
  [data-theme="${PREFIX}-light"] {
    --${PREFIX}-border: var(--${PREFIX}-hairline-strong);
  }
}
`
}
