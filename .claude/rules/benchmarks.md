---
paths: ['packages/0/src/**/*.bench.ts', 'packages/0/bench/**/*.bench.ts']
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

# Canonical metrics (coverage + dist median-of-3 + metrics.json) — reference host only
pnpm metrics
pnpm metrics:check

# Prove the apparatus still reproduces itself (run after any change to the machine)
pnpm metrics:verify --runs 3
pnpm metrics:verify --from a.json b.json    # compare artifacts you already have
```

To narrow to a single file, append the path: `pnpm test:bench packages/0/src/composables/createRegistry/index.bench.ts`.

## Apparatus contract (stability — non-negotiable)

Numbers only mean something if the **writer, machine, and flags** are fixed. Homepage peak, tier badges, and history sparklines all read the same artifacts.

| Knob | Canonical value | Why |
|------|-----------------|-----|
| Writer | **the reference host only** — CI regenerates coverage, never benchmarks | Feature PRs must not commit laptop `benchmarks.json` |
| Runner | **fixed reference workstation** + Node from `.nvmrc` | A pinned OS image does not pin the CPU — see "Reference host" |
| Host readiness | <5% busy machine-wide **and** <35% on any single CPU (`scripts/lib/host-guard.ts`) | A fixed host trades runner rotation for desktop contention |
| Vitest project | `v0:unit` only | `v0:browser` also matches `*.bench.ts` and double-records |
| Parallelism | `--maxWorkers=1 --no-file-parallelism` | File/worker interleaving adds jitter |
| Library under test | `V0_BENCH_TARGET=dist` (current) or npm dist path (history) | Source vs dist is a different apparatus |
| Aggregation | **median of 3 runs** (`pnpm metrics:bench`) | Single GHA run is ~10–20% noisy |
| Paths in JSON | repo-relative `packages/0/src/...` | Absolute `/home/john/...` vs `/home/runner/...` confuses audits |
| Host identity | `env` fingerprint in every artifact; **no** correction factor | Two artifacts are comparable only if cpu/node match — see below |

**Acceptable deviation:** canary benches (see `scripts/lib/bench-stable.ts` `CANARY_BENCHES`) may move **±20%** run-to-run on shared GHA with no code change — *but only once numbers are host-normalized*. On raw ops/s the real spread is far wider: PR #714 re-benched the byte-identical 1.0.0 npm dist and moved **+50.9% median across 623 benches**, with 582 of them outside ±20% and 35 tier badges flipped. Never read a raw cross-run delta as signal.

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

**Do not** commit `apps/docs/public/benchmarks.json` or `apps/docs/src/data/metrics*.json` from a feature branch. `pnpm metrics:check` fails the PR. Override only with `ALLOW_METRICS_ARTIFACT_EDIT=1` and a written reason. See "Regenerating metrics" below for the sanctioned path.

## Why there is no host calibration

There used to be. It is worth knowing why it is gone, because the reasoning that produced it is seductive and will otherwise be reinvented.

`runs-on: ubuntu-24.04` pins the **OS image, not the CPU**. GHA rotates hosts across generations differing ~1.5x in single-thread throughput, so identical code benched on two runners yields two different sets of absolute ops/s — that is what produced #714's phantom 50% "improvement". The fix built for it was a frozen 13-anchor microbenchmark suite that imported nothing from v0, whose trimmed geometric mean against a stored baseline gave a per-run `scale` that every consumer divided by.

**It was deleted because it made the numbers worse.** Measured across four full-suite runs of identical code on the fixed workstation:

| method | per-bench median | per-feature median | per-feature worst |
|--------|-----------------:|-------------------:|------------------:|
| raw ops/s | **1.81%** | **2.16%** | **4.96%** |
| anchor-normalized | 3.53% | 6.23% | 9.50% |

Dividing by the scale roughly tripled the disagreement between measurements of identical code. The cause: on one of the four runs the anchors moved −4.6% at the median (allocation-heavy ones −38% and −27%) while the 433 real benches moved +1.4%. The probe did not track the workload it was correcting, so its "correction" was injected error. No trim setting rescues that: recomputing the scale at trim 0/1/2/3 gives 0.9140 / 0.9393 / 0.9586 / 0.9606 — the contaminated block was too broad to reject, and the anchors' central tendency was wrong, not merely their tails. The single least reproducible file in the whole suite was `calibration.bench.ts` itself, at 9.42% against a worst real feature of 4.96%.

Two further facts settled it. **Every committed artifact had `scale: 1`** — the apparatus was inert for its entire life, so deleting it changed no published number and required no migration. And a survey of ~35 comparable projects (V8, JetStream, Speedometer, Node core, TypeScript `ts-perf`, rustc-perf, LNT, SPEC, JMH, Go `benchstat`, criterion.rs, Vue core, React, Deno, Bun, esbuild, Biome, tinybench, mitata, CodSpeed, BenchmarkDotNet, MongoDB, Mozilla) found **zero** that derive a host scale from a synthetic probe and divide by it. Benchmark.js shipped exactly this mechanism and removed it, for exactly this reason. SPEC's reference-machine ratio looks like precedent but is not: it normalizes each benchmark against *its own* reference time, a unit conversion that provably cancels.

The deeper reason no probe could have worked: decomposing the pairwise variance, a run-wide common shift accounts for only **0.1–13%** of it, while 87–99.9% is per-bench noise that no single scalar can touch. There is roughly 1% of host drift available to correct against a ~4% noise floor, so even a perfect probe buys almost nothing — and an imperfect one costs 4%.

**What replaces it:** nothing corrects the host. Instead the host is *fixed*, its identity is *recorded* (`env`), and whole-suite movement is *reported* (`suiteShiftPct` in the delta report). If every bench moves together, that is visible in one line and a human draws the obvious conclusion — rather than the shift being silently folded into every figure. If two artifacts' `env.cpu` or `env.node` differ, their absolute numbers are not comparable and the answer is to re-measure the series, not to rescale it.

**Do not reintroduce a calibration probe.** If cross-machine comparison becomes genuinely necessary, the options with real precedent are: re-measure history on the new machine (what `metrics:history` already does), switch the gated metric to something deterministic such as instruction counts (rustc-perf's answer, ±0.2%), or bench both versions in one interleaved run and publish only the ratio (Node core's answer). A synthetic probe disjoint from the workload is not on that list.

## Reference host

Benchmarks are measured on a **fixed workstation**, not a CI runner. This is the entire mechanism — fixing the host removes host rotation rather than compensating for it, which is why nothing downstream needs a correction factor.

Measured on the reference box (i9-7980XE, 18C/36T), four full-suite runs of identical code: **per-feature spread 2.16% median, 4.96% worst; per-bench 1.81% median, 8.51% at p95** — against the +50.9% median that host rotation produced on GHA. Run `pnpm metrics:verify` to reproduce those figures on demand; it is the standing proof that the setup still deserves trust.

### Nine benches are unreliable, and no pipeline change fixes them

These nine spread **>20% on identical code** across four runs and are the *entire* >20% tail — they are the only benches capable of tripping a ±20% canary band without a code change. 42 of 433 spread >10%.

| spread | bench |
|-------:|-------|
| 46.5% | `createNested` :: Unregister root with cascade (1,000 tree items) |
| 34.3% | `createNested` :: Onboard 1,000 flat items |
| 32.0% | `createSortable` :: Create empty sortable |
| 28.1% | `useDate` :: compare 1000 pairs |
| 28.0% | `createNested` :: Onboard ~10,000 tree items (depth 4) |
| 27.3% | `createRegistry` :: Reorder reverse (1,000 items) |
| 24.7% | `useDate` :: isSameDay |
| 24.3% | `useDate` :: addMonths |
| 24.2% | `createNested` :: Get depth (1,000 tree items) |

The clustering in `createNested` and `useDate` is a hint about the benches, not the machine — check them against "Fixture Isolation" above before blaming the host. Note `rme` does not predict this: correlation between `log(rme)` and `log(cross-run spread)` is only 0.413, so a low in-run `rme` is no evidence of between-run stability (`useDate :: format shortDate` reports `rme` 0.27 and still swings 14.6%). Gate on a flat band, not an rme-derived one.

**Read feature aggregates, not individual benches.** 127 of 433 benches report `rme > 5` and swing 6–7% run-to-run (worst 46%), so a single bench moving 10% is usually noise. The same data aggregated per feature moves 2.16%. Tier badges already operate at feature level; regression judgements should too.

**Do not pin the bench to a core subset.** The intuitive hardening step measures worse. Restricting the run to 2 physical cores cost 5–8% throughput on the fast benches and widened the tails; widening to all 18 physical cores restored throughput but not stability. Node's GC and marking threads plus the vitest main process need cores of their own, and taking them away is a cost with no matching benefit. `taskset` is not part of the apparatus.

### Regenerating metrics

Two halves, deliberately split by whether the number cares which CPU produced it.

**Coverage — automatic, on CI.** `.github/workflows/metrics-regen.yml` runs `pnpm metrics:coverage` after a release and opens `chore: regenerate coverage metrics`. Coverage is deterministic, so a shared runner is fine. That job re-emits the committed benchmark numbers unchanged and **fails loudly if `benchmarks.json` changes**, because a CI-measured benchmark would silently replace reference-host numbers with whichever CPU the runner drew.

**Benchmarks — manual, on the reference host.** There is no automation for this on purpose: the machine is the apparatus, and no GitHub runner is that machine. The coverage job does check whether any published version lacks a snapshot (`generate-metrics-history.ts --print-missing`) and says so in the PR it opens, so the debt shows up on a page someone already reads instead of relying on memory.

```bash
# On the reference workstation, from a clean checkout of master
git pull && pnpm install --frozen-lockfile

# Coverage + build + bench (median of 3) + metrics.json.
# Refuses to start if the host is busy — wait rather than passing --allow-contended.
pnpm metrics

# Only when a newly published version has no snapshot yet
pnpm metrics:history

# Review before committing: canary table + whole-suite movement
pnpm metrics:delta --prev <previous benchmarks.json> --next apps/docs/public/benchmarks.json
pnpm metrics:check
```

Read the delta with the noise floor in mind. A single bench moving <10% is usually nothing; judge at feature level, where identical code reproduces to ~2%. If `suiteShiftPct` reports the whole suite moving more than ~5% in one direction, suspect the machine before the code — check `env` against the previous artifact and re-run.

Commit as `chore(bench): regenerate metrics` and open a PR. That subject prefix is what `metrics:check` accepts for a human-authored artifact change; anything else fails the PR guard by design, so feature branches cannot quietly ship laptop numbers.

**When the machine itself changes** — new CPU, kernel, Node major, or the box is replaced — the old series is not comparable to the new one and no factor fixes that. Run `pnpm metrics:verify --runs 2` first to confirm the new setup reproduces itself, then re-measure the whole history (`pnpm metrics:history --force`) so every point shares one machine, and say so in the PR.

### Host readiness guard

A fixed host trades CI's rotation problem for one CI never had: the machine is a real desktop that other people use. A run overlapping a game or a build is not a slow measurement, it is a wrong one, and no downstream consumer can tell afterwards. `scripts/run-bench-stable.ts` therefore refuses to start when the host is busy, and records `busy` / `governor` into `apparatus.env` so any suspect snapshot is attributable without a forensic dig.

The signal is non-idle CPU sampled from `/proc/stat` over 1s — both machine-wide and per logical CPU — and deliberately not load average, not "is anyone logged in":

- **Login presence is the wrong rule.** An idle desktop session is not contention, so a guard keyed on it is red permanently and gets switched off. Other logins are reported as context when the guard trips, never as the reason.
- **Load average is the wrong rule.** It is exponentially damped and lags in both directions. Measured on the reference box: under synthetic load, `busy` read 16.7% while the 1-minute load average still read 0.09; twelve seconds after the load stopped, `busy` had cleared to 0.1% while load had climbed to 0.92. Keyed on load, the guard would have admitted the contended run and then blocked the clean one.
- **The machine-wide figure alone is not enough, and this is the subtle one.** One fully saturated core on a 36-thread host is 2.8% of total CPU — under any sane whole-machine threshold — yet a single competing CPU-bound process is the likeliest contention there is. Measured: one busy thread read 2.8% aggregate and passed a 5%-total-only guard; with the per-CPU check it reads 100% on its core and blocks. The per-core limit is 35%, set from the gap between the measured idle floor (0–1% on the busiest core) and a real workload (100%).
- **`iowait` counts as busy, not idle.** The CPU is stalled during it, but a disk-bound neighbour still moves memory bandwidth, evicts page cache and raises interrupt load, all of which land on the benchmark. Measured: a `dd` loop read 2.9% aggregate — invisible whole-machine — and 38.4% on one core, which blocks.

Enforcement is skipped only on an **ephemeral** CI runner, read as `CI` set *and* the governor helper absent. `CI` alone is the wrong test: the reference workstation driven by automation also sets `CI`, and that is exactly where the readiness contract must still hold — keying on `CI` alone disables the guard on the one machine it was written for. The host is always *inspected* regardless, so `apparatus.env` records `busy` / `peak` / `governor` behind every artifact even where nothing would have been stopped. A non-`performance` scaling governor warns rather than blocks: clock drift widens dispersion without inventing a result. Escape hatch for a deliberately contended run: `--allow-contended` / `V0_BENCH_ALLOW_CONTENDED=1`, which measures anyway and says so in the log.

### Scaling governor

`run-bench-stable.ts` sets `performance` for the duration of the suite and restores the previous governor. The reference host carries a sudoers rule scoped to a single root-owned helper (`/usr/local/sbin/v0-governor`) that accepts only `performance` or `powersave`; everywhere else the toggle no-ops, so this is not a prerequisite for running benches.

**The hold declines rather than half-works.** It changes nothing when the helper is absent, when the governor is already `performance`, or — importantly — when the original value is one the helper cannot set back (`schedutil`, `ondemand`, the `mixed(...)` marker for CPUs that disagree). Flipping to `performance` from an unrestorable governor would strand somebody's desktop at max clocks permanently, which is worse than benching at whatever was already in force.

**Restore is wired to signals, and that required the child to be async.** `finally` does not run on Ctrl-C, so release is also bound to SIGINT/SIGTERM. That alone was not enough: signal handlers only run when the event loop turns, and the original `execFileSync` blocked it for the whole suite. Verified before the change — SIGINT to the parent left vitest still benching and the box pinned to `performance`, with the interrupt queued behind the very run it was meant to abort. `runOnce` now spawns asynchronously and the handler kills the child, so an interrupt aborts the run and hands the machine back.

**The measured benefit is small, and the honest number matters more than the intuition here.** A first sequential comparison — five `powersave` runs, then five `performance` runs — showed `performance` looking dramatically *worse*. That result did not survive an interleaved re-test. Alternating the governors across four paired runs, which cancels time-ordered drift, reversed it: median CV **1.79% on `performance` against 1.98% on `powersave`**, with a median speed delta of **+0.06%**. The sequential comparison was measuring the passage of time, not the governor.

Two things follow. The toggle stays, because it removes a variable for roughly nothing and the mechanism already exists — but it is not what makes these numbers trustworthy, and nobody should expect it to rescue a noisy suite. And any future governor/apparatus comparison must be **interleaved**, never run as one block after another; on this host a sequential A/B produced a confident result with the wrong sign.

The governor is restored afterwards rather than left on `performance`, because the reference host is a desktop somebody else uses; pinning 18 cores to max clocks permanently is a round-the-clock cost for a benefit that exists only during a run.

**A note on what the fixed host does not fix.** About 6% of benches are host-*shape*-sensitive rather than merely host-speed-sensitive: on the #714 pair, `createTokens` alias resolution moved ~2.5x while the suite moved 1.47x. On a fixed host this stops mattering day to day, but it is the reason a future machine migration cannot be papered over with any single factor — the honest migration is to re-measure the series on the new host.

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
