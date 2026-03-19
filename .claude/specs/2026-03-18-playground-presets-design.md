# Playground Presets — Design Spec

**Date**: 2026-03-18
**Scope**: `apps/playground/`
**Branch**: `refactor/playground-parity`

---

## Overview

Add a Presets section to the playground settings modal. Users can select from four preset configurations that each reset the playground with a fresh template and the appropriate package setup. The active preset is visible in the Presets section and persists in the URL hash.

---

## Presets

| ID | Label | Extra packages | Notes |
|----|-------|---------------|-------|
| `default` | Default | — | Current v0 tabs example; no extra imports |
| `router` | Vue Router | `vue-router@latest` | RouterView app, router.ts, Home/About pages |
| `pinia` | Pinia | `pinia@latest` | Counter store example |
| `vuetify` | Vuetify | `vuetify@latest` + CSS | Basic Vuetify component usage; CSS link added via `store.setLinks` |

---

## Architecture

### Preset data — `src/data/presets.ts`

```ts
interface PresetDefinition {
  id: string
  label: string
  icon: string
  description: string
  mainOptions?: MainOptions
  files: Record<string, string>      // user-visible files (no main.ts/uno.config.ts)
  imports?: Record<string, string>   // extra CDN JS imports
  css?: string[]                     // extra CDN CSS links (Vuetify styles)
}
```

Static array of the four preset objects. Each defines its own files as raw template strings (App.vue, router.ts, store.ts, etc.).

### `createMainTs(theme, options?)` — extended

```ts
interface MainOptions {
  router?: boolean
  pinia?: boolean
  vuetify?: boolean
}

export function createMainTs (
  theme: 'light' | 'dark',
  options?: MainOptions,
): string
```

The generated `main.ts` conditionally includes:
- **router**: imports `createRouter`/`createWebHashHistory` from `vue-router`, creates a router with the user's routes file, calls `app.use(router)`
- **pinia**: imports `createPinia` from `pinia`, calls `app.use(createPinia())`
- **vuetify**: imports `createVuetify` from `vuetify`, calls `app.use(createVuetify())`

Default behavior (no options) is unchanged.

### `usePlaygroundFiles` — additions

Two new items returned:

**`activePreset`** — `ShallowRef<string>` initialized to `'default'`. Decoded from `settings.preset` in the hash on mount. Included in `updateHash` serialization.

**`applyPreset(id)`** — async function that:
1. Sets `activePreset.value = id`
2. Generates `createMainTs(theme, preset.mainOptions)` as the fresh main.ts
3. Calls `loadExample(preset.files)` — reuses existing file-loading flow
4. Calls `store.setImportMap({ imports: preset.imports }, true)` if the preset has extra imports; clears extra imports if not
5. Calls `store.setLinks({ css: preset.css })` if the preset has CSS links (Vuetify); calls `store.setLinks({ css: [] })` otherwise to clear previous CSS
6. Updates `extraImports.value` to reflect the preset's imports (so they survive hash encode/decode)

`loadExample` gains an optional third argument `mainOptions?: MainOptions` passed to `createMainTs` internally. `applyPreset` passes the preset's `mainOptions` through this path.

**Theme watcher** updated to use `createMainTs(isDark ? 'dark' : 'light', PRESETS.find(p => p.id === activePreset.value)?.mainOptions)`.

### Hash

`PlaygroundHashData.settings` gains `preset?: string`:

```ts
settings?: { vue?: string; v0?: string; preset?: string }
```

On decode: `settings.preset` is read to restore `activePreset.value` (informational — files in hash are the authoritative state). `isValidSettings` updated to allow the new field.

On encode: `settings.preset` written when `activePreset.value !== 'default'`.

---

## UI

### `PlaygroundSettingsPresets.vue` — new component

Replaces `component: null` in the `sections` array of `PlaygroundSettings.vue`. `available` changes to `true`.

Renders a vertical list of preset cards. Each card shows:
- Icon + label (bold when active)
- Short description
- Checkmark or highlighted border when this is the active preset

**Selecting a preset:**

Clicking an already-active preset → nothing.

Clicking an inactive preset → show inline confirmation within the panel:

> *Applying "[Label]" will reset your playground. Any unsaved work will be lost.*
> [Cancel] [Apply]

On **Apply**: call `playground.applyPreset(id)`, collapse confirmation.
On **Cancel**: collapse confirmation, no change.

Only one confirmation is visible at a time. A second click on another preset while one confirmation is open collapses the first and opens the new one.

---

## File Changes

| File | Change |
|------|--------|
| `src/data/presets.ts` | **New** — `PresetDefinition` interface + 4 preset objects |
| `src/data/playground-defaults.ts` | Extend `createMainTs` to accept `MainOptions?` |
| `src/composables/usePlayground.ts` | Add `preset?` to `settings` in `PlaygroundHashData`; update `isValidSettings` |
| `src/composables/usePlaygroundFiles.ts` | Add `activePreset`, `applyPreset`; update `loadExample` for `mainOptions`; update theme watcher; include preset in hash |
| `src/components/playground/app/PlaygroundApp.vue` | Add `activePreset`, `applyPreset` to `PlaygroundContext` |
| `src/components/playground/settings/PlaygroundSettings.vue` | Set `available: true` + `component: PlaygroundSettingsPresets` for presets entry |
| `src/components/playground/settings/PlaygroundSettingsPresets.vue` | **New** — preset cards + inline confirmation UI |

---

## Out of Scope

- Combining presets (e.g. Router + Pinia together)
- User-defined custom presets
- Preset-specific version pinning (always uses the currently selected version)
- Animating preset card transitions
