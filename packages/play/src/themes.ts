// Framework
import { ThemeAdapter, UNSAFE_KEYS, isString } from '@vuetify/v0'

export interface PlaygroundThemeDefinition {
  dark: boolean
  colors: Record<string, string>
}

/** Theme ids interpolated into generated `main.ts`. Must start with a letter. */
export const SAFE_THEME_ID = /^[a-zA-Z][\w-]*$/

const MAX_THEME_ID = 64
const MAX_THEMES = 32
const MAX_COLORS = 64
const MAX_COLOR_VALUE = 128

export function isPlaygroundThemeId (id: string): boolean {
  return id.length <= MAX_THEME_ID && SAFE_THEME_ID.test(id) && !UNSAFE_KEYS.has(id)
}

function isSafeColorKey (key: string): boolean {
  return key.length <= MAX_THEME_ID && ThemeAdapter.SAFE_IDENT.test(key) && !UNSAFE_KEYS.has(key)
}

function isSafeColorValue (value: string): boolean {
  return value.length > 0 && value.length <= MAX_COLOR_VALUE && !ThemeAdapter.UNSAFE_CSS.test(value)
}

function sanitizeColors (colors: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(colors)) {
    if (Object.keys(out).length >= MAX_COLORS) break
    if (!isSafeColorKey(key) || !isString(value) || !isSafeColorValue(value)) continue
    out[key] = value
  }
  return out
}

/** Strip attacker-controlled theme records down to ids/colors the sandbox will emit. */
export function sanitizePlaygroundThemes (
  extra?: Record<string, PlaygroundThemeDefinition>,
): Record<string, PlaygroundThemeDefinition> | undefined {
  if (!extra) return undefined

  const out: Record<string, PlaygroundThemeDefinition> = {}
  for (const [id, def] of Object.entries(extra)) {
    if (!isPlaygroundThemeId(id) || !def?.colors || Object.keys(out).length >= MAX_THEMES) continue
    const colors = sanitizeColors(def.colors)
    if (Object.keys(colors).length === 0) continue
    out[id] = { dark: def.dark === true, colors }
  }

  return Object.keys(out).length > 0 ? out : undefined
}

/**
 * Pack any theme records for a v0play hash. Docs, the builder, or a host
 * app can call this — v0play merges `themes` into the sandbox plugin and
 * selects `theme`. Color aliases must already be resolved.
 *
 * @example
 * ```ts
 * toPlaygroundThemes('brand-light', {
 *   'brand-light': { dark: false, colors: { primary: '#7453ec', background: '#ffffff' } },
 *   'brand-dark': { dark: true, colors: { primary: '#c4b5fd', background: '#121212' } },
 * })
 * ```
 */
export function toPlaygroundThemes (
  selected: string,
  records: Record<string, { dark?: boolean, colors?: Record<string, unknown> }>,
): { theme: string, themes?: Record<string, PlaygroundThemeDefinition> } | undefined {
  const theme = isPlaygroundThemeId(selected) ? selected : undefined
  if (!theme) return undefined

  const themes: Record<string, PlaygroundThemeDefinition> = {}
  for (const [id, def] of Object.entries(records)) {
    if (Object.keys(themes).length >= MAX_THEMES) break
    if (!isPlaygroundThemeId(id) || !def.colors) continue
    const colors = sanitizeColors(def.colors)
    if (Object.keys(colors).length === 0) continue
    themes[id] = { dark: def.dark === true, colors }
  }

  if (Object.keys(themes).length === 0) return { theme }
  return { theme, themes }
}
