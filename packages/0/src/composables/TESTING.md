# Composable Testing Conventions

## File Structure

Tests are colocated with source: `useX/index.test.ts`

## Import Order

Enforced by ESLint (`perfectionist/sort-imports`):

```ts
// Composable under test
import { createX, useX } from './index'

// Adapters/fixtures
import { XAdapter } from './adapters/x'

// Test utilities
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Vue utilities
import { nextTick, ref } from 'vue'
```

## Test Naming

Always use `should` prefix (enforced by `vitest/prefer-lowercase-title`):

```ts
it('should register an item with a custom id', ...)
it('should not select disabled items', ...)

// For specific function tests, prefix with function name:
it('useWindowEventListener should return noop during SSR', ...)
```

## Mock Cleanup

When using `vi.mock()`, always include cleanup:

```ts
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

For dynamic module mocks in SSR tests:

```ts
beforeEach(() => {
  vi.resetModules()
})
```

## SSR Testing

Browser-dependent composables must include SSR safety tests:

```ts
describe('SSR', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return noop function during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { useX } = await import('./index')
    expect(() => useX()).not.toThrow()
  })
})
```

## ESLint Rules

These rules are enforced in `eslint.config.js`:

| Rule | Purpose |
|------|---------|
| `vitest/prefer-lowercase-title` | Lowercase test titles |
| `vitest/prefer-hooks-in-order` | Consistent hook ordering |
| `vitest/prefer-hooks-on-top` | Hooks before test cases |
| `vitest/max-nested-describe` | Max 3 nesting levels |
| `vitest/consistent-test-it` | Use `it`, not `test` |
| `perfectionist/sort-imports` | Sorted imports |

## Describe Block Organization

- Outer: composable/function name
- Inner: feature or method groups
- Max 3 levels deep

```ts
describe('useRegistry', () => {
  describe('registration', () => {
    it('should register an item', () => {})
  })

  describe('lookup', () => {
    it('should find by id', () => {})
    it('should browse by value', () => {})
  })
})
```
