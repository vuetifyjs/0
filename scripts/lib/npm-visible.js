// Whether a package@version is actually on the registry.
//
// `npm view name@version` reads the packument. That document lagged 159s behind
// a successful PUT for @vuetify/v0@1.3.1 (2026-10-27): changesets had already
// printed `packages published successfully`, and the version document was the
// thing that existed. Gating the release on the packument failed the job and
// skipped the GitHub tag. The version document is the signal; the packument is
// only a fallback for the replica that has one and not the other.
import { execFileSync } from 'node:child_process'

function versionDocument (name, version) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`

  try {
    const body = execFileSync('curl', [
      '-fsS',
      '--max-time', '20',
      '-H', 'accept: application/json',
      url,
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

    return JSON.parse(body).version === version
  } catch {
    return false
  }
}

function packumentHas (name, version) {
  try {
    const out = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()

    return out === version
  } catch {
    return false
  }
}

export function npmVersionVisible (name, version) {
  return versionDocument(name, version) || packumentHas(name, version)
}
