# Playground Settings Modal — Design Spec

**Date**: 2026-03-17
**Scope**: `apps/playground/`
**Branch**: `refactor/playground-parity`

---

## Overview

Add a settings modal to the browser-based REPL playground (`apps/playground/`). The modal provides a growing collection of configuration options. Version selection (Vue and @vuetify/v0) is the first feature; Presets and Export are planned follow-ons with placeholder entries in the nav from day one.

---

## Architecture

### `usePlaygroundSettings` composable

New composable called inside `usePlaygroundFiles`. Owns version state, fetches available versions from npm, and exposes writable refs that drive the import map.

Returns:
- `vueVersion` — the `Ref<string | null>` returned by `useVueImportMap` (writable)
- `v0Version` — `Ref<string>` driving the v0 CDN URL
- `vueVersions` — `Ref<string[]>` of available Vue versions (for the select UI)
- `v0Versions` — `Ref<string[]>` of available v0 versions (for the select UI)
- `fetchVersions()` — called lazily when the modal opens; no-ops after first call

`usePlaygroundFiles` receives `vueVersion` and `v0Version` from this composable and uses them to build the import map. It also passes `settings` (the current version values) into `encodePlaygroundHash` inside the existing `updateHash` debounce.

`PlaygroundApp.vue` adds `settings` (a `{ vueVersion, v0Version }` shape) to `PlaygroundContext` so child components (the settings modal) can read and update versions.

### `useVueImportMap` behavior

Confirmed from source: when `vueVersion.value` is `null`, `useVueImportMap` uses its static `runtimeDev`/`runtimeProd` fallbacks and the `defaultVersion` string (current latest). When `vueVersion.value` is set to a concrete string (e.g. `'3.5.13'`), it generates versioned jsdelivr URLs automatically and ignores `runtimeDev`/`runtimeProd`. Setting `vueVersion.value` is sufficient to change the Vue runtime — no additional store manipulation needed.

### Reactivity chain

```
vueVersion ref (set by user) → useVueImportMap computes versioned CDN URLs → importMap updates → sandbox recompiles
v0Version ref (set by user) → builtinImportMap computed regenerates '@vuetify/v0' CDN URL → sandbox recompiles
```

CDN URL pattern for v0:
```
https://cdn.jsdelivr.net/npm/@vuetify/v0@{version}/dist/index.mjs
```

Both are pure reactive — no store reset or page reload required.

---

## URL Hash

### Extended `PlaygroundHashData`

```ts
interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: { vue?: string; v0?: string }  // new — extensible for future options
}
```

`settings` is optional. Old hashes without it decode cleanly; versions fall back to `null` (latest).

### Hash writing

`usePlaygroundFiles` already owns the `updateHash` debounce. It is updated to include `settings` in the data passed to `encodePlaygroundHash`:

```ts
const settings = {
  vue: vueVersion.value ?? undefined,
  v0: v0Version.value,
}
const hash = await encodePlaygroundHash({ files, active, imports: extraImports.value, settings })
```

`usePlaygroundSettings` does not write the hash directly — `usePlaygroundFiles` remains the sole hash writer.

### Decode format support

`decodePlaygroundHash` handles four formats:

1. **Legacy plain record** `Record<string, string>` — files only, no active, no versions
2. **Current object** `{ files, active, imports }` — no `settings`, versions fall back to `null`
3. **New object** `{ files, active, imports, settings }` — includes version selections
4. **Vuetify play tuple** `[files, vueVersion, ...]` — detected when decoded value is an array

For format 4 (Vuetify play tuple):
- `files` ← index 0 (`Record<string, string>`) — file path keys do NOT have a `src/` prefix in Vuetify play format; normalize by prepending `src/` to any key that doesn't already start with it
- `settings.vue` ← index 1 (string)
- `active` ← index 4 (string | undefined)
- All other indices discarded

---

## Version Fetching

### `fetchNpmVersions` utility (`src/utilities/npm.ts`)

```ts
async function fetchNpmVersions(
  pkg: string,
  minVersion: string,
  includePrerelease: boolean
): Promise<string[]>
```

- Hits `https://registry.npmjs.org/{pkg}` with `Accept: application/vnd.npm.install-v1+json`
- Filters by a hand-rolled semver comparator (no `semver` package — avoids a new dependency for a few comparisons)
- Filters out pre-releases (versions containing `-`) unless `includePrerelease` is `true`
- Returns versions sorted newest-first (reverse of publication order)
- On network failure: returns `[]` (caller handles empty list)

Simple semver gte comparator (no pre-release parsing needed here — just major.minor.patch):
```ts
function semverGte(a: string, b: string): boolean {
  const pa = a.split('-')[0].split('.').map(Number)
  const pb = b.split('-')[0].split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return true
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return false
  }
  return true
}
```

Minimum versions:
- Vue: `3.2.0` (minimum `@vue/repl` supports), pre-releases excluded
- v0: `0.1.0`, pre-releases included

Fetching is **lazy** — triggered on first call to `fetchVersions()`, which the modal calls on open. Results are cached in the refs for the session (called at most once per package per page load).

### Error / loading states

- **Loading**: version selects show a disabled skeleton state while fetching
- **Error**: if fetch fails, the select falls back to showing only the currently active version as a single option (the user can still navigate, just can't switch)
- **Empty list**: treated the same as error

---

## UI

### App bar button

A settings button added to the right side of the app bar, between the layout toggle and the theme toggle. Uses a sliders or gear icon. Clicking opens the settings modal. Modal open state lives as a local `shallowRef` in `PlaygroundAppBar.vue`.

### Settings modal

A dialog (`PlaygroundSettings.vue`) with a two-column layout:

**Left**: vertical nav list with icon + label entries:
- **Versions** — active section, implemented
- **Presets** — placeholder, visually disabled/dimmed with a "coming soon" badge
- **Export** — placeholder, visually disabled/dimmed with a "coming soon" badge

**Right**: content panel rendering the active section component.

Nav entries are driven by a data structure (not hardcoded conditionals) so adding a new section is one array entry + one new component.

### Versions section (`PlaygroundSettingsVersions.vue`)

Two labeled select dropdowns:

| Label | Package | Pre-releases |
|---|---|---|
| Vue | `@vue/runtime-dom` (fetched from `vue` npm package) | excluded |
| @vuetify/v0 | `@vuetify/v0` | included |

Each select:
- Shows a loading skeleton while `fetchVersions()` is in-flight
- Falls back to a single-option select with the current version on error
- Pre-selects the currently active version
- On change: sets `vueVersion.value` or `v0Version.value` → import map reacts → sandbox recompiles

---

## File Changes

| File | Change |
|---|---|
| `src/composables/usePlayground.ts` | Extend `PlaygroundHashData` with `settings`; add Vuetify play tuple decode branch (format 4); normalize `src/` prefixes for tuple files |
| `src/composables/usePlaygroundFiles.ts` | Call `usePlaygroundSettings`; pass its version refs into `useVueImportMap` and `builtinImportMap`; include `settings` in `encodePlaygroundHash` call |
| `src/composables/usePlaygroundSettings.ts` | **New** — version state, npm fetch, lazy `fetchVersions()` |
| `src/utilities/npm.ts` | **New** — `fetchNpmVersions` utility |
| `src/components/playground/app/PlaygroundApp.vue` | Add `settings` to `PlaygroundContext` and `providePlayground` call |
| `src/components/playground/app/PlaygroundAppBar.vue` | Add settings button; local `open` ref for modal |
| `src/components/playground/settings/PlaygroundSettings.vue` | **New** — modal shell with left nav |
| `src/components/playground/settings/PlaygroundSettingsVersions.vue` | **New** — versions section content |

---

## Out of Scope (this spec)

- Presets (Vue Router, Pinia hookup) — placeholder nav entry only
- Export as download — placeholder nav entry only
- Version persistence beyond the URL hash (no localStorage)
- Nightly/canary build toggles
- `@vue/server-renderer` CDN URL (handled automatically by `useVueImportMap` when `vueVersion` is set)
