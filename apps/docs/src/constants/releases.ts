/**
 * Maps a canonical release version (the maturity `since` value, no `v` prefix)
 * to a short display alias. The full version still drives the release deep-link,
 * so only the rendered label changes — not the underlying data.
 */
export const RELEASE_ALIASES: Record<string, string> = {
  '1.0.0-alpha.0': 'alpha.0',
  '1.0.0-alpha.1': 'alpha.1',
  '1.0.0-alpha.2': 'alpha.2',
  '1.0.0-alpha.3': 'alpha.3',
  '1.0.0-alpha.4': 'alpha.4',
  '1.0.0-alpha.5': 'alpha.5',
  '1.0.0-beta.0': 'beta.0',
}

/** Display label for a release version: its alias, or `v{version}` when unmapped. */
export function releaseAlias (version: string | undefined): string {
  if (!version) return ''

  return RELEASE_ALIASES[version] ?? `v${version}`
}
