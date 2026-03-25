// Types
import type { Plugin } from 'vite'

import { themes } from '../src/themes'

// Palette values from zero.ts — must stay in sync
const palette: Record<string, string> = {
  'palette.brand.discord': '#5865f2',
  'palette.brand.vue': '#41b883',
  'palette.brand.mastered': '#ff8000',
}

/**
 * Resolve token aliases like `{dark.colors.surface-tint}` and
 * `{palette.brand.discord}` at build time.
 */
function resolveColor (value: string, themeId: string, colors: Record<string, string>): string {
  const match = value.match(/^\{(.+)\}$/)
  if (!match) return value

  const path = match[1]

  // Palette references: {palette.brand.discord}
  if (palette[path]) return palette[path]

  // Same-theme self-references: {dark.colors.surface-tint}
  const parts = path.split('.')
  if (parts[0] === themeId && parts[1] === 'colors' && parts[2]) {
    const resolved = colors[parts[2]]
    if (resolved && !resolved.startsWith('{')) return resolved
  }

  return value
}

/**
 * Generates all theme CSS variables and injects them into index.html
 * as a static <style> tag. This ensures theme colors are available
 * before first paint, independent of @unhead hydration or adoptedStyleSheets.
 *
 * The FOUC prevention script in index.html sets data-theme on <html>
 * before anything renders — this CSS provides the matching variables.
 */
export default function generateThemeCssPlugin (): Plugin {
  return {
    name: 'generate-theme-css',
    transformIndexHtml () {
      let css = ''

      for (const [id, theme] of Object.entries(themes)) {
        const vars = Object.entries(theme.colors)
          .map(([key, val]) => `--v0-${key}:${resolveColor(val, id, theme.colors)}`)
          .join(';')
        css += `[data-theme="${id}"]{${vars}}`
      }

      return [
        {
          tag: 'style',
          attrs: { id: 'v0-theme-critical' },
          children: css,
          injectTo: 'head',
        },
      ]
    },
  }
}
