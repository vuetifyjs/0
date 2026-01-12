---
paths: packages/0/src/**/*.bench.ts
---

# Benchmark Standards

Performance benchmark conventions for `packages/0/src/`.

## File Location

Benchmarks are colocated with source:
```
packages/0/src/composables/createRegistry/
├── index.ts
├── index.test.ts
└── index.bench.ts
```

## Fixture Isolation

**Critical**: Separate read-only operations from mutations to get accurate measurements.

### Read-Only Benchmarks (Shared Fixtures)

Use shared fixtures for operations that don't modify state. This isolates the operation cost:

```ts
describe('lookup operations', () => {
  // Created once, reused across all benchmarks in this describe block
  const registry1k = createPopulatedRegistry(1_000)
  const registry10k = createPopulatedRegistry(10_000)

  bench('Get item by id (1,000 items)', () => {
    registry1k.get('item-500')  // Measures ONLY the get() call
  })
})
```

**Safe for shared fixtures:**
- Map/Set lookups (get, has, browse)
- Array access
- Cached computations (repeated reads)
- Pure functions

### Mutation Benchmarks (Fresh Fixtures)

Create fresh fixtures per iteration for operations that modify state:

```ts
describe('mutation operations', () => {
  bench('Upsert item (1,000 items)', () => {
    const registry = createPopulatedRegistry(1_000)  // Fresh per iteration
    registry.upsert('item-500', { value: 'updated' })
  })
})
```

**Requires fresh fixtures:**
- Any operation that modifies internal state
- Operations with side effects (cache invalidation)
- Register/unregister cycles
- Batch operations (clear, offboard)

**Note**: Fresh fixtures include setup cost. This is intentional—document it in the category comment.

## TypeScript Requirements

Fixtures must have explicit types:

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
  const registry = useRegistry()
  registry.onboard(count === 1_000 ? ITEMS_1K : ITEMS_10K)
  return registry
}
```

## Category Comments

Each category must document what it measures:

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
Use lowercase category names:
- `initialization` - Setup/creation
- `lookup operations` - Finding items
- `mutation operations` - Single item changes
- `batch operations` - Bulk actions
- `computed access` - Cached/derived reads
- `seek operations` - Directional search

### Bench Names
Sentence case with comma-formatted numbers:
```ts
// Good
bench('Get item by id (1,000 items)', ...)
bench('Onboard then clear 10,000 items', ...)
bench('Access keys() 100 times (1,000 items, cached)', ...)

// Bad
bench('get item', ...)
bench('clear 10000', ...)
```

## Minimum Requirements

| Requirement | Minimum |
|-------------|---------|
| Total benchmarks | ≥5 |
| Categories covered | ≥3 |
| Dataset sizes tested | ≥2 (1,000 and 10,000) |

## Required Categories

Each file must cover at least 3:

| Category | Description | Fixture Type |
|----------|-------------|--------------|
| `initialization` | Setup/creation cost | Fresh |
| `lookup operations` | Finding/accessing items | Shared |
| `mutation operations` | Updates and modifications | Fresh |
| `batch operations` | Bulk actions | Fresh |
| `computed access` | Derived value reads | Shared |
| `seek operations` | Directional search | Shared |

## Dataset Guidelines

Test multiple sizes to reveal O(n) complexity:

| Size | Items | Required |
|------|-------|----------|
| Medium | 1,000 | ✓ Yes |
| Large | 10,000 | ✓ Yes |
| Small | 100 | Optional |
| Stress | 100,000 | Optional |

Use realistic lookup targets (middle of registry, not first/last):
```ts
const LOOKUP_ID_1K = 'item-500'    // Middle of 1K registry
const LOOKUP_ID_10K = 'item-5000'  // Middle of 10K registry
```

## Performance Tiers

The tier is determined by the **fastest benchmark** in the file:

| Tier | O(1) threshold | O(n) threshold |
|------|----------------|----------------|
| `blazing` | ≥100,000 ops/s | ≥10,000 ops/s |
| `fast` | ≥10,000 ops/s | ≥1,000 ops/s |
| `good` | Below fast | Below fast |

**Important**: Tiers are only meaningful with proper fixture isolation. A file that mixes setup costs into read-only benchmarks will show misleadingly low numbers.

### Complexity Detection

Auto-detected from benchmark names:
- `single item` / `single query` → O(1)
- `1,000 items` / `all keys` → O(n)
- `nested` / `recursive` → O(n²)

## Mocking Best Practices

Mock only lifecycle-dependent code:
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

## Running Benchmarks

```bash
# Single file
pnpm vitest bench packages/0/src/composables/createRegistry/index.bench.ts

# All benchmarks
pnpm vitest bench

# Generate metrics
pnpm metrics
```

## Reference Implementation

See `packages/0/src/composables/createRegistry/index.bench.ts` for the canonical example of:
- Proper fixture isolation
- TypeScript types on fixtures
- Category documentation
- 1K/10K dataset coverage
- Read-only vs mutation separation
