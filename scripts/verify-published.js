// Verify each just-published package@version is readable on npm, and that no
// prerelease publish leaked onto the `latest` dist-tag.
// Driven by the changesets/action `publishedPackages` output.
//
// A missing read does not fail the job. changesets has already exited 0 and
// named the versions npm accepted. The registry read lags that write: the v0
// packument updated 158s after the 1.3.0 publish (run 39477920090) and 159s
// after 1.3.1 (run 40520781737). Both runs gave up at ~143s, failed the job,
// and skipped the GitHub tag. The tag step mints from that publish receipt.
// This step only records whether the replica has caught up, and still fails
// the job when a prerelease is sitting on `latest`.
import { execFileSync } from 'node:child_process'
import { npmVersionVisible } from './lib/npm-visible.js'

// A semver prerelease always carries a hyphen (1.0.0-rc.8); a stable never does.
function isPrerelease (version) {
  return version.includes('-')
}

const published = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]')

// How long to wait before logging that the replica is still behind. The tag
// is minted either way. VERIFY_PUBLISHED_BUDGET_MS shortens this in tests.
const BUDGET_MS = Number(process.env.VERIFY_PUBLISHED_BUDGET_MS) || (5 * 60 * 1000)

function sleep (ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function guardDistTag (name, version) {
  // While a prerelease cycle is in flight, `latest` must stay on the last
  // stable — changesets publishes prereleases under the pre-tag and never
  // touches `latest`. A prerelease sitting on `latest` means a publish escaped
  // the pre-tag path, so plain `npm install <pkg>` silently hands users a
  // release candidate. This caught nothing when 1.0.0-rc.6 leaked onto
  // `latest`; it will now.
  if (!isPrerelease(version)) return false

  let latest
  try {
    latest = execFileSync('npm', ['view', name, 'dist-tags.latest'], { encoding: 'utf8' }).trim()
  } catch {
    // A failed read is an npm/infra hiccup, not a tag defect — the visibility
    // guard already confirmed the publish. Warn, don't fail.
    console.log(`::warning::could not read dist-tags.latest for ${name}; skipping dist-tag guard`)
    return false
  }

  if (isPrerelease(latest)) {
    console.error(`::error::${name} 'latest' points at prerelease ${latest} — a prerelease escaped the pre-tag path. Retag with: npm dist-tag add <pkg>@<last-stable> latest`)
    return true
  }

  console.log(`dist-tag ok for ${name}: latest → ${latest} (stable), prerelease ${version} correctly off latest`)
  return false
}

const pending = published.map(pkg => ({ ...pkg, found: false }))
let failed = false
let wait = 5000
let attempt = 1
const start = Date.now()

while (pending.some(pkg => !pkg.found)) {
  for (const pkg of pending) {
    if (pkg.found) continue
    if (!npmVersionVisible(pkg.name, pkg.version)) continue

    pkg.found = true
    console.log(`confirmed ${pkg.name}@${pkg.version}`)
    if (guardDistTag(pkg.name, pkg.version)) failed = true
  }

  if (pending.every(pkg => pkg.found)) break

  const elapsed = Date.now() - start
  if (elapsed >= BUDGET_MS) break

  const names = pending.filter(pkg => !pkg.found).map(pkg => `${pkg.name}@${pkg.version}`).join(', ')
  const pause = Math.min(wait, BUDGET_MS - elapsed)
  console.log(`${names} not visible yet (attempt ${attempt}, ${Math.round(elapsed / 1000)}s elapsed), retrying in ${Math.round(pause / 1000)}s`)
  sleep(pause)
  wait = Math.min(wait + 5000, 30_000)
  attempt++
}

for (const pkg of pending) {
  if (pkg.found) continue
  console.log(`::warning::${pkg.name}@${pkg.version} is not readable on the registry yet. The publish was accepted; this read lags the write.`)
}

// Only a prerelease sitting on `latest` fails the step. A lagging read must not.
if (failed) process.exitCode = 1
