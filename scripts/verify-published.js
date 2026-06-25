// Verify each just-published package@version is actually visible on npm.
// Driven by the changesets/action `publishedPackages` output. Retries to ride
// out npm propagation lag and fails the release loud on a partial publish (the
// failure mode where one substrate package landed and the other did not).
import { execFileSync } from 'node:child_process'

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

  if (found) {
    console.log(`confirmed ${name}@${version}`)
  } else {
    console.error(`::error::${name}@${version} is missing from npm — the publish did not complete.`)
    failed = true
  }
}

// Non-zero exit (without process.exit) fails the release step after reporting
// every missing package, not just the first.
if (failed) process.exitCode = 1
