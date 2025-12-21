---
paths: packages/0/src/**
---

# Implementation Patterns

Technical patterns used throughout `packages/0/src/`.

## Utilities First

Before writing new helpers, check `#v0/utilities/helpers`. Use these instead of creating duplicates:

| Helper | Purpose |
|--------|---------|
| `isFunction`, `isString`, `isNumber`, `isBoolean` | Type guards |
| `isObject`, `isArray`, `isNull`, `isUndefined` | Type guards |
| `isNullOrUndefined`, `isPrimitive`, `isSymbol`, `isNaN` | Type guards |
| `mergeDeep` | Deep object merge with `DeepPartial<T>` |
| `genId` | Generate random 7-char ID |
| `clamp(value, min, max)` | Clamp number to range |
| `range(length, start)` | Create sequential number array |
| `debounce(fn, delay)` | Debounce with `.clear()` and `.immediate()` |

All helpers are tree-shakeable (`#__NO_SIDE_EFFECTS__`).

## Ticket Pattern

"Tickets" represent registered items. Base interface:

```ts
interface RegistryTicket {
  id: ID               // Unique (auto-generated if not provided)
  index: number        // Position in registry
  value: unknown       // Associated value
  valueIsIndex: boolean // True if value wasn't set
}
```

**Extensions**:
| Ticket Type | Added Properties |
|-------------|------------------|
| `SelectionTicket` | `disabled`, `isSelected`, `select()`, `unselect()`, `toggle()` |
| `GroupTicket` | `isMixed`, `mix()`, `unmix()`, `indeterminate` |
| `FormTicket` | `validate()`, `reset()`, `errors`, `isValid`, `isPristine`, `rules` |
| `QueueTicket` | `timeout`, `isPaused`, `dismiss()` |
| `ThemeTicket` | `lazy`, `dark` |

## Spread Pattern for Extension

Composables extend via object spreading:

```ts
function useSelection() {
  const registry = useRegistry()
  const selectedIds = shallowReactive(new Set())

  return {
    ...registry,    // Spread base
    selectedIds,    // Add new
    select,
  } as E
}
```

## Reactive Collections

- `shallowReactive(new Set())` for ID collections (not `ref(new Set())`)
- `computed()` for derived collections
- Cache iterations in Maps, invalidate on mutation

## Validation Patterns

Async validation signature:
```ts
type Rule = (value: T) => string | true | Promise<string | true>
```
- String = error message
- `true` = valid

## SSR Support

- `IN_BROWSER` constant from `#v0/constants/globals`
- `Hydration` component + `useHydration` composable
- Theme adapter checks `IN_BROWSER` before DOM ops

## Token Flattening

`useTokens` flattens nested objects:
```ts
{ colors: { blue: { 500: '#3b82f6' } } }
// → 'colors.blue.500' -> '#3b82f6'
```
Uses iterative stack (not recursive) for performance.

## Path Alias

`#v0/` maps to `packages/0/src/`. Use this, not relative imports.

```ts
import { ID } from '#v0/types'
import { useRegistry } from '#v0/composables/useRegistry'
import { isObject, genId } from '#v0/utilities/helpers'
```

## File Organization

```
packages/0/src/
├── components/       # Vue components
├── composables/      # Composable functions
│   └── useX/
│       ├── index.ts
│       ├── index.test.ts
│       └── adapters/
├── constants/        # IN_BROWSER, htmlElements
├── types/            # Shared types (ID, etc.)
└── utilities/        # Helpers (use these!)
```
