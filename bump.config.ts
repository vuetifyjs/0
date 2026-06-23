import { defineConfig } from 'bumpp'

// Substrate release scope. `pnpm release` bumps only these files so the
// substrate packages (@vuetify/v0 + @vuetify/paper) stay in lockstep with the
// root version and ship together from the `v*` tag.
//
// @paper/* design systems (e.g. @paper/genesis) are versioned and released
// independently and must NOT be bumped by a substrate release — that is why
// this uses an explicit `files` list instead of bumpp's `--recursive`, which
// would sweep every package.json (including the design systems) along.
//
// Requires bumpp >= 11.1.0: earlier versions silently ignore a config-file
// `files` list and bump only the root (antfu-collective/bumpp #119, #121),
// which is what shipped the broken v1.0.0-beta.2 release.
//
// Keep this list in sync with the publish allowlist in
// .github/workflows/release.yml.
export default defineConfig({
  files: [
    'package.json',
    'packages/0/package.json',
    'packages/paper/package.json',
  ],
})
