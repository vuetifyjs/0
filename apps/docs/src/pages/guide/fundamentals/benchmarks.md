---
title: Benchmarks - Performance Metrics and Tiers
features:
  order: 6
  level: 2
meta:
  - name: description
    content: Understand Vuetify0 benchmark methodology, performance tiers, and how to interpret results. Learn what gets benchmarked and how metrics are calculated.
  - name: keywords
    content: vuetify0, benchmarks, performance, metrics, tiers, ops/s, vitest bench
related:
  - /composables
  - /guide/fundamentals/core
---

# Benchmarks

v0 maintains performance benchmarks for all core composables. This page explains what gets benchmarked, how to interpret metrics, and what the performance tiers mean.

<DocsPageFeatures :frontmatter />

## Why Benchmark

Headless UI libraries must be fast—they're foundational infrastructure. v0 benchmarks exist to:

1. **Catch regressions** — CI fails if performance drops
2. **Guide optimization** — Data-driven decisions, not guesses
3. **Set expectations** — Users know what to expect at scale
4. **Validate minimal reactivity** — Prove the tradeoffs are worth it

## What Gets Benchmarked

### Core Composables

| Composable | Why It's Benchmarked |
| - | - |
| `createRegistry` | Foundation for all collections—performance here affects everything |
| `createModel` | Value store underlying all selection—selection benchmarks depend on it |
| `createSelection` | Base for all selection patterns—select, toggle, mandatory, batch |
| `createNested` | Hierarchical trees with cascade—tree traversal scales with depth |
| `createTokens` | Design tokens can grow large—alias resolution must scale |
| `createFilter` | Search/filter on large datasets must remain responsive |
| `createVirtual` | Virtual scrolling is performance-critical by definition |
| `createDataTable` | Composed orchestrator—measures sorting, filtering, and pagination together |
| `createDataGrid` | Composed on top of createDataTable—measures column layout, cell editing, row ordering, and row spanning overhead |
| `createSortable` | Ordered-list primitive—move, swap, and reorder operations must scale to large lists |
| `useDate` | Date operations are frequent in UIs |
| `useProxyRegistry` | Reactive proxy for templates—shows reactivity overhead vs raw registry |

### Operation Categories

Each benchmark file covers multiple operation types:

| Category | Fixture Type | What It Measures |
| - | - | - |
| Initialization | Fresh | Setup/creation cost |
| Lookup operations | Shared | Single item access (O(1) expected) |
| Mutation operations | Fresh | Updates and modifications |
| Batch operations | Fresh | Bulk actions (onboard, offboard) |
| Computed access | Shared | Cached/derived value reads |
| Seek operations | Shared | Directional search |

**Shared fixtures** reuse the same data structure across iterations—safe for read-only operations.

**Fresh fixtures** create new data per iteration—required for mutations to get accurate measurements.

## Performance Tiers

Tiers grade **cost**, not raw throughput. Raw ops/s mostly measures how much work a benchmark was given: an operation over 10,000 items at 17 ops/s is 5.9µs per item, which is better engineering than a single-item call at 200,000 ops/s and 5µs per item. Grading on ops/s would rank the second one higher.

Which budget applies depends on whether the benchmark has a workload to amortize.

**Collection operations** — anything measured over N items — are graded on two axes, and the worse of the two wins:

| Tier | Per-item cost | Single-operation latency |
|------|---------------|--------------------------|
| Blazing | < 1µs per item | < 16.7ms — one frame at 60fps |
| Fast | < 10µs | < 33.4ms — two frames |
| Good | < 100µs | < 100ms — the perceptibility threshold |
| Slow | ≥ 100µs | ≥ 100ms |

The second axis exists so honest per-item cost cannot hide a slow operation: a 10,000-row sort taking 160ms has respectable per-item cost, but a user waits a tenth of a second for it, so it does not get to badge "fast".

**One-shot operations** — constructors and single utility calls, where there is no workload to spread — are graded on call latency alone. Grading them per-item would be a category error, since the item count is one:

| Tier | Per call |
|------|----------|
| Blazing | < 10µs |
| Fast | < 100µs |
| Good | < 16.7ms — within one frame |
| Slow | ≥ 16.7ms |

The latency thresholds are the only ones anchored to something outside the library: 16.7ms is a frame at 60fps, and 100ms is the long-standing threshold below which an interface feels instantaneous. The per-item and per-call budgets are engineering conventions.

**A feature's badge is its worst group, and a group's badge is its worst benchmark.** Averaging would let one flattering microbenchmark mask a genuinely slow path, which is the opposite of what these badges are for.

> [!NOTE]
> Numbers are measured on a single fixed reference machine so they stay comparable between releases, and are published as measured with no host correction applied. That machine is deliberately not the fastest available — a benchmark host should err pessimistic. Absolute figures will differ on your hardware; the tiers and the trends are the parts that carry meaning.

### Reading Results

```bash
✓ createRegistry/index.bench.ts
  lookup operations
    ✓ Get by id (1,000 items)          1,234,567 ops/s
    ✓ Get by id (10,000 items)         1,198,432 ops/s
```

- **ops/s** — Operations per second (higher is better)
- **Consistent across sizes** — O(1) complexity confirmed
- **10x data, ~same speed** — Good scaling behavior

## Dataset Sizes

Benchmarks test multiple sizes to reveal complexity:

| Size | Items | Purpose |
| - | - | - |
| Medium | 1,000 | Baseline measurement |
| Large | 10,000 | Reveals O(n) vs O(1) |
| Small | 100 | Optional edge case |
| Stress | 100,000 | Optional stress test |

If a 10,000-item benchmark is 10x slower than 1,000-item, the operation is O(n). If it's roughly the same speed, it's O(1).

## Running Benchmarks

```bash
# Run all benchmarks
pnpm test:bench

# Run specific file
pnpm vitest bench packages/0/src/composables/createRegistry/index.bench.ts
```

Numbers from your own machine are useful for spotting a regression you just introduced, and are not comparable to the published figures — different CPU, different results. The artifacts behind this site are regenerated only on the project's reference machine, so please don't commit locally generated ones; CI rejects them.

## Interpreting for Your Use Case

::: faq single
??? Is this fast enough for my app?

Most v0 composables handle 10,000+ items at interactive speeds (>60fps). For typical UIs:

- **<100 items** — Instant, no optimization needed
- **100-1,000 items** — Smooth, standard usage
- **1,000-10,000 items** — Consider virtual scrolling
- **10,000+ items** — Use `createVirtual`, paginate, or filter

??? Should I use events or polling?

- **Events** — Real-time updates, notifications, debugging
- **Polling (`values()`)** — Periodic snapshots, non-critical freshness
- **`useProxyRegistry`** — Template-bound lists that must stay current

Events add minimal overhead when enabled. Benchmarks show raw operation cost; event emission adds ~1-5% overhead.

??? Why minimal reactivity instead of full reactivity?

Vue's reactivity system is powerful but not free. Each reactive wrapper adds:

- Memory for dependency tracking
- CPU cycles for change detection
- Potential for unnecessary re-renders

By keeping reactivity minimal, v0 composables stay predictable—you know exactly what triggers updates. When you need reactivity, opt in explicitly with `useProxyRegistry`.

??? How do I compare raw vs reactive performance?

Compare `createRegistry` benchmarks with `useProxyRegistry` to see the reactivity overhead. It's worth it when needed, but shouldn't be the default.
:::

## Explorer

Browse all benchmark results. Select a composable to filter, or expand groups to compare individual operations.

<BenchmarkExplorer />

## Contributing Benchmarks

New composables should include benchmarks if they:

- Manage collections (registries, arrays, maps)
- Perform search/filter operations
- Have user-perceived latency (loading, transitions)
- Are called frequently (every render, every keystroke)

See [createRegistry benchmarks](https://github.com/vuetifyjs/0/blob/master/packages/0/src/composables/createRegistry/index.bench.ts) for the canonical example.
