---
title: Benchmarks - Performance Metrics and Size Ratings
features:
  order: 5
  level: 3
meta:
  - name: description
    content: Understand Vuetify0 benchmark methodology, performance tiers, and size ratings. Learn what gets benchmarked and how to interpret metrics.
  - name: keywords
    content: vuetify0, benchmarks, performance, metrics, size ratings, ops/s, vitest bench
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
| [createRegistry](/composables/registration/create-registry) | Foundation for all collections—performance here affects everything |
| [createTokens](/composables/registration/create-tokens) | Design tokens can grow large—alias resolution must scale |
| [createFilter](/composables/utilities/create-filter) | Search/filter on large datasets must remain responsive |
| [useVirtual](/composables/utilities/use-virtual) | Virtual scrolling is performance-critical by definition |
| [useDate](/composables/plugins/use-date) | Date operations are frequent in UIs |

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

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
  <div class="border border-divider rounded-lg p-4 bg-surface">
    <div class="flex items-center gap-2 mb-3">
      <AppIcon icon="benchmark-blazing" class="text-error" :size="20" />
      <span class="font-semibold text-error">Blazing Fast</span>
    </div>
    <div class="text-sm text-on-surface-variant space-y-1">
      <div>O(1): ≥100,000 ops/s</div>
      <div>O(n): ≥10,000 ops/s</div>
    </div>
  </div>
  <div class="border border-divider rounded-lg p-4 bg-surface">
    <div class="flex items-center gap-2 mb-3">
      <AppIcon icon="benchmark-fast" class="text-warning" :size="20" />
      <span class="font-semibold text-warning">Fast</span>
    </div>
    <div class="text-sm text-on-surface-variant space-y-1">
      <div>O(1): ≥10,000 ops/s</div>
      <div>O(n): ≥1,000 ops/s</div>
    </div>
  </div>
  <div class="border border-divider rounded-lg p-4 bg-surface">
    <div class="flex items-center gap-2 mb-3">
      <AppIcon icon="benchmark-good" class="text-info" :size="20" />
      <span class="font-semibold text-info">Good</span>
    </div>
    <div class="text-sm text-on-surface-variant space-y-1">
      <div>O(1): Below fast</div>
      <div>O(n): Below fast</div>
    </div>
  </div>
</div>

The tier is determined by the **fastest benchmark** in each file.

### Complexity Detection

Tiers adjust based on detected algorithmic complexity:

| Pattern in Benchmark Name | Complexity |
| - | - |
| "single item", "single query" | O(1) |
| "1,000 items", "all keys" | O(n) |
| "nested", "recursive" | O(n²) |

### Reading Results

```
✓ createRegistry/index.bench.ts
  lookup operations
    ✓ Get item by id (1,000 items)     1,234,567 ops/s
    ✓ Get item by id (10,000 items)    1,198,432 ops/s
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

# Generate metrics report
pnpm metrics
```

## Interpreting for Your Use Case

::: faq single
??? Is this fast enough for my app?

Most v0 composables handle 10,000+ items at interactive speeds (>60fps). For typical UIs:

- **<100 items** — Instant, no optimization needed
- **100-1,000 items** — Smooth, standard usage
- **1,000-10,000 items** — Consider virtual scrolling
- **10,000+ items** — Use [useVirtual](/composables/utilities/use-virtual), paginate, or filter

??? Should I use events or polling?

- **Events** — Real-time updates, notifications, debugging
- **Polling (`values()`)** — Periodic snapshots, non-critical freshness
- **[useProxyRegistry](/composables/reactivity/use-proxy-registry)** — Template-bound lists that must stay current

Events add minimal overhead when enabled. Benchmarks show raw operation cost; event emission adds ~1-5% overhead.

??? Why minimal reactivity instead of full reactivity?

Vue's reactivity system is powerful but not free. Each reactive wrapper adds:

- Memory for dependency tracking
- CPU cycles for change detection
- Potential for unnecessary re-renders

By keeping reactivity minimal, v0 composables stay predictable—you know exactly what triggers updates. When you need reactivity, opt in explicitly with [useProxyRegistry](/composables/reactivity/use-proxy-registry).

??? How do I compare raw vs reactive performance?

Compare [createRegistry](/composables/registration/create-registry) benchmarks with [useProxyRegistry](/composables/reactivity/use-proxy-registry) to see the reactivity overhead. It's worth it when needed, but shouldn't be the default.
:::

## Contributing Benchmarks

New composables should include benchmarks if they:

- Manage collections (registries, arrays, maps)
- Perform search/filter operations
- Have user-perceived latency (loading, transitions)
- Are called frequently (every render, every keystroke)

See [createRegistry benchmarks](https://github.com/vuetifyjs/v0/blob/master/packages/0/src/composables/createRegistry/index.bench.ts) for the canonical example.
