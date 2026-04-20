---
paths: "**/*.test.ts"
---

# Testing Standards

Scope-specific mechanics for `**/*.test.ts`. Covers coverage requirements, structure, naming, assertion patterns, composable/component test patterns, zero-warnings policy, namespace keys, expected warnings, mocking, v-model testing, plugin mocking, and benchmark placement. Philosophy for what to test lives in `PHILOSOPHY.md`.

## Cited PHILOSOPHY sections

- §2.9 Errors throw; data integrity warns; runtime returns
- §4.5 Scope cleanup contract
- §9.2 Logger, not console
- §9.3 Namespace keys contain `:`

## Runtime

Vitest + happy-dom. [intent:84] Colocated with source: `foo.ts → foo.test.ts`, `createX/index.test.ts`. [intent:65, intent:85]

> **Project override.** This project uses `.test.ts`. The personal-rule default `.spec.ts` in `~/.claude/rules/quality.md` does not apply here — do not rename files to `.spec.ts`. Tension T14/T22 in `../tensions.md` records the decision.

## Coverage Requirements

- Every composable must have `index.test.ts`. [intent:219]
- Every component must have `index.test.ts`. [intent:220]
- Focus: edge cases, error conditions, async, SSR safety. [intent:86, intent:221]
- Only write tests when explicitly asked — never proactively add test files. [intent:19]

## Test File Structure

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'

// Mock Vue DI when needed (note hasInjectionContext for composables that use it)
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
    hasInjectionContext: vi.fn(() => true),
  }
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

Always `it('should ...')`. Never `test()`. Never `it('returns ...')`. [intent:222]

## Assertion Patterns

```ts
// Primitives
expect(value).toBe(expected)

// Refs — always unwrap with .value
expect(timer.isActive.value).toBe(true)
// [intent:223]

// Objects / arrays
expect(result).toEqual({ key: 'value' })

// Call counts
expect(handler).toHaveBeenCalledTimes(1)   // Not .toHaveBeenCalledOnce() [intent:224]

// Errors
expect(() => useContext()).toThrow('Context not found')
```

## Composable Test Pattern

```ts
describe('createFoo', () => {
  function setup (options = {}) {
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

Tests must produce **zero** stderr output. [intent:225] Verify with:

```bash
npx vitest run --reporter verbose 2>&1 | grep -E '\[Vue warn\]|\[v0.*warn\]|\[v0:context\]'
```

### Namespace keys (PHILOSOPHY §9.3)

All string keys passed to `createContext()` or `createXContext({ namespace })` must contain `:`. [intent:226] Use `test:` prefix for test-only keys, `v0:` for production keys. [intent:227]

```ts
// Wrong — triggers [v0:context] namespace warning
createContext('my-key')
createFooContext({ namespace: 'custom' })

// Right
createContext('test:my-key')
createFooContext({ namespace: 'test:custom' })
```

### Composables that use `onScopeDispose`

Wrap in `effectScope()` so disposal runs correctly in tests: [intent:228]

```ts
let scope: EffectScope

function setup (options = {}) {
  let ctx: ReturnType<typeof createCombobox>
  scope = effectScope()
  scope.run(() => { ctx = createCombobox(options) })
  return ctx!
}

afterEach(() => { scope?.stop() })
```

### Expected warnings

When a test intentionally triggers a warning (error paths, duplicate registration), capture with `vi.spyOn` and **assert** it was called — never silently swallow. [intent:229]

```ts
const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

// ... code that warns ...

expect(spy).toHaveBeenCalledTimes(1)
expect(spy).toHaveBeenCalledWith(expect.stringContaining('expected message'))
spy.mockRestore()
```

### Vue DI mocks

When mocking `provide`/`inject` from Vue and the composable uses `hasInjectionContext()`, include it: [intent:230]

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

function mountComponent (options: { props?, slots? } = {}): MountResult {
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

### V-model testing

Explicit ref binding via `onUpdate:modelValue` callback. [intent:231]

```ts
const model = shallowRef<string>()
const wrapper = mount(Component.Root, {
  props: {
    modelValue: model.value,
    'onUpdate:modelValue': (value: string) => (model.value = value),
  },
})
```

### Plugin mocking

Use `global.plugins` for Stack, Theme, etc. [intent:232]

```ts
const wrapper = mount(Component.Root, {
  global: {
    plugins: [createStackPlugin(), createThemePlugin()],
  },
})
```

## Locale string assertions (PHILOSOPHY §5.5)

Assert `toBeDefined()` for locale strings, not exact text values. Tests must not pin to an English rendering. [intent:177]

```ts
// Right
expect(slotProps.attrs['aria-label']).toBeDefined()

// Wrong
expect(slotProps.attrs['aria-label']).toBe('Close dialog')
```

## Benchmark Pattern

Benchmarks are colocated as `index.bench.ts`, only for performance-critical composables. See `.claude/rules/benchmarks.md` for full conventions. [intent:233]

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

Naming: sentence case with comma-formatted numbers: `'Get by id (1,000 items)'`.

## Checklist

- [ ] File named `index.test.ts` and colocated with source
- [ ] Imports: `beforeEach, describe, expect, it, vi` from vitest
- [ ] All test names use `it('should ...')`
- [ ] Refs unwrapped with `.value` in assertions
- [ ] `.toHaveBeenCalledTimes(1)`, not `.toHaveBeenCalledOnce()`
- [ ] All namespace keys contain `:` and use `test:` prefix
- [ ] `onScopeDispose` composables wrapped in `effectScope()`
- [ ] Expected warnings captured with `vi.spyOn` and asserted
- [ ] Vue DI mock includes `hasInjectionContext` when composable uses it
- [ ] Locale strings asserted with `toBeDefined()`, not exact text
- [ ] Zero stderr output when tests run
