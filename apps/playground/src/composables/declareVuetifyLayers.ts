// Framework
import { isUndefined } from '@vuetify/v0'

const LAYER_PREAMBLE = `document.head.insertAdjacentHTML('afterbegin', '<style>@layer vuetify-core,vuetify-components,vuetify-overrides,vuetify-utilities,vuetify-final;</style>')\n`

/**
 * Prepend Vuetify's cascade-layer order so it is declared before `app.use(vuetify)`.
 *
 * Legacy Play playgrounds ship their own `main.ts`, which replaces the generated
 * one that already declares this order. `theme.install` writes
 * `@layer vuetify-utilities` at `app.use` time; without the preamble that layer
 * is established first and components beat helpers.
 *
 * Prefer `src/setup.ts` when it is present: Play's `main.ts` imports it before
 * `app.use(vuetify)`. Otherwise prepend the vuetify module, which that import
 * evaluates first.
 */
export function declareVuetifyLayers (files: Record<string, string>): Record<string, string> {
  const vuetifyFile = Object.keys(files).find(path => /(?:^|\/)vuetify\.[jt]s$/.test(path))
  if (!vuetifyFile) return files

  const target = isUndefined(files['src/setup.ts']) ? vuetifyFile : 'src/setup.ts'
  const code = files[target]
  if (isUndefined(code) || code.includes('@layer vuetify-core')) return files

  return {
    ...files,
    [target]: `${LAYER_PREAMBLE}${code}`,
  }
}
