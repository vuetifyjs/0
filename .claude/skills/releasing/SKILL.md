---
name: releasing
description: Authoring a changeset, or cutting a release for @vuetify/v0 and the @paper/* design systems. Use when writing a .changeset/*.md file, deciding what belongs in changelog copy, re-entering or exiting changesets pre/beta mode, or reviewing a Version Packages PR. Covers the changeset content contract, the two version domains, and optional pre-channel workflow.
---

# Releasing

Changesets-driven. Pushing to `master` opens/updates a "Version Packages" PR; merging it publishes to npm (tokenless OIDC) and mints the GitHub releases (`.github/workflows/release.yml`).

The branch model — which base branch a PR targets by change type — lives in the root `CLAUDE.md` and is always loaded. This skill covers what happens once the PR is on the right branch.

## Commands

```bash
pnpm changeset         # Author a changeset — once per change
pnpm release:prepare   # Pre-release validation (validate + build)
```

Publishing is automated via the Version Packages PR on `master` — do not `npm publish` by hand except the **first create** of a new scoped package (OIDC cannot PUT a name that does not exist yet). That one-shot is `npm publish --access public` from a logged-in human, then add a trusted publisher (GitHub Actions / org `vuetifyjs` / repo `0` / workflow `release.yml` / environment empty). Every package needs `publishConfig.access: public` before that PUT.

`npm view` 404 on a brand-new name after a successful `+ pkg@version` is packument lag — the version URL can 200 while the packument is still 404. Do not abort the GitHub-release step on that.

A changeset file must not mix a public package with a `private` one (`privatePackages.version: false` treats private as ignored; changesets rejects mixed files). Un-private the DS if this cut is meant to ship it; do not strip it from the changeset as a workaround unless it should stay unpublished.

## Version Packages review (before merge)

The bump in that PR **is** the next published version. It is not held for a milestone.

1. Read the title (`1.1.0` vs `1.0.6`).
2. Every pending `.changeset/*.md` on `master` — any `"@vuetify/v0": minor` (or `major`) *is* that bump.
3. What is still on `dev` that you wanted in this minor?
4. If (2) and (3) disagree: **do not merge**. Retarget the stray `feat` PRs to `dev`, or accept this minor is the master feats and the `dev` train is the *next* minor.

`dev` → `master` is a **merge commit**, never squash. Do not unpublish if another published package depends on v0 with a caret range.

Agents do not merge this PR or cut `dev`→`master` unless John says so.

## Changeset content contract

The `.changeset/*.md` body renders verbatim into the changelog and GitHub release notes — it is release-note copy, not a commit message. Don't budget by character count; budget by what belongs:

- **First line** — conventional-commit summary `type(Scope): what changed (#PR)`, written from the consumer's side, not the diff's. It stands alone as the whole changeset when it already answers both questions a consumer asks — *does this affect me, and must I do anything?* A title that instead restates the diff (what code moved) is a commit message in changeset frontmatter — that is the failure to avoid, body or not.
- **Body (optional)** — add one when the title can't answer those questions itself: a behavior delta, a performance change worth quantifying (state the magnitude), a breaking/migration step, or new public options or escape hatches. Length is earned by impact, not padded to a target.
- **Never the mechanism** — internal composables touched, private fields, refactors mirrored from a sibling go in the PR description and commit body, never the changelog.

## Two version domains

- **Substrate** — `@vuetify/v0` is the sole published substrate, versioned and released on its own `v<version>` GitHub release. `@vuetify/paper` is `private`/dormant and no longer part of the changesets `fixed` group.
- **Design systems** (`@paper/*`, e.g. `@paper/genesis`) version and release independently, each on its own `name@version` release. Note `@paper/genesis` depends on `@vuetify/v0`, so a substrate **major** bump (e.g. `1.x` → `2.0.0`) leaves genesis's `^` range and changesets will also bump + republish genesis. That is expected — review it in the "Version Packages" PR before merging.

## Pre / beta channel (optional)

Stable releases are the default. The repo is **not** in changesets pre mode unless `.changeset/pre.json` exists. To enter a prerelease channel again:

1. `pnpm changeset pre enter <tag>` (e.g. `beta` or `rc`)
2. Ship pre-releases via the normal Version Packages flow (`…-<tag>.N` under that dist-tag)
3. Before the next stable cut: `pnpm changeset pre exit`, commit the removal of `.changeset/pre.json`, then merge the Version Packages PR that produces the clean stable version

Skipping `pre exit` ships another pre version (or mistags) instead of a real stable.
