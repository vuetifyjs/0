---
paths: packages/0/src/composables/**
---

# Composables Architecture

Scope-specific mechanics for `packages/0/src/composables/**`. Covers naming, factory shape, imports, reactive primitive selection, options reactivity, error handling, cleanup, composition patterns, dependency layers, registry internals, and scope guards. Cross-cutting rules live in `PHILOSOPHY.md`.

## Cited PHILOSOPHY sections

- §2.5 Composables never touch DOM events
- §2.6 Never override — spread and extend
- §2.8 ID generation is centralized
- §2.9 Errors throw; data integrity warns; runtime returns
- §3.1 Return conventions
- §3.2 Argument ordering
- §3.3 Naming (including `_option`, single-word preference)
- §3.4 `withDefaults` prohibition
- §3.7 No superfluous comments
- §4 Reactivity model (primitives, readonly-at-boundaries, MaybeRefOrGetter)
- §4.4 The `reactive: true` footgun
- §4.5 Scope cleanup including `useToggleScope`
- §5.2 Composables (headless contract)
- §6 Registries & context
- §6.5 Never raw `inject`/`provide`
- §6.6 `useProxyModel`
- §6.7 `useProxyRegistry`
- §6.8 Register / unregister lifecycle contract
- §7 Events & lifecycle
- §9 Errors & invariants

## Naming Rules (PHILOSOPHY §3.3)

| Prefix | Use | Creates state | Example |
|--------|-----|---------------|---------|
| `create` | Factory returning a new stateful instance. Can be called multiple times. | Yes | `createRegistry()`, `createSelection()` [intent:116] |
| `use` | DI consumer (`createPluginContext`), browser-API wrapper, or lifecycle-aware hook | Varies | `useTheme()`, `useEventListener()` [intent:117] |
| `to` | Pure, stateless transformer. No side effects, no reactivity. | No | `toArray()`, `toElement()`, `toReactive()` [intent:118] |

**Trinity export** — use only when a composable needs subtree scoping via Vue DI:

- Registry-style: `[useX, provideX, defaultX]` via `createXContext()`. [intent:119]
- Plugin-style: `[createXContext, createXPlugin, useX]` via `createPluginContext()`. [intent:120]
- No trinity for plain factories owned by the caller.

## Factory Function Pattern (PHILOSOPHY §3.1, §3.2)

100% enforced. Canonical form:

```ts
/**
 * @module createFoo
 *
 * @see https://0.vuetifyjs.com/composables/category/create-foo
 *
 * @remarks Description of what this composable does.
 *
 * @example
 * ```ts
 * const foo = createFoo({ bar: true })
 * ```
 */

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isNull } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

export interface FooOptions extends RegistryOptions {
  disabled?: MaybeRefOrGetter<boolean>  // Reactive UI state → MaybeRefOrGetter
  namespace?: string                     // Configuration → plain value
}

export interface FooContext<
  Z extends FooTicketInput = FooTicketInput,
  E extends FooTicket<Z> = FooTicket<Z>,
> extends Omit<RegistryContext<Z, E>, 'register'> {
  register: (registration?: Partial<Z>) => E
}

export function createFoo <
  Z extends FooTicketInput = FooTicketInput,
  E extends FooTicket<Z> = FooTicket<Z>,
> (options: FooOptions = {}): FooContext<Z, E> {
  const { disabled, namespace = 'v0:foo' } = options
  const registry = createRegistry<Z, E>(options)
  // ...
  return {
    ...registry,   // Always spread parent (PHILOSOPHY §2.6)
    // new properties
  } as FooContext<Z, E>
}
```

[intent:121]

### Import Section Order (100% enforced)

Always grouped with comments, always `#v0/` alias. Order is enforced by `perfectionist/sort-imports` in `eslint.config.js`. Run `pnpm lint:fix` and let it sort; do not hand-author. [intent:123, intent:124]

1. `// Components` — imports from `#v0/components/` (rare in composables, common in components)
2. `// Composables` — imports from `#v0/composables/` and `useX` patterns
3. `// Adapters` — imports from local `./adapters/`
4. `// Utilities` — imports from `#v0/utilities`, plus `vue`, `vue-router`, `pinia`, `@vue/*` (Vue lives here, not its own group)
5. `// Transformers` — imports from `#v0/composables/toX`
6. `// Types` — `import type` blocks
7. `// Globals` — imports from `#v0/constants/globals` (lint sorts this last as `internal`; section comment is author-added for consistency, not auto-inserted)
8. `// Exports` — re-exports of adapter types (if applicable)

### JSDoc Block (100% enforced)

Every composable requires the following at the top of `index.ts`: [intent:122]

- `@module` — composable name
- `@see` — link to the public docs page
- `@remarks` — purpose and key features
- `@example` — at least one usage example

### Per-symbol `@example` (100% enforced)

Every exported symbol that surfaces in `<DocsApi />` — the factory function, every method on its returned context, and any options or ticket interface with non-obvious shape — carries its own `@example` block. `@example` is a docs-UI feature (it renders as a collapsible on the composable's docs page), so the rule tracks visibility in the generated API reference, not author inclination.

Skip `@example` only for trivial types whose example would just restate the type signature (e.g., `type Primary = string`).

## Reactive Primitives (PHILOSOPHY §4.1)

| Primitive | Use |
|-----------|-----|
| `shallowRef(value)` | Single mutable UI state: booleans, numbers, strings. [intent:125] |
| `shallowReactive(new Set())` | Mutable ID collections inside a registry. [intent:126] |
| `computed(() => ...)` | Derived state: filtering, mapping, aggregation. Only when caching matters. [intent:127] |
| `toRef(() => ...)` | Default derivation: simple property access, ternaries, cheap composition. [intent:128] |
| `ref(value)` | Mutable objects/arrays that need deep tracking. [intent:129] |
| `readonly()` / `shallowReadonly()` | Plugin singletons exposed to consumers. [intent:130] |

**Rule.** Registry collections stay mutable; plugin singletons get readonly wrapping. [intent:131, PHILOSOPHY §4.2]

## Options Reactivity (100% enforced)

| Option type | Pattern | Example |
|-------------|---------|---------|
| UI state (disabled, readonly, error) | `MaybeRefOrGetter<T>` | `disabled?: MaybeRefOrGetter<boolean>` [intent:132] |
| Configuration (events, namespace) | Plain `T` | `namespace?: string` [intent:133] |
| Reactive logic (keys, filters) | `MaybeRefOrGetter<T>` | `keys?: MaybeRefOrGetter<string[]>` [intent:134] |

When destructuring the options object, the rest variable is `options`, never `modelOptions` or `registryOptions`. [intent:287]

```ts
// Right
function createFoo (options: FooOptions = {}) {
  const { disabled, namespace = 'v0:foo', ...rest } = options
}
```

## Error Handling

See PHILOSOPHY §2.9 for the three-way split (throw / warn / return) and the full rationale. The rules there are scope-independent. Composable-specific reminder: the `warn` path uses `useLogger()`, never `console.warn` — see PHILOSOPHY §9.2. [intent:138]

## Cleanup (PHILOSOPHY §4.5)

| Composable type | Cleanup |
|-----------------|---------|
| DOM observers, event listeners | `onScopeDispose(cleanup)` [intent:139] |
| Performance-critical DOM observers | `onScopeDispose(cleanup, true)` — deferred [intent:140] |
| Pure data structures, computed state | No cleanup needed (Vue handles it) [intent:141] |

## Composition Patterns (4 canonical styles)

### 1. Extension (spread override) — PHILOSOPHY §2.6

Child spreads parent and adds or overrides: [intent:142]

```ts
// packages/0/src/composables/createSelection/index.ts:286
const model = createModel(options)
return { ...model, selectedIds, select, toggle, /* ... */ }
```

Used by the selection chain: `createModel → createSelection → createSingle → createGroup → createStep`.

### 2. Aggregation (multi-system orchestrator)

Composable orchestrates independent systems: [intent:143]

```ts
// packages/0/src/composables/createCombobox/index.ts
return {
  selection: createSelection(),
  popover: usePopover(),
  cursor: useVirtualFocus(),
  // ...
}
```

Used by `createCombobox` and `createDataTable`. The orchestrator does not extend the selection chain — it composes.

### 3. Plugin Context (app-level singleton)

App-level state via `createPluginContext`: [intent:144]

```ts
export const [createXContext, createXPlugin, useX] = createPluginContext('v0:x', /* ... */)
```

Used by `useTheme`, `useLocale`, `useLogger`, `useStack`, and friends.

### 4. Adapter (pluggable implementation)

Swappable behavior via adapter interface: [intent:145]

```ts
function createFoo ({ adapter = new V0FooAdapter() }: FooOptions) {
  adapter.setup(context)
  // ...
}
```

Used by Theme, Logger, Date, Locale, Storage, Notifications, DataTable, Combobox. See `.claude/rules/implementation.md` for the adapter *mechanics* (file layout, fallback strategies, SSR gating). This rules file covers *when* to reach for the adapter pattern — see the next section.

## Adapter Interface Pattern — when and how

The adapter pattern shows up in two distinct situations. They look similar in source but serve different purposes.

### Situation A — third-party library integration

**When.** A composable exposes functionality that consumers might want to back by any of several competing third-party implementations. The composable stays neutral; the adapter decides which library fulfills the contract.

**Examples in source:**

- **`useLocale`** — ships `V0LocaleAdapter` by default, plus adapters that proxy to `vue-i18n`, `@intlify/unplugin-vue-i18n`, or any other translation library the consumer already uses. [intent:107]
- **`useDate`** — ships no default; every consumer picks from adapters backed by `date-fns`, `dayjs`, or the native `Intl` API, because there is no universally correct default date library.
- **`useLogger`** — ships `V0LoggerAdapter` (console-based) by default, plus `PinoLoggerAdapter`, `ConsolaLoggerAdapter` for structured logging integrations.
- **`useStorage`** — ships `V0StorageAdapter` (localStorage), plus `MemoryStorageAdapter` (SSR-safe fallback), plus third-party-branded adapters for cookie / IndexedDB backends.
- **`useNotifications`** — ships `V0NotificationsAdapter` (in-memory queue) by default, with adapters for external notification services.

**Interface contract.** Every adapter interface is defined in the composable's `adapters/index.ts` and includes optional lifecycle hooks:

```ts
// packages/0/src/composables/useLocale/adapters/index.ts (illustrative)
export interface LocaleAdapter {
  setup?: (context: LocaleAdapterContext) => void
  dispose?: () => void
  t: (key: string, params?: Record<string, unknown>) => string
  n: (value: number, options?: Intl.NumberFormatOptions) => string
  // ... domain-specific methods
}
```

When `setup` exists, the plugin calls it during install; when `dispose` exists, the plugin registers it on `app.onUnmount`. See `.claude/rules/implementation.md` for the full lifecycle mechanics. [intent:108]

**How consumers override.** Pass the `adapter` option at plugin-install time:

```ts
// Consumer app code
app.use(createLocalePlugin({ adapter: new VueI18nLocaleAdapter(i18n) }))
```

### Situation B — feature-mode switch

**When.** A single composable ships *multiple internal modes* that differ in data-flow shape, not in which library backs them. Adapter selection is the API for "which mode am I running in?" This is useful when the modes share 80% of their surface but diverge on one or two methods (e.g., synchronous client-side vs asynchronous server-side data access).

**Examples in source:**

- **`createDataTable` — `ClientAdapter` vs `ServerAdapter`.** The client adapter sorts, filters, and paginates in memory; the server adapter forwards those ops as query parameters to a caller-provided fetch function. Same `DataTableContext` surface, two data flows. The docs expose this as `DataTable` vs `DataTableServer`.
- **`createCombobox` — client-side filter adapter vs server-side query adapter.** [intent:324] Same `ComboboxContext` surface; client adapter filters the local tickets, server adapter debounces and delegates to a fetcher.

**Interface contract.** Same shape as Situation A, but the adapter's domain-specific methods encode the mode:

```ts
export interface DataTableAdapter<Row> {
  setup?: (context: DataTableAdapterContext<Row>) => void
  dispose?: () => void
  // Mode-distinguishing method:
  load: (params: DataTableQuery) => Promise<DataTableResult<Row>> | DataTableResult<Row>
}
```

**How consumers override.** Pass the adapter option in the composable's factory:

```ts
const table = createDataTable({
  adapter: new ServerDataTableAdapter({ fetch: myBackendCall }),
})
```

### When *not* to use an adapter

- The composable has exactly one correct implementation, and consumers have no reason to swap it. Example: `useHotkey` — the listener semantics are fixed.
- You want to switch behavior based on a boolean flag. Use an option (`mode: 'client' | 'server'`) rather than dressing it up as an adapter. Adapters are for swapping *implementations*, not for flipping a known toggle.

### `useProxyModel` and `useProxyRegistry` — cross-link

Both composables are covered in PHILOSOPHY §6.6 and §6.7. Repeating the when-to-use summary here for composable authors:

- **`useProxyModel(context, model, { multiple? })`** — when your composable/component owns a `createModel`-derived context internally and exposes v-model externally. Registry must be created with `events: true` so late-registering tickets can sync. [intent:182, intent:309]
- **`useProxyRegistry(registry, { deep? })`** — when you want a reactive `{ keys, values, entries, size }` snapshot of a registry for template iteration. Never substitute `reactive: true` on the registry — that breaks `values()` cache-backed dep tracking (PHILOSOPHY §4.4). [intent:253, intent:254]

## Dependency Layers (PHILOSOPHY §6)

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

**Never depend upward.** Foundation must not import from Layer 1+. [intent:146]

## Registry System (PHILOSOPHY §6)

`createRegistry` is the foundational factory. Returns an enhanced Map with indexing, caching, and event hooks. Manages tickets with `id`, `index`, `value`, `valueIsIndex`. [intent:96]

Extension is always via `...spread`. 100% consistent across all 27 registry-based composables. [intent:147]

## Plugins and Reactive Defaults

Scope: how a plugin (or a high-level factory composable) that wraps a registry should configure it — specifically, when to pass `reactive: true` internally vs. leave it off.

### Two tiers

- **Primitives** — `createRegistry`, `createModel`, `createSelection`, `createSingle`, `createGroup`, `createStep`. Expose the `reactive` switch. Callers opt in based on their use case.
- **Plugins** — `useTheme`, `useLocale`, `useFeatures`, `useNotifications`, `useLogger`, `usePermissions`. App-level services created via `createPluginContext`. Ship a named user-facing contract (e.g. "the theme updates reactively"). Bake reactivity in; consumers never see the registry underneath.

High-level factory composables that aren't plugins but expose a similar contract — `createForm`, `createInput`, `createBreadcrumbs` — follow the same convention as plugins. The distinction that matters for this section isn't plugin-vs-factory, it's whether the composable ships a Vue-reactive contract or leaves the reactivity choice to its caller.

### The rule

**Any plugin (or plugin-shaped factory) whose public surface is reachable from a template or a computed passes `reactive: true` to its internal registry.** "Public surface reachable from a template or a computed" means any of:

- `registry.values()` / `keys()` / `entries()` iteration (directly or via `for (const x of …)` inside a computed)
- `registry.size` exposed as a getter
- `registry.get(id)` called from consumer code or from a wrapper helper (`features.variation(id)`, `theme.colors` resolving through ticket value)
- Per-ticket field reads when consumers hold ticket references

### Why

Users of `useTheme()` expect `theme.colors` to track, `v-for="name in theme.keys()"` to update, and `theme.upsert()` to propagate. Making any of that contingent on a plugin-configuration flag they've never heard of is a footgun. The cost of `reactive: true` on a bounded UI-adjacent registry is negligible; the cost of leaking the opt-in up to consumers is a class of latent bugs (#208 was one of them).

### Two-registry architecture

Many plugins keep two internal collections — a small reactive ID registry and a large non-reactive lookup table:

| Role | Reactive? | Example |
|---|---|---|
| Small ID registry (who's registered, who's selected) | `reactive: true` | `useTheme`'s theme registry, `useLocale`'s locale registry, `useFeatures`'s flag registry |
| Large lookup table (palette tokens, translation strings) | default (non-reactive) | `createTokens({ palette, ...themes })`, `createTokens(messages)` |

The big table stays cheap (plain `Map`, O(1) lookups). Runtime mutations that need reactivity flow through the small registry (e.g. replace a theme's `value` object via `upsert`), not through the tokens. Tokens provide alias dereferencing at read time.

This split is why `useTheme` and `useLocale` work fine even though their reactive registries are bounded to 2–20 entries — the bulk data never needed reactivity in the first place.

### Escape hatch for unbounded collections

For plugins whose registries can grow without bound (notifications, data tables, logs, queues), `reactive: true` is still the right default but consider exposing an explicit opt-out on the plugin options. The shape is "bake in reactive behavior, let the consumer turn it off if they hit a scale wall." `useNotifications` is the canonical example.

### `useProxyRegistry` vs `reactive: true`

Both deliver reactive iteration; they're complementary, not competing. Pick based on what else you need:

| Want | Use |
|---|---|
| Reactive iteration **plus** per-ticket field mutations via `upsert` | `reactive: true` on the registry |
| Reactive iteration without wrapping each ticket in a proxy | `useProxyRegistry(registry, { events: true })` |
| `{ deep: true }` tracking on registered tickets | `useProxyRegistry(registry, { deep: true })` |
| Reactive snapshot driven by explicit registry events | `useProxyRegistry` |

`createGroup` bakes in `useProxyRegistry` internally for its derived reactive selection state; plugins like `useTheme` bake in `reactive: true` for the ticket-level mutation path. The choice is per-composable, based on which capability the contract needs.

## Scope Guards (PHILOSOPHY §4.6)

| Composable type | Guard |
|-----------------|-------|
| Needs global/injected context | `instanceExists()` check with fallback [intent:148] |
| Pure utilities | No check — works anywhere [intent:149] |
| Vue framework integration | `hasInjectionContext()` check [intent:150] |

## ID Generation (100% enforced, PHILOSOPHY §2.8)

Always use `useId()` from `#v0/utilities`. Never auto-increment. SSR-safe. [intent:151]

## Events and Lifecycle

See PHILOSOPHY §2.5 for the DOM-event rule. Scope-specific reminder: the only composables exempt from it are the three browser-primitive wrappers — `useEventListener`, `useHotkey`, `useClickOutside`. Anything else that reaches for `addEventListener` is in the wrong file.

## Naming Instance (PHILOSOPHY §3.3)

Bind a composable's return value to a named const before using it. Don't chain method calls on `use*()` invocations — each call creates a new instance, losing state and cleanup. [intent:282]

```ts
// Wrong
useTheme().current.value

// Right
const theme = useTheme()
const current = theme.current.value
```

Pure transformers (`toRef`, `toElement`, `toValue`) are fine to call inline — they return values, not stateful instances. [intent:283]

## Selection System — Value vs Logic Separation

`createModel` is a value store; selection logic (multiple, mandatory, seek, mandate) lives in `createSelection`. [intent:285]

`enroll` defaults to `true` in `createModel`, `false` in `createSelection`. [intent:286]

## Checklist

- [ ] Composable prefixed `create` / `use` / `to` based on §3.3
- [ ] JSDoc block present (`@module`, `@see`, `@remarks`, `@example`)
- [ ] Imports grouped in order: Components, Composables, Adapters, Utilities, Transformers, Types, Globals, Exports (run `pnpm lint:fix` to enforce)
- [ ] Options destructured as `options` rest var with literal defaults
- [ ] Extension via `{ ...parent, newProperty }`, never override
- [ ] Reactive primitive matches §4.1 table (`toRef` default, `computed` for expensive)
- [ ] UI-state options are `MaybeRefOrGetter<T>`, config options plain `T`
- [ ] Error handling uses three-way split (throw/warn/return)
- [ ] DOM observers/listeners clean up in `onScopeDispose`
- [ ] No DOM event binding inside the composable
- [ ] ID generation through `useId()`
- [ ] Trinity return only from `createTrinity` / `createContext` / `createPlugin`
