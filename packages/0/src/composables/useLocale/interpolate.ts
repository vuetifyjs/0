// Utilities
import { isObject, isUndefined } from '#v0/utilities'

/**
 * Substitutes placeholders in a message string.
 *
 * Supports named placeholders (`{name}`) sourced from a leading object argument
 * and positional placeholders (`{0}`, `{1}`) sourced from the remaining
 * arguments. Unmatched placeholders are left intact.
 *
 * Shared by {@link V0LocaleAdapter} and the built-in English fallback lookup so
 * the placeholder grammar lives in exactly one place.
 */
export function interpolate (message: string, args: unknown[]): string {
  let result = message
  let rest = args

  if (rest.length > 0 && isObject(rest[0])) {
    const variables = rest[0] as Record<string, unknown>
    result = result.replace(/{([a-zA-Z][a-zA-Z0-9_]*)}/g, (match, name) => {
      return isUndefined(variables[name]) ? match : String(variables[name])
    })
    rest = rest.slice(1)
  }

  result = result.replace(/\{(\d+)\}/g, (match, index) => {
    const i = Number.parseInt(index, 10)
    return isUndefined(rest[i]) ? match : String(rest[i])
  })

  return result
}
