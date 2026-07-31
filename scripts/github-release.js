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
import { existsSync, readFileSync, readdirSync } from 'node:fs'

const SUBSTRATE = new Set(['@vuetify/v0', '@vuetify/paper'])

const published = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]')
const sha = process.env.GITHUB_SHA

// Reconcile against npm. `publishedPackages` only lists what THIS run published,
// so a package that landed in an earlier (failed) run never gets its release on
// the recovery run: its version is already on npm, `changeset publish` skips it,
// and it drops out of `publishedPackages`. Add any publishable workspace package
// whose CURRENT version is on npm but absent from this run's output. Minting is
// idempotent (already-minted releases are skipped), so this only fills the gaps.
const seen = new Set(published.map(p => p.name))
for (const dir of readdirSync('packages')) {
  const manifest = `packages/${dir}/package.json`
  if (!existsSync(manifest)) continue
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'))
  if (!pkg.name || pkg.private || seen.has(pkg.name)) continue
  if (onNpm(pkg.name, pkg.version)) {
    console.log(`reconcile: ${pkg.name}@${pkg.version} is on npm but not in this run — including`)
    published.push({ name: pkg.name, version: pkg.version })
  }
}

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

// Condense each changelog bullet's conventional-commit title into a skimmable,
// grouped overview at the top of the release notes — changesets' per-entry prose
// buries the one-line summaries readers skim for, and its flat list mixes features,
// fixes, and perf work together. The overview reorganizes them the way the old
// `conventional-changelog-vuetify` preset did: a section per commit type (its exact
// emoji headers and group order — see SECTIONS below), the redundant `type(scope): `
// prefix folded into a bold scope, and real Markdown PR links so the notes render on
// our own releases page — not just on GitHub, which is the only place bare `#123`
// text autolinks.
//
// BULLET peels off the changesets-added preamble (PR link, commit link, "Thanks
// X!"), leaving `text` = the conventional-commit title the author wrote, optionally
// with a ` — <detail>` trailer on the same line. TITLE then splits that title into
// type / scope / description; a title with no recognizable `type:` prefix keeps its
// full text and falls through to the Other bucket.
const REPO = 'vuetifyjs/0'
const BULLET = /^- (?:\[#(\d+)]\([^)]*\)\s*)?(?:\[`[0-9a-f]+`]\([^)]*\)\s*)?(?:Thanks .*?! - )?(.+)$/
const TITLE = /^(\w+)(?:\(([^)]*)\))?!?:\s*(.+)$/

// Commit type → overview section, mirroring `conventional-changelog-vuetify`'s
// writer map and group order. Literal emoji (not `:shortcode:`) so the section
// headers render on the docs releases page too — its markedEmoji map doesn't carry
// every shortcode (e.g. arrows_counterclockwise). Array order is the render order.
// The preset's Labs section is vuetify-core-specific (keyed off packages/vuetify/src
// /labs) and omitted here. Unlike the preset — which discards non-breaking docs/
// chore/style — any type absent here or a title with no type prefix lands in Other
// Commits, because in the changesets flow every entry exists only because an author
// wrote a changeset, so nothing should silently vanish.
const SECTIONS = [
  ['feat', '🚀 Features'],
  ['fix', '🔧 Bug Fixes'],
  ['perf', '🔥 Performance Improvements'],
  ['refactor', '🔬 Code Refactoring'],
  ['revert', '🔁 Reverts'],
]
const OTHER = 'Other Commits'

function overview (body) {
  const buckets = new Map()
  for (const line of body.split('\n')) {
    const match = line.match(BULLET)
    if (!match) continue
    const [, pr, text] = match
    // Changesets emits its own boilerplate bullet ("Updated dependencies [sha, …]:")
    // for packages that only bumped because an internal dependency changed — no
    // conventional-commit title to extract, and the sha list is pure noise here.
    if (text.startsWith('Updated dependencies')) continue

    const title = text.split(' — ')[0].trim()
    const parts = title.match(TITLE)
    const type = parts ? parts[1] : ''
    const scope = parts ? parts[2] : ''
    const desc = parts ? parts[3] : title

    // Bold the scope and drop the type word (it's the section header now); a
    // scopeless title keeps its bare description.
    const summary = scope ? `**${scope}:** ${desc}` : desc
    // Skip our appended PR link when the author already ended the title with a
    // linked issue/PR reference (e.g. a "…stay interactive ([#279](…))" trailer) —
    // otherwise the row renders two adjacent parenthesized links.
    const linked = /\(\[#\d+]\([^)]*\)\)\s*$/.test(desc)
    const link = pr && !linked ? ` ([#${pr}](https://github.com/${REPO}/pull/${pr}))` : ''
    const label = SECTIONS.find(([t]) => t === type)?.[1] ?? OTHER

    if (!buckets.has(label)) buckets.set(label, [])
    buckets.get(label).push(`- ${summary}${link}`)
  }

  if (buckets.size === 0) return ''

  const order = [...SECTIONS.map(([, label]) => label), OTHER]
  const sections = []
  for (const label of order) {
    const lines = buckets.get(label)
    if (lines) sections.push(`### ${label}\n${lines.join('\n')}`)
  }

  return `## Overview\n\n${sections.join('\n\n')}\n\n---\n\n`
}

function exists (tag) {
  try {
    execFileSync('gh', ['release', 'view', tag], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// `npm view name@version` exits non-zero when that exact version is not on the
// registry — the "is it published?" signal used to reconcile recovery runs.
function onNpm (name, value) {
  try {
    execFileSync('npm', ['view', `${name}@${value}`, 'version'], { stdio: 'ignore' })
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
  body = overview(body) + body
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
  const body = notes(`packages/${dir}/CHANGELOG.md`, value)
  mint(`${name}@${value}`, overview(body) + body, sha, value.includes('-'))
}

// Fail the step (after attempting every release) if any could not be minted, so a
// partial GitHub-release run is visible rather than silently green.
if (failures.length > 0) {
  console.error(`::error::${failures.length} GitHub release(s) failed: ${failures.join(', ')}`)
  process.exitCode = 1
}
