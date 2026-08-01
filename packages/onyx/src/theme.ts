export type SemanticKey =
  | 'background' | 'foreground'
  | 'card' | 'card-foreground'
  | 'popover' | 'popover-foreground'
  | 'primary' | 'primary-foreground'
  | 'secondary' | 'secondary-foreground'
  | 'muted' | 'muted-foreground'
  | 'accent' | 'accent-foreground'
  | 'destructive' | 'destructive-foreground' | 'destructive-fg'
  | 'border' | 'input' | 'ring'
  | 'brand' | 'brand-foreground'
  | 'warning' | 'success' | 'info'

export type Semantic = Record<SemanticKey, string>

// Legacy warm neutral ramp — kept for backward compatibility only (dev/src/onyx/pages/Color.vue
// still references it). Direction A does not build its palette from a numbered ramp at all — the
// semantic maps below are built from the named surface values that follow — so this ramp feeds
// nothing internally; it exists so the ramp exhibit keeps compiling until the docs pass replaces it.
export const neutral = {
  50: '#f0ece5', 100: '#e5ded4', 200: '#d3c9ba', 300: '#b3a89b',
  400: '#94897d', 500: '#78695c', 600: '#5c4f45', 700: '#423c37',
  800: '#2f2925', 900: '#181411', 950: '#0d0a08',
} as const

// Direction A "Lapidary / Jewel-Box" — named surface values (direction-a.md §3.2). OKLCH hue
// 56-62°, chroma 0.006-0.012 for the dark ramp — warm stone, never blue-black. #000000 never
// appears anywhere in this system (hard rule, SPEC.md) — every "black" reference in these values
// and in the material tokens below is built from pitchDeep or a color-mix() of it instead of a
// literal #000/rgb(0 0 0).
export const pitchDeep = '#080605'
export const pitch = '#0d0a08'
export const stone = '#181411'
export const stoneRaised = '#211c19'
export const intaglio = '#090605'
export const hairline = '#2f2925'
export const hairlineStrong = '#423c37'
export const mutedFg = '#bab3ab'
export const bone = '#f0ece5'
export const champagne = '#dac593'
export const champagneDeep = '#ac8545'
export const carnelian = '#cf4b3b'
export const carnelianFg = '#f18a76'
export const verdite = '#93ca9e'
export const topaz = '#fcb26f'
export const sapphire = '#90bce9'

// Dark semantic map — the default theme (direction-a.md §3.3).
export const dark: Semantic = {
  'background': pitch,
  'foreground': bone,
  'card': stone,
  'card-foreground': bone,
  'popover': stoneRaised,
  'popover-foreground': bone,
  'primary': champagne,
  'primary-foreground': pitch,
  'secondary': stoneRaised,
  'secondary-foreground': bone,
  'muted': stoneRaised,
  'muted-foreground': mutedFg,
  'accent': hairline,
  'accent-foreground': bone,
  'destructive': carnelian,
  'destructive-foreground': bone,
  'destructive-fg': carnelianFg,
  'border': hairline,
  'input': hairline,
  'ring': champagne,
  'brand': champagne,
  'brand-foreground': pitch,
  'warning': topaz,
  'success': verdite,
  'info': sapphire,
}

// Light semantic map — "the box lining" variant (direction-a.md §3.4). Popover-foreground and
// destructive-fg aren't given explicit values in the spec's table; both are reasoned inferences
// (documented in the redesign report) — popover text follows card-foreground/foreground exactly
// as it does in the dark map, and light-mode destructive text reuses destructive itself since
// unlike the dark carnelian (which measured Lc -37.9 and needed a lightened variant), the light
// destructive #bf3c2d already reads as body text on a light card.
export const light: Semantic = {
  'background': '#f9f6f2',
  'foreground': '#1f1915',
  'card': '#fffefd',
  'card-foreground': '#1f1915',
  'popover': '#fffefd',
  'popover-foreground': '#1f1915',
  'primary': champagneDeep,
  'primary-foreground': '#f9f6f2',
  'secondary': '#efece7',
  'secondary-foreground': '#1f1915',
  'muted': '#efece7',
  'muted-foreground': '#6f6761',
  'accent': '#efece7',
  'accent-foreground': '#1f1915',
  'destructive': '#bf3c2d',
  'destructive-foreground': '#fffefd',
  'destructive-fg': '#bf3c2d',
  'border': '#dbd7d0',
  'input': '#dbd7d0',
  'ring': champagneDeep,
  'brand': champagneDeep,
  'brand-foreground': '#f9f6f2',
  'warning': '#b66c18',
  'success': '#3f774d',
  'info': '#346fa9',
}

// Material geometry — direction-a.md §5.2. Theme-independent: these two read the same in both
// themes because the spec's own light-mode override block never redefines them (a recess still
// darkens toward pitchDeep regardless of theme, and a champagne active-girdle is the same accent
// in both).
export const bandRecess = `linear-gradient(180deg, color-mix(in oklab, ${pitchDeep} 22%, transparent) 0%, transparent 34%)`
export const girdleActive = `inset 0 1px 0 0 color-mix(in oklab, ${champagne} 60%, transparent)`

// Theme-dependent material tokens. Values that reference "black" use pitchDeep's own RGB (8 6 5)
// in place of the spec's literal rgb(0 0 0 / …) / #000 — direction-a.md §5.2's own worked CSS
// violates its own §3.2 hard rule ("#000000 never appears anywhere in the system") in several
// spots; this substitutes the warm equivalent at the same alpha everywhere that happened.
export const materialDark: Record<string, string> = {
  'band': 'linear-gradient(180deg, color-mix(in oklab, var(--onyx-foreground) 2.5%, transparent) 0%, transparent 42%)',
  'girdle': 'inset 0 1px 0 0 rgb(247 240 226 / 0.055)',
  'girdle-lit': 'inset 0 1px 0 0 rgb(247 240 226 / 0.10)',
  'girdle-recess': 'inset 0 1px 2px 0 rgb(8 6 5 / 0.55), inset 0 -1px 0 0 rgb(247 240 226 / 0.035)',
  'pool': '0 1px 2px -1px rgb(8 6 5 / 0.70), 0 16px 32px -22px rgb(8 6 5 / 0.95)',
  'pool-overlay': '0 2px 4px -2px rgb(8 6 5 / 0.80), 0 44px 80px -32px rgb(8 6 5 / 0.95)',
  'lamp': 'radial-gradient(120% 68% at 50% -12%, rgb(255 240 214 / 0.045) 0%, rgb(255 240 214 / 0.012) 38%, transparent 66%)',
  'surface-raised': stoneRaised,
  'hairline-strong': hairlineStrong,
  intaglio,
  champagne,
}

export const materialLight: Record<string, string> = {
  'band': 'linear-gradient(180deg, rgb(255 255 255 / 0.6) 0%, transparent 40%)',
  'girdle': 'inset 0 1px 0 0 rgb(255 255 255 / 0.9)',
  'girdle-lit': 'inset 0 1px 0 0 rgb(255 255 255 / 1)',
  'girdle-recess': 'inset 0 1px 2px 0 rgb(31 25 21 / 0.10)',
  'pool': '0 1px 2px -1px rgb(48 38 28 / 0.10), 0 12px 24px -16px rgb(48 38 28 / 0.22)',
  'pool-overlay': '0 2px 6px -2px rgb(48 38 28 / 0.14), 0 40px 72px -28px rgb(48 38 28 / 0.30)',
  'lamp': 'radial-gradient(120% 68% at 50% -12%, rgb(172 133 69 / 0.05) 0%, transparent 62%)',
  // Not given explicit values by the spec's light override block — reasoned inferences (see
  // redesign report): surface-raised mirrors light popover (same relationship as dark mode,
  // where surface-raised === popover === secondary); intaglio is spec-explicit ("also the
  // light-mode intaglio fill" next to muted in §3.4); hairline-strong is a modest darkening of
  // the light border for emphasis, since the spec doesn't give one.
  'surface-raised': '#fffefd',
  'intaglio': light.muted,
  'hairline-strong': '#c7c0b5',
  'champagne': champagneDeep,
}

export const radius = { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' } as const
export const spacing = { '3xs': '2px', '2xs': '4px', 'xs': '8px', 'sm': '12px', 'md': '16px', 'lg': '24px', 'xl': '32px', '2xl': '48px', '3xl': '64px' } as const
export const stroke = { s: '1px', m: '2px' } as const
// Backward compatible — direction-a.md's own appendix keeps these unused-by-components rather
// than removed: "Existing shadow-xs/shadow-sm stay for backward compatibility but are unused by
// any Onyx component after this direction lands — they are the light-mode shadows that caused
// the problem." Replaced everywhere by the girdle/pool material system (§5.2-§5.9). Exempted from
// the #000-never rule for the same reason (SPEC.md notes the exemption explicitly).
export const shadow = { xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)', sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' } as const

// Display face (Fraunces) added — direction-a.md §4.1. `serif` is new; `sans`/`mono` faces
// replaced (Instrument Sans over Inter, IBM Plex Mono over the previous system-mono stack). All
// three carry a graceful system fallback so a failed self-hosted font load degrades to the
// previous appearance rather than to Times — the docs agent installs the actual @fontsource
// files; this package only wires the token names + fallbacks.
export const fontFamily = {
  serif: '"Fraunces Variable", Fraunces, Georgia, "Times New Roman", serif',
  sans: '"Instrument Sans Variable", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const

// Scale — direction-a.md §4.2 ("buying air"). Every step's size/line-height/tracking replaced;
// 5xl is new (hero only). 3xl and up are always Fraunces at weight 300 in component CSS; below
// 3xl is always Instrument Sans — that rule lives at the call site, not in this token shape.
export const fontSize = {
  'xs': ['12px', { lineHeight: '18px', letterSpacing: '0.005em' }],
  'sm': ['13.5px', { lineHeight: '22px', letterSpacing: '0em' }],
  'base': ['15px', { lineHeight: '24px', letterSpacing: '-0.003em' }],
  'md': ['16.5px', { lineHeight: '27px', letterSpacing: '-0.005em' }],
  'lg': ['19px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
  'xl': ['22px', { lineHeight: '30px', letterSpacing: '-0.014em' }],
  '2xl': ['27px', { lineHeight: '34px', letterSpacing: '-0.018em' }],
  '3xl': ['36px', { lineHeight: '42px', letterSpacing: '-0.024em' }],
  '4xl': ['48px', { lineHeight: '52px', letterSpacing: '-0.028em' }],
  '5xl': ['72px', { lineHeight: '74px', letterSpacing: '-0.032em' }],
} as const

// motion-slow (overlay entrances) and motion-lamp (the lighting easing — symmetric, no overshoot,
// "light does not spring") are new — direction-a.md §7.
export const motion = { fast: '120ms', base: '200ms', slow: '320ms', easing: 'cubic-bezier(0.16, 1, 0.3, 1)', lamp: 'cubic-bezier(0.4, 0, 0.2, 1)' } as const
export const control = { sm: '32px', md: '36px', lg: '40px' } as const
