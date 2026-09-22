/**
 * Flat color map published as CSS custom properties by the Emerald adapter.
 * Keys become `--emerald-{key}` (and `--v0-*` aliases for kit interop).
 */

import {
  alert,
  alertDark,
  background,
  border,
  borderDark,
  danger,
  dangerDark,
  info,
  infoDark,
  neutral,
  neutralDark,
  on,
  onDark,
  primary,
  primaryDark,
  secondary,
  secondaryDark,
  shadow,
  shadowDark,
  success,
  successDark,
  surface,
} from './design-system'

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

/**
 * `satisfies` (not `: Record<string, string>`) so `keyof typeof emeraldColors`
 * stays a literal union — the adapter's `--v0-*` alias tables are compile-checked
 * against it, so a renamed token breaks the build instead of silently dropping
 * an alias.
 */
export const emeraldColors = {
  ...scale('primary', primary),
  ...scale('secondary', secondary),
  ...scale('neutral', neutral),
  ...scale('danger', danger),
  ...scale('alert', alert),
  ...scale('success', success),
  ...scale('info', info),
  ...scale('on', on),
  // Shadows ride the per-theme map (not just `:root` foundations) so the dark
  // theme can override them — light elevations are invisible on dark surfaces.
  ...scale('shadow', shadow),
  'background': background.DEFAULT,
  'surface': surface.DEFAULT,
  'surface-tint': primary['alpha-10'],
  'on-surface-variant': neutral[700],
  'divider': neutral[300],
  'border': border.DEFAULT,
  'status-danger-bg': danger[100],
  'status-danger-br': danger[500],
  'status-success-bg': primary[100],
  'status-success-br': primary[600],
  'status-info-bg': info[100],
  'status-info-br': info[500],
  'status-warning-bg': alert[100],
  'status-warning-br': alert[500],
  // Kit-facing pre aliases (docs chrome code panes)
  'pre': neutral[1000],
} satisfies Record<string, string>

/**
 * Dark counterpart of {@link emeraldColors}. `satisfies` pins it to the light
 * map's exact key set, and every family in `design-system.ts` is pinned to its
 * light family the same way — a token added or renamed on one side of the
 * light/dark pair is a compile error, not a silently unthemed surface.
 */
export const emeraldDarkColors = {
  ...scale('primary', primaryDark),
  ...scale('secondary', secondaryDark),
  ...scale('neutral', neutralDark),
  ...scale('danger', dangerDark),
  ...scale('alert', alertDark),
  ...scale('success', successDark),
  ...scale('info', infoDark),
  ...scale('on', onDark),
  ...scale('shadow', shadowDark),
  'background': background.dark,
  'surface': surface.dark,
  'surface-tint': primaryDark['alpha-10'],
  'on-surface-variant': neutralDark[700],
  'divider': neutralDark[300],
  'border': borderDark.DEFAULT,
  'status-danger-bg': dangerDark[100],
  'status-danger-br': dangerDark[500],
  'status-success-bg': primaryDark[100],
  'status-success-br': primaryDark[600],
  'status-info-bg': infoDark[100],
  'status-info-br': infoDark[500],
  'status-warning-bg': alertDark[100],
  'status-warning-br': alertDark[500],
  // Code panes are already dark chrome in the light theme; keep them a step
  // above the dark surface instead of flipping to light.
  'pre': neutralDark[200],
} satisfies Record<keyof typeof emeraldColors, string>
