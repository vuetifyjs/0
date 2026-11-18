/**
 * Whether an SFC is a private building block: its header block, the JSDoc
 * comment above the first `<script>`, carries an `@internal` tag line.
 * Such a file is not exported from its barrel, so it is left out of the
 * web-types and gets no API page.
 *
 * Shared by the web-types generator here and the docs API generator.
 */
export function isInternal (source: string): boolean {
  const header = source.slice(0, Math.max(0, source.indexOf('<script')))
  return /^\s*\*\s*@internal\b/m.test(header)
}
