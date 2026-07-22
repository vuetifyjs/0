// Wraps `changeset publish` so that re-publishing an already-live version is the
// no-op success it actually is, instead of failing the whole Release workflow.
//
// Why this exists: the Release workflow runs on every push to master. When no
// changesets remain (the "Version Packages" PR was merged) the changesets action
// falls through to this publish step. `changeset publish` is meant to be
// idempotent — see the version already on npm, skip it, exit 0 — but its
// pre-publish version check misreads the registry as empty in the tokenless-OIDC
// runner (`info … has not been published on npm` for a version that *is* live),
// re-attempts the publish, and npm rejects it with EPUBLISHCONFLICT
// ("cannot publish over the previously published versions: X"). That turned every
// post-release master push into a red Release run even though nothing was wrong.
//
// This wrapper swallows a failure ONLY when every package that failed did so for
// that specific already-published reason. Any other error (auth, network, a real
// partial publish, a genuinely new version that failed) still propagates and fails
// the workflow loud. A run that publishes a genuinely new version keeps working:
// its `New tag:` lines reach stdout so the changesets action still sets its
// `published` / `publishedPackages` outputs and the release steps fire.
import { spawnSync } from 'node:child_process'

// Matches npm's already-published rejection in either phrasing.
const ALREADY_PUBLISHED = /cannot publish over the previously published|EPUBLISHCONFLICT/i

// Each failed package emits exactly one of these lines; the trailing text is the
// underlying error message we classify against.
const PUBLISH_ERROR = /an error occurred while publishing (\S+): (.+)/g

const result = spawnSync('pnpm', ['exec', 'changeset', 'publish'], { encoding: 'utf8' })

// Forward the child's streams verbatim so the changesets action can still parse
// `New tag:` lines from stdout for its published-packages outputs.
if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)

if (result.error) throw result.error

const code = result.status ?? 1

if (code !== 0) {
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  const errors = [...output.matchAll(PUBLISH_ERROR)].map(match => match[2])

  // No per-package error lines means the failure was something else entirely
  // (build, auth, crash) — never swallow that.
  const everyErrorIsAlreadyPublished =
    errors.length > 0 && errors.every(message => ALREADY_PUBLISHED.test(message))

  if (everyErrorIsAlreadyPublished) {
    console.log(
      `\n[changeset-publish] All ${errors.length} publish failure(s) were "already published" ` +
      'conflicts — nothing new to release. Treating as a no-op success.',
    )
  } else {
    // Non-zero exit (without process.exit) fails the release step loud.
    process.exitCode = code
  }
}
