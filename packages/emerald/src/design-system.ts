/**
 * Emerald design-system token dictionary.
 *
 * Not just color themes — the full Figma-bound surface: color scales,
 * spacing, radius, stroke, icon sizes, shadows, type, motion, and
 * control geometry. Consumed by:
 * - `adapter.ts` → CSS custom properties (`--emerald-*`)
 * - `colors.ts` → flat map for v0's theme plugin
 * - optional UnoCSS / tooling via `emeraldDesignSystem`
 *
 * Source: Figma "Emerald 1.0" (fileKey WaY9z9gHeU6LbkqNgcD9io).
 *
 * Scale structure: brand + neutral 100–1000; semantic families
 * (danger/alert/success/info) 100–600; alpha-10|20|30; DEFAULT =
 * family base (alpha base).
 */

// ──────────────────────────────────────────────
// Brand
// ──────────────────────────────────────────────

export const primary = {
  '100': '#E7FFF2',
  '200': '#D6F3E2',
  '300': '#BAEDD0',
  '400': '#94CAAB',
  '500': '#6FB38C',
  '600': '#1FAE60',
  '700': '#027D4C',
  '800': '#01603A',
  '900': '#004026',
  '1000': '#012C1A',
  'alpha-10': '#26C26D1A',
  'alpha-20': '#26C26D33',
  'alpha-30': '#26C26D4D',
  'DEFAULT': '#26C26D',
} as const

export const secondary = {
  '100': '#DBF8FF',
  '200': '#B6F2FF',
  '300': '#92EBFF',
  '400': '#76E6FF',
  '500': '#2DD8FF',
  '600': '#00B4DC',
  '700': '#00809D',
  '800': '#006982',
  '900': '#004A5B',
  '1000': '#00323D',
  'alpha-10': '#00809D1A',
  'alpha-20': '#00809D33',
  'alpha-30': '#00809D4D',
  'DEFAULT': '#00809D',
} as const

// ──────────────────────────────────────────────
// Neutral
// ──────────────────────────────────────────────

export const neutral = {
  '100': '#FEFEFE',
  // Canonical Figma Emerald 1.0 (WaY9z9gHeU6LbkqNgcD9io) — not the Copy file
  '200': '#F6F8FA',
  '300': '#CCD6E7',
  '400': '#AEB6BE',
  '500': '#A3AFBE',
  '600': '#939DAC',
  '700': '#757E85',
  '800': '#636A70',
  '900': '#494A4C',
  '1000': '#2B2D2E',
  'alpha-10': '#3333331A',
  'alpha-20': '#33333333',
  'alpha-30': '#3333334D',
  'alpha-gray-20': '#CCD6E733',
  'DEFAULT': '#333333',
} as const

// ──────────────────────────────────────────────
// Semantics
// ──────────────────────────────────────────────

export const danger = {
  '100': '#FFEBEE',
  '200': '#FFCCD2',
  '300': '#F49898',
  '400': '#DF3543',
  '500': '#C61424',
  '600': '#A1000E',
  'alpha-10': '#FB37481A',
  'alpha-20': '#FB374833',
  'alpha-30': '#FB37484D',
  'DEFAULT': '#FB3748',
} as const

export const alert = {
  '100': '#FFF7E1',
  '200': '#FFEAB3',
  '300': '#FFDD82',
  '400': '#FFDB43',
  '500': '#FFCF06',
  '600': '#D9AF00',
  'alpha-10': '#FFDB431A',
  'alpha-20': '#FFDB4333',
  'alpha-30': '#FFDB434D',
  'DEFAULT': '#FFDB43',
} as const

export const success = {
  '100': '#C0E5D1',
  '200': '#97D4B4',
  '300': '#7AC6A0',
  '400': '#55C08A',
  '500': '#3BA66D',
  '600': '#1D9B58',
  'alpha-10': '#1FC16B1A',
  'alpha-20': '#1FC16B33',
  'alpha-30': '#1FC16B4D',
  'DEFAULT': '#1FC16B',
} as const

export const info = {
  '100': '#E4F2FF',
  '200': '#BDDDFF',
  '300': '#93C8FF',
  '400': '#5596FF',
  '500': '#3A70E2',
  '600': '#2657BF',
  'alpha-10': '#3A70E21A',
  'alpha-20': '#3A70E233',
  'alpha-30': '#3A70E24D',
  'DEFAULT': '#3A70E2',
} as const

// ──────────────────────────────────────────────
// Surfaces (derived from spec neutrals — not on the Figma Color page)
// ──────────────────────────────────────────────

export const white = '#FFFFFF'
export const black = '#000000'

export const background = {
  DEFAULT: neutral[100],
  dark: '#1A1C1E',
} as const

export const surface = {
  DEFAULT: white,
  dark: '#1E1C28',
} as const

// ──────────────────────────────────────────────
// Foreground (on-*) — derived from spec neutrals
// ──────────────────────────────────────────────

export const on = {
  primary: neutral[100],
  secondary: neutral[100],
  danger: neutral[100],
  alert: neutral[1000],
  success: neutral[100],
  info: neutral[100],
  background: neutral[1000],
  surface: neutral[1000],
} as const

// ──────────────────────────────────────────────
// Border
// ──────────────────────────────────────────────

export const border = {
  DEFAULT: neutral[400],
} as const

// ──────────────────────────────────────────────
// Dark theme (derived — no dedicated Figma dark page yet).
//
// Each family keeps the light family's exact key set (`satisfies` ties them,
// so a drifted key is a build error) with the lightness ladder inverted and
// chroma re-tuned rather than naively negated: 100 is the deepest tint (the
// role light-100 plays as palest), 600/1000 the brightest. `on-*` flips from
// white-on-color to ink-on-color because the dark DEFAULTs are brighter —
// white on them fails AA. Anchors: `background.dark` / `surface.dark` above.
// ──────────────────────────────────────────────

export const primaryDark = {
  '100': '#0A2E1D',
  '200': '#0E3B25',
  '300': '#11532F',
  '400': '#1A7A46',
  '500': '#22A45E',
  '600': '#2ECC77',
  '700': '#57D993',
  '800': '#8CE7B6',
  '900': '#C0F3D9',
  '1000': '#E3FBEE',
  'alpha-10': '#2ECC771A',
  'alpha-20': '#2ECC7733',
  'alpha-30': '#2ECC774D',
  'DEFAULT': '#2ECC77',
} as const satisfies Record<keyof typeof primary, string>

export const secondaryDark = {
  '100': '#06272F',
  '200': '#073A46',
  '300': '#0A4E5E',
  '400': '#0E6478',
  '500': '#12839D',
  '600': '#19B7DC',
  '700': '#4FD3F2',
  '800': '#86E2F8',
  '900': '#BEF0FC',
  '1000': '#E0F9FE',
  'alpha-10': '#22BFE31A',
  'alpha-20': '#22BFE333',
  'alpha-30': '#22BFE34D',
  'DEFAULT': '#22BFE3',
} as const satisfies Record<keyof typeof secondary, string>

export const neutralDark = {
  '100': '#1A1C1E',
  '200': '#22252A',
  '300': '#30343B',
  '400': '#3F444D',
  '500': '#4C525C',
  '600': '#6A7280',
  '700': '#949DA9',
  '800': '#B3BAC4',
  '900': '#D5D9DE',
  '1000': '#EEF1F4',
  'alpha-10': '#E4E9F01A',
  'alpha-20': '#E4E9F033',
  'alpha-30': '#E4E9F04D',
  'alpha-gray-20': '#94A3BF33',
  'DEFAULT': '#E6E9ED',
} as const satisfies Record<keyof typeof neutral, string>

export const dangerDark = {
  '100': '#3B1216',
  '200': '#55181E',
  '300': '#7A2029',
  '400': '#E4606C',
  '500': '#F2828C',
  '600': '#F7A9B0',
  'alpha-10': '#FF5C6A1A',
  'alpha-20': '#FF5C6A33',
  'alpha-30': '#FF5C6A4D',
  'DEFAULT': '#FF5C6A',
} as const satisfies Record<keyof typeof danger, string>

export const alertDark = {
  '100': '#3A2F0A',
  '200': '#52430E',
  '300': '#715C13',
  '400': '#E8C23A',
  '500': '#FFD54A',
  '600': '#FFE071',
  'alpha-10': '#FFD84D1A',
  'alpha-20': '#FFD84D33',
  'alpha-30': '#FFD84D4D',
  'DEFAULT': '#FFD84D',
} as const satisfies Record<keyof typeof alert, string>

export const successDark = {
  '100': '#0D3320',
  '200': '#124528',
  '300': '#175A34',
  '400': '#2FBF74',
  '500': '#57D191',
  '600': '#7FDEAC',
  'alpha-10': '#2FD07C1A',
  'alpha-20': '#2FD07C33',
  'alpha-30': '#2FD07C4D',
  'DEFAULT': '#2FD07C',
} as const satisfies Record<keyof typeof success, string>

export const infoDark = {
  '100': '#14213D',
  '200': '#1B2D54',
  '300': '#24407A',
  '400': '#7FA6FF',
  '500': '#99B8FF',
  '600': '#B8CDFF',
  'alpha-10': '#6E9BFF1A',
  'alpha-20': '#6E9BFF33',
  'alpha-30': '#6E9BFF4D',
  'DEFAULT': '#6E9BFF',
} as const satisfies Record<keyof typeof info, string>

export const onDark = {
  primary: '#04150C',
  secondary: '#04252C',
  danger: '#2B0708',
  alert: '#211B06',
  success: '#06281A',
  info: '#0A1733',
  background: neutralDark[1000],
  surface: neutralDark[1000],
} as const satisfies Record<keyof typeof on, string>

export const borderDark = {
  DEFAULT: neutralDark[400],
} as const satisfies Record<keyof typeof border, string>

// ──────────────────────────────────────────────
// Spacing (Figma ✦/Spacing: 3xs → 5xl)
// ──────────────────────────────────────────────

export const spacing = {
  '3xs': '2px',
  '2xs': '4px',
  'xs': '8px',
  's': '12px',
  'm': '16px',
  'l': '20px',
  'xl': '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '56px',
} as const

// ──────────────────────────────────────────────
// Radius (Figma ✦/Radius: t-shirt scale incl. 10px `l` step)
// ──────────────────────────────────────────────

export const radius = {
  'none': '0',
  '2xs': '2px',
  'xs': '4px',
  's': '6px',
  'm': '8px',
  'l': '10px',
  'xl': '12px',
  '2xl': '16px',
  'full': '999px',
} as const

// ──────────────────────────────────────────────
// Stroke (Figma ✦/Stroke: s/m/l/xl widths)
// ──────────────────────────────────────────────

export const stroke = {
  s: '1px',
  m: '2px',
  l: '4px',
  xl: '6px',
} as const

// ──────────────────────────────────────────────
// Icon (spec icon boxes: 18/20/24px glyphs, 32px control boxes —
// button icons, field prepend/append/info icons, dialog close/header)
// ──────────────────────────────────────────────

export const icon = {
  s: '18px',
  m: '20px',
  l: '24px',
  xl: '32px',
} as const

// ──────────────────────────────────────────────
// Shadows (Figma ✦/Shadow: single-layer elevations on
// shadow/default #333333 @ 20%, plus 5px-spread rings —
// focus = primary base @ 20%, danger = danger base @ 20%.
// Component effects from the spec that live outside the
// elevation scale: field (form-control fill, +hover), badge
// (Figma "Option2/md"), thumb (Figma "Option2/sm"), soft
// (Figma "Elevation/S"), focus-s (2px-spread focus ring))
// ──────────────────────────────────────────────

export const shadow = {
  's': '0px 0px 2px 0px rgba(51, 51, 51, 0.2)',
  'm': '0px 2px 4px 0px rgba(51, 51, 51, 0.2)',
  'l': '0px 5px 12px -1px rgba(51, 51, 51, 0.2)',
  'xl': '0px 16px 40px -8px rgba(51, 51, 51, 0.2)',
  '2xl': '0px 8px 24px 0px rgba(51, 51, 51, 0.2)',
  'focus': '0px 0px 0px 5px rgba(38, 194, 109, 0.2)',
  'focus-s': '0px 0px 0px 2px rgba(38, 194, 109, 0.2)',
  'danger': '0px 0px 0px 5px rgba(251, 55, 72, 0.2)',
  'field': '0px 1px 2px 0px rgba(5, 0, 18, 0.05)',
  'field-hover': '0px 1px 2px 0px rgba(5, 0, 18, 0.1)',
  'badge': '0px 3px 8px 0px rgba(5, 0, 18, 0.13), 0px 2px 4px 0px rgba(5, 0, 18, 0.1)',
  'thumb': '0px 1px 3px 0px rgba(5, 0, 18, 0.12), 0px 1px 5px 0px rgba(5, 0, 18, 0.2)',
  'soft': '0px 2px 4px rgba(27, 28, 29, 0.04)',
} as const

/**
 * Dark counterparts. The light elevations are near-black at 5–20% alpha —
 * arithmetically invisible on dark surfaces (dark-on-dark deltas are below
 * perception). Dark depth is drawn twice: a 1px light rim ring separates the
 * raised surface from its backdrop, and the umbra alpha is raised ~3x so the
 * cast still reads against an already-dark page. Rings (focus/danger) swap to
 * the dark family bases at a slightly higher alpha.
 */
export const shadowDark = {
  's': '0px 0px 0px 1px rgba(255, 255, 255, 0.06), 0px 0px 2px 0px rgba(0, 0, 0, 0.6)',
  'm': '0px 0px 0px 1px rgba(255, 255, 255, 0.06), 0px 2px 4px 0px rgba(0, 0, 0, 0.55)',
  'l': '0px 0px 0px 1px rgba(255, 255, 255, 0.07), 0px 5px 12px -1px rgba(0, 0, 0, 0.55)',
  'xl': '0px 0px 0px 1px rgba(255, 255, 255, 0.07), 0px 16px 40px -8px rgba(0, 0, 0, 0.6)',
  '2xl': '0px 0px 0px 1px rgba(255, 255, 255, 0.07), 0px 8px 24px 0px rgba(0, 0, 0, 0.6)',
  'focus': '0px 0px 0px 5px rgba(46, 204, 119, 0.28)',
  'focus-s': '0px 0px 0px 2px rgba(46, 204, 119, 0.28)',
  'danger': '0px 0px 0px 5px rgba(255, 92, 106, 0.28)',
  'field': '0px 1px 2px 0px rgba(0, 0, 0, 0.4)',
  'field-hover': '0px 1px 2px 0px rgba(0, 0, 0, 0.55)',
  'badge': '0px 0px 0px 1px rgba(255, 255, 255, 0.08), 0px 3px 8px 0px rgba(0, 0, 0, 0.5), 0px 2px 4px 0px rgba(0, 0, 0, 0.4)',
  'thumb': '0px 0px 0px 1px rgba(255, 255, 255, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.5), 0px 1px 5px 0px rgba(0, 0, 0, 0.6)',
  'soft': '0px 0px 0px 1px rgba(255, 255, 255, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.35)',
} as const satisfies Record<keyof typeof shadow, string>

// ──────────────────────────────────────────────
// Typography (Figma ✦/Typography: Manrope, uniform 1.5x
// line-height, letter-spacing 0 on every style)
// ──────────────────────────────────────────────

export const fontFamily = {
  sans: 'Manrope, system-ui, -apple-system, sans-serif',
} as const

export const fontSize = {
  'h1': ['34px', { lineHeight: '51px', letterSpacing: '0px', fontWeight: '700' }],
  'h2': ['28px', { lineHeight: '42px', letterSpacing: '0px', fontWeight: '700' }],
  'h3': ['24px', { lineHeight: '36px', letterSpacing: '0px', fontWeight: '700' }],
  'h4': ['20px', { lineHeight: '30px', letterSpacing: '0px', fontWeight: '500' }],
  'b1': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
  'b1-bold': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '700' }],
  'b2': ['14px', { lineHeight: '21px', letterSpacing: '0px', fontWeight: '400' }],
  'b2-bold': ['14px', { lineHeight: '21px', letterSpacing: '0px', fontWeight: '600' }],
  'b3': ['12px', { lineHeight: '18px', letterSpacing: '0px', fontWeight: '400' }],
  'b3-bold': ['12px', { lineHeight: '18px', letterSpacing: '0px', fontWeight: '600' }],
  'b4': ['10px', { lineHeight: '18px', letterSpacing: '0px', fontWeight: '600' }],
} as const

// ──────────────────────────────────────────────
// Motion (component transitions — not in Figma color page)
// ──────────────────────────────────────────────

export const motion = {
  'duration-fast': '120ms',
  'duration-base': '180ms',
  'duration-slow': '220ms',
  'ease-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// ──────────────────────────────────────────────
// Control anatomy (component geometry used ≥2 times)
// ──────────────────────────────────────────────

export const control = {
  'switch-track-width-sm': '28px',
  'switch-track-height-sm': '16px',
  'switch-track-width-md': '36px',
  'switch-track-height-md': '20px',
  'switch-track-width-lg': '44px',
  'switch-track-height-lg': '24px',
  'switch-thumb-sm': '12px',
  'switch-thumb-md': '16px',
  'switch-thumb-lg': '20px',
  'switch-travel-sm': '6px',
  'switch-travel-md': '8px',
  'switch-travel-lg': '10px',
  'checkbox-sm': '16px',
  'checkbox-md': '20px',
  'checkbox-lg': '24px',
  'avatar-sm': '32px',
  'avatar-md': '40px',
  'avatar-lg': '48px',
} as const

// ──────────────────────────────────────────────
// Aggregated dictionary (UnoCSS / tooling shape)
// ──────────────────────────────────────────────

export const emeraldDesignSystem = {
  colors: {
    primary,
    secondary,
    neutral,
    danger,
    alert,
    success,
    info,
    on,
    background,
    surface,
    border,
    black,
    white,
  },
  spacing,
  borderRadius: radius,
  borderWidth: stroke,
  boxShadow: shadow,
  fontFamily,
  fontSize,
  motion,
  control,
} as const
