---
paths: "**/*.test.ts"
---

# Testing Standards

Vitest + happy-dom. Colocated with source (`index.test.ts`).

## Coverage Requirements

- Every composable must have `index.test.ts`
- Every component must have `index.test.ts`
- Focus: edge cases, error conditions, async, SSR safety

## Test File Structure

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'

// Mock Vue DI when needed
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return { ...actual, provide: vi.fn(), inject: vi.fn(), hasInjectionContext: vi.fn(() => true) }
})

describe('composableName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('feature category', () => {
    it('should do specific thing', () => {
      // arrange, act, assert
    })
  })
})
```

## Test Naming (100% enforced)

Always `it('should ...')`. Never `test()` or `it('returns ...')`.

## Assertion Patterns

```ts
// Primitives
expect(value).toBe(expected)

// Refs — always unwrap with .value
expect(timer.isActive.value).toBe(true)

// Objects/arrays
expect(result).toEqual({ key: 'value' })

// Counts
expect(handler).toHaveBeenCalledTimes(1)  // Not .toHaveBeenCalledOnce()

// Errors
expect(() => useContext()).toThrow('Context not found')
```

## Composable Test Pattern

```ts
describe('createFoo', () => {
  // Helper factory
  function setup(options = {}) {
    return createFoo({ ...defaults, ...options })
  }

  it('should register items', () => {
    const foo = setup()
    foo.register({ id: 'a', value: 'test' })
    expect(foo.size).toBe(1)
  })
})
```

For lifecycle-dependent composables, wrap in `effectScope()`.

## Zero Warnings Policy

Tests must produce **zero** `stderr` output. Run `npx vitest run --reporter verbose 2>&1 | grep -E '\[Vue warn\]|\[v0.*warn\]|\[v0:context\]'` to verify.

### Namespace keys

All string keys passed to `createContext()` or `createXContext({ namespace })` must contain `:`.
Use `test:` prefix for test-only keys, `v0:` for production keys.

```ts
// wrong — triggers [v0:context] namespace warning
createContext('my-key')
createFooContext({ namespace: 'custom' })

// right
createContext('test:my-key')
createFooContext({ namespace: 'test:custom' })
```

### Composables that use `onScopeDispose`

If a composable calls `onScopeDispose` internally (e.g. `createCombobox`, `useVirtualFocus`), wrap calls in `effectScope()`:

```ts
let scope: EffectScope

function setup(options = {}) {
  let ctx: ReturnType<typeof createCombobox>
  scope = effectScope()
  scope.run(() => { ctx = createCombobox(options) })
  return ctx!
}

afterEach(() => { scope?.stop() })
```

### Expected warnings

When a test intentionally triggers a warning (error paths, duplicate registration, etc.), capture it with `vi.spyOn` and **assert** it was called — never silently swallow:

```ts
const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

// ... code that warns ...

expect(spy).toHaveBeenCalledTimes(1)
expect(spy).toHaveBeenCalledWith(expect.stringContaining('expected message'))
spy.mockRestore()
```

### Vue DI mocks

When mocking `provide`/`inject` from Vue and the composable under test uses `hasInjectionContext()`, include it in the mock:

```ts
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
    hasInjectionContext: vi.fn(() => true),
  }
})
```

## Component Test Pattern

```ts
interface MountResult {
  wrapper: VueWrapper
  props: () => ComponentSlotProps
  wait: () => Promise<void>
}

function mountComponent(options: { props?, slots? } = {}): MountResult {
  let captured: any
  const wrapper = mount(Component.Root, {
    props: options.props,
    slots: {
      default: (props: any) => {
        captured = props
        return h('span', 'content')
      },
    },
  })
  return {
    wrapper,
    props: () => captured,
    wait: () => nextTick(),
  }
}
```

**V-model testing**: Explicit ref binding via `onUpdate:modelValue` callback.
**Plugin mocking**: Use `global.plugins` array for Stack, Theme, etc.

## Benchmark Pattern

Located in `index.bench.ts`. Only for performance-critical composables.

```ts
/**
 * createFoo Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures
 * - MUTATION operations create fresh fixtures per iteration
 * - Tests both 1,000 and 10,000 item datasets
 */

const ITEMS_1K = Array.from({ length: 1000 }, (_, i) => ({ id: `item-${i}` }))

describe('lookup operations', () => {
  const FOO_1K = createPopulated(1000)

  bench('Get by id (1,000 items)', () => {
    FOO_1K.get('item-500')
  })
})
```

**Naming**: Sentence case with comma-formatted numbers: `'Get by id (1,000 items)'`
