// Verify each just-published package@version is actually visible on npm.
// Driven by the changesets/action `publishedPackages` output. Retries to ride
// out npm propagation lag and fails the release loud on a partial publish (the
// failure mode where one substrate package landed and the other did not).
import { execFileSync } from 'node:child_process'

const published = JSON.parse(process.env.PUBLISHED_PACKAGES || '[]')

function sleep (ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

let failed = false

for (const { name, version } of published) {
  let found = false

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      execFileSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'ignore' })
      found = true
      break
    } catch {
      console.log(`${name}@${version} not visible yet (attempt ${attempt}), retrying in 5s`)
      sleep(5000)
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
