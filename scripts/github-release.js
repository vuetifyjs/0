// Mint GitHub Releases after a changesets publish.
//
// - The substrate (@vuetify/v0 + @vuetify/paper, always lockstep) gets ONE
//   aggregate release on a `v<version>` tag, so downstream tooling keyed off a
//   single versioned release keeps working. v0's CHANGELOG entry is the body.
// - Every other published package (the @paper/* design systems) gets its own
//   release on a `name@version` tag.
//
// `createGithubReleases: false` on the action means it does NOT push the
// per-package tags `changeset publish` makes locally, so `gh release create`
// mints every tag itself at the publish commit (`--target`). That is also why
// the substrate carries only the aggregate `v*` tag, not per-package tags.
//
// Driven by the changesets/action `publishedPackages` output. `gh` is
// preinstalled on the runner and authenticates via GITHUB_TOKEN.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const SUBSTRATE = new Set(['@vuetify/v0', '@vuetify/paper'])

const published = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]')
const sha = process.env.GITHUB_SHA
const version = Object.fromEntries(published.map(p => [p.name, p.version]))

// Pull the `## <version>` block out of a changesets CHANGELOG.md. Returns '' when
// the file is absent: a package can land in publishedPackages before its
// CHANGELOG.md exists, and an unreadable changelog must NOT abort the release run
// (npm publish has already succeeded by the time this script runs).
function notes (changelog, value) {
  if (!existsSync(changelog)) return ''

  const lines = readFileSync(changelog, 'utf8').split('\n')
  const start = lines.findIndex(line => line.trim() === `## ${value}`)

  if (start === -1) return ''

  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      end = i
      break
    }
  }

  return lines.slice(start + 1, end).join('\n').trim()
}

function exists (tag) {
  try {
    execFileSync('gh', ['release', 'view', tag], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// `gh release create` mints the tag at `target` (the publish commit) and the
// release together. Idempotent on re-run: an already-minted release is skipped
// so a retry reconciles the missing ones instead of dying on the first 422.
// A prerelease version (anything carrying a `-`, e.g. `-beta.N`) is flagged
// `--prerelease` so GitHub never marks a beta as the repo's "Latest release".
function release (tag, body, target, prerelease) {
  if (exists(tag)) {
    console.log(`release ${tag} already exists, skipping`)
    return
  }

  const args = ['release', 'create', tag, '--title', tag, '--notes', body || 'No release notes.', '--target', target]
  if (prerelease) args.push('--prerelease')
  execFileSync('gh', args, { stdio: 'inherit' })
}

const failures = []

// Each release is isolated so one failure (e.g. an API hiccup) reports and is
// retried on a re-run instead of aborting every release not yet minted.
function mint (tag, body, target, prerelease) {
  try {
    release(tag, body, target, prerelease)
  } catch (error) {
    console.error(`::error::failed to create release ${tag}: ${error.message}`)
    failures.push(tag)
  }
}

// Aggregate substrate release — v0 + paper share a version. v0's changelog is the
// body; paper's is the fallback for a paper-only recovery publish (where v0 was
// already on npm). Keyed on either substrate package so the aggregate `v*` release
// still mints if only one of the lockstep pair lands in publishedPackages.
const substrate = version['@vuetify/v0'] ?? version['@vuetify/paper']
if (substrate) {
  let body = notes('packages/0/CHANGELOG.md', substrate) || notes('packages/paper/CHANGELOG.md', substrate)
  if (version['@vuetify/v0'] && version['@vuetify/paper']) {
    body += `\n\n---\n\`@vuetify/paper@${version['@vuetify/paper']}\` shipped in lockstep.`
  }
  mint(`v${substrate}`, body, sha, substrate.includes('-'))
}

// Each design system (@paper/*) releases independently on its own tag.
// Convention: @paper/<name> lives at packages/<name>.
for (const { name, version: value } of published) {
  if (SUBSTRATE.has(name)) continue
  const dir = name.split('/').pop()
  mint(`${name}@${value}`, notes(`packages/${dir}/CHANGELOG.md`, value), sha, value.includes('-'))
}

// Fail the step (after attempting every release) if any could not be minted, so a
// partial GitHub-release run is visible rather than silently green.
if (failures.length > 0) {
  console.error(`::error::${failures.length} GitHub release(s) failed: ${failures.join(', ')}`)
  process.exitCode = 1
}
