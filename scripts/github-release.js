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
import { readFileSync } from 'node:fs'

const SUBSTRATE = new Set(['@vuetify/v0', '@vuetify/paper'])

const published = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]')
const sha = process.env.GITHUB_SHA
const version = Object.fromEntries(published.map(p => [p.name, p.version]))

// Pull the `## <version>` block out of a changesets CHANGELOG.md.
function notes (changelog, value) {
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
function release (tag, body, target) {
  if (exists(tag)) {
    console.log(`release ${tag} already exists, skipping`)
    return
  }
  execFileSync('gh', ['release', 'create', tag, '--title', tag, '--notes', body || 'No release notes.', '--target', target], { stdio: 'inherit' })
}

// Aggregate substrate release — v0 + paper share a version; v0's changelog is the body.
const substrate = version['@vuetify/v0']
if (substrate) {
  let body = notes('packages/0/CHANGELOG.md', substrate)
  const paper = version['@vuetify/paper']
  if (paper) body += `\n\n---\n\`@vuetify/paper@${paper}\` shipped in lockstep.`
  release(`v${substrate}`, body, sha)
}

// Each design system (@paper/*) releases independently on its own tag.
// Convention: @paper/<name> lives at packages/<name>.
for (const { name, version: value } of published) {
  if (SUBSTRATE.has(name)) continue
  const dir = name.split('/').pop()
  release(`${name}@${value}`, notes(`packages/${dir}/CHANGELOG.md`, value), sha)
}
