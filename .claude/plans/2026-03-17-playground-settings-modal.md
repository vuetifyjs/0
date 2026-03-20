# Playground Settings Modal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a settings modal to `apps/playground/` with version selectors for Vue and @vuetify/v0, backed by npm version fetching, URL hash persistence, and Vuetify play hash compatibility.

**Architecture:** A new `usePlaygroundSettings` composable owns all version state (wrapping `useVueImportMap`) and exposes writable refs that drive a reactive import map. Version selections persist in the URL hash as an optional `settings` field. The modal has a nav-driven layout (Versions implemented, Presets/Export as placeholders) so future sections slot in without restructuring.

**Tech Stack:** Vue 3, `@vue/repl/core` (`useVueImportMap`, `useStore`), UnoCSS, MDI icons (via existing icons plugin), native `<select>` for version dropdowns.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/playground/src/utilities/npm.ts` | Create | `fetchNpmVersions` + `semverGte` |
| `apps/playground/src/composables/usePlayground.ts` | Modify | Add `settings` to `PlaygroundHashData`; add Vuetify play tuple decode branch |
| `apps/playground/src/composables/usePlaygroundSettings.ts` | Create | Owns version refs, wraps `useVueImportMap`, lazy npm fetch |
| `apps/playground/src/composables/usePlaygroundFiles.ts` | Modify | Call `usePlaygroundSettings`; reactive v0 CDN URL; include settings in hash |
| `apps/playground/src/components/playground/app/PlaygroundApp.vue` | Modify | Add version refs to `PlaygroundContext` |
| `apps/playground/src/components/playground/app/PlaygroundAppBar.vue` | Modify | Settings button; local `open` ref |
| `apps/playground/src/components/playground/settings/PlaygroundSettings.vue` | Create | Modal shell + nav |
| `apps/playground/src/components/playground/settings/PlaygroundSettingsVersions.vue` | Create | Version select UI |

---

## Task 1: npm version fetching utility

**File:** Create `apps/playground/src/utilities/npm.ts`

- [ ] **Create the file**

```ts
function semverGte (a: string, b: string): boolean {
  const pa = a.split('-')[0].split('.').map(Number)
  const pb = b.split('-')[0].split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return true
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return false
  }
  return true
}

export async function fetchNpmVersions (
  pkg: string,
  minVersion: string,
  includePrerelease: boolean,
): Promise<string[]> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}`, {
      headers: { Accept: 'application/vnd.npm.install-v1+json' },
    })
    const json = await res.json() as { versions: Record<string, unknown> }
    return Object.keys(json.versions)
      .filter(v => semverGte(v, minVersion))
      .filter(v => includePrerelease || !v.includes('-'))
      .reverse()
  } catch {
    return []
  }
}
```

- [ ] **Commit**

```bash
git add apps/playground/src/utilities/npm.ts
git commit -m "feat(playground): add fetchNpmVersions utility"
```

---

## Task 2: Hash format — add `settings` field and Vuetify play tuple support

**File:** Modify `apps/playground/src/composables/usePlayground.ts`

- [ ] **Add `settings` to `PlaygroundHashData`** (around line 123)

```ts
export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: { vue?: string; v0?: string }
}
```

- [ ] **Add `isUndefined` to the existing import at the top of `usePlayground.ts`**

The file currently imports `isObject` and `isString` from `@vuetify/v0`. Add `isUndefined`:

```ts
import { isObject, isString, isUndefined } from '@vuetify/v0'
```

- [ ] **Add a `isValidSettings` guard** (after `isFileRecord`, before `decodePlaygroundHash`)

```ts
function isValidSettings (v: unknown): v is { vue?: string; v0?: string } {
  if (!isObject(v)) return false
  const s = v as Record<string, unknown>
  return (isUndefined(s.vue) || isString(s.vue))
    && (isUndefined(s.v0) || isString(s.v0))
}
```

- [ ] **Update `decodePlaygroundHash`** — replace the full function body:

```ts
export async function decodePlaygroundHash (hash: string): Promise<PlaygroundHashData | null> {
  try {
    const parsed: unknown = JSON.parse(await atou(hash))

    // Format 1: legacy plain Record<string, string>
    if (isFileRecord(parsed)) {
      return { files: parsed }
    }

    // Format 4: Vuetify play tuple [files, vueVersion, vuetifyVersion, appendJson, activeFile, ...]
    if (Array.isArray(parsed)) {
      const [rawFiles, vueVer, , , rawActive] = parsed as [
        Record<string, unknown>,
        unknown,
        unknown,
        unknown,
        unknown,
      ]
      if (!isFileRecord(rawFiles)) return null
      const files: Record<string, string> = {}
      for (const [key, code] of Object.entries(rawFiles)) {
        files[key.startsWith('src/') ? key : `src/${key}`] = code
      }
      const active = isString(rawActive)
        ? (rawActive.startsWith('src/') ? rawActive : `src/${rawActive}`)
        : undefined
      const settings: PlaygroundHashData['settings'] = {}
      if (isString(vueVer)) settings.vue = vueVer
      return { files, active, settings: Object.keys(settings).length ? settings : undefined }
    }

    // Formats 2 & 3: current object { files, active, imports, settings? }
    if (
      typeof parsed === 'object'
      && parsed !== null
      && 'files' in parsed
      && isFileRecord((parsed as { files: unknown }).files)
    ) {
      const { files, active, imports, settings } = parsed as {
        files: Record<string, string>
        active?: unknown
        imports?: unknown
        settings?: unknown
      }
      return {
        files,
        active: isString(active) ? active : undefined,
        imports: isFileRecord(imports) ? imports : undefined,
        settings: isValidSettings(settings) ? settings : undefined,
      }
    }

    return null
  } catch {
    return null
  }
}
```

- [ ] **Commit**

```bash
git add apps/playground/src/composables/usePlayground.ts
git commit -m "feat(playground): extend hash format with settings + Vuetify play compatibility"
```

---

## Task 3: `usePlaygroundSettings` composable

**File:** Create `apps/playground/src/composables/usePlaygroundSettings.ts`

This composable owns version state. It wraps `useVueImportMap` (moving that call out of `usePlaygroundFiles`).

- [ ] **Create the file**

```ts
// Utilities
import { useVueImportMap } from '@vue/repl/core'
import { shallowRef } from 'vue'

// Data
import { fetchNpmVersions } from '@/utilities/npm'

export function usePlaygroundSettings () {
  const { importMap, vueVersion } = useVueImportMap({
    runtimeDev: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js',
    runtimeProd: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js',
    serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer/dist/server-renderer.esm-browser.js',
  })

  const v0Version = shallowRef('latest')

  const vueVersions = shallowRef<string[]>([])
  const v0Versions = shallowRef<string[]>([])

  const fetching = shallowRef(false)
  let fetched = false

  async function fetchVersions () {
    if (fetched) return
    fetched = true
    fetching.value = true
    const [vue, v0] = await Promise.all([
      fetchNpmVersions('vue', '3.2.0', false),
      fetchNpmVersions('@vuetify/v0', '0.1.0', true),
    ])
    vueVersions.value = vue
    v0Versions.value = v0
    fetching.value = false
  }

  return { importMap, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions }
}
```

- [ ] **Commit**

```bash
git add apps/playground/src/composables/usePlaygroundSettings.ts
git commit -m "feat(playground): add usePlaygroundSettings composable"
```

---

## Task 4: Wire `usePlaygroundFiles` to use `usePlaygroundSettings`

**File:** Modify `apps/playground/src/composables/usePlaygroundFiles.ts`

- [ ] **Replace the `useVueImportMap` import with `usePlaygroundSettings`**

Remove:
```ts
import { compileFile, useStore, useVueImportMap } from '@vue/repl/core'
```

Add:
```ts
import { compileFile, useStore } from '@vue/repl/core'
import { usePlaygroundSettings } from '@/composables/usePlaygroundSettings'
```

- [ ] **Replace `useVueImportMap` call with `usePlaygroundSettings`** (at the top of `usePlaygroundFiles`)

Remove:
```ts
const { importMap, vueVersion } = useVueImportMap({
  runtimeDev: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js',
  runtimeProd: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js',
  serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer/dist/server-renderer.esm-browser.js',
})
```

Add:
```ts
const { importMap, vueVersion, v0Version, vueVersions, v0Versions, fetchVersions } = usePlaygroundSettings()
```

- [ ] **Make `builtinImportMap` reactive to `v0Version`**

Change:
```ts
const builtinImportMap = computed(() => ({
  imports: {
    ...importMap.value?.imports,
    '@vuetify/v0': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@latest/dist/index.mjs',
  },
}))
```

To:
```ts
const builtinImportMap = computed(() => ({
  imports: {
    ...importMap.value?.imports,
    '@vuetify/v0': `https://cdn.jsdelivr.net/npm/@vuetify/v0@${v0Version.value}/dist/index.mjs`,
  },
}))
```

- [ ] **Apply settings from decoded hash in `onMounted`**

Replace the existing `onMounted` block (lines 41–67 in `usePlaygroundFiles.ts`) with the full updated version below. The only additions are the two `settings` assignment lines before `loadExample`, and the `PlaygroundHashData` type import at the top of the file (added in a later step):

```ts
onMounted(async () => {
  const hash = window.location.hash.slice(1)
  const decoded = hash ? await decodePlaygroundHash(hash) : null

  if (decoded) {
    if (decoded.settings?.vue) vueVersion.value = decoded.settings.vue
    if (decoded.settings?.v0) v0Version.value = decoded.settings.v0
    await loadExample(decoded.files, decoded.active)
    if (decoded.imports && Object.keys(decoded.imports).length > 0) {
      extraImports.value = decoded.imports
      store.setImportMap({ imports: decoded.imports }, true)
    }
  } else {
    const theme_ = theme.isDark.value ? 'dark' : 'light'
    await store.setFiles(
      {
        'src/main.ts': createMainTs(theme_),
        'src/uno.config.ts': UNO_CONFIG_TS,
        'src/App.vue': DEFAULT_CODE,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    store.setActive('src/App.vue')
  }

  isReady.value = true
})
```

- [ ] **Include settings in `updateHash`**

Change:
```ts
const updateHash = debounce(async (files: Record<string, string>, active: string | undefined) => {
  if (Object.keys(files).length === 0) return
  const hash = await encodePlaygroundHash({ files, active, imports: extraImports.value })
  history.replaceState(null, '', `#${hash}`)
}, 500)
```

To:
```ts
const updateHash = debounce(async (files: Record<string, string>, active: string | undefined) => {
  if (Object.keys(files).length === 0) return
  const settings: { vue?: string; v0?: string } = {}
  if (vueVersion.value) settings.vue = vueVersion.value
  if (v0Version.value !== 'latest') settings.v0 = v0Version.value
  const data: PlaygroundHashData = { files, active, imports: extraImports.value }
  if (Object.keys(settings).length) data.settings = settings
  const hash = await encodePlaygroundHash(data)
  history.replaceState(null, '', `#${hash}`)
}, 500)
```

Add the `PlaygroundHashData` import at the top:
```ts
import type { PlaygroundHashData } from '@/composables/usePlayground'
```

- [ ] **Add settings to the return value**

Change:
```ts
return { store, isReady, loadExample }
```

To:
```ts
return { store, isReady, loadExample, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions }
```

- [ ] **Commit**

```bash
git add apps/playground/src/composables/usePlaygroundFiles.ts
git commit -m "feat(playground): wire version refs through usePlaygroundFiles"
```

---

## Task 5: Expose settings through `PlaygroundContext`

**File:** Modify `apps/playground/src/components/playground/app/PlaygroundApp.vue`

- [ ] **Add version refs to `PlaygroundContext` interface** (in the `<script lang="ts">` block)

```ts
import type { Ref } from 'vue'

export interface PlaygroundContext {
  store: ReplStore
  isReady: { value: boolean }
  left: { value: boolean }
  tree: { value: boolean }
  bottom: { value: boolean }
  side: { value: boolean }
  editor: { value: boolean }
  vueVersion: Ref<string | null>
  v0Version: Ref<string>
  vueVersions: Ref<string[]>
  v0Versions: Ref<string[]>
  fetching: Ref<boolean>
  fetchVersions: () => Promise<void>
}
```

- [ ] **Destructure the new fields from `usePlaygroundFiles` and pass to `providePlayground`** (in `<script setup>`)

Change:
```ts
const { store, isReady } = usePlaygroundFiles()
```

To:
```ts
const { store, isReady, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions } = usePlaygroundFiles()
```

Change the `providePlayground` call to include the new fields:
```ts
providePlayground({
  store,
  isReady,
  left,
  tree,
  bottom,
  side,
  editor,
  vueVersion,
  v0Version,
  vueVersions,
  v0Versions,
  fetching,
  fetchVersions,
})
```

- [ ] **Commit**

```bash
git add apps/playground/src/components/playground/app/PlaygroundApp.vue
git commit -m "feat(playground): add version refs to PlaygroundContext"
```

---

## Task 6: Settings modal UI

### 6a — Settings button in the app bar

**File:** Modify `apps/playground/src/components/playground/app/PlaygroundAppBar.vue`

- [ ] **Add `open` ref and wire the settings button**

Add at the top of `<script setup>`:
```ts
import PlaygroundSettings from '@/components/playground/settings/PlaygroundSettings.vue'
import { shallowRef } from 'vue'

const open = shallowRef(false)
```

Add the settings button and `<PlaygroundSettings>` mount immediately before `<AppThemeToggle />` (the last element in the right-side button group). The right-side group ends at line 103 in the current template — insert before `<AppThemeToggle />`:

```html
<button
  :aria-pressed="open"
  class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
  :class="open ? 'opacity-80' : 'opacity-50'"
  title="Settings"
  type="button"
  @click="open = true"
>
  <AppIcon icon="cog" />
</button>

<PlaygroundSettings v-if="open" @close="open = false" />
```

- [ ] **Commit**

```bash
git add apps/playground/src/components/playground/app/PlaygroundAppBar.vue
git commit -m "feat(playground): add settings button to app bar"
```

### 6b — Modal shell with left nav

**File:** Create `apps/playground/src/components/playground/settings/PlaygroundSettings.vue`

- [ ] **Create the file**

```vue
<script setup lang="ts">
  // Components
  import PlaygroundSettingsVersions from './PlaygroundSettingsVersions.vue'
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'

  // Utilities
  import { shallowRef } from 'vue'

  defineEmits<{ close: [] }>()

  const active = shallowRef('versions')

  const sections = [
    { id: 'versions', label: 'Versions', icon: 'cog', component: PlaygroundSettingsVersions, available: true },
    { id: 'presets', label: 'Presets', icon: 'folder', component: null, available: false },
    { id: 'export', label: 'Export', icon: 'file-plus', component: null, available: false },
  ] as const
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div class="relative bg-surface border border-divider rounded-lg shadow-xl w-[560px] max-h-[80vh] flex overflow-hidden">
        <!-- Left nav -->
        <nav class="w-40 shrink-0 border-r border-divider flex flex-col py-2">
          <button
            v-for="section in sections"
            :key="section.id"
            class="flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
            :class="[
              section.available ? 'cursor-pointer hover:bg-surface-tint' : 'cursor-default opacity-40',
              active === section.id ? 'bg-surface-tint opacity-100' : '',
            ]"
            :disabled="!section.available"
            type="button"
            @click="section.available && (active = section.id)"
          >
            <AppIcon :icon="section.icon" :size="16" />
            <span>{{ section.label }}</span>
            <span
              v-if="!section.available"
              class="ml-auto text-[10px] opacity-60 border border-current rounded px-1"
            >soon</span>
          </button>
        </nav>

        <!-- Content -->
        <div class="flex-1 flex flex-col min-h-0">
          <div class="flex items-center justify-between px-4 py-3 border-b border-divider">
            <h2 class="text-sm font-medium">
              {{ sections.find(s => s.id === active)?.label }}
            </h2>
            <AppCloseButton @click="$emit('close')" />
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <component
              :is="sections.find(s => s.id === active)?.component"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
```

- [ ] **Commit**

```bash
git add apps/playground/src/components/playground/settings/PlaygroundSettings.vue
git commit -m "feat(playground): add settings modal shell"
```

### 6c — Versions section

**File:** Create `apps/playground/src/components/playground/settings/PlaygroundSettingsVersions.vue`

- [ ] **Create the file**

```vue
<script setup lang="ts">
  // Components
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { onMounted } from 'vue'

  const playground = usePlayground()

  onMounted(() => playground.fetchVersions())
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Vue version -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium opacity-60 uppercase tracking-wide">Vue</label>
      <div v-if="playground.fetching.value" class="version-select-skeleton" />
      <select
        v-else
        class="version-select"
        :value="playground.vueVersion.value ?? ''"
        @change="playground.vueVersion.value = ($event.target as HTMLSelectElement).value || null"
      >
        <option value="">Latest</option>
        <!-- If fetch failed, vueVersions is empty — only the Latest option shows -->
        <option
          v-for="v in playground.vueVersions.value"
          :key="v"
          :value="v"
        >{{ v }}</option>
      </select>
    </div>

    <!-- v0 version -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium opacity-60 uppercase tracking-wide">@vuetify/v0</label>
      <div v-if="playground.fetching.value" class="version-select-skeleton" />
      <select
        v-else
        class="version-select"
        :value="playground.v0Version.value"
        @change="playground.v0Version.value = ($event.target as HTMLSelectElement).value"
      >
        <option value="latest">Latest</option>
        <!-- If fetch failed, v0Versions is empty — only the Latest option shows -->
        <option
          v-for="v in playground.v0Versions.value"
          :key="v"
          :value="v"
        >{{ v }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.version-select {
  appearance: none;
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  color: var(--v0-on-surface);
  cursor: pointer;
  font-size: 13px;
  padding: 6px 10px;
  width: 100%;
}

.version-select:focus {
  outline: 2px solid var(--v0-primary);
  outline-offset: -1px;
}

.version-select-skeleton {
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  height: 32px;
  opacity: 0.5;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.25; }
}
</style>
```

- [ ] **Commit**

```bash
git add apps/playground/src/components/playground/settings/PlaygroundSettingsVersions.vue
git commit -m "feat(playground): add versions section to settings modal"
```

---

## Task 7: Verify

- [ ] **Run the playground dev server**

```bash
pnpm dev
```

Expected: playground loads at `http://localhost:5173` (or similar), no console errors.

- [ ] **Check default behavior** — open playground without a hash. Verify sandbox loads normally with default Vue/v0 versions.

- [ ] **Open settings modal** — click the gear icon. Verify modal opens, nav shows Versions / Presets (disabled) / Export (disabled).

- [ ] **Check version loading** — Versions section shows loading skeletons, then populates with version lists from npm.

- [ ] **Select a Vue version** — pick an older version (e.g. 3.4.0). Verify the sandbox recompiles and the hash in the URL now includes `settings`.

- [ ] **Select a v0 version** — pick a specific version. Verify hash updates.

- [ ] **Reload with the new hash** — copy the URL and reload. Verify both version selectors show the pinned versions on open.

- [ ] **Test Vuetify play hash** — paste the following hash and verify the files load:

```
#eNqlV+tu2zYUfhXOHWAFsKQkbVbUSNpkW4tuaIdg7QqsdX8w0nHMRiI1knaTGX73fbzIli/pHPSHYfFcvnPh4eHhp3lP1I3SNq15k30xSvaGvflIMjaKDDPqDZmnONpsSm496k2sbcwwz4tSQq2kSsx0Jsnmsqnzc4jleiqtqCktVX3+ODvJjk/yUhjbpWdk6vRKq6+GNFBGvUHHTg7ijHSqSZakSe9rd0NtzfYG75v2rRjf7WEzSp4/yQ6zw2AlktKKXxlnwkM75MVILnqDXiXkjdlIdmF8oj+1DnyXTQ/mkD4Hg0YX+UXTZBCCxVNLdVNxS8+dyOksLbnlqeVXFQXrwwlx5MecwY3wFdDAEdB1dOhLVxqBXJI0wt6BXqi64YVtGU48vSHHkbxG6USYWl2Jihx1WlUtNRCxH8RvGiWkBd/UgetdhbOt6+xR8CxryL7SAvtZOSNzVqhqWktkuhdVGJvP2Y8xPRlyBf27rC7ZiyibWWErYkPWv8zeZ322wC55W/lantaMu7gyxCmUdNmY+0DXjK6EZ6kYQ2bLBVNfyPKvpqPjN0MUSqZXVjIj/nUZMjV3KWKO7mCoFEgvyx+kVZcitZqbSVpwuaa9FSVIpZixouLGhVam44pu2TVPj6E3S6kyK0lveofVVtmppkfpEUiWbt1+vgzeN5oa7Jl3+/6ggLxasw0jXc62vS43mv6VKrLLEoyKqlIaPNJaocF0WRsubmRwJdlNJRLX1sp6Wk/z7ikDaY2PpSm0aCwzZKeN14BVY1k8fuysbQxz5qvVFas7gf0B45W4llgby7VbG/RsZ2TIxhx7NWA4fmC744fajg1uBfNGXE+6MAgZq6ADEng7lF7TN7QmgblD7ZIsaw/rPcqd47wL4SIcuXuU44FsFdH8VpkMDaubSJcRKL0iLYHgY3X5UF+xCjFgeXxY1Fh33ALxb1ra6AC9k/yGWLst9+Cd7ML7Q+2Ae+vcJs07WG9xTKZOfQn3095wl8pOlEtcxzFmFau3MJ/sH/LHj7vi3Q377AGZbASqfgv6Z+0+BkzIUmgqHGuJ/nh/9AvxMOijk72hL9EytKpFd9O+BX28P/RFpYh9WK+HFvq70vE7Osy9+dhG/r/qwKE7zUM3Qx+Ls0fNBa5Zg9kjzJSwXuCWt4ShhC3YGDljfdyP/ZFcCsTrcsnO2hFnJeS0W2Ycb1ZM0Hw3BWUkQw/gkD9bWU7wOxhJUDPwx+I689fAa46oUH5njNjZc98+VEWBlxAUgsrUUBI9WtJqhdk26T/Cdx/EGL13I4SvqVYzemfvKnrPrxPIXLp6MZThTks+VYqXrxQgDrAV+P7NGU8OPnsD46n0/Y2tg7DkIIznIUYLyhkrVTGtSdrsnynpu3e4+QoL7/uP2jHRTggjuHEYZkJknbsY18Ys+QEIB7Bhp9q3TyyzhmNiti8r6AAz2P9lIqoyccKYMdf8c5577zwySyaaxtHHAMskfWUx8CTRhPzOcFFp+gI3D1zS43sjhOTG5W5MYQOjNwluKXkT3GdeFP5VEMeFuAyuw3TOgOv+OlReli9nQHuDUZokIVMuCNR5dK4Lvy3rS8ML+wDiTNy6e6XKuwwVgcOSOADPX+zMmtv75X7GXK1nM+m3D4MxZE12rdR1RbwRGPpVnWPwfzHmtcAw/Ke6UlYNjw4PB4/xe4LfCX5P8Xt2eOgStm3f19u+Dux+gWFO8q6dP81unTs4+7jFBK9KMrix3TRlshrtALzoRDwm7Xy8q0982GgGq1YwknTrRUOttF2jPeZRMfEB+aJfPmZLGvNpZd8HYhx2YnfMc79JWLmN6i0GvfCKhKv+zdUbhOFq7WXV0qIPvcF8+TmMaovP/wFtIw+A
```

Expected: files load into the editor (they may have import errors since this is a Vuetify playground snippet, but the files should be present and visible).

- [ ] **Run typecheck**

```bash
pnpm typecheck
```

Expected: no new type errors.
