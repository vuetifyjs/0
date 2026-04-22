/**
 * Convert PascalCase, camelCase, or dot notation to kebab-case
 */
export function toKebab (str: string): string {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Convert kebab-case to PascalCase
 * e.g., "expansion-panel" → "ExpansionPanel"
 */
export function toPascal (str: string): string {
  return str.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())
}

/**
 * Convert kebab-case to camelCase
 * e.g., "create-selection" → "createSelection"
 */
export function toCamel (str: string): string {
  return str.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

/**
 * Extract and resolve the item name from a route path.
 * Components → PascalCase, composables → camelCase.
 * e.g., "/components/disclosure/expansion-panel" → "ExpansionPanel"
 * e.g., "/composables/selection/create-selection" → "createSelection"
 */
export function resolveItemName (path: string): string | null {
  const match = path.match(/\/(components|composables)\/[^/]+\/([^/]+)/)
  if (!match) return null

  const slug = match[2]
  return match[1] === 'components' ? toPascal(slug) : toCamel(slug)
}
