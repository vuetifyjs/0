---
title: Nightly Builds - Preview Unreleased Changes
meta:
  - name: description
    content: Install Vuetify0 nightly builds to test unreleased changes from master and dev branches. Automated daily npm releases for early adopters and contributors.
  - name: keywords
    content: vuetify0, nightly, preview, dev, testing, npm, unstable, prereleases
features:
  order: 1.9
  level: 1
related:
  - /introduction/getting-started
  - /introduction/contributing
  - /releases
---

# Nightly Builds

Nightly builds let you test unreleased changes before they ship in a stable release. They're published automatically every day at 12:00 UTC when the source branch has new commits.

<DocsPageFeatures :frontmatter />

## What Are Nightly Builds?

Nightly builds are automated daily snapshots of the `@vuetify/v0` package built from the latest commits on `master` and `dev` branches. They give you early access to:

- **Bug fixes** that haven't been released yet
- **New features** in development on the `dev` branch

> [!WARNING]
> Nightly builds are **unstable** and **not for production**. They may contain bugs, incomplete features, or breaking changes that haven't been documented yet. Use them for testing and development only.

## Installation

Install a nightly build by specifying the dist-tag instead of a version number:

### From master (nightly)

The `nightly` tag tracks the `master` branch — bug fixes and patches that will ship in the next stable release.

::: code-group no-filename

```bash pnpm
pnpm add @vuetify/v0@nightly
```

```bash npm
npm install @vuetify/v0@nightly
```

```bash yarn
yarn add @vuetify/v0@nightly
```

```bash bun
bun add @vuetify/v0@nightly
```

:::

### From dev (nightly-dev)

The `nightly-dev` tag tracks the `dev` branch — new features and minor version changes in development.

::: code-group no-filename

```bash pnpm
pnpm add @vuetify/v0@nightly-dev
```

```bash npm
npm install @vuetify/v0@nightly-dev
```

```bash yarn
yarn add @vuetify/v0@nightly-dev
```

```bash bun
bun add @vuetify/v0@nightly-dev
```

:::

## Version Format

Nightly versions follow this format:

```
<base-version>-<branch>.<date>
```

For example:
- `1.2.3-master.2026-10-08` — built from master on October 8, 2026
- `1.3.0-dev.2026-10-08` — built from dev on October 8, 2026

The base version comes from each branch's own `package.json`, so `dev` nightlies typically show the next minor version.

## Returning to Stable

To go back to the latest stable release:

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

- **Schedule**: Builds run daily at 12:00 UTC
- **Skip logic**: If a branch has no commits in the last 24 hours, its build is skipped
- **Safety**: Nightlies never affect the `latest` tag — stable releases remain untouched
- **Same package**: Published to `@vuetify/v0` under separate dist-tags, not a different package

## When to Use Nightlies

| Use case | Recommended tag |
|----------|-----------------|
| Test a bug fix before release | `nightly` |
| Preview upcoming features | `nightly-dev` |
| Verify your app against unreleased changes | `nightly` or `nightly-dev` |
| Report issues with reproduction | `nightly` or `nightly-dev` |

> [!TIP]
> When reporting bugs, check if the issue is already fixed in a nightly build. If it is, you can note that in your issue — it helps maintainers prioritize the next stable release.

## Semver and Lock Files

Nightly versions are prereleases. A `^1.2.3` range in your `package.json` will **not** automatically upgrade to a nightly — you must explicitly request the dist-tag. This is intentional: nightlies are opt-in, and your lock file keeps you on the version you chose until you update it.
