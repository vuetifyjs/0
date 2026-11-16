/**
 * Whether an SFC is a private building block: its header block, the JSDoc
 * comment above the first `<script>`, carries an `@internal` tag line.
 * Such a file is not exported from its barrel and gets no API page.
 *
 * `packages/0/scripts/generate-web-types.ts` keeps its own copy; the package
 * build cannot import from the docs app.
 */
export function isInternal (source: string): boolean {
  const header = source.slice(0, Math.max(0, source.indexOf('<script')))
  return /^\s*\*\s*@internal\b/m.test(header)
}
