# @vuetify/v0 Monorepo

Vue 3 headless UI primitives and composables. Unstyled, logic-focused building blocks for design systems. Part of the Vuetify family.

## Packages

- **`@vuetify/v0`** (`packages/0/`): Headless components and composables
- **`@vuetify/paper`** (`packages/paper/`): Styling primitives depending on v0

## Apps

- **Playground** (`playground/`): Dev environment
- **Docs** (`apps/docs/`): VitePress-style documentation
- **Storybook** (`apps/storybook/`): Component stories

## Commands

```bash
# Development
pnpm dev              # Playground
pnpm dev:docs         # Documentation
pnpm dev:storybook    # Storybook

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
pnpm lint             # Lint
pnpm lint:fix         # Auto-fix
pnpm validate         # lint + typecheck + test

# Release
pnpm release:prepare  # Pre-release validation
pnpm release:patch    # Bump patch
pnpm release:minor    # Bump minor

# Repo health
pnpm repo:check       # knip + sherif
```

## General Conventions

### TypeScript
- Zero `any` types
- `unknown` over `any` for unknowns
- Readonly tuples for trinity pattern: `as const`

### Styling
- **UnoCSS utility classes** in examples/docs/playground
- Component library stays headless

### Testing
- Vitest + happy-dom
- Colocated with source (`*.test.ts`)
- Focus: edge cases, error conditions, async, SSR safety

## Requirements

- **Node**: >=22
- **pnpm**: >=10.6

## Build Tooling

- **Build**: tsdown
- **Dev**: Vite
- **Test**: Vitest
- **Lint**: ESLint (vuetify config)
- **Style**: UnoCSS
