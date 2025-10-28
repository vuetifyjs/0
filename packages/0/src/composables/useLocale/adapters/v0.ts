// Utilities
import { isObject } from '#v0/utilities'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { LocaleAdapter } from './adapter'
import type { ID } from '#v0/types'

/**
 * Vuetify0.x locale adapter implementation
 *
 * This adapter provides translation and number formatting
 * capabilities using the Intl API and supports both
 * numbered and named variables in translation strings.
 */
export class Vuetify0LocaleAdapter implements LocaleAdapter {
  t (message: string, ...params: unknown[]): string {
    let resolvedMessage = message

    // Handle named variables if the first param is an object
    if (params.length > 0 && isObject(params[0])) {
      const variables = params[0] as Record<string, unknown>
      resolvedMessage = resolvedMessage.replace(/{([a-zA-Z][a-zA-Z0-9_]*)}/g, (match, name) => {
        return variables[name] === undefined ? match : String(variables[name])
      })
      // Remove the variables object from params so numbered placeholders can use the rest
      params = params.slice(1)
    }

    // Handle numbered placeholders with remaining params
    resolvedMessage = resolvedMessage.replace(/\{(\d+)\}/g, (match, index) => {
      const idx = Number.parseInt(index, 10)
      if (params[idx] !== undefined) {
        return String(params[idx])
      }
      return match
    })

    return resolvedMessage
  }

  n (value: number, locale: ID | undefined, ...params: unknown[]): string {
    if (!IN_BROWSER || !locale) return value.toString()

    const options = params[0] as Intl.NumberFormatOptions | undefined

    return new Intl.NumberFormat(String(locale), options).format(value)
  }
}
