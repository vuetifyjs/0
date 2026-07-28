---
name: releasing
description: Authoring a changeset, or cutting a release for @vuetify/v0 and the @paper/* design systems. Use when writing a .changeset/*.md file, deciding what belongs in changelog copy, exiting changesets pre/beta mode, or cutting a stable release. Covers the changeset content contract, the two version domains, and the pre-exit steps.
---

# Releasing

Changesets-driven. Pushing to `master` opens/updates a "Version Packages" PR; merging it publishes to npm (tokenless OIDC) and mints the GitHub releases (`.github/workflows/release.yml`).

The branch model — which base branch a PR targets by change type — lives in the root `CLAUDE.md` and is always loaded. This skill covers what happens once the PR is on the right branch.

## Changeset content contract

The `.changeset/*.md` body renders verbatim into the changelog and GitHub release notes — it is release-note copy, not a commit message. Don't budget by character count; budget by what belongs:

- **First line** — conventional-commit summary `type(Scope): what changed (#PR)`, written from the consumer's side, not the diff's. It stands alone as the whole changeset when it already answers both questions a consumer asks — *does this affect me, and must I do anything?* A title that instead restates the diff (what code moved) is a commit message in changeset frontmatter — that is the failure to avoid, body or not.
- **Body (optional)** — add one when the title can't answer those questions itself: a behavior delta, a performance change worth quantifying (state the magnitude), a breaking/migration step, or new public options or escape hatches. Length is earned by impact, not padded to a target.
- **Never the mechanism** — internal composables touched, private fields, refactors mirrored from a sibling go in the PR description and commit body, never the changelog.

## Two version domains

- **Substrate** — `@vuetify/v0` is the sole published substrate, versioned and released on its own `v<version>` GitHub release. `@vuetify/paper` is `private`/dormant and no longer part of the changesets `fixed` group.
- **Design systems** (`@paper/*`, e.g. `@paper/genesis`) version and release independently, each on its own `name@version` release. Note `@paper/genesis` depends on `@vuetify/v0`, so a substrate **major** bump (e.g. `1.x` → `2.0.0`) leaves genesis's `^` range and changesets will also bump + republish genesis. That is expected — review it in the "Version Packages" PR before merging.

## Exiting beta / cutting a stable release

The repo is in changesets **pre mode** (`.changeset/pre.json`, `beta` dist-tag); every release is `…-beta.N` published under the `beta` tag. Before the first stable release:

1. `pnpm changeset pre exit`
2. Commit the removal of `.changeset/pre.json`
3. Let the next "Version Packages" PR produce the clean `1.0.0`, then merge it

Skipping `pre exit` ships `1.0.0-beta.N` (or mistags it) instead of a real `1.0.0`.
