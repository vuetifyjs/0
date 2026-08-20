// Verify each just-published package@version is actually visible on npm, and
// that no prerelease publish leaked onto the `latest` dist-tag.
// Driven by the changesets/action `publishedPackages` output. Retries to ride
// out npm propagation lag and fails the release loud on a partial publish (the
// failure mode where one substrate package landed and the other did not).
import { execFileSync } from 'node:child_process'

// A semver prerelease always carries a hyphen (1.0.0-rc.8); a stable never does.
function isPrerelease (version) {
  return version.includes('-')
}

const published = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]')

// 8 attempts with linear backoff (5s,10s,…,35s) ~= 140s of tolerance. The publish
// already succeeded at this point, so patience over npm propagation lag costs
// nothing while failing fast costs a manual re-run.
const ATTEMPTS = 8

function sleep (ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

let failed = false

for (const { name, version } of published) {
  let found = false

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      execFileSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'ignore' })
      found = true
      break
    } catch {
      if (attempt === ATTEMPTS) break
      const wait = attempt * 5000
      console.log(`${name}@${version} not visible yet (attempt ${attempt}/${ATTEMPTS}), retrying in ${wait / 1000}s`)
      sleep(wait)
    }
  }

  if (!found) {
    console.error(`::error::${name}@${version} is missing from npm — the publish did not complete.`)
    failed = true
    continue
  }

  console.log(`confirmed ${name}@${version}`)

  // Dist-tag guard: while a prerelease cycle is in flight, `latest` must stay on
  // the last stable — changesets publishes prereleases under the pre-tag and
  // never touches `latest`. A prerelease sitting on `latest` means a publish
  // escaped the pre-tag path (a manual/off-cycle publish), so plain
  // `npm install <pkg>` silently hands users a release candidate. This caught
  // nothing when 1.0.0-rc.6 leaked onto `latest`; it will now.
  if (isPrerelease(version)) {
    let latest
    try {
      latest = execFileSync('npm', ['view', name, 'dist-tags.latest'], { encoding: 'utf8' }).trim()
    } catch {
      // A failed read is an npm/infra hiccup, not a tag defect — the
      // visibility guard above already confirmed the publish. Warn, don't fail.
      console.log(`::warning::could not read dist-tags.latest for ${name}; skipping dist-tag guard`)
      continue
    }

    if (isPrerelease(latest)) {
      console.error(`::error::${name} 'latest' points at prerelease ${latest} — a prerelease escaped the pre-tag path. Retag with: npm dist-tag add <pkg>@<last-stable> latest`)
      failed = true
    } else {
      console.log(`dist-tag ok for ${name}: latest → ${latest} (stable), prerelease ${version} correctly off latest`)
    }
  }
}

// Non-zero exit (without process.exit) fails the release step after reporting
// every missing package, not just the first.
if (failed) process.exitCode = 1
