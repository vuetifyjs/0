function semverGte (a: string, b: string): boolean {
  const pa = a.split('-')[0].split('.').map(Number)
  const pb = b.split('-')[0].split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return true
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return false
  }
  return true
}

export async function fetchNpmVersions (
  pkg: string,
  minVersion: string,
  includePrerelease: boolean,
): Promise<string[]> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}`, {
      headers: { Accept: 'application/vnd.npm.install-v1+json' },
    })
    if (!res.ok) return []
    const json = await res.json() as { versions: Record<string, unknown> }
    return Object.keys(json.versions)
      .filter(v => semverGte(v, minVersion))
      .filter(v => includePrerelease || !v.includes('-'))
      .toReversed()
  } catch {
    return []
  }
}
