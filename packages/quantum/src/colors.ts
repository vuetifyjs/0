/**
 * Flat colour maps published as `--quantum-*` custom properties by the adapter
 * and the bake: every key becomes `--quantum-<key>` plus a `-channels` triplet,
 * and the kit roles are mirrored onto `--v0-*` (SPEC.md "The v0 bridge").
 *
 * Values come from the MD1 colour page (spec/color.md), the component pages
 * SPEC.md "Ink and state" cites, and the lead decisions in SPEC.md (two scrim
 * tokens, 6% hover). Shadows ride these per-theme maps rather than the `:root`
 * foundations so a theme can retune them (SPEC.md "Elevation").
 */

import { alpha, elevation, quantumPalette, quantumPaletteInk, shadow } from './design-system'

// Types
import type { QuantumAccentHue, QuantumHue } from './design-system'

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
export interface QuantumHueRoles {
  /** The primary hue's 500. */
  'primary': string
  /** 700: the status bar and the pressed raised button. */
  'primary-dark': string
  /** 100: related information under a primary region, and the `--v0-surface-tint` bridge. */
  'primary-light': string
  /** The accent hue's A200: FAB, action buttons, text fields, selection, links. */
  'accent': string
  /** A100, the spec's lighter contrast fallback; the contextual data-table header. */
  'accent-light': string
  /** Selection controls, sliders and picker ink: A200 in light, the accent hue's 200 in dark. */
  'accent-control': string
  /** Ink on the primary 500 swatch. */
  'on-primary': string
  /** Ink on the accent A200 swatch. */
  'on-accent': string
  /** Text selection: the accent at 30% (the alpha is a decision). */
  'selection': string
}

/**
 * Derive the role set for another hue pair from the palette: primary 500 / 700 /
 * 100 and accent A200 / A100, with the swatch ink the colour page recommends.
 * Pass the result through `createQuantumPlugin({ theme: { themes } })`.
 *
 * @example
 * ```ts
 * const teal = quantumHueTheme('teal', 'amber')
 *
 * createQuantumPlugin({
 *   theme: {
 *     themes: {
 *       'quantum-light': { colors: teal.light },
 *       'quantum-dark': { colors: teal.dark, dark: true },
 *     },
 *   },
 * })
 * ```
 */
export function quantumHueTheme (primary: QuantumHue, accent: QuantumAccentHue): { light: QuantumHueRoles, dark: QuantumHueRoles } {
  const roles = {
    'primary': quantumPalette[`${primary}-500`],
    'primary-dark': quantumPalette[`${primary}-700`],
    'primary-light': quantumPalette[`${primary}-100`],
    'accent': quantumPalette[`${accent}-a200`],
    'accent-light': quantumPalette[`${accent}-a100`],
    'on-primary': quantumPaletteInk[`${primary}-500`],
    'on-accent': quantumPaletteInk[`${accent}-a200`],
    'selection': alpha(quantumPalette[`${accent}-a200`], 0.3),
  }

  return {
    light: { ...roles, 'accent-control': quantumPalette[`${accent}-a200`] },
    dark: { ...roles, 'accent-control': quantumPalette[`${accent}-200`] },
  }
}

/** The default theme is the colour page's worked example: Indigo primary, Pink accent (spec/color.md 2.1). */
const hues = quantumHueTheme('indigo', 'pink')

const black = quantumPalette.black
const white = quantumPalette.white

/**
 * Kit-bridge roles MD1 never defines and no `Qu*` component reads: Vuetify
 * 1.5's theme defaults for the severities Genesis admonitions consume, with
 * white ink (SPEC.md "The v0 bridge").
 */
const bridge = {
  'info': quantumPalette['blue-500'],
  'on-info': white,
  'success': quantumPalette['green-500'],
  'on-success': white,
  'warning': quantumPalette['orange-600'],
  'on-warning': white,
} as const

/**
 * `satisfies` (not `: Record<string, string>`) so `keyof typeof quantumColors`
 * stays a literal union: the `--v0-*` alias tables in `css.ts` are
 * compile-checked against it, so a renamed token breaks the build instead of
 * silently dropping an alias.
 */
export const quantumColors = {
  ...hues.light,
  // Red A400: the text-field error line and the stepper error step.
  'error': quantumPalette['red-a400'],
  'on-error': quantumPaletteInk['red-a400'],
  // The light theme figure: Grey 100 app bar, Grey 50 background, white sheets.
  'app-bar': quantumPalette['grey-100'],
  'background': quantumPalette['grey-50'],
  'surface': white,
  // Ink: dark text on light backgrounds (colour page).
  'text-primary': alpha(black, 0.87),
  'text-secondary': alpha(black, 0.54),
  'text-disabled': alpha(black, 0.38),
  'text-hint': alpha(black, 0.38),
  'divider': alpha(black, 0.12),
  'icon-active': alpha(black, 0.54),
  'icon-inactive': alpha(black, 0.38),
  'icon-focused': alpha(black, 0.87),
  // State overlays (buttons page; hover from the steppers page).
  'focus': alpha(black, 0.12),
  'pressed': alpha('#999999', 0.4),
  'hover': alpha(black, 0.06),
  'button-disabled': alpha(black, 0.12),
  'button-disabled-text': alpha(black, 0.26),
  // Lead decision 2: Vuetify 1.5's overlay for dialogs and the temporary
  // drawer; the bottom-sheets page's black 20% for bottom sheets.
  'scrim': alpha(quantumPalette['grey-900'], 0.46),
  'scrim-sheet': alpha(black, 0.2),
  // Component surfaces whose pages state a colour outside the theme roles.
  'snackbar': '#323232',
  'snackbar-text': white,
  'tooltip': alpha(quantumPalette['grey-700'], 0.9),
  'tooltip-text': white,
  'chip': quantumPalette['grey-300'],
  'grid-list-bar': alpha(black, 0.6),
  ...bridge,
  ...scale('shadow', shadow),
  ...scale('elevation', elevation),
} satisfies Record<string, string>

/**
 * Dark counterpart of {@link quantumColors}. `satisfies` pins it to the light
 * map's exact key set, so a token added or renamed on one side of the pair is
 * a compile error, not a silently unthemed surface. The spec's dark theme is
 * surfaces and ink, not lights: the roles and the shadows stay the same.
 */
export const quantumDarkColors = {
  ...hues.dark,
  'error': quantumPalette['red-a400'],
  'on-error': quantumPaletteInk['red-a400'],
  // The dark theme figure: Grey 900 app bar, #303030 background, Grey 800 sheets.
  'app-bar': quantumPalette['grey-900'],
  'background': '#303030',
  'surface': quantumPalette['grey-800'],
  // Ink: light text on dark backgrounds (colour page).
  'text-primary': white,
  'text-secondary': alpha(white, 0.7),
  'text-disabled': alpha(white, 0.5),
  'text-hint': alpha(white, 0.5),
  'divider': alpha(white, 0.12),
  'icon-active': white,
  'icon-inactive': alpha(white, 0.5),
  'icon-focused': white,
  'focus': alpha(white, 0.12),
  'pressed': alpha('#CCCCCC', 0.25),
  'hover': alpha(white, 0.1),
  'button-disabled': alpha(white, 0.12),
  'button-disabled-text': alpha(white, 0.3),
  'scrim': alpha(quantumPalette['grey-900'], 0.46),
  'scrim-sheet': alpha(black, 0.2),
  'snackbar': '#323232',
  'snackbar-text': white,
  'tooltip': alpha(quantumPalette['grey-700'], 0.9),
  'tooltip-text': white,
  // Image-only on the chips page; Vuetify 1.5's dark value.
  'chip': '#555555',
  'grid-list-bar': alpha(black, 0.6),
  ...bridge,
  ...scale('shadow', shadow),
  ...scale('elevation', elevation),
} satisfies Record<keyof typeof quantumColors, string>
