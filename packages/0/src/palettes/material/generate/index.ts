import {
  Hct,
  SchemeTonalSpot,
  SchemeVibrant,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities'

// Types
import type { PaletteDefinition } from '#v0/palettes'
import type { TonalPalette } from '@material/material-color-utilities'

export interface MaterialGenerateOptions {
  variant?: 'tonalSpot' | 'vibrant' | 'expressive' | 'fidelity' | 'monochrome' | 'neutral'
  contrast?: number
}

const VARIANTS = {
  tonalSpot: SchemeTonalSpot,
  vibrant: SchemeVibrant,
  expressive: SchemeExpressive,
  fidelity: SchemeFidelity,
  monochrome: SchemeMonochrome,
  neutral: SchemeNeutral,
} as const

const TONES = [0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100]

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

function extractTones (palette: TonalPalette): Record<number, string> {
  const tones: Record<number, string> = {}
  for (const tone of TONES) {
    tones[tone] = hexFromArgb(palette.tone(tone))
  }
  return tones
}

// MCU v0.4.0: DynamicScheme exposes color roles as getter
// properties returning ARGB numbers directly (e.g. scheme.primary).
function extractSchemeColors (scheme: InstanceType<typeof SchemeTonalSpot>): Record<string, string> {
  return {
    'primary': hexFromArgb(scheme.primary),
    'on-primary': hexFromArgb(scheme.onPrimary),
    'primary-container': hexFromArgb(scheme.primaryContainer),
    'on-primary-container': hexFromArgb(scheme.onPrimaryContainer),
    'secondary': hexFromArgb(scheme.secondary),
    'on-secondary': hexFromArgb(scheme.onSecondary),
    'secondary-container': hexFromArgb(scheme.secondaryContainer),
    'on-secondary-container': hexFromArgb(scheme.onSecondaryContainer),
    'tertiary': hexFromArgb(scheme.tertiary),
    'on-tertiary': hexFromArgb(scheme.onTertiary),
    'tertiary-container': hexFromArgb(scheme.tertiaryContainer),
    'on-tertiary-container': hexFromArgb(scheme.onTertiaryContainer),
    'error': hexFromArgb(scheme.error),
    'on-error': hexFromArgb(scheme.onError),
    'error-container': hexFromArgb(scheme.errorContainer),
    'on-error-container': hexFromArgb(scheme.onErrorContainer),
    'surface': hexFromArgb(scheme.surface),
    'on-surface': hexFromArgb(scheme.onSurface),
    'surface-variant': hexFromArgb(scheme.surfaceVariant),
    'on-surface-variant': hexFromArgb(scheme.onSurfaceVariant),
    'outline': hexFromArgb(scheme.outline),
    'outline-variant': hexFromArgb(scheme.outlineVariant),
    'background': hexFromArgb(scheme.background),
    'on-background': hexFromArgb(scheme.onBackground),
  }
}

/* #__NO_SIDE_EFFECTS__ */
export function material (seed: string, options: MaterialGenerateOptions = {}): PaletteDefinition {
  if (!HEX_RE.test(seed)) {
    throw new Error(`[@vuetify/v0] Invalid seed color: "${seed}". Expected a hex string (e.g., "#6750A4").`)
  }

  const { variant = 'tonalSpot', contrast = 0 } = options

  const hct = Hct.fromInt(argbFromHex(seed))

  const SchemeClass = VARIANTS[variant]
  if (!SchemeClass) {
    throw new Error(`[@vuetify/v0] Unknown material variant: "${variant}"`)
  }

  const light = new SchemeClass(hct, false, contrast)
  const dark = new SchemeClass(hct, true, contrast)

  return {
    palette: {
      primary: extractTones(light.primaryPalette),
      secondary: extractTones(light.secondaryPalette),
      tertiary: extractTones(light.tertiaryPalette),
      neutral: extractTones(light.neutralPalette),
      neutralVariant: extractTones(light.neutralVariantPalette),
      error: extractTones(light.errorPalette),
    },
    themes: {
      light: {
        dark: false,
        colors: extractSchemeColors(light),
      },
      dark: {
        dark: true,
        colors: extractSchemeColors(dark),
      },
    },
  }
}
