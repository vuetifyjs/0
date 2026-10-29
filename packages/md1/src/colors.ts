/**
 * Flat colour maps published as `--md1-*` custom properties by the adapter
 * and the bake: every key becomes `--md1-<key>` plus a `-channels` triplet,
 * and the kit roles are mirrored onto `--v0-*` (SPEC.md "The v0 bridge").
 *
 * Values come from the MD1 colour page (spec/color.md), the component pages
 * SPEC.md "Ink and state" cites, Vuetify 1.5.24's theme where a page is silent
 * (SPEC.md "Authority order") and the lead decisions in SPEC.md (two scrim
 * tokens). Shadows ride these per-theme maps rather than the `:root`
 * foundations so a theme can retune them (SPEC.md "Elevation").
 */

// Framework
import { hexToRgb } from '@vuetify/v0/utilities'

import { alpha, elevation, md1Palette, md1PaletteInk, shadow } from './design-system'

// Types
import type { Md1AccentHue, Md1Hue } from './design-system'

type Scale = Record<string, string>

/** `DEFAULT` collapses to the family name; every other key is namespaced under it. */
type Scaled<N extends string, T extends Scale> = {
  [K in keyof T & string as K extends 'DEFAULT' ? N : `${N}-${K}`]: string
}

function scale<N extends string, T extends Scale> (name: N, values: T): Scaled<N, T> {
  const out: Scale = {}
  for (const [key, val] of Object.entries(values)) {
    out[key === 'DEFAULT' ? name : `${name}-${key}`] = val
  }
  return out as Scaled<N, T>
}

/** The role tokens a primary and an accent hue derive (SPEC.md "Roles"). */
export interface Md1HueRoles {
  /** The primary hue's 500. */
  'primary': string
  /** 700: the status bar and the pressed raised button. */
  'primary-dark': string
  /** 100: related information under a primary region (the extension fill under a primary bar). */
  'primary-light': string
  /**
   * Primary-coloured text and icons on the theme's sheet: the 500 on light;
   * on dark the first lighter tone that reaches 4.5:1 on the selected list
   * band (colour page: "lighter or darker tones of your primary color" for
   * contrast, WCAG AA). Indigo 100 for the default theme.
   */
  'primary-ink': string
  /** The accent hue's A200: FAB, action buttons, text fields, selection, links. */
  'accent': string
  /** The accent hue's 50: the contextual data-table header (data tables page). */
  'accent-light': string
  /** The switch, the slider and the picker ink: A200 in light, the accent hue's 200 in dark. */
  'accent-control': string
  /** Ink on the primary 500 swatch. */
  'on-primary': string
  /** Ink on the accent A200 swatch. */
  'on-accent': string
  /** Text selection: the accent at 30% (the alpha is a decision). */
  'selection': string
  /**
   * The kit bridge's `--v0-surface-tint` (SPEC.md "The v0 bridge"): the primary
   * hue's 100 on the light theme and its 700 on the dark one, so kit chrome
   * tints toward the primary without paling under white ink. MD1 names no
   * such role and no `Md1*` component reads it.
   */
  'surface-tint': string
}

type Rgb = { r: number, g: number, b: number }

const TONES = ['500', '400', '300', '200', '100', '50'] as const

function luminance ({ r, g, b }: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map(channel => {
    const c = channel / 255

    return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * lr! + 0.7152 * lg! + 0.0722 * lb!
}

function contrast (a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].toSorted((x, y) => y - x)

  return (light! + 0.05) / (dark! + 0.05)
}

/**
 * The lightest dark surface primary ink rests on: the Grey 800 sheet under
 * the selected list band, white 7% (`list-selected`), about #4F4F4F. Ink
 * that clears 4.5:1 here clears it on the plain sheet, the #303030
 * background and the Grey 900 bars too.
 */
const BAND: Rgb = (() => {
  const { r, g, b } = hexToRgb(md1Palette['grey-800'])

  return { r: r + (255 - r) * 0.07, g: g + (255 - g) * 0.07, b: b + (255 - b) * 0.07 }
})()

function ink (hue: Md1Hue): string {
  const tone = TONES.find(tone => contrast(hexToRgb(md1Palette[`${hue}-${tone}`]), BAND) >= 4.5) ?? '50'

  return md1Palette[`${hue}-${tone}`]
}

/**
 * Derive the role set for another hue pair from the palette: primary 500 / 700 /
 * 100 and accent A200 / 50, with the swatch ink the colour page recommends.
 * Pass the result through `createMd1Plugin({ theme: { themes } })`.
 *
 * @example
 * ```ts
 * const teal = md1HueTheme('teal', 'amber')
 *
 * createMd1Plugin({
 *   theme: {
 *     themes: {
 *       'md1-light': { colors: teal.light },
 *       'md1-dark': { colors: teal.dark, dark: true },
 *     },
 *   },
 * })
 * ```
 */
export function md1HueTheme (primary: Md1Hue, accent: Md1AccentHue): { light: Md1HueRoles, dark: Md1HueRoles } {
  const roles = {
    'primary': md1Palette[`${primary}-500`],
    'primary-dark': md1Palette[`${primary}-700`],
    'primary-light': md1Palette[`${primary}-100`],
    'accent': md1Palette[`${accent}-a200`],
    'accent-light': md1Palette[`${accent}-50`],
    'on-primary': md1PaletteInk[`${primary}-500`],
    'on-accent': md1PaletteInk[`${accent}-a200`],
    'selection': alpha(md1Palette[`${accent}-a200`], 0.3),
  }

  return {
    light: {
      ...roles,
      'primary-ink': md1Palette[`${primary}-500`],
      'accent-control': md1Palette[`${accent}-a200`],
      'surface-tint': md1Palette[`${primary}-100`],
    },
    dark: {
      ...roles,
      'primary-ink': ink(primary),
      'accent-control': md1Palette[`${accent}-200`],
      'surface-tint': md1Palette[`${primary}-700`],
    },
  }
}

/** The default theme is the colour page's worked example: Indigo primary, Pink accent (spec/color.md 2.1). */
const hues = md1HueTheme('indigo', 'pink')

const black = md1Palette.black
const white = md1Palette.white

/**
 * Kit-bridge roles MD1 never defines and no `Md1*` component reads: Vuetify
 * 1.5's theme defaults for the severities Genesis admonitions consume, with
 * white ink (SPEC.md "The v0 bridge").
 */
const bridge = {
  'info': md1Palette['blue-500'],
  'on-info': white,
  'success': md1Palette['green-500'],
  'on-success': white,
  'warning': md1Palette['orange-600'],
  'on-warning': white,
} as const

/**
 * `satisfies` (not `: Record<string, string>`) so `keyof typeof md1Colors`
 * stays a literal union: the `--v0-*` alias tables in `css.ts` are
 * compile-checked against it, so a renamed token breaks the build instead of
 * silently dropping an alias.
 */
export const md1Colors = {
  ...hues.light,
  // Red A400: the text-field error line and the stepper error step.
  'error': md1Palette['red-a400'],
  'on-error': md1PaletteInk['red-a400'],
  // The light theme figure: Grey 100 app bar, Grey 50 background, white sheets.
  'app-bar': md1Palette['grey-100'],
  'background': md1Palette['grey-50'],
  'surface': white,
  // Ink: dark text on light backgrounds (colour page).
  'text-primary': alpha(black, 0.87),
  'text-secondary': alpha(black, 0.54),
  'text-disabled': alpha(black, 0.38),
  'text-hint': alpha(black, 0.38),
  // The text-fields page's placeholder: 42% black (3:1), 50% white.
  'placeholder': alpha(black, 0.42),
  'divider': alpha(black, 0.12),
  'icon-active': alpha(black, 0.54),
  'icon-inactive': alpha(black, 0.38),
  'icon-focused': alpha(black, 0.87),
  // State overlays (buttons page). `hover` is the text-fields page's box fill
  // and the selection-control halo the sheets measure; `list-hover` is
  // Vuetify 1.5's list-tile hover for lists and menus (th:51-52);
  // `list-selected` is the selected list item's full-bleed band, sampled
  // from the navigation drawer page's "List item selected" figure (#E8E8E8
  // on the #FAFAFA drawer).
  'focus': alpha(black, 0.12),
  'pressed': alpha('#999999', 0.4),
  'hover': alpha(black, 0.06),
  'list-hover': alpha(black, 0.04),
  'list-selected': alpha(black, 0.07),
  // The bottom navigation page's figures draw inactive actions in the secondary 54%.
  'bottom-navigation-inactive': alpha(black, 0.54),
  'button-disabled': alpha(black, 0.12),
  'button-disabled-text': alpha(black, 0.26),
  // Lead decision 2: Vuetify 1.5's overlay for dialogs and the temporary
  // drawer; the bottom-sheets page's black 20% for bottom sheets.
  'scrim': alpha(md1Palette['grey-900'], 0.46),
  'scrim-sheet': alpha(black, 0.2),
  // Component surfaces whose pages state a colour outside the theme roles.
  'snackbar': '#323232',
  'snackbar-text': white,
  'tooltip': alpha(md1Palette['grey-700'], 0.9),
  'tooltip-text': white,
  'chip': md1Palette['grey-300'],
  'grid-list-bar': alpha(black, 0.6),
  // Vuetify 1.5 gap fills: the focused expansion-panel header (th:49, the
  // page's Grey 200), the stepper sheet (`_steppers.styl:4-5`) and the
  // focused slider line (th:65).
  'panel-focus': md1Palette['grey-200'],
  'stepper': white,
  'slider-focused': alpha(black, 0.38),
  ...bridge,
  ...scale('shadow', shadow),
  ...scale('elevation', elevation),
} satisfies Record<string, string>

/**
 * Dark counterpart of {@link md1Colors}. `satisfies` pins it to the light
 * map's exact key set, so a token added or renamed on one side of the pair is
 * a compile error, not a silently unthemed surface. The spec's dark theme is
 * surfaces and ink, not lights: the roles and the shadows stay the same.
 */
export const md1DarkColors = {
  ...hues.dark,
  'error': md1Palette['red-a400'],
  'on-error': md1PaletteInk['red-a400'],
  // The dark theme figure: Grey 900 app bar, #303030 background, Grey 800 sheets.
  'app-bar': md1Palette['grey-900'],
  'background': '#303030',
  'surface': md1Palette['grey-800'],
  // Ink: light text on dark backgrounds (colour page).
  'text-primary': white,
  'text-secondary': alpha(white, 0.7),
  'text-disabled': alpha(white, 0.5),
  'text-hint': alpha(white, 0.5),
  'placeholder': alpha(white, 0.5),
  'divider': alpha(white, 0.12),
  'icon-active': white,
  'icon-inactive': alpha(white, 0.5),
  'icon-focused': white,
  'focus': alpha(white, 0.12),
  'pressed': alpha('#CCCCCC', 0.25),
  'hover': alpha(white, 0.1),
  'list-hover': alpha(white, 0.08),
  // A decision: the figure is light only, so dark mirrors the 7% in white.
  'list-selected': alpha(white, 0.07),
  // A decision: no figure shows a dark bar, so inactive actions take the
  // dimmest white that keeps a label at 4.5:1 on Grey 800 (58%, 4.6:1),
  // which sets them further apart from the lighter primary tone.
  'bottom-navigation-inactive': alpha(white, 0.58),
  'button-disabled': alpha(white, 0.12),
  'button-disabled-text': alpha(white, 0.3),
  'scrim': alpha(md1Palette['grey-900'], 0.46),
  'scrim-sheet': alpha(black, 0.2),
  'snackbar': '#323232',
  'snackbar-text': white,
  'tooltip': alpha(md1Palette['grey-700'], 0.9),
  'tooltip-text': white,
  // Image-only on the chips page; Vuetify 1.5's dark value.
  'chip': '#555555',
  'grid-list-bar': alpha(black, 0.6),
  'panel-focus': '#494949',
  'stepper': '#303030',
  'slider-focused': alpha(white, 0.3),
  ...bridge,
  ...scale('shadow', shadow),
  ...scale('elevation', elevation),
} satisfies Record<keyof typeof md1Colors, string>
