# New Feature Checklist

**Applies to:** Adding any new component or composable to `packages/0/`.

Scope-specific checklist: what files must exist and what tables must be updated before a new component or composable counts as "done." Philosophy for categorization and maturity ladder lives in `PHILOSOPHY.md`.

## Cited PHILOSOPHY sections

- §1 Identity (v0 components are headless and WAI-ARIA compliant)
- §3.1 Return conventions (drives the composable barrel entries)
- §5 Headless contract (drives the component structure)

## Required — every item, every time

When a new component or composable is created, **all** items below must be completed before the work is considered done. Do not skip items. Ask the user if unsure about category or maturity level. [intent:244]

## Components

| # | File | Action |
|---|------|--------|
| 1 | `packages/0/src/components/{Name}/` | Create component directory with `.vue` files + `index.ts` barrel |
| 2 | `packages/0/src/components/index.ts` | Add `export * from './{Name}'` (alphabetical) |
| 3 | `packages/0/src/maturity.json` | Add entry under `"components"` with `level`, `category` (and `since` once promoted past `draft` — see "Maturity matrix" below) |
| 4 | `apps/docs/src/pages/components/{category}/{name}.md` | Create docs page with frontmatter (title, meta, features, related) [intent:245] |
| 5 | `apps/docs/src/examples/components/{kebab-name}/basic.vue` | Create at least a basic example (folder is kebab-case, e.g. `alert-dialog/`, `expansion-panel/`) [intent:246] |
| 6 | `apps/docs/src/pages/components/index.md` | Add table entry in the correct category section |
| 7 | `packages/0/README.md` | Add to "What's Included" table [intent:247] |
| 8 | `README.md` (root) | Keep in sync with package README [intent:247] |

## Composables

| # | File | Action |
|---|------|--------|
| 1 | `packages/0/src/composables/{name}/` | Create directory with `index.ts` (+ `index.test.ts` if tests requested) |
| 2 | `packages/0/src/composables/index.ts` | Add `export * from './{name}'` (alphabetical) |
| 3 | `packages/0/src/maturity.json` | Add entry under `"composables"` with `level`, `category` (and `since` once promoted past `draft` — see "Maturity matrix" below) |
| 4 | `apps/docs/src/pages/composables/{category}/{name}.md` | Create docs page with frontmatter |
| 5 | `apps/docs/src/examples/composables/{kebab-name}/basic.vue` | Create at least a basic example (folder is kebab-case, e.g. `use-popover/`, `create-number-field/`) |
| 6 | `apps/docs/src/pages/composables/index.md` | Add table entry in the correct category section |
| 7 | `packages/0/README.md` | Add to "What's Included" table |
| 8 | `README.md` (root) | Keep in sync with package README |

## Auto-generated (no manual action)

These regenerate on `pnpm build` — just verify the build succeeds:

- `apps/docs/build/generated/api-whitelist.ts` — API hover/IntelliSense (filesystem discovery)
- Navigation, search index, examples index — Vite plugins
- `packages/0/dist/json/` — WebStorm/JetBrains web types

### API whitelist verification

After running `pnpm build:docs`, verify the new feature appears in `apps/docs/build/generated/api-whitelist.ts`. The whitelist is filesystem-driven — a new export from `packages/0/src/composables/{name}/index.ts` or a new component in `packages/0/src/components/{Name}/` is picked up automatically. If the feature doesn't appear after build, the cause is usually:

- The directory wasn't added to the relevant barrel (`packages/0/src/composables/index.ts` or `packages/0/src/components/index.ts`).
- The barrel entry is alphabetically out of order and a lint rule is silently skipping it.
- The feature's folder is named inconsistently with the export (e.g., `useFooBar/` but export is `useFoobar`).

The whitelist drives API hover popovers and IntelliSense in the docs site. Confirm your feature shows up in `<DocsApi />` on its docs page before calling the work done.

## Verification [intent:248]

After completing all items, run (in this order):

```bash
pnpm build:0        # Package build
pnpm typecheck       # Type safety
pnpm lint:fix        # Lint (fix mode, not check)
pnpm build:docs      # Docs build (validates pages, examples, nav)
```

`lint:fix` runs **before committing**, not after. The pre-push hook does not fix commits. [intent:255]

## Categories

**Components** [intent:249]: `primitives`, `providers`, `actions`, `forms`, `disclosure`, `data`, `semantic`

**Composables** [intent:250]: `foundation`, `registration`, `selection`, `forms`, `data`, `plugins`, `system`, `reactivity`, `transformers`, `semantic`

> **Note.** `maturity.json` currently tags `createBreadcrumbs` and `createOverflow` with `category: "utilities"`, but there is no `apps/docs/src/pages/composables/utilities/` directory and both pages live under `semantic/`. Treat that as a maturity.json data inconsistency to fix separately — don't pick `utilities` as a composable category for new features. The top-level `utilities` block of `maturity.json` (the type guards) is a different organizational layer and not a docs-page category.

### Features that don't fit an existing category

If a new component or composable doesn't fit any existing category, **do not** shoehorn it into the closest one. Propose a new category instead.

**Process:**

1. Draft a short description of the new category and what it contains.
2. List 2–3 existing features that would migrate into it (or confirm this is a wholly new axis).
3. Open a discussion (PR comment, GitHub Discussion, or design doc) rather than committing directly. Category additions touch docs nav, maturity matrix, checklist, and README — not a silent edit.
4. Wait for approval from a repo maintainer before adding the entry to `packages/0/src/maturity.json`.

Shoehorning a feature into a category that doesn't fit creates compound confusion: the docs nav lists it in the wrong section, the checklist audits it by the wrong rules, and the next author who joins won't find it. Better to own the naming once than to debug wrong taxonomy for six months. [user-feedback:2026-04-20]

## Maturity Levels [intent:251]

- **draft** — Planned, not implemented. New components/composables start here. [intent:300]
- **preview** — Implemented, API may change.
- **stable** — API locked, production-ready.
- **mature** — API frozen; downstream consumers depend on it. Breaking changes require a major version.
- **deprecated** — Superseded or scheduled for removal; ships with a migration guide and removal timeline.

### Maturity matrix — where each level lives

`maturity.json` is the single source of truth. Every entry has `level` and `category`, plus an optional `notes` field. `since` is required from `preview` onward and may be omitted on `draft` entries (no implementation has shipped yet). Once a feature is implemented, the entry should carry `since: null` until a maintainer cuts the release that first ships it — at which point `since` is flipped to that version. `since` and `level` are independent: `level` tracks API stability; `since` tracks first-release version. A `preview` feature carries a real `since` once it ships in any release.

```json
{
  "composables": {
    "createModel": {
      "level": "preview",
      "since": "0.2.0",
      "category": "selection",
      "notes": "Recently redesigned from selection system"
    },
    "createOverflow": {
      "level": "preview",
      "since": null,
      "category": "system"
    },
    "createRegistry": {
      "level": "stable",
      "since": "0.1.0",
      "category": "registration"
    }
  }
}
```

The `level` surfaces in the docs through the index-page tables and through `<DocsMaturity />` on the roadmap page (see "Cross-reference with docs" below). It is not rendered as a per-page badge today.

### Why `since: null` until first release

The author of a new feature does not know which release version will first ship it — interim alpha/beta cuts can land before or after the merge. Pinning a guess (e.g., `since: "1.0.0-alpha.1"`) ossifies a fictional version, the field rots when the actual cut number differs, and nobody re-checks it.

The version a feature first shipped in is only known the moment a maintainer cuts a release that includes it. That maintainer flips `since: null` → the actual version manually as part of the release PR. After that, `since` is permanent and never changes — even when the entry later promotes from `preview` to `stable`.

`null` (rather than omitting the key) keeps the entry shape uniform once an entry is past `draft`, surfaces the field as an obvious "needs to be filled in at release" placeholder, and lets tooling iterate entries without branching on key presence. Some `draft` entries omit `since` entirely — that's tolerated because nothing has shipped yet, but the moment the entry promotes to `preview` the key must exist (`null` or a real version).

### How to set the initial level

- Brand-new feature, no implementation yet → `level: "draft"`. `since` may be omitted (or set to `null`); it's filled in when the feature actually ships.
- Implementation landed, passing tests, docs page exists → `level: "preview"`, `since: null`. The maintainer who cuts the next release flips `since` to the release version (level stays `preview` if the API isn't stable yet).
- API has shipped for multiple minor versions with no breaking changes, test coverage is comprehensive, real consumers depend on it → `level: "stable"`. `since` was already set when the feature first shipped — leave it alone.
- Downstream consumers (Vuetify 5, Paper design systems, third-party apps) depend on the API and it's frozen → `level: "mature"`.
- Feature is being phased out → `level: "deprecated"`. Add a `notes` field with the migration target and removal timeline.

### When to promote

| From | To | Criteria |
|------|-----|---------|
| `draft` | `preview` | Implementation landed, `index.test.ts` covers the happy path and edge cases, docs page with a basic example exists, build passes |
| `preview` | `stable` | API has been stable across at least two minor releases (no breaking changes), all failure modes are tested, docs cover adapters / recipes / accessibility, benchmarks (if performance-critical) are green on the latest metrics pipeline |

### Who decides promotions

- `draft → preview` — the author landing the implementation updates `maturity.json` in the same PR.
- `preview → stable` — requires an explicit decision from a maintainer. Don't self-promote. Open a PR titled `chore(maturity): promote {name} to stable` with a checklist of the criteria above; a maintainer merges.

### Cross-reference with docs

`<DocsMaturity />` is the **roadmap aggregator** rendered on `apps/docs/src/pages/roadmap.md` (in the "Maturity Matrix" section). It flattens every entry in `maturity.json` — composables, components, and utilities — into a filterable, groupable `createDataTable` with type chips, level chips, search, and graduation criteria. It accepts no props; it reads the JSON directly. The component links each row to its docs page (or marks it as a non-link for `draft` entries).

There is **no per-page maturity badge** today. Feature pages do not auto-render a "Preview — API may change" notice; the maturity is communicated only through the roadmap matrix and the index pages. If you want a per-page badge, that's a new component — not a change to `DocsMaturity`.

The same `maturity.json` data feeds `pages/components/index.md` and `pages/composables/index.md` category tables. When promoting, do not edit those pages — they regenerate from the JSON.

## Before writing code (PHILOSOPHY §1)

Check existing functionality first:

- `#v0/utilities` for type guards, `mergeDeep`, `useId`, `clamp`, `range`
- `#v0/composables` for registration, selection, forms, browser, etc.
- `#v0/types` for `ID`, `Extensible`, `MaybeArray`, `DeepPartial`, `Activation`
- `#v0/constants/globals` for `IN_BROWSER`, `SUPPORTS_*`

Prefer extending an existing pattern over creating a new one.

## Checklist

- [ ] Directory and barrel entry created with alphabetical ordering
- [ ] `maturity.json` entry added with `level` (start at `draft`) and `category`; `since` once promoted past `draft` (`null` until first release ships, then the version)
- [ ] Docs page created with required frontmatter fields
- [ ] At least a basic example exists at `apps/docs/src/examples/{type}/{kebab-name}/basic.vue` (folder kebab-cased: `use-popover`, `alert-dialog` — never `usePopover`, `AlertDialog`)
- [ ] Index page table entry added in the correct category section
- [ ] Both `packages/0/README.md` and root `README.md` updated and kept in sync
- [ ] `pnpm build:0`, `pnpm typecheck`, `pnpm lint:fix`, `pnpm build:docs` all green
- [ ] Category chosen from the fixed list (no inventing new categories without approval)
- [ ] Feature appears in `apps/docs/build/generated/api-whitelist.ts` after build
- [ ] `<DocsApi />` renders on the new docs page
- [ ] Maturity level matches the promotion criteria table (don't self-promote to `stable` or `mature` — those require a maintainer)
