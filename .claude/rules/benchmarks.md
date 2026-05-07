---
paths: ['packages/0/src/**/*.bench.ts']
---

# Benchmark Standards

Scope-specific mechanics for `packages/0/src/**/*.bench.ts`. Covers file location, fixture isolation, TypeScript requirements, category comments, naming, minimum requirements, dataset guidelines, performance tiers, mocking, and running benchmarks. Philosophy for why we benchmark — "we want v0 to be fast enough to compete with Radix/Base UI/Ark UI on the same tasks" — lives in `PHILOSOPHY.md`.

## Cited PHILOSOPHY sections

- §1 Identity (v0 aims to surpass competing headless libraries)
- §4 Reactivity model (benchmarks target the shapes defined there)

## File Location

Benchmarks are colocated with source: [intent:115, intent:233]

```
packages/0/src/composables/createRegistry/
├── index.ts
├── index.test.ts
└── index.bench.ts
```

## File Header & Wrapper

Every bench file starts with a `@fileoverview`-style JSDoc block describing structure, dataset coverage, and category list, then wraps every `describe` block in an outer `describe('{name} benchmarks', …)`. Used in every composable bench file.

```ts
/**
 * createRegistry Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup, mutation, batch, computed access, seek
 */

import { bench, describe } from 'vitest'

// ... fixtures ...

describe('createRegistry benchmarks', () => {
  describe('initialization', () => { /* ... */ })
  describe('lookup operations', () => { /* ... */ })
})
```

## Fixture Isolation (critical)

Separate read-only operations from mutations so measurements are accurate. [intent:234]

### Read-Only Benchmarks (Shared Fixtures)

Shared fixtures for operations that don't modify state. Isolates the operation cost: [intent:235]

```ts
describe('lookup operations', () => {
  // Created once, reused across all benches in this describe block
  const registry1k = createPopulatedRegistry(1_000)
  const registry10k = createPopulatedRegistry(10_000)

  bench('Get by id (1,000 items)', () => {
    registry1k.get('item-500')   // Measures ONLY the get() call
  })
})
```

Both placements are in active use: in-describe (above, as in `createRegistry/index.bench.ts`) and module-level above the outer `describe` (as in `createSelection/index.bench.ts` and `createFilter/index.bench.ts`). Pick whichever scopes the fixture closest to the consumers; module-level is preferred when several `describe` blocks share the same data.

Safe for shared fixtures:
- Map/Set lookups (get, has, browse)
- Array access
- Cached computations (repeated reads)
- Pure functions

### Mutation Benchmarks (Fresh Fixtures)

Fresh fixtures per iteration for operations that modify state: [intent:236]

```ts
describe('mutation operations', () => {
  bench('Upsert single item (1,000 items)', () => {
    const registry = createPopulatedRegistry(1_000)  // Fresh per iteration
    registry.upsert('item-500', { value: 'updated' })
  })
})
```

Requires fresh fixtures:
- Operations that modify internal state
- Side effects (cache invalidation)
- Register/unregister cycles
- Batch operations (clear, offboard)

Fresh fixtures include setup cost; document it in the category comment.

## TypeScript Requirements

Fixtures must have explicit types. The `BenchmarkItem` shape (`{ id: string; value: string }`) and the `ITEMS_1K` / `ITEMS_10K` / `LOOKUP_ID_1K` / `LOOKUP_ID_10K` constant names are the conventions across every composable bench file — reuse them so cross-file diff and review stays uniform. [intent:237]

```ts collapse
interface BenchmarkItem {
  id: string
  value: string
}

const ITEMS_1K: BenchmarkItem[] = Array.from({ length: 1_000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

function createPopulatedRegistry (count: number): RegistryContext<RegistryTicket> {
  const registry = createRegistry()
  registry.onboard(count === 1_000 ? ITEMS_1K : ITEMS_10K)
  return registry
}
```

## Category Comments

Each category must document what it measures. [intent:238]

```ts
// ===========================================================================
// LOOKUP OPERATIONS - Single item access
// Shared fixture (safe - read-only operations, no state changes)
// Measures: isolated operation cost without setup overhead
// ===========================================================================
describe('lookup operations', () => {
```

## Naming Conventions

### Describe Blocks

Lowercase category names. [intent:239]

- `initialization` — setup/creation
- `lookup operations` — finding items
- `mutation operations` — single item changes
- `batch operations` — bulk actions
- `computed access` — cached/derived reads
- `seek operations` — directional search

### Bench Names

Sentence case with comma-formatted numbers. [intent:240]

```ts
// Good
bench('Get by id (1,000 items)', ...)
bench('Onboard then clear 10,000 items', ...)
bench('Access keys 100 times (1,000 items, cached)', ...)

// Bad
bench('get item', ...)
bench('clear 10000', ...)
```

### Operation Pool

Standard operation names that all bench files must use. Enables cross-composable comparison in the metrics pipeline.

| Category | Operation | Format | Complexity |
|----------|-----------|--------|------------|
| initialization | Create empty | `Create empty {thing}` | O(1) |
| initialization | Create populated | `Create {thing} ({N} items)` | O(n) |
| initialization | Onboard | `Onboard {N} items` | O(n) |
| lookup | Get by id | `Get by id ({N} items)` | O(1) |
| lookup | Lookup by index | `Lookup by index ({N} items)` | O(1) |
| lookup | Browse by value | `Browse by value ({N} items)` | O(n) |
| lookup | Check has | `Check has ({N} items)` | O(1) |
| mutation | Register | `Register single item ({N} items)` | O(1) |
| mutation | Unregister | `Unregister single item ({N} items)` | O(1) |
| mutation | Upsert | `Upsert single item ({N} items)` | O(1) |
| batch | Clear | `Onboard then clear {N} items` | O(n) |
| batch | Offboard | `Onboard {N} then offboard {M} items` | O(n) |
| batch | Reindex | `Onboard then reindex {N} items` | O(n) |
| computed | Access property | `Access {property} ({N} items)` | O(n) |
| computed | Cached access | `Access {property} {count} times ({N} items, cached)` | O(n) |
| seek | Seek direction | `Seek {direction} ({N} items)` | O(n) |
| seek | Seek predicate | `Seek with predicate ({N} items)` | O(n) |

**Cross-composable comparison** (benchmarking two access paths to the same data):

- `{source}.{method}() ({N} items)` — e.g., `registry.keys() (1,000 items)` vs `proxy.keys (1,000 items)`

Domain-specific operations are allowed but must follow the same `{Verb} {target} ({N} items)` pattern.

## Minimum Requirements [intent:241]

| Requirement | Minimum |
|-------------|---------|
| Total benchmarks | >= 5 |
| Categories covered | >= 3 |
| Dataset sizes tested | >= 2 (1,000 and 10,000) |

## Required Categories

Each file must cover at least 3. The names below are the **standard** categories — they drive cross-composable comparison in the metrics pipeline, so reuse them when a benchmark fits.

| Category | Description | Fixture Type |
|----------|-------------|--------------|
| `initialization` | Setup/creation cost | Fresh |
| `lookup operations` | Finding/accessing items | Shared |
| `mutation operations` | Updates and modifications | Fresh |
| `batch operations` | Bulk actions | Fresh |
| `computed access` | Derived value reads | Shared |
| `seek operations` | Directional search | Shared |

Domain-specific categories are allowed when the standard set doesn't fit, as long as the name follows the lowercase `{verb} {target}` shape. Examples in source: `traversal operations` and `selection mode comparison` (createNested), `primitive filtering`, `object filtering`, `filter modes`, `native comparison` (createFilter), `search pipeline`, `sort pipeline`, `grouping`, `full pipeline`, `adapter comparison` (createDataTable).

## Dataset Guidelines

Test multiple sizes to reveal O(n) complexity:

| Size | Items | Required |
|------|-------|----------|
| Medium | 1,000 | Yes |
| Large | 10,000 | Yes |
| Small | 100 | Optional |
| Stress | 100,000 | Optional |

Use realistic lookup targets (middle of registry, not first/last). [intent:242]

```ts
const LOOKUP_ID_1K = 'item-500'    // Middle of 1K registry
const LOOKUP_ID_10K = 'item-5000'  // Middle of 10K registry
```

## Performance Tiers

Each benchmark gets its own tier. The `_fastest` and `_slowest` summaries surface the best and worst performers per composable.

| Tier | O(1) threshold | O(n) threshold | O(n²) threshold |
|------|----------------|----------------|-----------------|
| `blazing` | >= 100,000 ops/s | >= 10,000 ops/s | >= 1,000 ops/s |
| `fast` | >= 10,000 ops/s | >= 1,000 ops/s | >= 100 ops/s |
| `good` | >= 1,000 ops/s | >= 100 ops/s | >= 10 ops/s |
| `slow` | < 1,000 ops/s | < 100 ops/s | < 10 ops/s |

**Important.** Tiers are only meaningful with proper fixture isolation. A file that mixes setup cost into read-only benchmarks will show misleadingly low numbers.

### Complexity Detection

Auto-detected from benchmark names by `scripts/generate-metrics.js`:
- `nested` / `recursive` / `all.*all` → O(n²)
- `{N} items` / `{N} objects` / `{N} entries` / `{N} elements` (any digit-and-noun pair) → O(n)
- `all items` / `all keys` → O(n)
- `single` / `one item` / `one query` / `one key` → O(1)
- Default fallback → O(n)

## Mocking

Mock only lifecycle-dependent code: [intent:243]

```ts
vi.mock('#v0/composables/useResizeObserver', () => ({
  useResizeObserver: (target, callback) => {
    if (target.value) {
      callback([{ contentRect: { height: 600, width: 400 } }])
    }
    return { stop: vi.fn() }
  },
}))

vi.mock('#v0/constants/globals', async () => ({
  ...await vi.importActual('#v0/constants/globals'),
  SUPPORTS_OBSERVER: true,
}))
```

Don't mock pure logic — let it run. Mocking too aggressively defeats the purpose of a benchmark.

## Running Benchmarks

```bash
# All benchmarks (canonical, used by CI)
pnpm test:bench

# All benchmarks, JSON output to apps/docs/public/benchmarks.json
pnpm test:bench:json

# Watch mode while iterating on a bench file
pnpm bench

# Generate metrics.json (runs coverage + bench:json + scripts/generate-metrics.js)
pnpm metrics
```

To narrow to a single file, append the path: `pnpm test:bench packages/0/src/composables/createRegistry/index.bench.ts`.

## Reference Implementation

`packages/0/src/composables/createRegistry/index.bench.ts` — canonical example of:

- Proper fixture isolation
- TypeScript types on fixtures
- Category documentation
- 1K/10K dataset coverage
- Read-only vs mutation separation

## Checklist

- [ ] Bench file colocated with source as `index.bench.ts`
- [ ] Read-only benchmarks use shared fixtures
- [ ] Mutation benchmarks create fresh fixtures per iteration
- [ ] Fixtures have explicit TypeScript types
- [ ] Each category has a comment block explaining what it measures
- [ ] Describe blocks use lowercase standard category names
- [ ] Bench names use sentence case with comma-formatted numbers
- [ ] >= 5 benchmarks, >= 3 categories, >= 2 dataset sizes (1K + 10K)
- [ ] Lookup targets are middle of registry
- [ ] Mocks limited to lifecycle-dependent code (observers, SSR constants)
