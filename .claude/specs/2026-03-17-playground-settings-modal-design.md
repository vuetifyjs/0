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

New composable that owns all configuration state. Extracted from `usePlaygroundFiles` to keep concerns separated.

```ts
interface PlaygroundSettings {
  vue: string   // e.g. '3.5.13'
  v0: string    // e.g. '0.1.7'
}
```

Returns:
- `settings` — reactive `PlaygroundSettings` object
- `vueVersion` — `Ref<string>` fed directly to `useVueImportMap`
- `v0Version` — `Ref<string>` driving the CDN URL in `builtinImportMap`

`usePlaygroundFiles` consumes `usePlaygroundSettings` and passes its refs into the existing store setup, replacing the hardcoded `@latest`.

### Reactivity chain

```
vueVersion ref → useVueImportMap({ vueVersion }) → import map → sandbox
v0Version ref → builtinImportMap computed → '@vuetify/v0' CDN URL → import map → sandbox
```

CDN URL pattern for v0:
```
https://cdn.jsdelivr.net/npm/@vuetify/v0@{version}/dist/index.mjs
```

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

Settings are optional. Old hashes without a `settings` field decode cleanly and fall back to `latest` for both versions.

### Vuetify play hash compatibility

`decodePlaygroundHash` gains a third decode branch. When the decompressed JSON is an **array**, it's the Vuetify play tuple format:

```
[files, vueVersion, vuetifyVersion, appendJson, activeFileName, ...]
```

Mapping:
- `files` ← index 0
- `settings.vue` ← index 1
- `active` ← index 4
- indices 2, 3, 5, 6, 7 are discarded (Vuetify-specific)

All three formats remain supported with no breaking changes:
1. Legacy plain `Record<string, string>` — files only, no versions
2. Current object `{ files, active, imports }` — no versions (fall back to latest)
3. New object `{ files, active, imports, settings }` — includes versions
4. Vuetify play tuple `[files, vueVersion, ...]` — files + vue version extracted

---

## Version Fetching

### `fetchNpmVersions` utility

```ts
async function fetchNpmVersions(
  pkg: string,
  minVersion: string,
  includePrerelease: boolean
): Promise<string[]>
```

- Hits `https://registry.npmjs.org/{pkg}` with `Accept: application/vnd.npm.install-v1+json`
- Filters by `semver.gte(version, minVersion)`
- Filters out pre-releases unless `includePrerelease` is true
- Returns versions sorted newest-first

Minimum versions:
- Vue: `3.2.0` — minimum `@vue/repl` supports
- v0: `0.1.0` — include all releases including pre-releases

Fetching is **lazy** — triggered when the settings modal opens, not on page load. A loading state is shown while fetching. Results are cached for the session (fetched at most once per package per page load).

---

## UI

### App bar button

A settings button added to the right side of the app bar, between the layout toggle and the theme toggle. Uses a sliders or gear icon. Opens the settings modal.

### Settings modal

A dialog with a two-column layout:

**Left**: vertical nav list with icon + label entries:
- **Versions** — active, implemented
- **Presets** — placeholder, visually disabled/dimmed with a "coming soon" indicator
- **Export** — placeholder, visually disabled/dimmed with a "coming soon" indicator

**Right**: content panel for the active section.

The nav structure is built from day one so future sections slot in without rearchitecting.

### Versions section

Two labeled select dropdowns:

| Label | Package | Prerelease |
|---|---|---|
| Vue | `vue` / `@vue/runtime-dom` | excluded |
| @vuetify/v0 | `@vuetify/v0` | included |

Each select shows a loading skeleton while versions are being fetched. The currently active version is pre-selected. Changing a version updates the ref immediately; the import map reacts and the sandbox recompiles.

---

## File Changes

| File | Change |
|---|---|
| `src/composables/usePlayground.ts` | Extend `PlaygroundHashData` with `settings`; add Vuetify play tuple decode branch |
| `src/composables/usePlaygroundFiles.ts` | Consume `usePlaygroundSettings`; remove hardcoded `@latest` |
| `src/composables/usePlaygroundSettings.ts` | **New** — owns version state, fetches npm versions, syncs to hash |
| `src/utilities/npm.ts` | **New** — `fetchNpmVersions` utility |
| `src/components/playground/app/PlaygroundAppBar.vue` | Add settings button |
| `src/components/playground/settings/PlaygroundSettings.vue` | **New** — modal shell with left nav |
| `src/components/playground/settings/PlaygroundSettingsVersions.vue` | **New** — versions section content |

---

## Out of Scope (this spec)

- Presets (Vue Router, Pinia hookup) — placeholder nav entry only
- Export as download — placeholder nav entry only
- Version persistence beyond the URL hash (no localStorage)
- Nightly/canary build toggles
