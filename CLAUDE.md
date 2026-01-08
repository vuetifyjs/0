# @vuetify/v0 Monorepo

Vue 3 headless UI primitives and composables. Unstyled, logic-focused building blocks for design systems.

## Before Writing Code

**STOP. Check existing functionality first.**

### Use Built-in Utilities (`#v0/utilities`)

| Utility | Purpose |
|---------|---------|
| `isFunction`, `isString`, `isNumber`, `isBoolean` | Type guards |
| `isObject`, `isArray`, `isNull`, `isUndefined` | Type guards |
| `isNullOrUndefined`, `isPrimitive`, `isSymbol`, `isNaN` | Type guards |
| `mergeDeep(target, ...sources)` | Deep merge with `DeepPartial<T>` |
| `genId()` | Random 7-char alphanumeric ID |
| `clamp(value, min, max)` | Clamp number to range |
| `range(length, start)` | Create sequential number array |
| `debounce(fn, delay)` | Debounce with `.clear()` and `.immediate()` |

### Use Built-in Constants (`#v0/constants/globals`)

| Constant | Purpose |
|----------|---------|
| `IN_BROWSER` | SSR-safe `typeof window !== 'undefined'` |
| `SUPPORTS_TOUCH` | Touch device detection |
| `SUPPORTS_MATCH_MEDIA` | matchMedia availability |
| `SUPPORTS_OBSERVER` | ResizeObserver availability |
| `SUPPORTS_INTERSECTION_OBSERVER` | IntersectionObserver availability |
| `SUPPORTS_MUTATION_OBSERVER` | MutationObserver availability |

### Check Existing Composables (`#v0/composables`)

**Foundation**: `createContext`, `createTrinity`, `createPlugin`
**Registry**: `createRegistry`, `useProxyRegistry`
**Selection**: `createSelection`, `createSingle`, `createGroup`, `createStep`
**Observers**: `useResizeObserver`, `useIntersectionObserver`, `useMutationObserver`
**Events**: `useEventListener`, `useHotkey`, `useClickOutside`
**Reactivity**: `useProxyModel`, `useToggleScope`, `toReactive`, `toArray`
**Features**: `useFeatures`, `usePermissions`, `useTheme`, `useLocale`, `useLogger`
**Data**: `useFilter`, `usePagination`, `useVirtual`, `createForm`, `createQueue`, `createTimeline`
**Browser**: `useBreakpoints`, `useMediaQuery`, `useStorage`, `useHydration`, `useOverflow`
**Tokens**: `createTokens`

## Path Alias

Always use `#v0/` for package imports, never relative paths:

```ts
import { ID } from '#v0/types'
import { isObject, genId } from '#v0/utilities'
import { IN_BROWSER } from '#v0/constants/globals'
import { createRegistry } from '#v0/composables'
```

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
pnpm lint:fix         # Always use lint:fix, not lint
pnpm validate         # lint + typecheck + test

# Release
pnpm release:prepare  # Pre-release validation
pnpm release:patch    # Bump patch
pnpm release:minor    # Bump minor

# Repo health
pnpm repo:check       # knip + sherif
```

## Conventions

### Vue SFCs
- Script tag order: `<script setup lang="ts">` (setup before lang)

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

## Detailed Rules

See `.claude/rules/` for path-scoped documentation:
- `implementation.md` - Patterns for `packages/0/src/**`
- `composables.md` - Architecture for `packages/0/src/composables/**`
- `components.md` - Architecture for `packages/0/src/components/**`
- `benchmarks.md` - Standards for `*.bench.ts` files
