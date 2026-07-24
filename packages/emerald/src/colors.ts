/**
 * Flat color map published as CSS custom properties by the Emerald adapter.
 * Keys become `--emerald-{key}` (and `--v0-*` aliases for kit interop).
 */

import {
  alert,
  background,
  border,
  danger,
  info,
  neutral,
  on,
  primary,
  secondary,
  success,
  surface,
} from './theme'

type Scale = Record<string, string>

function scale (name: string, values: Scale): Scale {
  const out: Scale = {}
  for (const [key, val] of Object.entries(values)) {
    out[key === 'DEFAULT' ? name : `${name}-${key}`] = val
  }
  return out
}

export const emeraldColors: Record<string, string> = {
  ...scale('primary', primary),
  ...scale('secondary', secondary),
  ...scale('neutral', neutral),
  ...scale('danger', danger),
  ...scale('alert', alert),
  ...scale('success', success),
  ...scale('info', info),
  ...scale('on', on),
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
}
