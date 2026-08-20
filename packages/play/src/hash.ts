// Framework
import { isBoolean, isObject, isString, isUndefined } from '@vuetify/v0'

import { isPlaygroundThemeId, sanitizePlaygroundThemes } from './themes'

// Types
import type { PlaygroundThemeDefinition } from './themes'

export interface PlaygroundHashSettings {
  vue?: string
  v0?: string
  vuetify?: string
  vuetifyNightly?: boolean
  preset?: string
  addons?: string
}

export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: PlaygroundHashSettings
  /** Selected sandbox theme id. */
  theme?: string
  /** Theme records merged into the sandbox `createThemePlugin`. */
  themes?: Record<string, PlaygroundThemeDefinition>
}

export interface UsePlaygroundOptions {
  dir?: string
  imports?: Record<string, string>
  settings?: PlaygroundHashSettings
  theme?: string
  themes?: Record<string, PlaygroundThemeDefinition>
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let _fflate: typeof import('fflate') | undefined

export async function loadFflate () {
  if (!_fflate) _fflate = await import('fflate')
  return _fflate
}

async function utoa (data: string): Promise<string> {
  const { strToU8, strFromU8, zlibSync } = await loadFflate()
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

async function atou (base64: string): Promise<string> {
  const { strToU8, strFromU8, unzlibSync } = await loadFflate()
  const binary = atob(base64)
  const buffer = strToU8(binary, true)
  const unzipped = unzlibSync(buffer)
  return strFromU8(unzipped)
}

export function isFileRecord (v: unknown): v is Record<string, string> {
  return isObject(v) && Object.values(v).every(x => isString(x))
}

function isPlaygroundTheme (v: unknown): v is PlaygroundThemeDefinition {
  if (!isObject(v)) return false
  const theme = v as Record<string, unknown>
  if (!isBoolean(theme.dark) || !isObject(theme.colors)) return false
  const colors = theme.colors as Record<string, unknown>
  return Object.values(colors).every(x => isString(x))
}

function isThemeRecord (v: unknown): v is Record<string, PlaygroundThemeDefinition> {
  return isObject(v) && Object.values(v as Record<string, unknown>).every(isPlaygroundTheme)
}

function isValidSettings (v: unknown): v is PlaygroundHashSettings {
  if (!isObject(v)) return false
  const settings = v as Record<string, unknown>
  if (!(isUndefined(settings.vue) || isString(settings.vue))) return false
  if (!(isUndefined(settings.v0) || isString(settings.v0))) return false
  if (!(isUndefined(settings.vuetify) || isString(settings.vuetify))) return false
  if (!(isUndefined(settings.vuetifyNightly) || isBoolean(settings.vuetifyNightly))) return false
  if (!(isUndefined(settings.preset) || isString(settings.preset))) return false
  if (!(isUndefined(settings.addons) || isString(settings.addons))) return false
  return true
}

/**
 * Unzip a playground hash to JSON. Callers that need extra formats (Vuetify
 * Play tuples) parse the result themselves, then hand objects to
 * `parsePlaygroundPayload`.
 */
export async function unzipPlaygroundHash (hash: string): Promise<unknown> {
  return JSON.parse(await atou(hash))
}

/**
 * Encode editor state (files + active filename + theme) to a URL hash string.
 */
export async function encodePlaygroundHash (data: PlaygroundHashData): Promise<string> {
  return utoa(JSON.stringify(data))
}

/**
 * Decode a parsed hash body (legacy file map or `{ files, theme, themes, settings }`).
 * Theme records are sanitized at the boundary.
 */
export function parsePlaygroundPayload (parsed: unknown): PlaygroundHashData | null {
  if (isFileRecord(parsed)) {
    return { files: parsed }
  }
  if (
    typeof parsed === 'object'
    && parsed !== null
    && 'files' in parsed
    && isFileRecord((parsed as { files: unknown }).files)
  ) {
    const record = parsed as Record<string, unknown>
    const { files, active, imports, settings } = record
    const settingsObj = isObject(record.settings) ? record.settings as Record<string, unknown> : undefined
    const rawTheme = isString(record.theme)
      ? record.theme
      : (isString(settingsObj?.theme) ? settingsObj.theme : undefined)
    const themesRaw = record.themes ?? settingsObj?.themes
    return {
      files: files as Record<string, string>,
      active: isString(active) ? active : undefined,
      imports: isFileRecord(imports) ? imports : undefined,
      settings: isValidSettings(settings) ? settings : undefined,
      theme: rawTheme && isPlaygroundThemeId(rawTheme) ? rawTheme : undefined,
      themes: isThemeRecord(themesRaw) ? sanitizePlaygroundThemes(themesRaw) : undefined,
    }
  }
  return null
}

/**
 * Decode an editor hash back to editor state.
 * Handles the current `{ files, theme, themes, settings? }` format and the
 * legacy plain `Record<string, string>` format.
 */
export async function decodePlaygroundHash (hash: string): Promise<PlaygroundHashData | null> {
  try {
    return parsePlaygroundPayload(await unzipPlaygroundHash(hash))
  } catch {
    return null
  }
}
