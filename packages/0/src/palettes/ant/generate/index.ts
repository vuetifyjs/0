import { generate } from '@ant-design/colors'

// Types
import type { PaletteDefinition } from '#v0/palettes'

export interface AntGenerateOptions {
  background?: string
}

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

type Palette = [string, string, string, string, string, string, string, string, string, string]

function toRecord (colors: Palette): Record<number, string> {
  const record: Record<number, string> = {}
  for (const [index, color] of colors.entries()) {
    record[index + 1] = color
  }
  return record
}

function contrast (hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

/* #__NO_SIDE_EFFECTS__ */
export function ant (seed: string, options: AntGenerateOptions = {}): PaletteDefinition {
  if (!HEX_RE.test(seed)) {
    throw new Error(`[@vuetify/v0] Invalid seed color: "${seed}". Expected a hex string (e.g., "#1677ff").`)
  }

  const { background = '#141414' } = options

  const light = generate(seed) as Palette
  const dark = generate(seed, { theme: 'dark', backgroundColor: background }) as Palette
  const grey = generate('#8c8c8c') as Palette
  const greyDark = generate('#8c8c8c', { theme: 'dark', backgroundColor: background }) as Palette

  return {
    palette: {
      primary: toRecord(light),
      primaryDark: toRecord(dark),
      neutral: toRecord(grey),
      neutralDark: toRecord(greyDark),
    },
    themes: {
      light: {
        dark: false,
        colors: {
          'primary': light[5],
          'on-primary': contrast(light[5]),
          'primary-container': light[0],
          'on-primary-container': light[4],
          'secondary': light[6],
          'on-secondary': contrast(light[6]),
          'secondary-container': light[1],
          'on-secondary-container': light[5],
          'tertiary': light[7],
          'on-tertiary': contrast(light[7]),
          'tertiary-container': light[2],
          'on-tertiary-container': light[6],
          'error': '#ff4d4f',
          'on-error': '#ffffff',
          'error-container': '#fff2f0',
          'on-error-container': '#a8071a',
          'surface': grey[0],
          'on-surface': grey[8],
          'surface-variant': grey[1],
          'on-surface-variant': grey[7],
          'outline': grey[4],
          'outline-variant': grey[3],
          'background': '#ffffff',
          'on-background': grey[9],
        },
      },
      dark: {
        dark: true,
        colors: {
          'primary': dark[5],
          'on-primary': contrast(dark[5]),
          'primary-container': dark[8],
          'on-primary-container': dark[4],
          'secondary': dark[6],
          'on-secondary': contrast(dark[6]),
          'secondary-container': dark[7],
          'on-secondary-container': dark[3],
          'tertiary': dark[7],
          'on-tertiary': contrast(dark[7]),
          'tertiary-container': dark[8],
          'on-tertiary-container': dark[4],
          'error': '#ff7875',
          'on-error': '#000000',
          'error-container': '#5c0011',
          'on-error-container': '#ffccc7',
          'surface': greyDark[1],
          'on-surface': greyDark[7],
          'surface-variant': greyDark[2],
          'on-surface-variant': greyDark[6],
          'outline': greyDark[4],
          'outline-variant': greyDark[3],
          background,
          'on-background': greyDark[8],
        },
      },
    },
  }
}
