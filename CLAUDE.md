# @vuetify/v0 Monorepo

Vue 3 headless UI primitives and composables. Unstyled, logic-focused building blocks for design systems.

## Before Writing Code

**STOP. Check existing functionality first.**

### Use What Already Ships

Never hand-roll a helper, type, or environment check that the package already exports. Read the barrels before writing:

- `#v0/utilities` — type guards (incl. `isThenable`), `mergeDeep`, `useId`, `clamp`, `range`
- `#v0/types` — `ID`, `Extensible`, `MaybeArray`, `DeepPartial`, `Activation`
- `#v0/constants/globals` — `IN_BROWSER`, `SUPPORTS_*` (never write `typeof window !== 'undefined'`)

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
- **`@vuetify/paper`** (`packages/paper/`): Styling primitives depending on v0 — **not published (dormant)**

## Commands

Scripts live in the root `package.json` — read it for the full list. The non-obvious ones:

```bash
pnpm lint:fix         # Always use lint:fix, never plain lint
pnpm validate         # lint + typecheck + test
pnpm metrics          # CI metrics-regen only — do not commit artifacts from feature branches; local: pnpm test:bench
pnpm repo:check       # knip + sherif
pnpm changeset        # Author a changeset — run once per change, see "Releasing"
```

## Releasing

Changesets-driven. Pushing to `master` opens/updates a "Version Packages" PR; merging it publishes to npm (tokenless OIDC) and mints the GitHub releases (`.github/workflows/release.yml`).

### Branch model — where a PR goes by change type

Three long-lived branches; a PR's base is chosen by the semver impact of the change, not by its commit-type label alone:

| Base | Change type | Semver | Examples |
|------|-------------|--------|----------|
| `master` | fixes, docs, chore, refactor, tests | patch / none | `fix(...)`, `docs(...)`, `test(...)`, and any app/tooling change that ships no package version |
| `dev` | new features that add public API | minor | `feat(...)` that adds a component, composable, prop, or option |
| `next` | breaking changes | major | anything with a `BREAKING CHANGE:` footer |

- **Only `master` publishes.** `dev` and `next` accumulate work and merge **into `master`** at the next minor / major cut — that merge is what triggers the changesets release. Never publish from `dev`/`next` directly.
- **`feat`/`fix` are still reserved for `packages/*` source.** A `feat(docs)` / `feat(playground)` / app-only change ships no package version, so it targets `master` (patch train) regardless of the `feat` label — prefer `docs`/`chore` for those.
- **Design systems** (`@paper/*`) version independently; a DS feature still targets `dev` (it's a minor bump for that package).
- CI (`pr-checks.yml`) and the changeset reminder (`changeset-reminder.yml`) run on PRs into all three branches; `release.yml` triggers on `master` pushes only.

### Authoring a changeset / cutting a release

For the changeset content contract, the two version domains (`@vuetify/v0` vs `@paper/*`), and optional pre/beta channel workflow, invoke the **`releasing`** skill (`.claude/skills/releasing/SKILL.md`).

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
- `new-feature-checklist.md` - Required files when adding a component or composable (path-scoped)
