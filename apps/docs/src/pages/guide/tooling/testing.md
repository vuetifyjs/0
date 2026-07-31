---
title: Testing Guide - Unit and Component Testing for v0
features:
  label: Testing
  order: 4
  level: 2
meta:
  - name: description
    content: Test v0-based code with Vitest and @vue/test-utils. Covers setup, plugin installation, fake timers, asserting v0 errors and warnings, and package-internal DI/SSR patterns for contributors.
  - name: keywords
    content: vuetify0, testing, vitest, vue test utils, unit tests, component tests, mocking, V0Error, isV0Error, happy-dom
related:
  - /guide/tooling/ai-tools
  - /guide/tooling/vuetify-cli
  - /guide/features/types
---

# Testing

Patterns for testing apps that use v0, plus the package-internal techniques used when contributing to `@vuetify/v0`.

<DocsPageFeatures :frontmatter />

## Setup

v0 tests run on [Vitest](https://vitest.dev/) with [happy-dom](https://github.com/capricorn86/happy-dom) (or jsdom). Install the required packages:

::: code-group no-filename

```bash pnpm
pnpm add -D vitest @vue/test-utils happy-dom
```

```bash npm
npm install -D vitest @vue/test-utils happy-dom
```

```bash yarn
yarn add -D vitest @vue/test-utils happy-dom
```

```bash bun
bun add -D vitest @vue/test-utils happy-dom
```

:::

Configure Vitest to use happy-dom:

```ts vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
  },
})
```

## Installing plugins

When a component under test calls plugin-backed composables (`useStack`, `useTheme`, and similar), install those plugins in `@vue/test-utils` mount options. Prefer real providers over mocking Vue's `provide` / `inject`:

```ts
import { mount } from '@vue/test-utils'
import { createStackPlugin, createThemePlugin } from '@vuetify/v0'
import MyComponent from './MyComponent.vue'

const wrapper = mount(MyComponent, {
  global: {
    plugins: [createStackPlugin(), createThemePlugin()],
  },
})
```

## Fake timers

Composables that schedule work via `setTimeout` or `setInterval` (such as `useTimer`, `useDelay`, and `usePopover`) require fake timers. Enable them in `beforeEach` and restore real timers in `afterEach`:

```ts
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useTimer } from '@vuetify/v0'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('should fire handler after duration', () => {
  const handler = vi.fn()
  const timer = useTimer(handler, { duration: 1000 })
  timer.start()
  vi.advanceTimersByTime(1000)
  expect(handler).toHaveBeenCalledTimes(1)
})
```

## Asserting v0 errors

v0 throws structured errors that carry a typed `code` discriminant. Use `isV0Error(err, code)` to narrow the caught value and assert the payload shape:

```ts
import { expect, it } from 'vitest'
import { isV0Error, useDate, V0Error } from '@vuetify/v0'

it('should throw V0_PLUGIN_MISSING when the date plugin is absent', () => {
  let caught: unknown
  try {
    useDate()
  } catch (err) {
    caught = err
  }

  expect(caught).toBeInstanceOf(V0Error)
  expect(isV0Error(caught, 'V0_PLUGIN_MISSING')).toBe(true)
  if (isV0Error(caught, 'V0_PLUGIN_MISSING')) {
    // TypeScript now knows caught.plugin exists
    expect(caught.plugin).toBe('createDatePlugin')
  }
})
```

> [!NOTE]
> Plugin-backed composables differ on whether they throw. `useDate()` throws `V0_PLUGIN_MISSING` when no provider is installed, but composables that ship a fallback — such as `useTheme()` — return synthesized defaults instead of throwing. Assert against a composable that actually throws.

### Error codes

| Code | Thrown when |
| --- | --- |
| `V0_CONTEXT_MISSING` | `inject()` returns nothing — required provider not installed |
| `V0_PLUGIN_MISSING` | A plugin that the composable depends on was not registered |
| `V0_PALETTE_INVALID_SEED` | An invalid seed color was passed to a palette factory |
| `V0_PALETTE_UNKNOWN_VARIANT` | An unrecognised variant name was given to the Material palette |
| `V0_ADAPTER_INSTANCE_MISSING` | The adapter composable was called without a mounted adapter instance |

## Asserting warnings

When a test intentionally triggers a v0 warning (for example, passing an invalid prop or registering a duplicate), capture it with `vi.spyOn` and assert it was called. The `using` form auto-restores the spy when the block exits:

```ts
import { expect, it, vi } from 'vitest'

it('should warn on duplicate registration', () => {
  using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  // ... code that triggers the warning ...

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('duplicate'))
})
```

> [!NOTE]
> The `using` keyword relies on TC39 Explicit Resource Management and requires `target: "esnext"` in `tsconfig.json`. If your setup does not support it, use `const spy = vi.spyOn(...)` and call `spy.mockRestore()` manually after the assertion.

Never silently swallow warnings — always assert that the spy was called.

## Locale-safe assertions

v0 formats user-visible strings through the locale system. Pin assertions to structure, not English text, so tests pass under any locale:

```ts
// Right — locale-safe
expect(wrapper.find('[aria-label]').element.getAttribute('aria-label')).toBeDefined()

// Wrong — breaks under non-English locales
expect(wrapper.find('[aria-label]').element.getAttribute('aria-label')).toBe('Close dialog')
```

## Contributing to v0

The patterns below apply when unit-testing composables **inside the `@vuetify/v0` package**. When testing your own components, prefer [Installing plugins](#installing-plugins) and real provide/inject instead.

### Mocking Vue DI

Many package tests isolate composables by stubbing `provide` / `inject` (and `hasInjectionContext` when the composable guards against use outside a component). Always spread `importActual` so the rest of Vue stays real:

```ts
import { vi } from 'vitest'

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

### SSR-only tests

`vi.mock` is hoisted and applies file-wide, so mixing client and SSR branches in the same file causes the mock to leak. Split SSR-only tests into a sibling `*.ssr.test.ts` file.

The package resolves internals via the `#v0/*` import map (`package.json` `imports`). That specifier is **not available to app consumers** — only monorepo tests that run against package source can mock it:

```ts index.ssr.test.ts
// Must be the first statement — vi.mock is hoisted
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { expect, it } from 'vitest'
import { useDate } from './index'

it('should throw when called outside a component in SSR', () => {
  expect(() => useDate()).toThrow('[v0] useDate() must be called inside a Vue component')
})
```

The corresponding client tests live in `index.test.ts` and are unaffected by the SSR mock.
