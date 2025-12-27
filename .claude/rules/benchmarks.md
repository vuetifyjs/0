---
paths: packages/0/src/**/*.bench.ts
---

# Benchmark Standards

Performance benchmark conventions for `packages/0/src/`.

## File Location

Benchmarks are colocated with source:
```
packages/0/src/composables/useRegistry/
├── index.ts
├── index.test.ts
└── index.bench.ts
```

## Basic Structure

```ts
import { bench, describe, vi } from 'vitest'
import { ref } from 'vue'
import { useX } from './index'

// Mock lifecycle-dependent composables
vi.mock('#v0/composables/useResizeObserver', () => ({
  useResizeObserver: () => ({ stop: vi.fn() }),
}))

describe('useX benchmarks', () => {
  describe('category name', () => {
    bench('Sentence case description with numbers formatted (1,000 items)', () => {
      // Benchmark code
    })
  })
})
```

## Naming Conventions

### Describe Blocks
Use lowercase category names that map to operations:
- `initialization` - Setup/creation
- `registration` - Adding items
- `lookup operations` - Finding items
- `scroll operations` - User interaction
- `token operations` - Token resolution

### Bench Names
Sentence case with comma-formatted numbers:
```ts
// Good
bench('Filter 1,000 objects with single key constraint', ...)
bench('Register 1,000 items then clear', ...)
bench('Process 100 scroll events (10,000 items)', ...)

// Bad
bench('filter 1000 objects', ...)
bench('register items', ...)
```

## Minimum Requirements

For a benchmark file to produce a meaningful tier rating:

| Requirement | Minimum |
|-------------|---------|
| Total benchmarks | ≥5 |
| Categories covered | ≥3 |
| Dataset sizes tested | ≥2 (e.g., 1,000 and 10,000) |

Files with fewer benchmarks should be expanded before the tier rating is considered representative.

## Required Categories

Each benchmark file must cover at least 3 of these categories:

| Category | Description | Example |
|----------|-------------|---------|
| `initialization` | Setup/creation cost | `Initialize with 1,000 items` |
| `core operations` | Primary functionality | `Register item`, `Filter objects` |
| `lookup operations` | Finding/accessing items | `Get item by id`, `Browse by value` |
| `mutation operations` | Updates and modifications | `Resize item`, `Replace items` |
| `batch operations` | Bulk actions | `Register 1,000 items`, `Clear all` |
| `computed access` | Derived value reads | `Access computed items 100 times` |

## Dataset Guidelines

Test multiple sizes to reveal O(n) complexity:

| Size | Items | Required |
|------|-------|----------|
| Medium | 1,000 | ✓ Yes |
| Large | 10,000 | ✓ Yes |
| Small | 100 | Optional |
| Stress | 100,000 | Optional |

Always include at least medium and large sizes.

## Performance Tiers

The tier rating is determined by the **fastest benchmark** in the file, adjusted for complexity. This represents the best-case performance of the feature.

| Tier | O(1) threshold | O(n) threshold | O(n²) threshold |
|------|----------------|----------------|-----------------|
| `blazing` | ≥100,000 ops/s | ≥10,000 ops/s | ≥1,000 ops/s |
| `fast` | ≥10,000 ops/s | ≥1,000 ops/s | ≥100 ops/s |
| `good` | Below fast | Below fast | Below fast |

**Important**: The tier is only meaningful if the benchmark file meets minimum requirements (≥5 benchmarks, ≥3 categories). A single benchmark gives a misleading rating.

### Complexity Detection

Complexity is auto-detected from benchmark names:
- `single item` / `single query` → O(1)
- `1,000 items` / `all keys` → O(n)
- `nested` / `recursive` → O(n²)

## Mocking Best Practices

Mock only lifecycle-dependent code:
```ts
// Mock observers to avoid DOM/lifecycle warnings
vi.mock('#v0/composables/useResizeObserver', () => ({
  useResizeObserver: (target, callback) => {
    if (target.value) {
      callback([{ contentRect: { height: 600, width: 400 } }])
    }
    return { stop: vi.fn() }
  },
}))

// Mock browser constants for SSR
vi.mock('#v0/constants/globals', async () => ({
  ...await vi.importActual('#v0/constants/globals'),
  SUPPORTS_OBSERVER: true,
}))
```

## Running Benchmarks

```bash
# Single file
pnpm vitest bench packages/0/src/composables/useRegistry/index.bench.ts

# All benchmarks
pnpm vitest bench

# Generate metrics
pnpm metrics
```

## Metrics Output

Benchmarks populate `apps/docs/src/data/metrics.json`:
```json
{
  "useRegistry": {
    "benchmarks": {
      "registration": {
        "name": "Register 1,000 items (index values)",
        "hz": 3839,
        "hzLabel": "3.8k ops/s",
        "mean": 0.2604767749999977,
        "meanLabel": "260.5μs",
        "rme": 12.8
      },
      "_fastest": {
        ...
        "tier": "good"
      }
    }
  }
}
```
