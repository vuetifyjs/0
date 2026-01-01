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
 */
export function toPascal (str: string): string {
  return str.split('-').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
}

/**
 * Convert kebab-case to camelCase
 */
export function toCamel (str: string): string {
  const parts = str.split('-').filter(Boolean)
  if (parts.length === 0) return ''
  return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
}
