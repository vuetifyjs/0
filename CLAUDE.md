# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **pnpm monorepo** for Vue 3 headless UI primitives and composables, providing unstyled, logic-focused components as building blocks for design systems and component libraries. Part of the Vuetify family.

### Core Packages

- **`@vuetify/v0`** (`packages/0/`): Main package providing headless components and composables
- **`@vuetify/paper`** (`packages/paper/`): Styling and layout primitives that depend on `@vuetify/v0`

### Applications

- **Playground** (`playground/`): Interactive development environment for rapid prototyping
- **Documentation** (`apps/docs/`): Documentation site built with VitePress-style markdown
- **Storybook** (`apps/storybook/`): Component stories and visual testing

## Commands

### Development
```bash
pnpm dev          # Start playground dev server
pnpm dev:docs     # Start documentation site
pnpm storybook    # Start Storybook
```

### Building
```bash
pnpm build        # Build all packages (uses tsdown)
pnpm build:docs   # Build documentation site
pnpm build:storybook
```

### Testing
```bash
pnpm test         # Run Vitest tests (watch mode)
pnpm test:ui      # Run tests with Vitest UI
pnpm coverage     # Generate coverage report
pnpm test:bench   # Run benchmarks (verbose)
pnpm bench        # Run benchmarks (default)
pnpm test:knip    # Check for unused dependencies/exports
pnpm test:sherif  # Check monorepo dependency consistency
```

### Code Quality
```bash
pnpm typecheck    # Type check @vuetify/v0 package
pnpm lint         # Lint codebase
pnpm lint:fix     # Fix linting issues
```

### Release
```bash
pnpm release      # Bump version with bumpp
```

## Composables Architecture

The entire system is built on composable functions in `packages/0/src/composables/`. Understanding this layer is critical to working in this codebase.

### Foundation Layer

Three core factories provide the foundation for all other composables:

#### 1. `createContext` - Dependency Injection
```ts
const [useContext, provideContext] = createContext<MyContext>('namespace')
```
- Type-safe Vue dependency injection wrapper
- `useContext()` throws error if context not found (no silent failures)
- `provideContext(value, app?)` can provide to app or current component tree
- Location: `packages/0/src/composables/createContext/index.ts`

#### 2. `createTrinity` - Context Triple Pattern
```ts
const [useX, provideX, defaultX] = createTrinity(useContext, provideContext, defaultContext)
```
- Returns readonly tuple: `[use function, provide function, default context instance]`
- The **trinity pattern** is used throughout the codebase for creating reusable context systems
- Third element is the default/fallback context instance
- Most complex composables export a trinity for dependency injection
- Location: `packages/0/src/composables/createTrinity/index.ts`

#### 3. `createPlugin` - Vue Plugin Factory
```ts
createPlugin({
  namespace: 'v0:feature',
  provide: (app) => { /* provide context */ },
  setup: (app) => { /* optional setup logic */ }
})
```
- Wraps context provision in a Vue plugin
- `app.runWithContext()` ensures proper context scoping
- Location: `packages/0/src/composables/createPlugin/index.ts`

### The Registry System

`useRegistry` is the **foundational data structure** that most other composables build upon. It's essentially an enhanced Map with indexing, caching, and event support.

**Core Concept**: Registry manages "tickets" (items with `id`, `index`, `value`, `valueIsIndex`)

**Key Features**:
- **Collection**: `Map<ID, Ticket>` storing all items
- **Catalog**: Reverse lookup from `value -> ID(s)` via `browse(value)`
- **Directory**: Index-based lookup via `lookup(index)`
- **Caching**: `keys()`, `values()`, `entries()` are cached and invalidated on mutation
- **Events**: Optional event emission for `register`/`unregister` operations
- **Reindexing**: Automatic index management when items are added/removed

**API**:
```ts
const registry = useRegistry<TicketType>({ events: true })

registry.register({ id: 'item-1', value: 'foo' }) // Returns ticket
registry.get('item-1')           // Get by ID
registry.browse('foo')           // Find ID(s) by value
registry.lookup(0)               // Get ID by index
registry.has('item-1')           // Check existence
registry.upsert('item-1', {...}) // Update or insert
registry.unregister('item-1')    // Remove and reindex
registry.onboard([...])          // Bulk register
registry.reindex()               // Rebuild indexes
```

Location: `packages/0/src/composables/useRegistry/index.ts`

### Composable Hierarchy

Understanding the inheritance chain is crucial:

```
useRegistry (base: collection management)
  ↓
useSelection (adds: selectedIds, select/unselect/toggle, mandatory/enroll options)
  ↓
  ├─ useSingle (single selection: selectedId, selectedItem, selectedIndex, selectedValue)
  │    ↓
  │    └─ useStep (navigation: first, last, next, prev, step)
  │         └─ Used by: Theme switching, Step components
  │
  └─ useGroup (multi-selection: selectedIndexes, array-based select/unselect)
       └─ useFeatures (feature flags with variations)
```

### Key Composable Systems

#### Selection System

**`useSelection`** - Base selection with Set-based tracking
- `selectedIds`: `Set<ID>` (reactive)
- `selectedItems`, `selectedValues`: Computed sets
- `mandatory`: Prevents deselecting last item (or 'force' to mandate on register)
- `enroll`: Auto-select non-disabled items on register
- Tickets get `isSelected`, `select()`, `unselect()`, `toggle()` methods

**`useSingle`** - Single-selection specialization
- Clears `selectedIds` before selecting (enforces single selection)
- Adds: `selectedId`, `selectedItem`, `selectedIndex`, `selectedValue` (all singular)
- Used by `useTheme` for theme switching

**`useGroup`** - Multi-selection specialization
- Accepts `ID | ID[]` for batch operations
- Adds: `selectedIndexes` computed set

**`useStep`** - Navigation through items
- Extends `useSingle` with: `first()`, `last()`, `next()`, `prev()`, `step(count)`
- Wraps around (circular navigation)
- Skips disabled items automatically

#### Token System

**`useTokens`** - Design token registry with alias resolution

**Key Concepts**:
- Tokens can be primitives or `TokenAlias` objects with `$value`
- Alias syntax: `{path.to.token}` (curly braces)
- Nested token collections are flattened with dot notation (e.g., `colors.primary`)
- Resolution follows aliases recursively with caching

```ts
const tokens = useTokens({
  colors: {
    blue: { 500: '#3b82f6' },
    primary: '{colors.blue.500}' // Alias
  }
}, { flat: true })

tokens.isAlias('{colors.primary}') // true
tokens.resolve('{colors.primary}') // '#3b82f6'
```

**Advanced Features**:
- Supports W3C Design Tokens format with `$value`, `$type`, `$description`
- Nested path resolution: can resolve `{colors}.blue.500` if `colors` is a token
- Cache for resolved values with circular reference protection

**Critical Protection**: Circular alias detection prevents stack overflow:
```typescript
const tokens = useTokens({
  a: '{b}',
  b: '{a}' // Detected and handled gracefully
})
tokens.resolve('{a}') // Returns undefined with warning
```

Location: `packages/0/src/composables/useTokens/index.ts`

#### Feature Flags

**`useFeatures`** - Feature flag system with variations

Built on `useGroup` + `useTokens`. Features can be:
- Boolean: `{ 'dark-mode': true }` - auto-selected if true
- Token objects: `{ 'theme': { $variation: 'blue' } }`

```ts
const features = createFeatures({
  namespace: 'v0:features',
  features: {
    'new-ui': true,
    'theme-variant': { $variation: 'compact' }
  }
})

features.variation('theme-variant', 'default') // 'compact' or fallback to 'default'
```

Location: `packages/0/src/composables/useFeatures/index.ts`

#### Forms

**`useForm`** - Form validation and state management

**Key Concepts**:
- Fields are registered with `id`, `value` (ref), `rules` (validation functions)
- Validation modes: `'submit'` (default), `'change'`, or space-separated combo
- Rules return `string` (error) or `true` (valid), can be async

**Field Ticket Properties**:
- `value`: Getter/setter that triggers validation on `'change'` mode
- `errors`: `ShallowRef<string[]>`
- `isValid`: `null` (not validated) | `true` | `false`
- `isPristine`: Tracks if value equals initial value
- `validate(silent?)`: Run validation, returns `Promise<boolean>`
- `reset()`: Restore initial value and clear errors

**Form-level API**:
```ts
const form = useForm({ validateOn: 'change' })

const username = form.register({
  id: 'username',
  value: ref(''),
  rules: [
    v => v.length > 0 || 'Required',
    v => v.length >= 3 || 'Min 3 chars'
  ]
})

await form.submit() // Validates all fields
form.reset()        // Reset all fields
```

Location: `packages/0/src/composables/useForm/index.ts`

#### Timeline (Undo/Redo)

**`useTimeline`** - Bounded undo/redo system

Extends `useRegistry` with fixed-size history:
- `size` option sets max timeline length (default: 10)
- `undo()`: Removes last item, adds to undo stack
- `redo()`: Restores last undone item
- Automatically removes oldest item when at capacity

Location: `packages/0/src/composables/useTimeline/index.ts`

#### Theme System

**`useTheme`** - Theme management with CSS variable injection

Built on `useSingle` for single-theme selection:
- Themes registered with `colors` object
- `colors` computed resolves token aliases via `useTokens`
- `cycle(themes?)`: Switch to next theme in array
- Adapter pattern: `ThemeAdapter` generates and injects CSS variables

**Plugin version** watches `colors` and updates adapter:
```ts
createThemePlugin({
  default: 'light',
  themes: {
    light: { colors: { primary: '#1976d2' } },
    dark: { colors: { primary: '#90caf9' } }
  }
})
```

Location: `packages/0/src/composables/useTheme/index.ts`

#### Other Composables

**Filtering**: `useFilter` - Reactive array filtering with multiple modes (some/every/union/intersection)

**Observers**: `useIntersectionObserver`, `useMutationObserver`, `useResizeObserver` - Lifecycle-managed observers

**Events**: `useEventListener`, `useKeydown` - Automatic cleanup on unmount

**Storage**: `useStorage` - Adapter pattern for localStorage/sessionStorage/memory

**Locale**: `useLocale` - i18n adapter pattern

**Logger**: `useLogger` - Logging adapter (consola/pino/custom)

**Breakpoints**: `useBreakpoints` - Responsive breakpoint detection

**Hydration**: `useHydration` - SSR hydration helpers

**Utilities**: `toReactive`, `toArray` - Transform helpers

### Context Trinity Pattern Usage

All applicable composables export both:
1. A direct `useX()` function for standalone use
2. A `createX()` function returning a trinity

Example pattern:
```ts
// Direct usage (uses default 'v0:theme' namespace)
const theme = useTheme()

// Or create your own context with custom namespace
const [useMyTheme, provideMyTheme, defaultTheme] = createTheme({
  namespace: 'my-theme',
  ...options
})
```

**Namespace Parameter**: All `createX` functions now accept `namespace` within their options object (not as a separate parameter). This provides a consistent API across all composables while maintaining backward compatibility through default values.

This dual pattern allows both standalone and injected usage. All registry-based composables implement the context creation pattern for dependency injection.

### Adapter Pattern

Several composables support adapters for framework-agnostic core logic:

- **Theme**: `ThemeAdapter` - CSS variable injection strategy
- **Logger**: Adapter interface for console/pino/consola
- **Locale**: i18n provider adapters
- **Storage**: localStorage/sessionStorage/memory adapters
- **Permissions**: Permission system adapters

Adapters live in `packages/0/src/composables/useX/adapters/`

## Code Conventions

### Component Structure

- **Headless first**: Components provide logic/accessibility, not styling
- **Slot-driven**: Maximize flexibility via comprehensive slot APIs
- **Single-layer**: Components should not be composed of multiple internal components
- **CSS variables only**: All styling via `--v0-*` custom properties, never hardcoded
- **No global state**: All state is local or context-based

### Styling Guidelines

- **Always use UnoCSS utility classes** for styling in examples, documentation, and playground
- UnoCSS is the primary styling approach for this project
- Use utility-first classes instead of custom `<style>` blocks whenever possible
- Examples:
  - Layout: `flex`, `grid`, `items-center`, `justify-between`, `gap-4`
  - Spacing: `px-6`, `py-4`, `mb-8`, `mt-12`
  - Colors: `bg-blue-50`, `text-gray-900`, `border-gray-300`
  - Typography: `text-2xl`, `font-medium`, `leading-relaxed`
  - Effects: `transition-all`, `hover:bg-gray-100`, `rounded-lg`
- Only use custom CSS when absolutely necessary (e.g., animations, complex gradients)
- Component library code remains headless (no styling in components themselves)

### Composables

- Named with `use` prefix (e.g., `useTheme`, `useBreakpoints`) or `create` for factories
- Located in `packages/0/src/composables/`
- Each composable in its own directory with `index.ts`
- **@module JSDoc block required** at line 1 of every composable file with:
  - `@module` tag with composable name
  - `@remarks` section explaining purpose and key features
  - Inheritance/relationship notes where applicable
- Tests colocated as `index.test.ts` in same directory
- Benchmark files as `index.bench.ts` where performance-critical (see `useTokens`, `useRegistry`)
- Most composables extend `useRegistry` or build on the foundation layer
- Export both standalone functions and context creation functions
- Use generic type parameters for extensibility: `<Z extends TicketType, E extends ContextType>`
- Section comments for imports (e.g., `// Factories`, `// Composables`, `// Types`) are encouraged

### Testing

- **Framework**: Vitest with happy-dom
- **Pattern**: Tests are colocated with source files
- **Test files**: `*.test.ts` or `*.spec.ts`
- **Configuration**: Root `vitest.config.ts` uses project-based testing for all `packages/*`
- **Mocking**: Vue composables are mocked for isolated unit tests (see `createContext/index.test.ts`)
- **What NOT to include in tests**:
  - No "real-world use case" or "example" test sections (belongs in docs/integration tests)
  - No TypeScript-only tests that verify types at runtime (impossible)
  - No tests of implementation details (test behavior, not internals)
  - No redundant/duplicate tests covering identical behavior
- **Focus on**: Edge cases, error conditions, async handling, SSR safety, memory leak prevention

### TypeScript

- Full type safety required throughout (zero `any` types allowed)
- Export types alongside implementation
- Heavy use of generic constraints for extensibility:
  - `Z extends TicketType` - The ticket/item type
  - `E extends ContextType` - The context/API type
  - Default types provided: `<Z extends TicketType = TicketType>`
- Path aliases: `#v0/` maps to `packages/0/src/` (use these, NOT relative imports)
- `ID` type imported from `#v0/types` (used for identifiers)
- Readonly tuples for trinity pattern: `as const`
- MaybeRef/MaybeRefOrGetter for flexible reactive inputs
- Use `unknown` instead of `any` for truly unknown data
- Proper `App` type from Vue for app-level provision

### File Organization

```
packages/0/src/
├── components/       # Vue components (Atom, Theme, etc.)
├── composables/      # Composable functions
│   └── useX/
│       ├── index.ts
│       ├── index.test.ts
│       └── adapters/ (if applicable)
├── constants/        # Global constants (IN_BROWSER, htmlElements)
├── types/           # Shared TypeScript types
└── utilities/       # Helper functions
```

### Exports

`@vuetify/v0` provides granular exports:
- `.` - Main entry (all exports)
- `./components` - Components only
- `./composables` - Composables only
- `./utilities` - Utilities only
- `./types` - Types only
- `./constants` - Constants only
- `./browser` - Browser-specific build

## Key Implementation Details

### Ticket Pattern

Throughout the codebase, "tickets" represent registered items. Each ticket extends `RegistryTicket`:
```ts
interface RegistryTicket {
  id: ID              // Unique identifier (auto-generated if not provided)
  index: number       // Position in registry
  value: unknown      // Associated value
  valueIsIndex: boolean // True if value wasn't explicitly set
}
```

Composables extend this with additional properties:
- `SelectionTicket` adds: `disabled`, `isSelected`, `select()`, `unselect()`, `toggle()`
- `FormTicket` adds: `validate()`, `reset()`, `errors`, `isValid`, `isPristine`, `rules`
- `ThemeTicket` adds: `lazy`, `dark`
- etc.

### Spread Pattern for Extension

Composables use object spreading to extend lower-level composables:
```ts
function useSelection() {
  const registry = useRegistry()

  // Add selection-specific logic
  const selectedIds = shallowReactive(new Set())

  return {
    ...registry,  // Spread all registry methods
    selectedIds,  // Add new properties
    select,       // Add new methods
  } as E
}
```

This creates a clean inheritance-like pattern without actual inheritance.

### Reactive Collections

- Use `shallowReactive(new Set())` for ID collections (not `ref(new Set())`)
- Use `computed()` for derived collections
- Cache non-reactive iterations in Maps, invalidate on mutation

### Validation Patterns

Forms and other systems use async validation:
- Rules: `(value) => string | true | Promise<string | true>`
- Error strings indicate failure, `true` indicates success
- Validation can be silent (for checking) or update state

### CSS Variable Naming

All CSS variables use `--v0-` prefix for the core package. Paper package may use different conventions.

### SSR Support

- Use `IN_BROWSER` constant from `#v0/constants/globals` for browser-only code
- Components support hydration via `Hydration` component and `useHydration` composable
- Theme adapter checks `IN_BROWSER` before DOM manipulation

### Token Flattening

`useTokens` internally flattens nested token objects into a registry using dot notation:
```ts
{ colors: { blue: { 500: '#3b82f6' } } }
// Becomes registry entries:
// 'colors.blue.500' -> '#3b82f6'
```

Uses iterative stack-based algorithm (not recursive) for performance.

## Package Manager Requirements

- **Node**: >=20.19 or >=22
- **pnpm**: >=10.6 (workspace-aware)
- Uses pnpm catalog for shared dependency versions

## Build Tooling

- **Build**: tsdown (TypeScript bundler)
- **Dev**: Vite
- **Testing**: Vitest
- **Linting**: ESLint with vuetify config
- **Styling**: UnoCSS (utility-first CSS)

## Documentation

Documentation is in `apps/docs/src/pages/` as Markdown files with examples. When adding new features, corresponding documentation should be added.
