---
paths: packages/0/src/**
---

# Implementation Patterns

Technical patterns used throughout `packages/0/src/`.

## Utilities First

Before writing new helpers, check `#v0/utilities`. Use these instead of creating duplicates:

| Helper | Purpose |
|--------|---------|
| `isFunction`, `isString`, `isNumber`, `isBoolean` | Type guards |
| `isObject`, `isArray`, `isNull`, `isUndefined` | Type guards |
| `isNullOrUndefined`, `isPrimitive`, `isSymbol`, `isNaN`, `isElement` | Type guards |
| `mergeDeep` | Deep object merge with `DeepPartial<T>` |
| `useId()` | SSR-safe ID generation |
| `clamp(value, min, max)` | Clamp number to range |
| `range(length, start)` | Create sequential number array |

All helpers are tree-shakeable (`#__NO_SIDE_EFFECTS__`).

## Ticket Pattern

"Tickets" represent registered items. Hierarchy:

```
RegistryTicketInput → ModelTicketInput → SelectionTicketInput → SingleTicketInput → StepTicketInput
                                        └→ GroupTicketInput → NestedTicketInput
                   └→ QueueTicketInput
                   └→ FormTicketInput
```

Base interface:
```ts
interface RegistryTicket {
  id: ID               // Unique (auto-generated via useId() if not provided)
  index: number        // Position in registry
  value: unknown       // Associated value
  valueIsIndex: boolean // True if value wasn't set
}
```

**Extensions**:
| Ticket Type | Added Properties |
|-------------|------------------|
| `ModelTicket` | `disabled`, `isSelected: Readonly<Ref<boolean>>` |
| `SelectionTicket` | `select()`, `unselect()`, `toggle()` |
| `GroupTicket` | `isMixed: Readonly<Ref<boolean>>`, `mix()`, `unmix()`, `indeterminate` |
| `NestedTicket` | `isOpen`, `isActive`, `isLeaf`, `depth`, tree traversal methods |
| `QueueTicket` | `timeout`, `isPaused`, `dismiss()` |
| `FormTicket` | `validate()`, `reset()`, `errors`, `isValid`, `isPristine`, `rules` |

**Input → Output naming**: Always `FooTicketInput` → `FooTicket`. Both defined as a pair.

**Ticket state typing**:
- Boolean state: `Readonly<Ref<boolean>>` (e.g., `isSelected`, `isMixed`)
- Methods: plain functions, no parameters (self-reference via closure)
- Config: `MaybeRefOrGetter<T>` on input, plain on output

## Spread Pattern for Extension (100% enforced)

Composables extend via object spreading. Never override — spread then add:

```ts
function createSelection(options) {
  const model = createModel(options)
  return { ...model, selectedIds, select, toggle } as E
}
```

## Reactive Collections

- `shallowReactive(new Set())` for ID collections (not `ref(new Set())`)
- `computed()` for derived collections
- Cache iterations in Maps, invalidate on mutation

## Adapter Pattern

Adapters enable framework-agnostic logic. Located in `composables/useX/adapters/`.

**Standard adapter structure**:
```ts
// Interface: what the adapter must implement
export interface FooAdapter {
  setup?: (context: FooAdapterContext) => void
  dispose?: () => void
  // domain-specific methods
}

// Default: V0-prefixed
export class V0FooAdapter implements FooAdapter { ... }

// Third-party: original branding
export class PinoLoggerAdapter implements LoggerAdapter { ... }
```

**Adapter lifecycle** (when setup exists):
```ts
// In plugin setup:
adapter.setup(context)
if (adapter.dispose) {
  app.onUnmount(() => adapter.dispose!())
}
```

**Fallback strategies** (pick one per composable):
1. **Required** — throw if missing (useDate)
2. **Default instance** — V0 adapter as fallback (useLogger, useStorage)
3. **Empty context** — functional but empty (useTheme, useFeatures)
4. **Graceful degradation** — partial functionality (useLocale, useRtl)

## SSR Support

- `IN_BROWSER` constant from `#v0/constants/globals`
- `useHydration` composable (SSR-aware, used internally by observers)
- Adapters with DOM access must check `IN_BROWSER` in their own setters

## Path Alias

`#v0/` maps to `packages/0/src/`. Use this, not relative imports.

```ts
import { ID } from '#v0/types'
import { createRegistry } from '#v0/composables/createRegistry'
import { isObject } from '#v0/utilities'
```

## File Organization

```
packages/0/src/
├── components/       # Vue components (compound pattern)
├── composables/      # Composable functions
│   └── createX/
│       ├── index.ts        # Implementation
│       ├── index.test.ts   # Tests (colocated)
│       ├── index.bench.ts  # Benchmarks (if performance-critical)
│       └── adapters/       # Adapter implementations (if applicable)
│           ├── index.ts    # Barrel: exports all adapters + interface
│           ├── v0.ts       # Default V0 adapter
│           └── pino.ts     # Third-party adapter (optional)
├── constants/        # IN_BROWSER, htmlElements
├── types/            # Shared types (ID, etc.)
└── utilities/        # Helpers (use these!)
```
