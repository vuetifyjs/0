# vue-i18n Locale Adapter

**Date**: 2026-03-20
**Status**: Approved
**Scope**: `packages/0/src/composables/useLocale/`

## Problem

The current `LocaleAdapter` interface only handles interpolation and number formatting. `createLocale` owns the full translation pipeline: key resolution, token reference resolution, fallback chain, then delegates to the adapter for interpolation only.

This means external i18n libraries like vue-i18n can't use their own translation pipeline. A vue-i18n adapter would be reduced to string interpolation — losing pluralization, linked messages, datetime formatting, and everything else vue-i18n provides.

For users upgrading from Vuetify (which has a `createVueI18nAdapter` that delegates the full `t()` to vue-i18n), the current architecture would be a regression.

## Goal

Refactor the adapter interface so it owns the **full translation pipeline**. The adapter is the translation engine; `createLocale` is the state manager and plugin glue.

The upgrade path for existing vue-i18n users should be: install the adapter, pass their i18n instance, done.

## Design

### New LocaleAdapter Interface

```ts
interface LocaleAdapter {
  t: (key: string, params?: Record<string, unknown> | unknown[], fallback?: string) => string
  n: (value: number) => string
}
```

Key changes from current interface:
- `t()` receives the **raw message key**, not a resolved message string. The adapter is responsible for the full pipeline: key lookup, resolution, fallback, interpolation.
- `t()` accepts `params` and `fallback` directly (matching the external `LocaleContext.t()` signature).
- `n()` takes only `value`. The adapter knows the current locale internally — no need to pass it.

### LocaleAdapterContext

For adapters that need v0 internal state (like the default adapter), `createLocale` provides a setup context:

```ts
interface LocaleAdapterContext {
  tokens: ReturnType<typeof createTokens>
  selectedId: Ref<ID | null | undefined>
  fallbackLocale: ID | undefined
  has: (id: ID) => boolean
}
```

This is passed via constructor to `Vuetify0LocaleAdapter`. External adapters (like vue-i18n) don't need it — they have their own state.

`has` is needed by the `resolve()` method to distinguish cross-locale references (e.g., `{en.brand}` in a Spanish message) from same-locale token references. It checks whether a `{prefix.key}` prefix is a registered locale ID.

### Vuetify0LocaleAdapter Changes

The default adapter absorbs the resolution logic currently in `createLocale`:

```ts
class Vuetify0LocaleAdapter implements LocaleAdapter {
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

  // Token reference resolution (moved from createLocale)
  private resolve (locale: ID, str: string, visited = new Set<string>()): string { ... }

  // Placeholder interpolation (existing logic)
  private interpolate (message: string, args: unknown[]): string { ... }
}
```

The `resolve()` function and interpolation logic move verbatim from `createLocale` into the adapter. `createLocale` becomes thinner.

### VueI18nLocaleAdapter

New adapter at `packages/0/src/composables/useLocale/adapters/vue-i18n/index.ts`:

```ts
import type { I18n } from 'vue-i18n'
import type { LocaleAdapter } from '../adapter'

export class VueI18nLocaleAdapter implements LocaleAdapter {
  private i18n: I18n<any, any, any, any, false>

  constructor (i18n: I18n<any, any, any, any, false>) {
    this.i18n = i18n
  }

  t (key: string, params?: Record<string, unknown> | unknown[], fallback?: string): string {
    if (fallback && !this.i18n.global.te(key)) return fallback

    return isArray(params)
      ? this.i18n.global.t(key, params)
      : this.i18n.global.t(key, params ?? {})
  }

  n (value: number): string {
    return this.i18n.global.n(value)
  }
}
```

**Type constraint:** `I18n<any, any, any, any, false>` pins to Composition API mode. Legacy mode (`new VueI18n()`) is not supported — vue-i18n v10+ defaults to Composition API and Legacy mode is deprecated.

**Fallback detection:** Uses `te(key)` (translation exists) instead of comparing `t()` result to the key string. The `result === key` heuristic breaks when a translation's value equals its key (e.g., `{ ok: 'ok' }`).

### createLocale Changes

`createLocale` becomes a state manager that delegates to the adapter:

```ts
function createLocale (_options: LocaleOptions = {}) {
  const { adapter: externalAdapter, messages = {}, fallback: fallbackLocale, ...options } = _options
  const tokens = createTokens(messages)
  const registry = createSingle(options)

  // Register locales from messages
  for (const id in messages) {
    registry.register({ id })
    if (id === options.default && !registry.selectedId.value) {
      registry.select(id)
    }
  }

  // Construct default adapter with internal state, or use external
  const adapter = externalAdapter ?? new Vuetify0LocaleAdapter({
    tokens,
    selectedId: registry.selectedId,
    fallbackLocale,
    has: id => registry.has(id),
  })

  return {
    ...registry,
    t: (key, params, fallback) => adapter.t(key, params, fallback),
    n: (value) => adapter.n(value),
    get size () { return registry.size },
  }
}
```

### Package Configuration

Following the adapter pattern:

**pnpm-workspace.yaml** — add to catalog:
```yaml
'vue-i18n': ^10.0.0
```

**packages/0/package.json**:
```json
"peerDependencies": {
  "vue-i18n": ">=10.0.0"
},
"peerDependenciesMeta": {
  "vue-i18n": { "optional": true }
},
"devDependencies": {
  "vue-i18n": "catalog:"
}
```

**publishConfig.exports** and **exports** — add:
```json
"./locale/adapters/vue-i18n": "./dist/locale/adapters/vue-i18n/index.mjs"
```

**tsdown** — existing glob `'./src/*/adapters/**/index.ts'` covers it.

### File Structure

```
packages/0/src/
├── composables/useLocale/
│   ├── index.ts                    # createLocale (simplified)
│   ├── index.test.ts               # Updated tests
│   └── adapters/
│       ├── adapter.ts              # LocaleAdapter + LocaleAdapterContext interfaces
│       ├── index.ts                # Re-exports
│       ├── v0.ts                   # Vuetify0LocaleAdapter (absorbs resolution logic)
│       └── vue-i18n/
│           └── index.ts            # VueI18nLocaleAdapter
└── locale/adapters/vue-i18n/
    └── index.ts                    # Re-export stub (mirrors v0 pattern)
```

The `src/locale/adapters/vue-i18n/index.ts` re-export stub is required for the public subpath export `@vuetify/v0/locale/adapters/vue-i18n` to resolve. It re-exports from the composable-level source:

```ts
export * from '#v0/composables/useLocale/adapters/vue-i18n'
```

## Usage

### Default (no change for existing users)

```ts
app.use(createLocalePlugin({
  default: 'en',
  fallback: 'en',
  messages: { en: { hello: 'Hello' }, es: { hello: 'Hola' } },
}))
```

### With vue-i18n

```ts
import { createI18n } from 'vue-i18n'
import { VueI18nLocaleAdapter } from '@vuetify/v0/locale/adapters/vue-i18n'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: { hello: 'Hello' }, es: { hello: 'Hola' } },
})

app.use(i18n)
app.use(createLocalePlugin({
  adapter: new VueI18nLocaleAdapter(i18n),
}))
```

Messages live in vue-i18n. v0 delegates `t()` and `n()` to vue-i18n directly. All vue-i18n features (pluralization, linked messages, component interpolation, etc.) work natively.

## Scope Boundaries

**In scope:**
- Refactor LocaleAdapter interface to own full `t()` pipeline
- Move resolution logic from createLocale into Vuetify0LocaleAdapter
- New VueI18nLocaleAdapter
- Package configuration (peer dep, exports, catalog)
- Updated tests

**Out of scope (future work):**
- Bidirectional locale selection sync between v0 and vue-i18n
- Scoped/component-level locale overrides via vue-i18n's `useI18n({ useScope: 'local' })`
- RTL integration with vue-i18n locale changes
- Documentation updates (separate PR)

## Breaking Changes

- `LocaleAdapter.t()` signature changes: receives raw key instead of resolved message
- `LocaleAdapter.n()` signature changes: no longer receives locale parameter
- `Vuetify0LocaleAdapter` constructor now requires `LocaleAdapterContext`

These are pre-alpha breaking changes. No migration guide needed.
