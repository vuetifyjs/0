// Wraps `changeset publish` so that re-publishing an already-live version is the
// no-op success it actually is, instead of failing the whole Release workflow.
//
// Why this exists: the Release workflow runs on every push to master. When no
// changesets remain (the "Version Packages" PR was merged) the changesets action
// falls through to this publish step. `changeset publish` is meant to be
// idempotent — see the version already on npm, skip it, exit 0 — but its
// pre-publish version check misreads the registry as empty in the tokenless-OIDC
// runner (`info … has not been published on npm` for a version that *is* live)
// and re-attempts the publish. npm rejects it, and under pnpm the E403 arrives in
// pnpm's `{ code, message }` shape rather than npm's `{ summary, detail }`. That
// shape crashes @changesets/cli with an unguarded `undefined.includes(...)`
// TypeError inside `isAlreadyPublishedError` — a hard crash that happens BEFORE it
// prints the `an error occurred while publishing X: …` line this wrapper used to
// classify against (changesets #2099 / #2184). The crash exits non-zero with no
// per-package error lines, so the old text-matching swallow could not recognize
// it: every post-release master push turned red, and because the publish step
// failed, `published` was never set and the GitHub-release step was skipped — the
// exact failure that stranded @vuetify/v0@1.0.1 on npm with no v1.0.1 release.
//
// The fix is to never let changeset publish re-attempt an already-live version in
// the first place: before publishing, any non-private workspace package whose
// current version is already on npm is temporarily marked `private` on disk (a
// CI-only edit, always restored) so `changeset publish` skips it. That removes the
// only path to the crash. Genuinely-new versions are untouched — they publish and
// print their `New tag:` lines, so the changesets action still sets its `published`
// / `publishedPackages` outputs and the release steps fire.
//
// Two swallows remain as defense-in-depth for anything the pre-skip misses (e.g. a
// version that lands on npm between the precheck and the publish attempt):
//   1. a non-zero exit where every per-package error is an already-published
//      conflict, and
//   2. the crash signature — a non-zero exit with NO parseable per-package error
//      lines — but only when the registry confirms every version we intended to
//      publish is now live (nothing was actually stranded).
// Any other failure (auth, network, a real partial publish, a genuinely new
// version that failed to land) still propagates and fails the workflow loud, and
// neither swallow ever fabricates `New tag:` lines: a clean skip must leave
// `published` false so the release step is skipped, not looped on a no-op.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'

// Matches npm's already-published rejection in either phrasing.
const ALREADY_PUBLISHED = /cannot publish over the previously published|EPUBLISHCONFLICT/i

// Each failed package emits exactly one of these lines; the trailing text is the
// underlying error message we classify against.
const PUBLISH_ERROR = /an error occurred while publishing (\S+): (.+)/g

// `npm view name@version` exits non-zero when that exact version is not on the
// registry — the "is it published?" signal used both to pre-skip already-live
// packages and to confirm a crash stranded nothing.
function onNpm (name, version) {
  return spawnSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'ignore' }).status === 0
}

// Discover every publishable (non-private) workspace package and split it into the
// versions already on npm (pre-skip these) and the ones this run should publish.
const skip = []
const pending = []
for (const dir of readdirSync('packages')) {
  const path = `packages/${dir}/package.json`
  if (!existsSync(path)) continue

  const raw = readFileSync(path, 'utf8')
  const pkg = JSON.parse(raw)
  if (!pkg.name || pkg.private) continue

  if (onNpm(pkg.name, pkg.version)) skip.push({ path, raw, pkg })
  else pending.push({ name: pkg.name, version: pkg.version })
}

// Temporarily mark the already-live packages private so `changeset publish` skips
// them and never hits the crashing re-publish path. Reformatting is irrelevant —
// the exact original bytes are restored in the `finally` below before this process
// exits, so nothing here is ever committed.
for (const { path, pkg } of skip) {
  console.log(`[changeset-publish] ${pkg.name}@${pkg.version} already on npm — skipping to avoid re-publish crash`)
  writeFileSync(path, `${JSON.stringify({ ...pkg, private: true }, null, 2)}\n`)
}

try {
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

    const everyErrorIsAlreadyPublished =
      errors.length > 0 && errors.every(message => ALREADY_PUBLISHED.test(message))

    // Crash signature: a non-zero exit with no per-package error lines at all
    // (the OIDC/pnpm TypeError above). Safe to swallow only if nothing we meant to
    // publish was left stranded — every pending version is now live on npm.
    const crashStrandedNothing =
      errors.length === 0 && pending.every(p => onNpm(p.name, p.version))

    if (everyErrorIsAlreadyPublished) {
      console.log(
        `\n[changeset-publish] All ${errors.length} publish failure(s) were "already published" ` +
        'conflicts — nothing new to release. Treating as a no-op success.',
      )
    } else if (crashStrandedNothing) {
      console.log(
        '\n[changeset-publish] changeset publish exited non-zero with no per-package error lines ' +
        '(the known OIDC/pnpm crash), but every version this run intended to publish is live on ' +
        'npm — nothing stranded. Treating as a no-op success.',
      )
    } else {
      // Non-zero exit (without process.exit) fails the release step loud.
      process.exitCode = code
    }
  }
} finally {
  // Always restore the manifests we touched, whatever the publish outcome.
  for (const { path, raw } of skip) writeFileSync(path, raw)
}
