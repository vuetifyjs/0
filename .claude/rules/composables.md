---
paths: packages/0/src/composables/**
---

# Composables Architecture

Composables live in `packages/0/src/composables/`.

## Foundation Layer

### `createContext` - Dependency Injection
```ts
const [useContext, provideContext] = createContext<MyContext>('namespace')
```
- Type-safe Vue DI wrapper
- `useContext()` throws if context not found
- `provideContext(value, app?)` provides to app or component tree

### `createTrinity` - Context Triple Pattern
```ts
const [useX, provideX, defaultX] = createTrinity(useContext, provideContext, defaultContext)
```
- Returns readonly tuple: `[use, provide, default]`
- Third element is fallback context instance
- Most complex composables export a trinity

### `createPlugin` - Vue Plugin Factory
```ts
createPlugin({
  namespace: 'v0:feature',
  provide: (app) => { /* provide context */ },
  setup: (app) => { /* optional setup */ }
})
```

## Registry System

`useRegistry` is the foundational data structure. Enhanced Map with indexing, caching, events.

**Core Concept**: Manages "tickets" with `id`, `index`, `value`, `valueIsIndex`

**Features**:
- **Collection**: `Map<ID, Ticket>`
- **Catalog**: Reverse lookup `value -> ID(s)` via `browse(value)`
- **Directory**: Index lookup via `lookup(index)`
- **Caching**: `keys()`, `values()`, `entries()` cached, invalidated on mutation
- **Events**: Optional `register`/`unregister` emission

**API**:
```ts
registry.register({ id: 'item-1', value: 'foo' })
registry.get('item-1')
registry.browse('foo')      // Find ID(s) by value
registry.lookup(0)          // Get ID by index
registry.upsert('item-1', {...})
registry.unregister('item-1')
registry.onboard([...])     // Bulk register
```

## Selection System

### `useSelection` - Base Selection
- `selectedIds`: `Set<ID>` (reactive)
- `mandatory`: Prevents deselecting last item
- `enroll`: Auto-select non-disabled on register
- Tickets get: `isSelected`, `select()`, `unselect()`, `toggle()`

### `useSingle` - Single Selection
- Clears `selectedIds` before selecting
- Adds: `selectedId`, `selectedItem`, `selectedIndex`, `selectedValue`

### `useGroup` - Multi-Selection + Tri-State
- Accepts `ID | ID[]` for batch ops
- Tri-state: `isMixed`, `mix()`, `unmix()`, `indeterminate`
- Batch: `selectAll()`, `unselectAll()`, `toggleAll()`

### `useStep` - Navigation
- Extends `useSingle`
- `first()`, `last()`, `next()`, `prev()`, `step(count)`
- Circular navigation, skips disabled

## Token System

### `useTokens` - Design Token Registry
```ts
const tokens = useTokens({
  colors: {
    blue: { 500: '#3b82f6' },
    primary: '{colors.blue.500}'  // Alias
  }
}, { flat: true })

tokens.resolve('{colors.primary}')  // '#3b82f6'
```

- Alias syntax: `{path.to.token}`
- Nested flattening with dot notation
- Circular alias protection

## Specialized Composables

| Composable | Purpose |
|------------|---------|
| `useFeatures` | Feature flags with variations (on `useGroup` + `useTokens`) |
| `useForm` | Form validation with async rules |
| `useTimeline` | Bounded undo/redo |
| `useTheme` | Theme management with CSS variable injection |
| `useQueue` | FIFO queue for notifications/toasts |
| `usePagination` | Integer-based page navigation |
| `useVirtual` | Virtual scrolling |
| `useOverflow` | Container measurement |
| `useFilter` | Array filtering |
| `usePermissions` | RBAC/ABAC on `useTokens` |
| `useLocale` | i18n with interpolation |
| `useBreakpoints` | Responsive breakpoint detection |
| `useLogger` | Pluggable logging with adapters |

## Proxy Utilities

- **`useProxyModel`**: Bridges selection ↔ v-model
- **`useProxyRegistry`**: Registry Map → reactive object

## Other Composables

- **`useToggleScope`**: Conditional effect scope management
- **Observers**: `useResizeObserver`, `useIntersectionObserver`, `useMutationObserver`
- **Events**: `useEventListener`, `useKeydown`, `useClickOutside`
- **Storage**: `useStorage` (localStorage/sessionStorage/memory adapters)
- **Hydration**: `useHydration` (SSR hydration state)
- **Transformers**: `toReactive`, `toArray`

## Trinity Pattern

All applicable composables export both:
1. Direct `useX()` for standalone use
2. `createX()` returning trinity

```ts
const theme = useTheme()

const [useMyTheme, provideMyTheme, defaultTheme] = createTheme({
  namespace: 'my-theme',
  ...options
})
```

## Adapter Pattern

Adapters enable framework-agnostic logic:
- **Theme**: `ThemeAdapter` - CSS variable injection
- **Logger**: console/pino/consola
- **Locale**: i18n providers
- **Storage**: localStorage/sessionStorage/memory

Location: `composables/useX/adapters/`

## Conventions

- `use` prefix for composables, `create` for factories
- Each in own directory with `index.ts`
- **@module JSDoc required** at line 1
- Tests colocated: `index.test.ts`
- Benchmarks: `index.bench.ts` where performance-critical
- Generic constraints: `Z extends TicketType`, `E extends ContextType`
- Path alias: `#v0/` → `packages/0/src/`
