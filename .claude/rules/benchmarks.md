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
 * - WARM operations (upsert, reorder) share a populated fixture and reset per
 *   iteration, so only the operation is timed — never the O(n) populate
 * - FRESH fixtures only where the populate IS the op (initialization, batch
 *   onboard-then-clear)
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

**The timed region of an operation bench must contain the operation and nothing else.** In particular it must never contain an `O(n)` fixture population (`onboard`/`register`-loop of N rows) that is *not itself* the operation under measurement. A bench that builds its fixture inside the timed block measures construction, not the operation — and because `getTier` normalizes `mean` by the item count parsed from the bench name (see "Performance Tiers"), it then reports the *populate's* per-item cost under the operation's label. This is the single most common way a bench lies. [intent:234]

The litmus test for every bench: **strip the timed block down to the one call named in the title. Is anything O(n) left besides that call?** If yes, hoist it to a shared fixture.

Three fixture strategies, by what the bench measures:

### 1. Read-Only Benchmarks (Shared Fixtures)

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

### 2. Warm Operation Benchmarks (Shared Fixture + Reset)

For an operation that mutates state but whose input is an already-populated fixture — sort, filter, search, paginate, group, pin, select, move, reorder, toggle. **Share the populated fixture; reset the operation's own state at the top of the timed block, then run the operation.** The reset is a cheap `O(1)`–`O(sort-columns)` call (`sort.reset()`, `selection.clear()`, `layout.reset()`), never a re-populate — so it costs nothing next to the `O(n)` operation and does not pollute the measurement.

```ts
describe('sort pipeline', () => {
  const table1k = createPopulatedTable(1_000)   // populated ONCE
  const table10k = createPopulatedTable(10_000)

  bench('Sort by string column ascending (10,000 items)', () => {
    table10k.sort.reset()          // canonical state — cheap, not a re-populate
    table10k.sort.toggle('name')   // the operation
    void table10k.sortedItems.value // force the recompute
  })
})
```

Two invariants make this correct:

- **Determinism.** The reset must return the fixture to the *same* canonical state every iteration, so measurements don't drift as the run accumulates state. Verify: a warm bench should report a much tighter `rme` than its fresh predecessor (construction noise is gone). If `rme` is high or the mean climbs across samples, state is leaking — the reset is incomplete.
- **Defeat memoization.** Reading a derived `.value` only re-runs the computation if a dependency changed since the last read. The reset-then-operate sequence must leave the derivation *dirty* (the operation changed an input). Confirm the measured mean reflects real work, not a cache hit returning in nanoseconds. When in doubt, alternate the operation's argument across iterations (e.g. toggle `'name'` then `'email'`) so each iteration ends in a distinct state.

Reserve fresh fixtures (below) only for the cases warm can't express.

### 3. Fresh Fixtures — when construction *is* the operation

Fresh fixture per iteration **only** when the O(n) work in the timed block is the thing being measured, or when the operation permanently accumulates state with no cheap reset: [intent:236]

```ts
describe('initialization', () => {
  bench('Onboard 10,000 items', () => {
    const registry = createRegistry()          // O(1) construct
    registry.onboard(ITEMS_10K)                 // the operation IS the O(n) populate
  })
})
```

Requires fresh fixtures:
- Construction / onboarding / registration benches — the populate is the measured op (`Create …`, `Onboard N …`).
- Batch operations that consume the fixture (`Onboard then clear N`, `Onboard N then offboard M`) — both halves are the measured batch.
- Register/unregister into a *growing* collection with no stable-size variant — a shared fixture would grow unbounded across iterations.

Note the distinction: an **empty** `createRegistry()` then a single `register()` is O(1) construction and stays fresh with no harm — the pollution rule is about O(n) *populate*, not any construction. But an operation named `… (1,000 items)` that populates 1,000 rows to exercise one call belongs in category 2, not here.

Every fresh-fixture operation bench must carry a category comment stating *why* it can't be warm (construction-is-op / consumes-fixture / unbounded-growth).

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

| Category | Description | Fixture Strategy |
|----------|-------------|------------------|
| `initialization` | Setup/creation cost | Fresh — construction *is* the op (§3) |
| `lookup operations` | Finding/accessing items | Shared read-only (§1) |
| `mutation operations` | Updates on a populated collection (upsert, move, reorder) | Warm — shared + reset (§2). Fresh only if it consumes/grows the fixture (§3) |
| `batch operations` | Bulk actions that consume the fixture (onboard-then-clear/offboard) | Fresh — both halves are the op (§3) |
| `computed access` | Derived value reads | Shared read-only (§1) |
| `seek operations` | Directional search | Shared read-only (§1) |

(§1/§2/§3 refer to the three strategies under "Fixture Isolation".) Pipeline categories (`search pipeline`, `sort pipeline`, `full pipeline`, `grouping`) are Warm (§2): the pipeline runs against a pre-populated fixture, so share it and reset the pipeline's own state (`sort.reset()`, clear the query) per iteration.

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

Each benchmark gets its own tier. The `_fastest` and `_slowest` summaries surface the best and worst performers per composable. Tiers are computed in `scripts/lib/benchmarks.ts` (`getTier`) from the bench's `mean` and the workload parsed out of its **name** — so the tier is only as honest as the name and the fixture isolation.

**Tiers grade cost, not raw ops/s.** Raw ops/s measures workload size, not code quality — a 10k-item op at 17 ops/s (5.9μs/item) can be better engineered than a 1-item op at 200k ops/s (5μs/item). `getTier` therefore normalizes by the workload:

- **Collection benches** (`workload.items > 1`) — worst of two axes wins:
  - *Efficiency* — per-item cost `μs = mean·1000 / (items·repeats)`: `<1` blazing, `<10` fast, `<100` good, else slow.
  - *Feel* — single-op latency `ms = mean / repeats` against the frame budget: `≤16.7` blazing, `≤33.4` fast, `≤100` good, else slow. Keeps a 160ms 10k-row sort from badging `fast` on honest per-item cost alone.
- **One-shot benches** (`workload.items === 1`: constructors, single utility calls) — no workload to amortize, so they tier on call latency alone: `<10μs` blazing, `<100μs` fast, `<16.7ms` good, else slow.

A group's tier is its **worst** member's tier; a composable's tier is its worst group's. A feature is as fast as its slowest documented operation, never its most flattering microbench.

**Why fixture isolation is load-bearing here.** The per-item cost divides `mean` by the item count from the name. If the timed block populated those items (an `O(n)` onboard that isn't the operation), the tier reports the *populate's* per-item cost under the operation's label — often flattering, always wrong. A warm operation bench (shared fixture + reset) feeds `getTier` a clean operation `mean`, so the tier finally means what its label claims. See "Fixture Isolation" — this is why the overhaul to warm benches was necessary.

### Workload Detection

`workload(name)` parses two quantities from the bench name (`scripts/lib/benchmarks.ts`):

- **items** — the largest collection size in the name: `~?N <noun>` where noun ∈ items/elements/entries/objects/dates/pairs/nodes/rows/cells/keys/queries/tokens/fields/values/columns/groups/thumbs/primitives/paths/additions/formats, plus any bare number `≥ 1000`. Unmatched → `1` (treated as one-shot).
- **repeats** — `N times` (e.g. "Access values 100 times"), else `1`.

Consequence for naming: a warm operation over N rows must keep `(N items)` in its title so it tiers as a collection op, not a one-shot. Keep the `{N} items` suffix when converting fresh→warm.

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
# Dev: all benches (source, isolated workers, single pass)
pnpm test:bench

# Dev: JSON dump — do not commit from a laptop
pnpm test:bench:json

# Watch mode while iterating on a bench file
pnpm bench

# Canonical metrics (coverage + dist median-of-3 + metrics.json) — CI only for commits
pnpm metrics
pnpm metrics:check
```

To narrow to a single file, append the path: `pnpm test:bench packages/0/src/composables/createRegistry/index.bench.ts`.

## Apparatus contract (stability — non-negotiable)

Numbers only mean something if the **writer, machine, and flags** are fixed. Homepage peak, tier badges, and history sparklines all read the same artifacts.

| Knob | Canonical value | Why |
|------|-----------------|-----|
| Writer | **metrics-regen workflow only** | Feature PRs must not commit laptop `benchmarks.json` |
| Runner | `ubuntu-24.04` + Node from `.nvmrc` | OS/V8 drift moves hz |
| Vitest project | `v0:unit` only | `v0:browser` also matches `*.bench.ts` and double-records |
| Parallelism | `--maxWorkers=1 --no-file-parallelism` | File/worker interleaving adds jitter |
| Library under test | `V0_BENCH_TARGET=dist` (current) or npm dist path (history) | Source vs dist is a different apparatus |
| Aggregation | **median of 3 runs** (`pnpm metrics:bench`) | Single GHA run is ~10–20% noisy |
| Paths in JSON | repo-relative `packages/0/src/...` | Absolute `/home/john/...` vs `/home/runner/...` confuses audits |

**Acceptable deviation:** canary benches (see `scripts/lib/bench-stable.ts` `CANARY_BENCHES`) may move **±20%** run-to-run on shared GHA with no code change. Beyond that, re-run or investigate — do not merge noise as signal.

**Commands:**

```bash
# Dev iteration (source, single run, still isolated workers)
pnpm test:bench
pnpm test:bench:json   # ad-hoc JSON — do NOT commit from a laptop

# Canonical metrics (dist, median of 3) — CI metrics-regen only for commits
pnpm metrics           # coverage + build:0 + metrics:bench + generate-metrics.js
pnpm metrics:bench     # node scripts/run-bench-stable.ts --runs 3
pnpm metrics:check     # guard: no local paths; PR must not touch metrics artifacts casually
pnpm metrics:delta --prev old.json --next new.json
```

**Do not** commit `apps/docs/public/benchmarks.json` or `apps/docs/src/data/metrics*.json` from a feature branch. `pnpm metrics:check` fails the PR. Override only with `ALLOW_METRICS_ARTIFACT_EDIT=1` and a written reason.

## Apparatus & imports (benchmark-history harness)

The benchmark-history trend (`apps/docs/src/data/metrics/<version>.json`) is produced by running the **current** bench suite against each version's npm-installed dist — one fixed apparatus, only the library varies (see `scripts/generate-metrics-history.ts` → `run-bench-stable.ts`). Two rules follow:

- **Import the library from the public package, never relative source.** Benches import the composable and its types from `@vuetify/v0/composables` (or `@vuetify/v0/date`, `@vuetify/v0` for utilities) — *not* `from './index'`. The harness aliases `@vuetify/v0` to an installed version's dist via `V0_BENCH_TARGET`; a `./index` import would silently measure current source for every version instead. Keep the bench's own fixtures (`./fixtures/...`) relative.
- **The metrics pipeline benches the built dist; dev benches source.** `V0_BENCH_TARGET` (read in `packages/0/vitest.config.ts`): unset → source (`pnpm bench`/`test:bench`); `dist` → this package's build (`pnpm metrics`); a path → an installed version (the history harness). So `pnpm metrics` runs `build:0` first.

**Caveat — mocking internal deps breaks historical measurement.** A bench that `vi.mock`s an *internal* module (e.g. `createVirtual` mocks `#v0/composables/useResizeObserver`) cannot intercept that dependency once the composable is a bundled dist — the mock no-ops against installed versions, so that bench's historical numbers are noisier/less controlled. Prefer not mocking internals in performance-critical benches; if you must, expect its trend line to be unreliable.

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
- [ ] Operation benches over a populated collection are warm (shared fixture + cheap reset); the timed block contains no O(n) populate that isn't the operation
- [ ] Fresh fixtures used only where the populate IS the op (initialization, batch onboard-then-clear) or the fixture grows unbounded — with a category comment saying which
- [ ] Warm benches verified: tight `rme` (no state drift) and the measured mean reflects real work (memoization defeated)
- [ ] Operation benches keep the `(N items)` suffix so the tier grades them as collection ops
- [ ] Fixtures have explicit TypeScript types
- [ ] Each category has a comment block explaining what it measures
- [ ] Describe blocks use lowercase standard category names
- [ ] Bench names use sentence case with comma-formatted numbers
- [ ] >= 5 benchmarks, >= 3 categories, >= 2 dataset sizes (1K + 10K)
- [ ] Lookup targets are middle of registry
- [ ] Mocks limited to lifecycle-dependent code (observers, SSR constants)
- [ ] Library imports use the public `@vuetify/v0/*` surface, not `./index` (the history harness measures installed versions via that alias)
