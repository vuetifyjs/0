/**
 * Emerald Design System — Token Definitions
 *
 * Extracted from the canonical Figma spec "Emerald 1.0 Copy"
 * (fileKey mRyzZtj2AmJCKhnj06MXj9), bound-variable values.
 * These tokens feed the UnoCSS theme config and the Emerald
 * theme plugin, which publishes them as `--emerald-*` CSS vars.
 *
 * Scale structure follows the spec: brand + neutral families run
 * 100–1000; semantic families (danger/alert/success/info) run
 * 100–600. Each family carries an Alpha 10/20/30 tier built on the
 * family base color, exposed as `alpha-10|20|30` keys. `DEFAULT`
 * aliases point at each family's spec base value (the alpha base).
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
  '200': '#EBF0F4',
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
// Full theme export (UnoCSS theme config shape)
// ──────────────────────────────────────────────

export const emeraldTheme = {
  colors: {
    primary,
    secondary,
    neutral,
    danger,
    alert,
    success,
    info,
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
} as const
