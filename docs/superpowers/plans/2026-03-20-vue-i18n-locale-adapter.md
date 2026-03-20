# vue-i18n Locale Adapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor LocaleAdapter to own the full translation pipeline and add a VueI18nLocaleAdapter.

**Architecture:** The adapter interface changes from interpolation-only to full-pipeline (key resolution + fallback + interpolation). `createLocale` becomes a thin state manager that delegates `t()`/`n()` to the adapter. The default `Vuetify0LocaleAdapter` absorbs the resolution logic. A new `VueI18nLocaleAdapter` wraps `vue-i18n` directly.

**Tech Stack:** TypeScript, Vue 3, vue-i18n v10+, Vitest

**Spec:** `docs/superpowers/specs/2026-03-20-vue-i18n-locale-adapter-design.md`

---

### Task 1: Refactor LocaleAdapter interface and LocaleAdapterContext

**Files:**
- Modify: `packages/0/src/composables/useLocale/adapters/adapter.ts`

- [ ] **Step 1: Write the new adapter interface**

Replace the entire file with:

```ts
// Types
import type { ID } from '#v0/types'
import type { TokenContext, TokenTicket } from '#v0/composables/createTokens'
import type { Ref } from 'vue'

export interface LocaleAdapterContext {
  tokens: TokenContext<TokenTicket>
  selectedId: Ref<ID | null | undefined>
  fallbackLocale: ID | undefined
  has: (id: ID) => boolean
}

export interface LocaleAdapter {
  t: (key: string, params?: Record<string, unknown> | unknown[], fallback?: string) => string
  n: (value: number) => string
}
```

- [ ] **Step 2: Verify typecheck passes for adapter.ts in isolation**

Run: `pnpm typecheck`
Expected: errors in `v0.ts` and `index.ts` (expected — they still use the old interface). No errors in `adapter.ts`.

- [ ] **Step 3: Commit**

```bash
git add packages/0/src/composables/useLocale/adapters/adapter.ts
git commit -m "refactor(useLocale): update LocaleAdapter interface to own full translation pipeline"
```

---

### Task 2: Rewrite Vuetify0LocaleAdapter with resolution logic

**Files:**
- Modify: `packages/0/src/composables/useLocale/adapters/v0.ts`

The adapter absorbs the `t()`, `resolve()`, and `n()` logic currently in `createLocale`. The interpolation logic (named + numbered placeholders) stays, but moves to a private `interpolate()` method.

- [ ] **Step 1: Rewrite v0.ts**

Replace the entire file with:

```ts
// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isObject, isString, isUndefined } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { ID } from '#v0/types'
import type { LocaleAdapter, LocaleAdapterContext } from './adapter'

/**
 * Default locale adapter for @vuetify/v0.
 *
 * Handles the full translation pipeline: key lookup via tokens,
 * fallback chain, token reference resolution, and placeholder interpolation.
 */
export class Vuetify0LocaleAdapter implements LocaleAdapter {
  private context: LocaleAdapterContext

  constructor (context: LocaleAdapterContext) {
    this.context = context
  }

  t (key: string, params?: Record<string, unknown> | unknown[], fallback?: string): string {
    const locale = this.context.selectedId.value
    const args = toArray(params)

    if (!locale) return this.interpolate(fallback ?? key, args)

    const message = this.context.tokens.get(`${locale}.${key}`)?.value

    if (isString(message)) {
      return this.interpolate(this.resolve(locale, message), args)
    }

    if (this.context.fallbackLocale) {
      const fbMessage = this.context.tokens.get(`${this.context.fallbackLocale}.${key}`)?.value
      if (isString(fbMessage)) {
        return this.interpolate(this.resolve(this.context.fallbackLocale, fbMessage), args)
      }
    }

    return this.interpolate(fallback ?? key, args)
  }

  n (value: number): string {
    const locale = this.context.selectedId.value

    if (!IN_BROWSER || !locale) return value.toString()

    return new Intl.NumberFormat(String(locale)).format(value)
  }

  private resolve (locale: ID, str: string, visited = new Set<string>()): string {
    return str.replace(/{([a-zA-Z0-9.\-_]+)}/g, (match, key) => {
      const [prefix, ...rest] = key.split('.')
      const target = this.context.has(prefix) ? prefix : locale
      const name = this.context.has(prefix) ? rest.join('.') : key

      const path = `${target}.${name}`

      if (visited.has(path)) return match

      visited.add(path)

      const resolved = this.context.tokens.get(path)?.value

      if (isString(resolved)) {
        return this.resolve(target, resolved, visited)
      }

      return match
    })
  }

  private interpolate (message: string, args: unknown[]): string {
    let result = message
    let rest = args

    if (rest.length > 0 && isObject(rest[0])) {
      const variables = rest[0] as Record<string, unknown>
      result = result.replace(/{([a-zA-Z][a-zA-Z0-9_]*)}/g, (match, name) => {
        return isUndefined(variables[name]) ? match : String(variables[name])
      })
      rest = rest.slice(1)
    }

    result = result.replace(/\{(\d+)\}/g, (match, index) => {
      const i = Number.parseInt(index, 10)
      if (!isUndefined(rest[i])) {
        return String(rest[i])
      }
      return match
    })

    return result
  }
}
```

- [ ] **Step 2: Update adapters/index.ts re-exports**

Replace `packages/0/src/composables/useLocale/adapters/index.ts` with:

```ts
export { Vuetify0LocaleAdapter } from './v0'

export type { LocaleAdapter, LocaleAdapterContext } from './adapter'
```

- [ ] **Step 3: Commit**

```bash
git add packages/0/src/composables/useLocale/adapters/v0.ts packages/0/src/composables/useLocale/adapters/index.ts
git commit -m "refactor(useLocale): move resolution logic into Vuetify0LocaleAdapter"
```

---

### Task 3: Simplify createLocale to delegate to adapter

**Files:**
- Modify: `packages/0/src/composables/useLocale/index.ts`

Remove the `t()`, `n()`, and `resolve()` functions from `createLocale`. It now constructs the default adapter with a `LocaleAdapterContext` and delegates.

- [ ] **Step 1: Rewrite createLocale function**

Replace the `createLocale` function (lines 110–189) with:

```ts
export function createLocale<
  Z extends LocaleTicketInput = LocaleTicketInput,
  E extends LocaleTicket<Z> = LocaleTicket<Z>,
  R extends LocaleContext<Z, E> = LocaleContext<Z, E>,
> (_options: LocaleOptions = {}): R {
  const { adapter: externalAdapter, messages = {}, fallback: fallbackLocale, ...options } = _options
  const tokens = createTokens(messages)
  const registry = createSingle<Z, E>(options)

  for (const id in messages) {
    registry.register({ id } as unknown as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  const adapter = externalAdapter ?? new Vuetify0LocaleAdapter({
    tokens,
    selectedId: registry.selectedId,
    fallbackLocale,
    has: id => registry.has(id),
  })

  function t (
    key: string,
    params?: Record<string, unknown> | unknown[],
    fallback?: string,
  ): string {
    return adapter.t(key, params, fallback)
  }

  function n (value: number): string {
    return adapter.n(value)
  }

  return {
    ...registry,
    t,
    n,
    get size () {
      return registry.size
    },
  } as unknown as R
}
```

- [ ] **Step 2: Remove unused imports**

Remove these imports from the top of the file since the resolution logic moved to the adapter:
- `isString` from `#v0/utilities`
- `toArray` from `#v0/composables/toArray`

Also update the exports to include `LocaleAdapterContext`:

```ts
export type { LocaleAdapter, LocaleAdapterContext } from '#v0/composables/useLocale/adapters'
```

- [ ] **Step 3: Run all existing tests**

Run: `pnpm vitest run packages/0/src/composables/useLocale/index.test.ts`
Expected: All `createLocale` and `createLocaleContext` tests pass. The `vuetify0LocaleAdapter` unit tests will FAIL because they construct the adapter without context — this is expected and fixed in Task 4.

- [ ] **Step 4: Commit**

```bash
git add packages/0/src/composables/useLocale/index.ts
git commit -m "refactor(useLocale): simplify createLocale to delegate to adapter"
```

---

### Task 4: Update tests for refactored adapter

**Files:**
- Modify: `packages/0/src/composables/useLocale/index.test.ts`

The `vuetify0LocaleAdapter` describe block needs updating — the adapter now requires a `LocaleAdapterContext`. Also remove the test for `new Vuetify0LocaleAdapter()` without args in `createLocalePlugin` tests.

- [ ] **Step 1: Rewrite the adapter test block**

Replace the `describe('vuetify0LocaleAdapter')` block (lines 241–292) with:

```ts
  describe('vuetify0LocaleAdapter', () => {
    function createAdapter (messages: Record<string, Record<string, string>>, locale?: string) {
      const tokens = createTokens(messages)

      return new Vuetify0LocaleAdapter({
        tokens,
        selectedId: shallowRef(locale) as any,
        fallbackLocale: undefined,
        has: (id: string) => id in messages,
      })
    }

    it('should translate simple messages', () => {
      const adapter = createAdapter({ en: { hello: 'Hello' } }, 'en')
      expect(adapter.t('hello')).toBe('Hello')
    })

    it('should handle named placeholders', () => {
      const adapter = createAdapter({ en: { greet: 'Hello {name}' } }, 'en')
      expect(adapter.t('greet', { name: 'World' })).toBe('Hello World')
    })

    it('should handle numbered placeholders', () => {
      const adapter = createAdapter({ en: { sum: 'Sum: {0} + {1} = {2}' } }, 'en')
      expect(adapter.t('sum', [1, 2, 3])).toBe('Sum: 1 + 2 = 3')
    })

    it('should return key when translation not found', () => {
      const adapter = createAdapter({ en: { hello: 'Hello' } }, 'en')
      expect(adapter.t('missing')).toBe('missing')
    })

    it('should return fallback when translation not found', () => {
      const adapter = createAdapter({ en: { hello: 'Hello' } }, 'en')
      expect(adapter.t('missing', undefined, 'Fallback')).toBe('Fallback')
    })

    it('should format numbers', () => {
      const adapter = createAdapter({ 'en-US': {} }, 'en-US')
      const result = adapter.n(1234.56)
      expect(typeof result).toBe('string')
    })

    it('should handle undefined locale in n()', () => {
      const adapter = createAdapter({})
      expect(adapter.n(1234.56)).toBe('1234.56')
    })
  })
```

Note: Add these imports at the top of the test file:

```ts
import { hasInjectionContext, inject, provide, shallowRef } from 'vue'
import { createTokens } from '#v0/composables/createTokens'
```

- [ ] **Step 2: Fix the createLocalePlugin custom adapter test**

Replace the `'should accept custom adapter'` test (lines 314–324) — it currently constructs `new Vuetify0LocaleAdapter()` with no args. Test with a mock adapter instead:

```ts
    it('should accept custom adapter', () => {
      const customAdapter = {
        t: (key: string) => key,
        n: (value: number) => String(value),
      }
      const plugin = createLocalePlugin({
        adapter: customAdapter,
        messages: {
          en: { hello: 'Hello' },
        },
      })

      expect(plugin).toBeDefined()
    })
```

- [ ] **Step 3: Run all tests**

Run: `pnpm vitest run packages/0/src/composables/useLocale/index.test.ts`
Expected: ALL tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/0/src/composables/useLocale/index.test.ts
git commit -m "test(useLocale): update adapter tests for new LocaleAdapterContext interface"
```

---

### Task 5: Add vue-i18n to package configuration

**Files:**
- Modify: `pnpm-workspace.yaml`
- Modify: `packages/0/package.json`

- [ ] **Step 1: Add vue-i18n to pnpm catalog**

Add to the `catalog:` section of `pnpm-workspace.yaml` (alphabetical order, after `vue-component-meta`):

```yaml
  'vue-i18n': ^10.0.0
```

- [ ] **Step 2: Add vue-i18n to package.json**

In `packages/0/package.json`:

Add to `peerDependencies` (after `vue`):
```json
"vue-i18n": ">=10.0.0"
```

Add to `peerDependenciesMeta`:
```json
"vue-i18n": {
  "optional": true
}
```

Add to `devDependencies` (after `vue-component-meta`):
```json
"vue-i18n": "catalog:"
```

Add to `publishConfig.exports` (after `./locale/adapters/v0`):
```json
"./locale/adapters/vue-i18n": "./dist/locale/adapters/vue-i18n/index.mjs"
```

Add to `exports` (after `./locale/adapters/v0`):
```json
"./locale/adapters/vue-i18n": {
  "development": "./src/locale/adapters/vue-i18n/index.ts",
  "default": "./dist/locale/adapters/vue-i18n/index.mjs"
}
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`
Expected: vue-i18n installed successfully. No errors.

- [ ] **Step 4: Commit**

```bash
git add pnpm-workspace.yaml packages/0/package.json pnpm-lock.yaml
git commit -m "chore: add vue-i18n as optional peer dependency"
```

---

### Task 6: Create VueI18nLocaleAdapter

**Files:**
- Create: `packages/0/src/composables/useLocale/adapters/vue-i18n/index.ts`
- Create: `packages/0/src/locale/adapters/vue-i18n/index.ts`

- [ ] **Step 1: Create the adapter implementation**

Create `packages/0/src/composables/useLocale/adapters/vue-i18n/index.ts`:

```ts
// Utilities
import { isArray } from '#v0/utilities'

// Types
import type { I18n } from 'vue-i18n'
import type { LocaleAdapter } from '../adapter'

/**
 * Locale adapter that delegates to a vue-i18n instance.
 *
 * Composition API mode only (vue-i18n v10+ default).
 * The adapter delegates `t()` and `n()` to `i18n.global`,
 * preserving all vue-i18n features: pluralization, linked
 * messages, datetime/number formatting, etc.
 */
export class VueI18nLocaleAdapter implements LocaleAdapter {
  private i18n: I18n<any, any, any, any, false>

  constructor (i18n: I18n<any, any, any, any, false>) {
    this.i18n = i18n
  }

  t (key: string, params?: Record<string, unknown> | unknown[], fallback?: string): string {
    if (fallback && !this.i18n.global.te(key)) return fallback

    return isArray(params)
      ? this.i18n.global.t(key, params as unknown[])
      : this.i18n.global.t(key, params ?? {})
  }

  n (value: number): string {
    return this.i18n.global.n(value)
  }
}
```

- [ ] **Step 2: Create the re-export stub**

Create `packages/0/src/locale/adapters/vue-i18n/index.ts`:

```ts
/**
 * @module locale/adapters/vue-i18n
 *
 * @example
 * ```ts
 * import { VueI18nLocaleAdapter } from '@vuetify/v0/locale/adapters/vue-i18n'
 * ```
 */

export * from '#v0/composables/useLocale/adapters/vue-i18n'
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm typecheck`
Expected: PASS — no type errors.

- [ ] **Step 4: Commit**

```bash
git add packages/0/src/composables/useLocale/adapters/vue-i18n/index.ts packages/0/src/locale/adapters/vue-i18n/index.ts
git commit -m "feat(useLocale): add VueI18nLocaleAdapter"
```

---

### Task 7: Full validation

**Files:** None (verification only)

- [ ] **Step 1: Run full test suite**

Run: `pnpm vitest run packages/0/src/composables/useLocale/`
Expected: ALL tests pass.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Run lint**

Run: `pnpm lint:fix`
Expected: No errors (auto-fixes applied if any).

- [ ] **Step 4: Final commit if lint changed anything**

```bash
git add -A && git commit -m "chore: lint fixes" || echo "Nothing to commit"
```
