# New Feature Checklist

**Applies to:** Adding any new component or composable to `packages/0/`.

When a new component or composable is created, **all** items below must be completed before the work is considered done. Do not skip items — ask the user if unsure about category or maturity level.

## Components

| # | File | Action |
|---|------|--------|
| 1 | `packages/0/src/components/{Name}/` | Create component directory with `.vue` files + `index.ts` barrel |
| 2 | `packages/0/src/components/index.ts` | Add `export * from './{Name}'` (alphabetical) |
| 3 | `packages/0/src/maturity.json` | Add entry under `"components"` with `level`, `since`, `category` |
| 4 | `apps/docs/src/pages/components/{category}/{name}.md` | Create docs page with frontmatter (title, meta, features, related) |
| 5 | `apps/docs/src/examples/components/{name}/basic.vue` | Create at least a basic example |
| 6 | `apps/docs/src/pages/components/index.md` | Add table entry in the correct category section |
| 7 | `packages/0/README.md` | Add to "What's Included" table |
| 8 | `README.md` (root) | Keep in sync with package README |

## Composables

| # | File | Action |
|---|------|--------|
| 1 | `packages/0/src/composables/{name}/` | Create directory with `index.ts` (+ `index.test.ts` if tests requested) |
| 2 | `packages/0/src/composables/index.ts` | Add `export * from './{name}'` (alphabetical) |
| 3 | `packages/0/src/maturity.json` | Add entry under `"composables"` with `level`, `since`, `category` |
| 4 | `apps/docs/src/pages/composables/{category}/{name}.md` | Create docs page with frontmatter |
| 5 | `apps/docs/src/examples/composables/{name}/basic.vue` | Create at least a basic example |
| 6 | `apps/docs/src/pages/composables/index.md` | Add table entry in the correct category section |
| 7 | `packages/0/README.md` | Add to "What's Included" table |
| 8 | `README.md` (root) | Keep in sync with package README |

## Auto-generated (no manual action)

These regenerate on `pnpm build` — just verify build succeeds:

- `apps/docs/build/generated/api-whitelist.ts` — API hover/IntelliSense (filesystem discovery)
- Navigation, search index, examples index — Vite plugins
- `packages/0/dist/json/` — WebStorm/JetBrains web types

## Verification

After completing all items, run:

```bash
pnpm build:0        # Package build
pnpm typecheck       # Type safety
pnpm lint:fix        # Lint
pnpm build:docs      # Docs build (validates pages, examples, nav)
```

## Categories

**Components:** primitives, providers, actions, forms, disclosure, semantic

**Composables:** foundation, registration, selection, forms, data, plugins, system, reactivity, transformers, utilities, semantic

## Maturity Levels

- **draft** — Planned, not implemented
- **preview** — Implemented, API may change
- **stable** — API locked, production-ready
