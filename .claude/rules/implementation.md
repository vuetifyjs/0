---
paths: packages/0/src/**
---

# Implementation Patterns

Technical mechanics for everything under `packages/0/src/`. Covers utilities, ticket hierarchy, reactive collections, adapters, SSR support, file layout, and imports. Cross-cutting philosophy lives in `PHILOSOPHY.md`; this file cites the sections below.

## Cited PHILOSOPHY sections

- §2.1 Headless contract — no utility classes in source
- §2.2 Zero `any`
- §2.3 Utility guards over raw comparisons
- §2.4 Path alias, never relative cross-feature
- §2.6 Never override — spread and extend
- §2.7 Tree-shakeable utilities, marked
- §2.8 ID generation is centralized
- §2.10 SSR-safe by default
- §3.3 Naming (single-word preference, `_option` mirror, `on<Action>`, `index`)
- §3.7 No superfluous comments
- §4 Reactivity model
- §6 Registries & context

## Naming

All cross-cutting naming rules live in PHILOSOPHY §3.3. Restated invariants for files under `packages/0/src/`:

- **`index`** not `idx`.
- **`on<Action>`** not `handle<Action>`.
- **Single-word** over multi-word when both are unambiguous.
- **`_option`** for local mirrors of a prop or option; never `optionProp`.
- **`create` / `use` / `to`** prefix rule — see §3.3.
- **`FooTicketInput` → `FooTicket`** pair for registry types.

File and folder naming:

- Composable folder: `createX/` or `useX/` or `toX/`, matching the composable's prefix.
- Component folder: `PascalCase` (`Splitter/`, `Tabs/`), sub-component files `PascalCaseRoot.vue`, `PascalCaseItem.vue`.
- Adapter files: `adapters/v0.ts` for the default, `adapters/{lib}.ts` for third-party (`adapters/pino.ts`, `adapters/consola.ts`). Always lowercase library branding in the filename. [intent:106, intent:107]

## Comments

See PHILOSOPHY §3.7. Comments explain *why*, never repeat *what*. The only exception is JSDoc on exported APIs (`@module`, `@see`, `@remarks`, `@example` blocks — see `.claude/rules/composables.md` for the format). Inline "this increments the counter" comments do not belong in source. [user-feedback:2026-04-20]

## Utilities First (PHILOSOPHY §2.3, §2.7)

Before writing a new helper, check `#v0/utilities`. Available today:

| Helper | Purpose |
|--------|---------|
| `isFunction`, `isString`, `isNumber`, `isBoolean` | Type guards |
| `isObject`, `isArray`, `isNull`, `isUndefined` | Type guards |
| `isNullOrUndefined`, `isPrimitive`, `isSymbol`, `isNaN`, `isElement` | Type guards |
| `mergeDeep(target, ...sources)` | Deep object merge with `DeepPartial<T>` |
| `useId()` | SSR-safe ID generation (see §2.8) |
| `clamp(value, min, max)` | Clamp number to range |
| `range(length, start)` | Create sequential number array |

All helpers carry `#__NO_SIDE_EFFECTS__` and are tree-shakeable. Never add a new utility that introduces a top-level side effect — the barrel cannot absorb it. [PHILOSOPHY §2.7]

## Ticket Pattern (PHILOSOPHY §6.2)

"Tickets" are the currency of every registry. The hierarchy:

```
RegistryTicketInput
  ├── ModelTicketInput
  │     ├── SelectionTicketInput
  │     │     ├── SingleTicketInput
  │     │     └── StepTicketInput
  │     └── GroupTicketInput
  │           └── NestedTicketInput
  ├── QueueTicketInput
  └── FormTicketInput
```

Base interface (see `packages/0/src/composables/createRegistry/index.ts`):

```ts
interface RegistryTicket {
  id: ID               // Unique (auto-generated via useId())
  index: number        // Position in registry
  value: unknown       // Associated value (unknown, narrowed at use site)
  valueIsIndex: boolean // True if value wasn't explicitly set
}
```

**Extensions** (each extends the parent via spread — never override):

| Ticket | Adds |
|--------|------|
| `ModelTicket` | `disabled`, `isSelected: Readonly<Ref<boolean>>` |
| `SelectionTicket` | `select()`, `unselect()`, `toggle()` |
| `GroupTicket` | `isMixed: Readonly<Ref<boolean>>`, `mix()`, `unmix()`, `indeterminate` |
| `NestedTicket` | `isOpen`, `isActive`, `isLeaf`, `depth`, tree traversal methods |
| `QueueTicket` | `timeout`, `isPaused`, `dismiss()` |
| `FormTicket` | `validate()`, `reset()`, `errors`, `isValid`, `isPristine`, `rules` |

**Naming pair (enforced).** Input/output types always pair: `FooTicketInput` → `FooTicket`. Defined together, exported together. [intent:97]

**Ticket state typing (enforced).**
- Boolean state: `Readonly<Ref<boolean>>` — e.g., `isSelected`, `isMixed`. [intent:98]
- Methods: plain functions, no parameters — self-reference via closure. [intent:99]
- Config input: `MaybeRefOrGetter<T>`. Config output: plain `T`. [intent:100]

## Spread Pattern for Extension (PHILOSOPHY §2.6)

100% enforced across all 27 registry-based composables. Parent is spread first, new properties added after. Never redefine.

```ts
// packages/0/src/composables/createSelection/index.ts:286
return {
  ...model,          // Parent first
  multiple,          // Additions after
  register,
  onboard,
  unselect,
  toggle,
  apply,
  mandate,
}
```

This is the single mechanism by which `createModel → createSelection → createSingle → createGroup → createStep` remain type-substitutable.

## Reactive Collections (PHILOSOPHY §4.1)

| Data shape | Use |
|------------|-----|
| ID collections inside a registry | `shallowReactive(new Set())` — never `ref(new Set())` [intent:102] |
| Derived collections | `computed()` [intent:103] |
| Iteration-heavy derivations | Cache in a `Map`, invalidate on mutation [intent:104] |

Caching iterations is a perf rule, not a style rule: invalidate in the registry's own mutation hooks so consumers never observe stale keys.

## Adapter Pattern (PHILOSOPHY §5.2)

Adapters enable framework-agnostic logic. Located in `composables/useX/adapters/`. [intent:105]

**Standard structure.**

```ts
// adapters/index.ts
export interface FooAdapter {
  setup?: (context: FooAdapterContext) => void
  dispose?: () => void
  // domain-specific methods
}

// adapters/v0.ts — default
export class V0FooAdapter implements FooAdapter { ... }

// adapters/pino.ts — third-party integration
export class PinoLoggerAdapter implements LoggerAdapter { ... }
```

**Naming.** Default adapters are V0-prefixed (`V0FooAdapter`). Third-party adapters use their original branding (`PinoLoggerAdapter`, `ConsolaLoggerAdapter`, `PostHogFeaturesAdapter`). [intent:106, intent:107]

**Lifecycle.** When an adapter has `setup`, call it inside the plugin's setup phase and register `dispose` on app unmount:

```ts
// In createXPlugin install():
adapter.setup(context)
if (adapter.dispose) app.onUnmount(() => adapter.dispose!())
```
[intent:108]

**Fallback strategy — pick one per composable.** [intent:109]

| Strategy | Example | When |
|----------|---------|------|
| Required (throw) | `useDate` | Logic is meaningless without the adapter |
| Default instance | `useLogger`, `useStorage` | A reasonable default exists in v0 |
| Empty context | `useTheme`, `useFeatures` | Functional but no-op without config |
| Graceful degradation | `useLocale`, `useRtl` | Partial functionality possible |

## SSR Support (PHILOSOPHY §2.10)

Three gating mechanisms, in order of preference:

1. `IN_BROWSER` constant from `#v0/constants/globals`. One-line gate at the top of a branch. [intent:110]
2. `useHydration` composable for SSR-aware lifecycle coordination. [intent:111]
3. Adapter-level: any adapter that touches the DOM must gate in its own setters. [intent:112]

```ts
// packages/0/src/composables/useStorage/index.ts:105
const storage = IN_BROWSER ? window.localStorage : new MemoryAdapter()
```

**Known soft-violations** to be tightened:
- `packages/0/src/composables/useClickOutside/index.ts:346-350` reads `document.activeElement` inside a handler without gate.
- `packages/0/src/composables/useHotkey/index.ts:159` reads `document.activeElement`.
- `packages/0/src/composables/createCombobox/index.ts:187` `document.querySelector` inside a factory.

The rule is per-composable. Even a handler that only runs client-side should gate, so the composable's type-level promise ("safe to call under SSR") holds everywhere.

## Path Alias (PHILOSOPHY §2.4)

`#v0/` maps to `packages/0/src/`. Cross-feature imports exclusively through the alias. [intent:113]

```ts
// Right
import { ID } from '#v0/types'
import { createRegistry } from '#v0/composables/createRegistry'
import { isObject } from '#v0/utilities'

// Wrong — cross-feature relative
import { createRegistry } from '../createRegistry'
```

Only sanctioned relative imports are sibling imports inside a feature directory (adapter → parent, compound sub-component → Root). Zero `../..` imports exist in `packages/0/src/`; keep the count at zero.

## File Organization

```
packages/0/src/
├── components/       # Vue components (compound pattern — see components.md)
├── composables/      # Composable functions (see composables.md)
│   └── createX/
│       ├── index.ts         # Implementation
│       ├── index.test.ts    # Tests (colocated — see testing.md)
│       ├── index.bench.ts   # Benchmarks (performance-critical only — see benchmarks.md)
│       └── adapters/        # Adapter implementations (if applicable)
│           ├── index.ts     # Barrel: interface + exports
│           ├── v0.ts        # Default V0 adapter
│           └── pino.ts      # Third-party adapter (optional)
├── constants/        # IN_BROWSER, SUPPORTS_*, htmlElements
├── types/            # Shared types (ID, Extensible, MaybeArray, DeepPartial, Activation)
└── utilities/        # Helpers — always check here first (§2.3, §2.7)
```

Colocated tests use `createX/index.test.ts`. [intent:114] Benchmarks colocate as `createX/index.bench.ts` only when the composable is performance-critical. [intent:115]

## Checklist

- [ ] Before writing a helper, grep `packages/0/src/utilities/` and `#v0/utilities` exports
- [ ] All type guards go through `#v0/utilities` — no raw `=== undefined`
- [ ] All cross-feature imports use `#v0/`
- [ ] New utility files carry `#__NO_SIDE_EFFECTS__`
- [ ] New ticket types defined as `FooTicketInput` + `FooTicket` pair
- [ ] New composable that extends another spreads the parent before adding
- [ ] Registry collections use `shallowReactive(new Set())`
- [ ] New adapter interface has `setup?` / `dispose?` contract and a V0-prefixed default
- [ ] Any branch touching `window`/`document` gates on `IN_BROWSER`
- [ ] File placed in the correct dir; barrel updated alphabetically
