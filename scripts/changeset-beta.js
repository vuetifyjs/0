// Publish a snapshot beta from a clean `dev` checkout. Nothing here is committed.
//
// `pnpm release` cannot do this. It calls `changeset publish` with no `--tag`,
// which moves the `latest` dist-tag — the failure verify-published.js exists to
// catch. A beta has to pass `--tag beta` itself.
//
// `changeset version --snapshot` rewrites package.json and CHANGELOG.md and
// deletes the changeset files it applied. Those files are still the stable
// release's notes when `dev` merges to `master`. Committing that rewrite is the
// version-line conflict this script exists to avoid, so the working tree is
// restored on every exit path, including SIGINT during the build.
//
// Versions are `<calculated>-beta-<datetime>` because `.changeset/config.json`
// sets `snapshot.useCalculatedVersion`. The default without that flag is
// `0.0.0-beta-<datetime>`.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

const rootResult = spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' })
if (rootResult.status !== 0) {
  console.error((rootResult.stderr || 'git rev-parse failed').trim())
  process.exit(1)
}
const root = rootResult.stdout.trim()
process.chdir(root)

let mutated = false

function restore () {
  if (!mutated) return
  mutated = false
  const result = spawnSync('git', ['restore', '--source=HEAD', '--worktree', '.'], {
    cwd: root,
    stdio: 'inherit',
  })
  if ((result.status ?? 1) !== 0) {
    console.error('git restore failed. Do not commit. Run: git restore --source=HEAD --worktree .')
    process.exitCode = 1
  }
}

process.on('SIGINT', () => {
  restore()
  process.exit(130)
})
process.on('SIGTERM', () => {
  restore()
  process.exit(143)
})

function capture (cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' })
  if (result.status !== 0) {
    const detail = `${result.stderr ?? ''}${result.stdout ?? ''}`.trim()
    throw new Error(detail || `${cmd} ${args.join(' ')} failed`)
  }
  return (result.stdout ?? '').trim()
}

function run (cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if ((result.status ?? 1) !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited ${result.status}`)
  }
}

function fail (message) {
  console.error(message)
  process.exit(1)
}

function publicPackages () {
  const packages = []
  for (const dir of readdirSync('packages')) {
    const path = `packages/${dir}/package.json`
    if (!existsSync(path)) continue
    const pkg = JSON.parse(readFileSync(path, 'utf8'))
    if (!pkg.name || pkg.private) continue
    packages.push({ name: pkg.name, version: pkg.version })
  }
  return packages
}

const branch = capture('git', ['branch', '--show-current'])
if (branch !== 'dev') fail(`refusing: beta publishes from dev (current branch is ${branch || 'detached'})`)

if (capture('git', ['status', '--porcelain'])) {
  fail('refusing: working tree is dirty. Commit or stash, then run from a clean dev.')
}

run('git', ['fetch', 'origin', 'dev'])
if (capture('git', ['rev-parse', 'HEAD']) !== capture('git', ['rev-parse', 'origin/dev'])) {
  fail('refusing: HEAD is not origin/dev. Push or fast-forward, then re-run.')
}

try {
  capture('npm', ['whoami'])
} catch (error) {
  fail(`refusing: npm whoami failed (${error.message}). Betas are a local publish; release.yml OIDC does not cover them.`)
}

const notes = readdirSync('.changeset').filter(name => name.endsWith('.md') && name !== 'README.md')
if (notes.length === 0) fail('refusing: no changesets on dev.')

const before = new Map(publicPackages().map(pkg => [pkg.name, pkg.version]))
for (const [name, version] of before) {
  let latest
  try {
    latest = capture('npm', ['view', name, 'version'])
  } catch (error) {
    fail(`refusing: could not read npm latest for ${name} (${error.message})`)
  }
  if (latest !== version) {
    fail(`${name} on dev is ${version}, npm latest is ${latest}. Merge master into dev before a beta so the snapshot is calculated from the published version.`)
  }
}

let bumped = []
try {
  mutated = true
  run('pnpm', ['exec', 'changeset', 'version', '--snapshot', 'beta'])

  bumped = publicPackages().filter(pkg => before.get(pkg.name) !== pkg.version)
  if (bumped.length === 0) throw new Error('snapshot changed no public package')

  console.log('\nPublishing under dist-tag beta. latest is not moved.')
  for (const pkg of bumped) console.log(`  ${pkg.name}@${pkg.version}`)

  run('pnpm', ['build'])
  run('pnpm', ['exec', 'changeset', 'publish', '--tag', 'beta', '--no-git-tag'])
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  restore()
}

if (capture('git', ['status', '--porcelain'])) {
  console.error('working tree is still dirty after restore. Do not commit. Run: git restore --source=HEAD --worktree .')
  process.exitCode = 1
}

for (const pkg of bumped) {
  let latest
  try {
    latest = capture('npm', ['view', pkg.name, 'dist-tags.latest'])
  } catch {
    console.log(`could not read dist-tags.latest for ${pkg.name}`)
    continue
  }
  if (latest === pkg.version || latest.includes('-')) {
    console.error(`${pkg.name} latest is ${latest}. A beta moved latest. Retag with: npm dist-tag add ${pkg.name}@<last-stable> latest`)
    process.exitCode = 1
    continue
  }
  console.log(`dist-tag ok for ${pkg.name}: latest → ${latest}, beta → ${pkg.version}`)
}

if (process.exitCode) process.exit(process.exitCode)

console.log('\nInstall with the beta dist-tag, for example: pnpm add @vuetify/v0@beta')
