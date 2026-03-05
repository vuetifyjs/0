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
 * e.g., "use-selection" → "useSelection"
 */
export function toCamel (str: string): string {
  return str.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}
