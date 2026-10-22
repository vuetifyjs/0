---
title: Nightly Builds - Preview Unreleased Changes
meta:
- name: description
  content: Install Vuetify0 nightly builds from @vuetify/v0-nightly with a package alias. Daily snapshots of master and dev for testing only.
- name: keywords
  content: vuetify0, nightly, v0-nightly, preview, dev, testing, npm, unstable, prereleases
features:
  order: 1.9
  level: 1
related:
  - /introduction/getting-started
  - /introduction/contributing
  - /releases
---

<script setup lang="ts">
  import DocsNightlyVersions from '@/components/docs/DocsNightlyVersions.vue'
</script>

# Nightly Builds

<DocsPageFeatures :frontmatter />

Nightly builds are daily snapshots of unreleased `master` and `dev` work, published as [@vuetify/v0-nightly](https://www.npmjs.com/package/@vuetify/v0-nightly). Install one with a package alias so your imports stay `@vuetify/v0`.

## What Are Nightly Builds?

A nightly is an automated build of the latest commits on `master` or `dev`. It runs every day at 12:00 UTC when that branch has new commits. Use one to try:

- Bug fixes that have not shipped in a stable release yet
- New features still in progress on `dev`

> [!WARNING]
> Nightly builds are unstable and not for production. They can contain bugs, unfinished features, or breaking changes that are not documented yet. Use them for testing only.

## Installation

Alias `@vuetify/v0` to `@vuetify/v0-nightly`. The alias keeps every import on `@vuetify/v0`. A direct install of `@vuetify/v0-nightly` would not.

### From master (nightly)

The `nightly` dist-tag on `@vuetify/v0-nightly` tracks `master`: bug fixes and patches headed for the next stable release.

::: code-group no-filename

```bash pnpm
pnpm add @vuetify/v0@npm:@vuetify/v0-nightly@nightly
```

```bash npm
npm install @vuetify/v0@npm:@vuetify/v0-nightly@nightly
```

```bash yarn
yarn add @vuetify/v0@npm:@vuetify/v0-nightly@nightly
```

```bash bun
bun add @vuetify/v0@npm:@vuetify/v0-nightly@nightly
```

:::

### From dev (nightly-dev)

The `nightly-dev` dist-tag tracks `dev`: new features and minor changes still in development.

::: code-group no-filename

```bash pnpm
pnpm add @vuetify/v0@npm:@vuetify/v0-nightly@nightly-dev
```

```bash npm
npm install @vuetify/v0@npm:@vuetify/v0-nightly@nightly-dev
```

```bash yarn
yarn add @vuetify/v0@npm:@vuetify/v0-nightly@nightly-dev
```

```bash bun
bun add @vuetify/v0@npm:@vuetify/v0-nightly@nightly-dev
```

:::

### Pin a version

Dist-tags move. To stay on one build, alias that exact version. Versions look like `<version>-<branch>.<date>`:

```json package.json
{
  "dependencies": {
    "@vuetify/v0": "npm:@vuetify/v0-nightly@1.3.0-master.2026-10-20"
  }
}
```

The same specifier works from the CLI: `pnpm add @vuetify/v0@npm:@vuetify/v0-nightly@1.3.0-master.2026-10-20`. The list below copies that command for a published build.

## Version Format

```
<version>-<branch>.<date>
```

Examples:

- `1.3.0-master.2026-10-20` from master on October 20, 2026
- `1.3.0-dev.2026-10-20` from dev on October 20, 2026

The base version is the `version` in that branch's `package.json`.

## Returning to Stable

Install the stable package again. That drops the alias.

::: code-group no-filename

```bash pnpm
pnpm add @vuetify/v0@latest
```

```bash npm
npm install @vuetify/v0@latest
```

```bash yarn
yarn add @vuetify/v0@latest
```

```bash bun
bun add @vuetify/v0@latest
```

:::

## How It Works

- **Schedule.** Builds run daily at 12:00 UTC. A branch with no commits in the last 24 hours is skipped.
- **Package.** Nightlies publish to `@vuetify/v0-nightly` only. Nothing from the nightly workflow is published to `@vuetify/v0`, and its `latest` tag does not move.
- **Dist-tags.** `nightly` and `nightly-dev` live on `@vuetify/v0-nightly`. They are not tags on `@vuetify/v0`.
- **Versions.** Each publish is `<version>-<branch>.<date>`, taken from the branch version plus the UTC date.

## When to Use Nightlies

| Use case | Tag |
| --- | --- |
| Test a bug fix before release | `nightly` |
| Preview upcoming features | `nightly-dev` |
| Check your app against unreleased changes | `nightly` or `nightly-dev` |
| Report an issue with a reproduction | `nightly` or `nightly-dev` |

> [!TIP]
> When you report a bug, check whether a nightly already fixes it. Say so in the issue if it does.

## Semver and Lock Files

Nightly versions are prereleases of a different package. A `^1.3.0` range on `@vuetify/v0` will not upgrade you onto one. You opt in with the alias `npm:@vuetify/v0-nightly@<version>`. Your lockfile stays on that build until you change the alias.

## Published Versions

The list reads the [@vuetify/v0-nightly](https://www.npmjs.com/package/@vuetify/v0-nightly) registry entry.

<DocsNightlyVersions />
