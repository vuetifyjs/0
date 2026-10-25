/**
 * Material Design 1 design-system token dictionary (2014 to 2017)
 * as pinned in SPEC.md, every value sourced in the notes under `spec/`
 * (`color.md`, `typography.md`, `elevation.md`, `motion.md`, `layout.md`,
 * `iconography.md`).
 *
 * Consumed by:
 * - `css.ts` -> the `:root` foundations (`--md1-*`) the adapter and the bake emit
 * - `colors.ts` -> the two flat theme maps v0's theme plugin publishes per theme
 * - tooling and docs through `md1DesignSystem`
 *
 * Units: dp and sp are px, 1:1 (layout/units-measurements). Everything here is
 * theme-independent; roles, ink, state and shadows live in `colors.ts` because
 * the dark theme overrides them.
 */

// Framework
import { md1 } from '@vuetify/v0/palettes/md1'
import { hexToRgb, isObject, isString } from '@vuetify/v0/utilities'

// Palette (spec/color.md 1.1 and 1.2)

export type Md1Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
export type Md1AccentShade = 'a100' | 'a200' | 'a400' | 'a700'
export type Md1AccentHue =
  | 'red'
  | 'pink'
  | 'purple'
  | 'deep-purple'
  | 'indigo'
  | 'blue'
  | 'light-blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'light-green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'deep-orange'
export type Md1NeutralHue = 'brown' | 'grey' | 'blue-grey'
export type Md1Hue = Md1AccentHue | Md1NeutralHue
export type Md1PaletteKey =
  | `${Md1Hue}-${Md1Shade}`
  | `${Md1AccentHue}-${Md1AccentShade}`
  | 'black'
  | 'white'
/** The colour page's recommended text colour on a swatch. */
export type Md1Ink = '#000000' | '#FFFFFF'

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const satisfies readonly Md1Shade[]
const ACCENTS = ['a100', 'a200', 'a400', 'a700'] as const satisfies readonly Md1AccentShade[]

/** md1's camelCase hue keys mapped to the spec's kebab-case token names. */
const ACCENT_HUES = {
  red: 'red',
  pink: 'pink',
  purple: 'purple',
  deepPurple: 'deep-purple',
  indigo: 'indigo',
  blue: 'blue',
  lightBlue: 'light-blue',
  cyan: 'cyan',
  teal: 'teal',
  green: 'green',
  lightGreen: 'light-green',
  lime: 'lime',
  yellow: 'yellow',
  amber: 'amber',
  orange: 'orange',
  deepOrange: 'deep-orange',
} as const satisfies Record<string, Md1AccentHue>

/**
 * v0's md1 palette ships the sixteen accent-bearing hues only. The three
 * neutral ladders complete the spec's 256 values; typed from spec/color.md
 * 1.1, where all 256 values were verified identical across the 2018 page, the
 * 2016 page and Vuetify 1.5.
 */
const NEUTRAL_HUES = {
  'brown': {
    50: '#EFEBE9',
    100: '#D7CCC8',
    200: '#BCAAA4',
    300: '#A1887F',
    400: '#8D6E63',
    500: '#795548',
    600: '#6D4C41',
    700: '#5D4037',
    800: '#4E342E',
    900: '#3E2723',
  },
  'grey': {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  'blue-grey': {
    50: '#ECEFF1',
    100: '#CFD8DC',
    200: '#B0BEC5',
    300: '#90A4AE',
    400: '#78909C',
    500: '#607D8B',
    600: '#546E7A',
    700: '#455A64',
    800: '#37474F',
    900: '#263238',
  },
} as const satisfies Record<Md1NeutralHue, Record<Md1Shade, string>>

function flatten (): Record<string, string> {
  const out: Record<string, string> = {}

  for (const [key, hue] of Object.entries(ACCENT_HUES)) {
    const shades = md1[key]
    if (!isObject(shades)) continue
    for (const [shade, value] of Object.entries(shades)) {
      if (isString(value)) out[`${hue}-${shade.toLowerCase()}`] = value.toUpperCase()
    }
  }

  for (const [hue, shades] of Object.entries(NEUTRAL_HUES)) {
    for (const [shade, value] of Object.entries(shades)) out[`${hue}-${shade}`] = value
  }

  out.black = '#000000'
  out.white = '#FFFFFF'

  return out
}

/**
 * `--md1-<hue>-<shade>`: the 19 hues (50 to 900, plus A100 to A700 on the
 * 16 accent-bearing hues) and black and white, 256 values, emitted on `:root`.
 */
export const md1Palette = flatten() as Readonly<Record<Md1PaletteKey, string>>

/**
 * Recommended text colour per swatch (spec/color.md 1.2, the 2018 column, which
 * wins over the 2016 page on the six contested cells): the ten shades, then the
 * four accents where the hue has them. `B` black, `W` white.
 */
const INK = {
  'red': ['BBBBWWWWWW', 'BWWW'],
  'pink': ['BBBBWWWWWW', 'BWWW'],
  'purple': ['BBBWWWWWWW', 'BWWW'],
  'deep-purple': ['BBBWWWWWWW', 'BWWW'],
  'indigo': ['BBBWWWWWWW', 'BWWW'],
  'blue': ['BBBBBBWWWW', 'BWWW'],
  'light-blue': ['BBBBBBBWWW', 'BBBW'],
  'cyan': ['BBBBBBBWWW', 'BBBB'],
  'teal': ['BBBBBWWWWW', 'BBBB'],
  'green': ['BBBBBBWWWW', 'BBBB'],
  'light-green': ['BBBBBBBBWW', 'BBBB'],
  'lime': ['BBBBBBBBBW', 'BBBB'],
  'yellow': ['BBBBBBBBBB', 'BBBB'],
  'amber': ['BBBBBBBBBB', 'BBBB'],
  'orange': ['BBBBBBBBBW', 'BBBB'],
  'deep-orange': ['BBBBBBWWWW', 'BBWW'],
  'brown': ['BBBWWWWWWW'],
  'grey': ['BBBBBBWWWW'],
  'blue-grey': ['BBBBWWWWWW'],
} as const satisfies Record<Md1Hue, readonly [string, string?]>

function ink (letter: string | undefined): Md1Ink {
  return letter === 'W' ? '#FFFFFF' : '#000000'
}

function inks (): Record<string, Md1Ink> {
  const out: Record<string, Md1Ink> = { black: '#FFFFFF', white: '#000000' }

  for (const [hue, [shades, accents = '']] of Object.entries(INK)) {
    for (const [index, shade] of SHADES.entries()) out[`${hue}-${shade}`] = ink(shades[index])
    for (const [index, accent] of ACCENTS.entries()) {
      if (accents[index]) out[`${hue}-${accent}`] = ink(accents[index])
    }
  }

  return out
}

/** Black or white per swatch, for a consumer deriving `on-primary` from a custom hue. */
export const md1PaletteInk = inks() as Readonly<Record<Md1PaletteKey, Md1Ink>>

/** `rgba()` of a hex colour at an opacity: the colour page states ink as black or white at a percentage. */
export function alpha (hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Typography (spec/typography.md)

export type Md1TypeStyle =
  | 'display-4'
  | 'display-3'
  | 'display-2'
  | 'display-1'
  | 'headline'
  | 'title'
  | 'subheading'
  | 'subheading-2'
  | 'body-2'
  | 'body-1'
  | 'caption'
  | 'button'
  | 'menu'

export interface Md1TypeTokens {
  size: string
  weight: string
  leading: string
  tracking: string
  transform: string
}

/** Roboto then Noto (the page's stack); the weights are Vuetify 1.5's numbers for the page's names. */
export const font = {
  'family': 'Roboto, Noto, sans-serif',
  'weight-light': '300',
  'weight-regular': '400',
  'weight-medium': '500',
  'weight-bold': '700',
} as const

/**
 * The English type scale at device sizes. Single-line styles take
 * `line-height: 1`, except Display 3, which takes Vuetify 1.5's 1.35 (var:101;
 * the page gives no number). Tracking is the page's Adobe unit read as 1/1000
 * em (the unit is `low`), except where Vuetify 1.5 sets a value: Display 4
 * -0.04em, Display 3 -0.02em, Title 0.02em (var:100-105). Menu's metrics are
 * `low` (absent from the archived scale image).
 */
export const type = {
  'display-4': { size: '112px', weight: font['weight-light'], leading: '1', tracking: '-0.04em', transform: 'none' },
  'display-3': { size: '56px', weight: font['weight-regular'], leading: '1.35', tracking: '-0.02em', transform: 'none' },
  'display-2': { size: '45px', weight: font['weight-regular'], leading: '48px', tracking: '0', transform: 'none' },
  'display-1': { size: '34px', weight: font['weight-regular'], leading: '40px', tracking: '0', transform: 'none' },
  'headline': { size: '24px', weight: font['weight-regular'], leading: '32px', tracking: '0', transform: 'none' },
  'title': { size: '20px', weight: font['weight-medium'], leading: '1', tracking: '0.02em', transform: 'none' },
  'subheading': { size: '16px', weight: font['weight-regular'], leading: '24px', tracking: '0.01em', transform: 'none' },
  'subheading-2': { size: '16px', weight: font['weight-regular'], leading: '28px', tracking: '0.01em', transform: 'none' },
  'body-2': { size: '14px', weight: font['weight-medium'], leading: '24px', tracking: '0.01em', transform: 'none' },
  'body-1': { size: '14px', weight: font['weight-regular'], leading: '20px', tracking: '0.01em', transform: 'none' },
  'caption': { size: '12px', weight: font['weight-regular'], leading: '1', tracking: '0.02em', transform: 'none' },
  'button': { size: '14px', weight: font['weight-medium'], leading: '1', tracking: '0.01em', transform: 'uppercase' },
  'menu': { size: '14px', weight: font['weight-medium'], leading: '1', tracking: '0.01em', transform: 'none' },
} as const satisfies Record<Md1TypeStyle, Md1TypeTokens>

/** Desktop (`pointer: fine`) sizes: subheading 15 sp, body and menu 13 sp. */
export const typeDesktop = {
  'subheading': { size: '15px' },
  'subheading-2': { size: '15px' },
  'body-2': { size: '13px' },
  'body-1': { size: '13px' },
  'menu': { size: '13px' },
} as const satisfies Partial<Record<Md1TypeStyle, Partial<Md1TypeTokens>>>

/** Dense scripts (ja, ko, zh): one sp larger from title down, the dense leading column. */
export const typeDense = {
  'display-2': { leading: '63px' },
  'display-1': { leading: '48px' },
  'headline': { leading: '34px' },
  'title': { size: '21px' },
  'subheading': { size: '17px', leading: '26px' },
  'subheading-2': { size: '17px', leading: '30px' },
  'body-2': { size: '15px', leading: '26px' },
  'body-1': { size: '15px', leading: '23px' },
  'caption': { size: '13px' },
  'button': { size: '15px' },
  'menu': { size: '15px' },
} as const satisfies Partial<Record<Md1TypeStyle, Partial<Md1TypeTokens>>>

/**
 * Tall scripts (ar, hi, th, vi and the rest of the page's list): the dense
 * sizes and leading, Regular and Bold only because Noto ships no Light or
 * Medium for them (the page's own table, Bold where English is Medium).
 */
export const typeTall = {
  'display-4': { weight: font['weight-regular'] },
  'display-2': typeDense['display-2'],
  'display-1': typeDense['display-1'],
  'headline': typeDense.headline,
  'title': { ...typeDense.title, weight: font['weight-bold'] },
  'subheading': typeDense.subheading,
  'subheading-2': typeDense['subheading-2'],
  'body-2': { ...typeDense['body-2'], weight: font['weight-bold'] },
  'body-1': typeDense['body-1'],
  'caption': typeDense.caption,
  'button': { ...typeDense.button, weight: font['weight-bold'] },
  'menu': { ...typeDense.menu, weight: font['weight-bold'] },
} as const satisfies Partial<Record<Md1TypeStyle, Partial<Md1TypeTokens>>>

/** Dense and tall scripts under `pointer: fine`: the desktop column of the page's script tables. */
export const typeScriptDesktop = {
  'subheading': { size: '16px' },
  'subheading-2': { size: '16px' },
  'body-2': { size: '14px' },
  'body-1': { size: '14px' },
  'menu': { size: '14px' },
} as const satisfies Partial<Record<Md1TypeStyle, Partial<Md1TypeTokens>>>

/** The page's language codes per script category and the font stack each one adds. */
export const scripts = {
  dense: {
    languages: ['ja', 'ko', 'zh'],
    family: 'Roboto, "Noto Sans CJK", Noto, sans-serif',
  },
  tall: {
    languages: ['ar', 'bn', 'fa', 'gu', 'hi', 'km', 'kn', 'lo', 'ml', 'mr', 'my', 'ne', 'pa', 'si', 'ta', 'te', 'th', 'ur', 'vi'],
    family: 'Roboto, "Noto Sans", Noto, sans-serif',
  },
} as const

/** The ink role each style takes: display and caption at the secondary tier (54%), the rest at primary (87%). */
export const typeInk = {
  'display-4': 'secondary',
  'display-3': 'secondary',
  'display-2': 'secondary',
  'display-1': 'secondary',
  'headline': 'primary',
  'title': 'primary',
  'subheading': 'primary',
  'subheading-2': 'primary',
  'body-2': 'primary',
  'body-1': 'primary',
  'caption': 'secondary',
  'button': 'primary',
  'menu': 'primary',
} as const satisfies Record<Md1TypeStyle, 'primary' | 'secondary'>

// Elevation (spec/elevation.md)

/** The three shadow layers' opacities; `colors.ts` publishes them per theme so a dark theme can retune every level at once. */
export const shadow = {
  umbra: 'rgba(0, 0, 0, 0.2)',
  penumbra: 'rgba(0, 0, 0, 0.14)',
  ambient: 'rgba(0, 0, 0, 0.12)',
} as const

/** Offset, blur and spread per level, Vuetify 1.5's `_elevations.styl` (the only pixel recipe; the spec states dp only). */
const UMBRA = [
  '0px 0px 0px 0px', '0px 2px 1px -1px', '0px 3px 1px -2px', '0px 3px 3px -2px', '0px 2px 4px -1px',
  '0px 3px 5px -1px', '0px 3px 5px -1px', '0px 4px 5px -2px', '0px 5px 5px -3px', '0px 5px 6px -3px',
  '0px 6px 6px -3px', '0px 6px 7px -4px', '0px 7px 8px -4px', '0px 7px 8px -4px', '0px 7px 9px -4px',
  '0px 8px 9px -5px', '0px 8px 10px -5px', '0px 8px 11px -5px', '0px 9px 11px -5px', '0px 9px 12px -6px',
  '0px 10px 13px -6px', '0px 10px 13px -6px', '0px 10px 14px -6px', '0px 11px 14px -7px', '0px 11px 15px -7px',
] as const

const PENUMBRA = [
  '0px 0px 0px 0px', '0px 1px 1px 0px', '0px 2px 2px 0px', '0px 3px 4px 0px', '0px 4px 5px 0px',
  '0px 5px 8px 0px', '0px 6px 10px 0px', '0px 7px 10px 1px', '0px 8px 10px 1px', '0px 9px 12px 1px',
  '0px 10px 14px 1px', '0px 11px 15px 1px', '0px 12px 17px 2px', '0px 13px 19px 2px', '0px 14px 21px 2px',
  '0px 15px 22px 2px', '0px 16px 24px 2px', '0px 17px 26px 2px', '0px 18px 28px 2px', '0px 19px 29px 2px',
  '0px 20px 31px 3px', '0px 21px 33px 3px', '0px 22px 35px 3px', '0px 23px 36px 3px', '0px 24px 38px 3px',
] as const

const AMBIENT = [
  '0px 0px 0px 0px', '0px 1px 3px 0px', '0px 1px 5px 0px', '0px 1px 8px 0px', '0px 1px 10px 0px',
  '0px 1px 14px 0px', '0px 1px 18px 0px', '0px 2px 16px 1px', '0px 3px 14px 2px', '0px 3px 16px 2px',
  '0px 4px 18px 3px', '0px 4px 20px 3px', '0px 5px 22px 4px', '0px 5px 24px 4px', '0px 5px 26px 4px',
  '0px 6px 28px 5px', '0px 6px 30px 5px', '0px 6px 32px 5px', '0px 7px 34px 6px', '0px 7px 36px 6px',
  '0px 8px 38px 7px', '0px 8px 40px 7px', '0px 8px 42px 7px', '0px 9px 44px 8px', '0px 9px 46px 8px',
] as const

/**
 * The three layers of one level read the shadow tokens with their literal
 * fallbacks, so retuning `--md1-shadow-*` on a theme retunes every level
 * declared beside it.
 */
function layer (level: number): string {
  return `${UMBRA[level]} var(--md1-shadow-umbra, ${shadow.umbra}), `
    + `${PENUMBRA[level]} var(--md1-shadow-penumbra, ${shadow.penumbra}), `
    + `${AMBIENT[level]} var(--md1-shadow-ambient, ${shadow.ambient})`
}

/** `--md1-elevation-0` to `--md1-elevation-24`: the full three-layer `box-shadow` per dp. */
export const elevation = {
  0: layer(0),
  1: layer(1),
  2: layer(2),
  3: layer(3),
  4: layer(4),
  5: layer(5),
  6: layer(6),
  7: layer(7),
  8: layer(8),
  9: layer(9),
  10: layer(10),
  11: layer(11),
  12: layer(12),
  13: layer(13),
  14: layer(14),
  15: layer(15),
  16: layer(16),
  17: layer(17),
  18: layer(18),
  19: layer(19),
  20: layer(20),
  21: layer(21),
  22: layer(22),
  23: layer(23),
  24: layer(24),
} as const

// Motion (spec/motion.md)

export const easing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const

/** Mobile durations: entering, leaving, the typical transition and the large full-screen one. */
export const duration = {
  enter: '225ms',
  leave: '195ms',
  standard: '300ms',
  complex: '375ms',
} as const

function longer (value: string): string {
  return `${Math.round(Number.parseFloat(value) * 1.3)}ms`
}

/** Tablet (`min-width: 600px` and `pointer: coarse`): about 30% longer than mobile, the page's 300 to 390 ms. */
export const durationTablet = {
  enter: longer(duration.enter),
  leave: longer(duration.leave),
  standard: longer(duration.standard),
  complex: longer(duration.complex),
} as const satisfies Record<keyof typeof duration, string>

/** Desktop (`pointer: fine`): 150 to 200 ms, faster and simpler than mobile. */
export const durationDesktop = {
  enter: '150ms',
  leave: '150ms',
  standard: '200ms',
  complex: '200ms',
} as const satisfies Record<keyof typeof duration, string>

/** The choreography page's stagger ceiling, and Vuetify 1.5's ripple expand and fade (var:342-343; read by `Md1Ripple`). */
export const motion = {
  'stagger': '20ms',
  'ripple-duration': '250ms',
  'ripple-fade': '300ms',
} as const

// Layout (spec/layout.md, spec/iconography.md)

/** The 8 dp baseline grid, one to five steps. */
export const spacing = {
  1: '8px',
  2: '16px',
  3: '24px',
  4: '32px',
  5: '40px',
} as const

/**
 * Handset keylines, the standard increment, the touch target, the two radii,
 * the system icon sizes (24 dp, 20 dp in dense hosts) and the 40 dp avatar.
 */
export const layout = {
  'keyline-margin': '16px',
  'keyline-content': '72px',
  'increment': '56px',
  'touch-target': '48px',
  'radius': '2px',
  'radius-box': '4px',
  'icon-size': '24px',
  'icon-size-dense': '20px',
  'avatar-size': '40px',
} as const

/** From 600 px (the handset / tablet split of layout/responsive-ui). */
export const layoutTablet = {
  'keyline-margin': '24px',
  'keyline-content': '80px',
  'increment': '64px',
} as const satisfies Partial<Record<keyof typeof layout, string>>

/**
 * The responsive-ui page's breakpoint widths, keyed by the nominal dp value;
 * the desktop rows (1024 and above) carry the page's 16 px reduction for
 * browser chrome. Breakpoints cannot be custom properties, so they ship as this
 * map and as the documented table. v0's `useBreakpoints` has its own named
 * breakpoints (`xs` to `xxl`) and takes nothing from Material Design 1: a consumer that
 * needs the spec's widths assigns these values to those names through
 * `createBreakpointsPlugin({ breakpoints })`, or reads one with `useMediaQuery`.
 */
export const md1Breakpoints = {
  480: 480,
  600: 600,
  840: 840,
  960: 960,
  1280: 1264,
  1440: 1424,
  1600: 1584,
  1920: 1904,
} as const satisfies Record<number, number>

// Aggregated dictionary (tooling shape)

export const md1DesignSystem = {
  palette: md1Palette,
  ink: md1PaletteInk,
  font,
  type,
  typeDesktop,
  typeDense,
  typeTall,
  typeScriptDesktop,
  typeInk,
  scripts,
  shadow,
  elevation,
  easing,
  duration,
  durationTablet,
  durationDesktop,
  motion,
  spacing,
  layout,
  layoutTablet,
  breakpoints: md1Breakpoints,
} as const
