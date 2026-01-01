/**
 * Convert PascalCase, camelCase, or dot notation to kebab-case
 */
export function toKebab (str: string): string {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}
