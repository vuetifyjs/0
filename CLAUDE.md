# @vuetify/v0 Monorepo

Vue 3 headless UI primitives and composables. Unstyled, logic-focused building blocks for design systems.

## Before Writing Code

**STOP. Check existing functionality first.**

### Use Built-in Utilities (`#v0/utilities`)

| Utility | Purpose |
|---------|---------|
| `isFunction`, `isString`, `isNumber`, `isBoolean` | Type guards |
| `isObject`, `isArray`, `isNull`, `isUndefined` | Type guards |
| `isNullOrUndefined`, `isPrimitive`, `isSymbol`, `isNaN`, `isElement` | Type guards |
| `isThenable` | Duck-typed thenable check (any object with a `.then` method) |
| `mergeDeep(target, ...sources)` | Deep merge with `DeepPartial<T>` |
| `useId()` | SSR-safe ID (Vue's useId in components, counter fallback) |
| `clamp(value, min, max)` | Clamp number to range |
| `range(length, start)` | Create sequential number array |

### Use Built-in Types (`#v0/types`)

| Type | Purpose |
|------|---------|
| `ID` | Identifier type (`string \| number`) for registry tickets |
| `Extensible<T>` | Preserves string literal autocomplete while allowing arbitrary strings |
| `MaybeArray<T>` | Union accepting single value or array (`T \| T[]`) |
| `DeepPartial<T>` | Recursively makes all properties optional |
| `Activation` | Keyboard activation mode (`'automatic' \| 'manual'`) |

### Use Built-in Constants (`#v0/constants/globals`)

| Constant | Purpose |
|----------|---------|
| `IN_BROWSER` | SSR-safe `typeof window !== 'undefined'` |
| `SUPPORTS_TOUCH` | Touch device detection |
| `SUPPORTS_MATCH_MEDIA` | matchMedia availability |
| `SUPPORTS_OBSERVER` | ResizeObserver availability |
| `SUPPORTS_INTERSECTION_OBSERVER` | IntersectionObserver availability |
| `SUPPORTS_MUTATION_OBSERVER` | MutationObserver availability |

### Check Existing Composables & Components (`#v0/composables`, `#v0/components`)

Before building anything, consult the `vuetify0` skill's `SKILL.md` — invoke the **`vuetify0`** skill (Skill tool). Its **"Decision table — reach for these first"** maps each task (selection, validation, registries, virtual scroll, popovers, focus, etc.) to the composable/component to use, and `references/layer-decisions.md` covers the component-vs-composable-vs-both call. Use it to decide **what** to reach for and **when** — don't reinvent a primitive v0 already ships. The skill is the source of truth; this file does not duplicate the inventory.

## Path Alias

Always use `#v0/` for package imports, never relative paths:

```ts
import { ID } from '#v0/types'
import { isObject } from '#v0/utilities'
import { IN_BROWSER } from '#v0/constants/globals'
import { createRegistry } from '#v0/composables'
```

## Packages

- **`@vuetify/v0`** (`packages/0/`): Headless components and composables
- **`@vuetify/paper`** (`packages/paper/`): Styling primitives depending on v0

## Apps

- **Dev** (`dev/`): Dev environment
- **Playground** (`apps/playground/`): Browser-based editor with live preview
- **Docs** (`apps/docs/`): VitePress-style documentation

## Commands

```bash collapse
# Development
pnpm dev              # Dev environment
pnpm dev:docs         # Documentation

# Build
pnpm build            # All packages
pnpm build:0          # @vuetify/v0 only
pnpm build:paper      # @vuetify/paper only
pnpm build:apps       # All apps
pnpm build:all        # Everything

# Quality
pnpm test             # Watch mode
pnpm test:run         # CI mode
pnpm test:bench       # Run benchmarks
pnpm metrics          # Generate performance metrics
pnpm typecheck        # All packages
pnpm lint:fix         # Always use lint:fix, not lint
pnpm validate         # lint + typecheck + test

# Release (Changesets)
pnpm changeset        # Author a changeset for your PR (run per change)
pnpm release:prepare  # Pre-release validation (validate + build)
# Publishing is automated: pushing to master opens a "Version Packages" PR;
# merging it builds, publishes to npm via OIDC, and creates the GitHub releases.
# Currently in PRE mode (beta dist-tag) — see "Releasing" below before cutting stable.

# Repo health
pnpm repo:check       # knip + sherif
```

## Releasing

Changesets-driven. Pushing to `master` opens/updates a "Version Packages" PR; merging it publishes to npm (tokenless OIDC) and mints the GitHub releases (`.github/workflows/release.yml`).

- **Substrate** (`@vuetify/v0` + `@vuetify/paper`) is a `fixed` group: one shared version, one aggregate `v<version>` GitHub release.
- **Design systems** (`@paper/*`, e.g. `@paper/genesis`) version and release independently, each on its own `name@version` release. Note `@paper/genesis` depends on `@vuetify/v0`, so a substrate **major** bump (e.g. `1.x` → `2.0.0`) leaves genesis's `^` range and changesets will also bump + republish genesis. That is expected — review it in the "Version Packages" PR before merging.

### Exiting beta / cutting a stable release

The repo is in changesets **pre mode** (`.changeset/pre.json`, `beta` dist-tag); every release is `…-beta.N` published under the `beta` tag. Before the first stable release:

1. `pnpm changeset pre exit`
2. Commit the removal of `.changeset/pre.json`
3. Let the next "Version Packages" PR produce the clean `1.0.0`, then merge it

Skipping `pre exit` ships `1.0.0-beta.N` (or mistags it) instead of a real `1.0.0`.

## Conventions

### Vue SFCs
- Script tag order: `<script setup lang="ts">` (setup before lang)
- With generics: `<script lang="ts" setup generic="T">` (lang before setup when using generic)

### TypeScript
- Zero `any` types
- `unknown` over `any` for unknowns
- Readonly tuples for trinity pattern: `as const`

### Styling
- **UnoCSS utility classes** in examples/docs/dev
- Component library stays headless
- **Never use `ltr:` variant** — it requires an explicit `dir="ltr"` attribute on an ancestor. Use the bare class for default (LTR) behavior, `rtl:` for the override (e.g. `-translate-x-full rtl:translate-x-full`, not `ltr:-translate-x-full rtl:translate-x-full`)

### Testing
- Vitest, two projects: `v0:unit` (happy-dom, `*.test.ts` — composables/utilities) and `v0:browser` (real Chromium via Playwright, `*.browser.test.ts` — components)
- Colocated with source (`*.test.ts`, components `*.browser.test.ts`)
- Focus: edge cases, error conditions, async, SSR safety

## Requirements

- **Node**: >=26
- **pnpm**: >=10.6

## Build Tooling

- **Build**: tsdown
- **Dev**: Vite
- **Test**: Vitest
- **Lint**: ESLint (vuetify config)
- **Style**: UnoCSS

## Worktrees

Worktree directory: `.claude/worktrees/` — always use this location for all worktrees.

## Detailed Rules

See `.claude/rules/` for path-scoped documentation:
- `implementation.md` - Patterns for `packages/0/src/**`
- `composables.md` - Architecture for `packages/0/src/composables/**`
- `components.md` - Architecture for `packages/0/src/components/**`
- `benchmarks.md` - Standards for `*.bench.ts` files
- `docs.md` - Architecture for `apps/docs/**`
- `testing.md` - Standards for `*.test.ts` files
