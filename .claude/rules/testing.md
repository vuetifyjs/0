---
paths: ['**/*.test.ts']
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

> **Project override.** This project uses `.test.ts`. The personal-rule default `.spec.ts` in `~/.claude/rules/quality.md` does not apply here — do not rename files to `.spec.ts`.

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

// Mock Vue DI when the composable uses provide/inject directly.
// Default form — see packages/0/src/composables/createContext/index.test.ts
vi.mock('vue', () => ({
  provide: vi.fn(),
  inject: vi.fn(),
}))

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

## Test Naming (preferred — sweep in progress)

Always `it('should ...')`. Never `test()`. Prefer `it('should return ...')` over `it('returns ...')`. [intent:222] About two dozen `it('returns …')` callsites still exist in source (e.g., `composables/createNumberField/index.test.ts`); they will be swept in a follow-up. Don't add new ones.

## Assertion Patterns

```ts
// Primitives
expect(value).toBe(expected)

// Refs — always unwrap with .value
expect(timer.isActive.value).toBe(true)
// [intent:223]

// Objects / arrays
expect(result).toEqual({ key: 'value' })

// Call counts — prefer .toHaveBeenCalledTimes(N), sweep in progress
expect(handler).toHaveBeenCalledTimes(1)   // Preferred over .toHaveBeenCalledOnce() [intent:224]

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

All string keys passed to `createContext()` or `createXContext({ namespace })` must contain `:`. [intent:226] Use `v0:` for both production and test-only keys (e.g., `v0:test`, `v0:test-key`, `v0:missing-key`). The dominant convention in source is to keep the `v0:` prefix in tests rather than introduce a separate `test:` namespace. [intent:227]

```ts
// Wrong — triggers [v0:context] namespace warning
createContext('my-key')
createFooContext({ namespace: 'custom' })

// Right — see packages/0/src/composables/createContext/index.test.ts
createContext('v0:test')
createContext('v0:test-key')
createFooContext({ namespace: 'v0:custom' })
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

### Vue DI mocks — `hasInjectionContext` extension

The default mock at the top of the file covers most composables. When the composable also gates on `hasInjectionContext()`, extend the mock to keep the gate truthy under test: [intent:230]

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

### Fake timers (delay / timer / popover)

Use `vi.useFakeTimers()` in `beforeEach` and `vi.advanceTimersByTime(ms)` to step through scheduled work. Standard for any composable that schedules via `setTimeout` / `setInterval`. Restore in `afterEach`.

```ts
// packages/0/src/composables/useTimer/index.test.ts
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('should fire handler after duration', () => {
  const handler = vi.fn()
  const timer = useTimer(handler, { duration: 1000 })
  timer.start()
  vi.advanceTimersByTime(1000)
  expect(handler).toHaveBeenCalledTimes(1)
})
```

### SSR rendering with `createSSRApp` + `renderToString`

Component tests that exercise SSR safety wrap the component in a `defineComponent` and render it through `vue/server-renderer`. Assert against the returned HTML string, not a mounted wrapper.

```ts
// packages/0/src/components/Atom/index.test.ts
it('should render to string on server without errors', async () => {
  const app = createSSRApp(defineComponent({
    render: () => h(Atom as unknown as Component, { as: 'div' }, () => 'Hello'),
  }))

  const html = await renderToString(app)
  expect(html).toContain('Hello')
})
```

### Separate `*.ssr.test.ts` for `IN_BROWSER` mocking

`vi.mock` is hoisted and applies file-wide. To exercise SSR branches that gate on `IN_BROWSER`, split SSR-only tests into a sibling `index.ssr.test.ts` so the mock doesn't bleed into client-mode tests.

```ts
// packages/0/src/composables/useDate/index.ssr.test.ts
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useDate } from './index'

it('should throw when called outside component in SSR', () => {
  expect(() => useDate()).toThrow('[v0] useDate() must be called inside a Vue component')
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
- [ ] All test names use `it('should ...')` (no new `it('returns ...')` callsites)
- [ ] Refs unwrapped with `.value` in assertions
- [ ] Prefer `.toHaveBeenCalledTimes(1)` over `.toHaveBeenCalledOnce()`
- [ ] All namespace keys contain `:` and use the `v0:` prefix (including in tests)
- [ ] `onScopeDispose` composables wrapped in `effectScope()`
- [ ] Expected warnings captured with `vi.spyOn` and asserted
- [ ] Vue DI mock includes `hasInjectionContext` when composable uses it
- [ ] Fake timers (`vi.useFakeTimers` / `vi.advanceTimersByTime`) used for delay/timer composables
- [ ] SSR-only tests split into a sibling `index.ssr.test.ts` when mocking `IN_BROWSER`
- [ ] Locale strings asserted with `toBeDefined()`, not exact text
- [ ] Zero stderr output when tests run
