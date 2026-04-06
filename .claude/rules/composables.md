---
paths: packages/0/src/composables/**
---

# Composables Architecture

Composables live in `packages/0/src/composables/`.

## Naming Rules (100% enforced)

| Prefix | When to Use | Creates State? | Example |
|--------|-------------|---------------|---------|
| `create` | Factory returning new stateful instance. Can be instantiated multiple times. | Yes | `createRegistry()`, `createSelection()` |
| `use` | DI consumer (`createPluginContext`), browser API wrapper, or lifecycle-aware hook | Varies | `useTheme()`, `useEventListener()` |
| `to` | Pure stateless transformer — no side effects, no reactivity | No | `toArray()`, `toElement()` |

**Trinity export**: When a composable needs subtree scoping via Vue DI.
- `createXContext()` → registries: returns `[useX, provideX, defaultX]`
- `createPluginContext()` → plugins: returns `[createXContext, createXPlugin, useX]`
- **No trinity** → plain factories owned by caller or internal helpers

## Factory Function Pattern (100% enforced)

```ts
/**
 * @module createFoo
 * @see https://0.vuetifyjs.com/composables/category/create-foo
 * @remarks Description of what this composable does.
 * @example
 * ```ts
 * const foo = createFoo({ bar: true })
 * ```
 */

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isNull } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'

export interface FooOptions extends RegistryOptions {
  disabled?: MaybeRefOrGetter<boolean>  // Reactive state → MaybeRefOrGetter
  namespace?: string                     // Configuration → plain value
}

export interface FooContext<
  Z extends FooTicketInput = FooTicketInput,
  E extends FooTicket<Z> = FooTicket<Z>,
> extends Omit<RegistryContext<Z, E>, 'register'> {
  register: (registration?: Partial<Z>) => E
}

export function createFoo<
  Z extends FooTicketInput = FooTicketInput,
  E extends FooTicket<Z> = FooTicket<Z>,
>(options: FooOptions = {}): FooContext<Z, E> {
  const { disabled, namespace = 'v0:foo' } = options

  const registry = createRegistry<Z, E>(options)

  // ... implementation

  return {
    ...registry,     // Always spread parent
    // new properties
  } as FooContext<Z, E>
}
```

### Import Section Order (100% enforced)

Always grouped with comments, always `#v0/` alias:
1. `// Globals` — imports from `#v0/constants/globals`
2. `// Composables` — imports from `#v0/composables/`
3. `// Adapters` — imports from local `./adapters/`
4. `// Utilities` — imports from `#v0/utilities`
5. `// Transformers` — imports from `#v0/composables/toX`
6. `// Types` — `import type` blocks (always last)
7. `// Exports` — re-exports of adapter types (if applicable)

### JSDoc (100% enforced)

Every composable requires at the top of `index.ts`:
- `@module` — composable name
- `@see` — link to docs page
- `@remarks` — purpose and key features
- `@example` — usage example (at least one)

## Reactive Primitives (100% enforced)

| Primitive | When to Use |
|-----------|-------------|
| `shallowRef(value)` | Single mutable UI state (booleans, numbers, strings) |
| `shallowReactive(new Set())` | Mutable ID collections |
| `computed(() => ...)` | Derived state (filtering, mapping, aggregation) |
| `toRef(() => ...)` | Simple property access, ternaries, cheap derivations |
| `ref(value)` | Mutable objects/arrays that need deep tracking |
| `readonly()` / `shallowReadonly()` | Plugin singletons exposed to consumers |

**Rule**: Registry collections stay mutable. Plugin singletons get readonly wrapping.

## Options Reactivity (100% enforced)

| Option Type | Pattern | Example |
|-------------|---------|---------|
| UI state (disabled, readonly, error) | `MaybeRefOrGetter<T>` | `disabled?: MaybeRefOrGetter<boolean>` |
| Configuration (events, namespace) | Plain `T` | `namespace?: string` |
| Reactive logic (keys, filters) | `MaybeRefOrGetter<T>` | `keys?: MaybeRefOrGetter<string[]>` |

## Error Handling Philosophy (95% enforced)

| Situation | Action |
|-----------|--------|
| Missing required context/plugin | `throw new Error()` |
| Data integrity (duplicate IDs, circular refs) | `logger.warn()` via `useLogger()` |
| Runtime logic (disabled, not found) | Silent return (`return` / `return false`) |

**Never** use `console.warn` directly — always `useLogger()`.

## Cleanup Pattern

| Composable Type | Cleanup |
|-----------------|---------|
| DOM observers, event listeners | `onScopeDispose(cleanup)` |
| Performance-critical DOM observers | `onScopeDispose(cleanup, true)` (deferred) |
| Pure data structures, computed state | No cleanup needed (Vue handles it) |

## Composition Patterns (4 canonical styles)

### 1. Extension (spread override)
```ts
// Child spreads parent and adds/overrides
const selection = createModel(options)
return { ...selection, selectedIds, select, toggle }
```
Used by: Selection chain (createModel → createSelection → createSingle → createGroup → createStep)

### 2. Aggregation (multi-system)
```ts
// Orchestrator composes independent systems
return { selection: createSelection(), popover: usePopover(), cursor: useVirtualFocus() }
```
Used by: createCombobox, createDataTable

### 3. Plugin Context (singleton)
```ts
// App-level state via createPluginContext
export const [createXContext, createXPlugin, useX] = createPluginContext('v0:x', ...)
```
Used by: useTheme, useLocale, useLogger, useStack, etc.

### 4. Adapter (pluggable implementation)
```ts
// Swappable behavior via adapter interface
function createFoo({ adapter = new V0FooAdapter() }) { adapter.setup(context) }
```
Used by: Theme, Logger, Date, Locale, Storage, Notifications, DataTable, Combobox

## Dependency Layers

```
Layer 0: Foundation (no v0 deps)
  createContext, createRegistry, createModel, createNumeric,
  createObserver, createPlugin, createTrinity,
  toArray, toElement, toReactive,
  useEventListener, useHydration, useTimer, useMediaQuery, etc.

Layer 1: Single-layer deps
  useBreakpoints, useLocale, useTheme, useRules, etc.

Layer 2: Complex orchestrators
  createSelection → createSingle → createGroup → createStep
  createCombobox, createDataTable
```

**Never** depend upward. Foundation must not import from Layer 1+.

## Registry System

`createRegistry` is the foundational factory. Returns an enhanced Map with indexing, caching, events.

**Core Concept**: Manages "tickets" with `id`, `index`, `value`, `valueIsIndex`

**Extension**: Always via `...spread` pattern. 100% consistent across all 27 registry-based composables.

## Selection System

### `createSelection` - Base Selection
### `createSingle` - Single Selection
### `createGroup` - Multi-Selection + Tri-State
### `createStep` - Navigation
### `createModel` - Value Store
### `createNested` - Hierarchical Selection

See CLAUDE.md for full API reference.

## Scope Guards

| Composable Type | Guard |
|-----------------|-------|
| Needs global/injected context | `instanceExists()` check with fallback |
| Pure utilities | No check — works anywhere |
| Vue framework integration | `hasInjectionContext()` check |

## ID Generation (100% enforced)

Always use `useId()` from `#v0/utilities`. Never auto-increment. SSR-safe.
