// Mint GitHub Releases after a changesets publish.
//
// - The substrate (@vuetify/v0 + @vuetify/paper, always lockstep) gets ONE
//   aggregate release on a `v<version>` tag, so downstream tooling keyed off a
//   single versioned release keeps working. v0's CHANGELOG entry is the body.
// - Every other published package (the @paper/* design systems, @vuetify/play)
//   gets its own release on a `name@version` tag. Those never take GitHub's
//   Latest badge — only the stable `v*` substrate release may.
//
// `createGithubReleases: false` on the action means it does NOT push the
// per-package tags `changeset publish` makes locally, so `gh release create`
// mints every tag itself. The target is the commit that introduced the version
// (`git log -S` on that package's manifest), not HEAD — a recovery run on a
// later master push must not point the tag at commits that shipped after it.
// Falls back to GITHUB_SHA, which is that commit on the publish run itself.
// That is also why the substrate carries only the aggregate `v*` tag, not
// per-package tags.
//
// Driven by the changesets/action `publishedPackages` output, plus any current
// workspace version already on npm (recovery when an earlier run published and
// then skipped this step). `gh` is preinstalled on the runner and authenticates
// via GITHUB_TOKEN.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { npmVersionVisible } from './lib/npm-visible.js'

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

// True when the release is already there. False only for gh's "release not found".
// Any other failure throws — a network blip must not look like a missing tag and
// provoke a second `gh release create`.
function exists (tag) {
  try {
    execFileSync('gh', ['release', 'view', tag], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    return true
  } catch (error) {
    const err = `${error.stderr ?? ''}\n${error.stdout ?? ''}`
    if (err.includes('release not found')) return false
    throw error
  }
}

// Version document, not the packument — the same signal verify-published uses,
// so a recovery run can see a version whose packument has not caught up.
function onNpm (name, value) {
  return npmVersionVisible(name, value)
}

function manifestPath (name) {
  if (name === '@vuetify/v0') return 'packages/0/package.json'
  if (name === '@vuetify/paper') return 'packages/paper/package.json'
  return `packages/${name.split('/').pop()}/package.json`
}

// The commit that introduced `"version": "<value>"` in this package's manifest.
function versionCommit (name, value) {
  try {
    const hash = execFileSync('git', [
      'log', '-1', '--format=%H', '-S', `"version": "${value}"`, '--', manifestPath(name),
    ], { encoding: 'utf8' }).trim()
    return hash || undefined
  } catch {
    return undefined
  }
}

function targetFor (name, value) {
  const commit = versionCommit(name, value)
  if (commit) return commit
  console.log(`::warning::could not find the version-bump commit for ${name}@${value}; tagging ${sha}`)
  return sha
}

// `gh release create` mints the tag at `target` (the publish commit) and the
// release together. Idempotent on re-run: an already-minted release is skipped
// so a retry reconciles the missing ones instead of dying on the first 422.
//
// GitHub's Latest badge is last-write-wins unless `--latest` is set explicitly.
// A multi-package cut mints `v*` first, then `@paper/*` / `@vuetify/play`, so
// the last DS/play release would steal Latest from the substrate. Only the
// stable `v*` tag may take the badge (`--latest`); every other mint passes
// `--latest=false`. A prerelease version (anything carrying a `-`, e.g.
// `-beta.N`) is also flagged `--prerelease` so a beta can never be Latest.
function release (tag, body, target, { prerelease = false, latest = false } = {}) {
  const args = ['release', 'create', tag, '--title', tag, '--notes', body || 'No release notes.', '--target', target]
  if (prerelease) args.push('--prerelease')
  args.push(latest && !prerelease ? '--latest' : '--latest=false')
  execFileSync('gh', args, { stdio: 'inherit' })
}

const failures = []

// Each release is isolated so one failure (e.g. an API hiccup) reports and is
// retried on a re-run instead of aborting every release not yet minted.
// A package this run published (`seen`) is minted from that receipt even when
// the registry read still lags. A package only reconciled from the working
// tree has no receipt, so it is minted only when the read succeeds.
function mint (tag, body, target, options, spec) {
  let present
  try {
    present = exists(tag)
  } catch (error) {
    const message = `${error.stderr ?? error.message ?? ''}`.trim()
    // This run's publish must fail loud. A release that was only reconciled
    // from npm can wait for the next push — failing here would turn every
    // unrelated master push red on a GitHub hiccup.
    if (seen.has(spec.name)) {
      console.error(`::error::could not read release ${tag}: ${message}`)
      failures.push(tag)
    } else {
      console.log(`::warning::could not tell whether ${tag} exists (${message}); a later push will retry`)
    }
    return
  }

  if (present) {
    console.log(`release ${tag} already exists, skipping`)
    return
  }

  if (!npmVersionVisible(spec.name, spec.version)) {
    if (!seen.has(spec.name)) {
      console.error(`::error::${spec.name}@${spec.version} is not on npm — not minting ${tag}`)
      failures.push(tag)
      return
    }
    console.log(`::warning::${spec.name}@${spec.version} is not readable on the registry yet; minting ${tag} from the publish receipt`)
  }

  try {
    release(tag, body, target, options)
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
  const pre = substrate.includes('-')
  const substrateName = version['@vuetify/v0'] ? '@vuetify/v0' : '@vuetify/paper'
  mint(`v${substrate}`, body, targetFor(substrateName, substrate), { prerelease: pre, latest: !pre }, {
    name: substrateName,
    version: substrate,
  })
}

// Each non-substrate package (@paper/* design systems, @vuetify/play) releases
// independently on its own tag. Convention: @paper/<name> lives at packages/<name>.
// Never Latest — a DS-only cut must leave the previous `v*` badge in place.
for (const { name, version: value } of published) {
  if (SUBSTRATE.has(name)) continue
  const dir = name.split('/').pop()
  const body = notes(`packages/${dir}/CHANGELOG.md`, value)
  mint(`${name}@${value}`, overview(body) + body, targetFor(name, value), {
    prerelease: value.includes('-'),
    latest: false,
  }, { name, version: value })
}

// Fail the step (after attempting every release) if any could not be minted, so a
// partial GitHub-release run is visible rather than silently green.
if (failures.length > 0) {
  console.error(`::error::${failures.length} GitHub release(s) failed: ${failures.join(', ')}`)
  process.exitCode = 1
}
