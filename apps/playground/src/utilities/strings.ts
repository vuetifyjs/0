/**
 * Convert kebab-case to PascalCase
 * e.g., "expansion-panel" → "ExpansionPanel"
 */
export function toPascal (str: string): string {
  return str.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())
}
