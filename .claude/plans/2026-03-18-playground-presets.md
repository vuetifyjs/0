# Playground Presets Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four preset configurations (Default, Vue Router, Pinia, Vuetify) to the playground settings modal, each resetting the REPL with a fresh template and appropriate CDN imports.

**Architecture:** Preset definitions live in `src/data/presets.ts`. `createMainTs` gains an optional `MainOptions` arg for conditional plugin setup. `usePlaygroundFiles` gets `activePreset` (persisted in URL hash) and `applyPreset` (resets files/imports/CSS). A new `PlaygroundSettingsPresets.vue` renders preset cards with inline confirmation before applying.

**Tech Stack:** Vue 3, `@vue/repl/core` (`useStore` — `store.setImportMap`, `store.setLinks`), UnoCSS, existing icons plugin (`'editor'`, `'folder'`, `'cog'`, `'lang-vue'`).

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/playground/src/data/playground-defaults.ts` | Modify | Extend `createMainTs` with `MainOptions` |
| `apps/playground/src/data/presets.ts` | Create | `PresetDefinition` interface + 4 preset objects |
| `apps/playground/src/composables/usePlayground.ts` | Modify | Add `preset?` to hash `settings`; update `isValidSettings` |
| `apps/playground/src/composables/usePlaygroundFiles.ts` | Modify | Add `activePreset`, `applyPreset`; update `loadExample`, `updateHash`, theme watcher |
| `apps/playground/src/components/playground/app/PlaygroundApp.vue` | Modify | Add `activePreset`, `applyPreset` to `PlaygroundContext` |
| `apps/playground/src/components/playground/settings/PlaygroundSettings.vue` | Modify | Remove `as const`, enable presets section |
| `apps/playground/src/components/playground/settings/PlaygroundSettingsPresets.vue` | Create | Preset cards + inline confirmation UI |

---

## Task 1: Extend `createMainTs` with `MainOptions`

**File:** Modify `apps/playground/src/data/playground-defaults.ts`

The current `createMainTs(defaultTheme)` generates a fixed main.ts. We need it to optionally install vue-router, pinia, or vuetify.

- [ ] **Add the `MainOptions` interface and update the function signature**

Replace the current function declaration:
```ts
export function createMainTs (defaultTheme: 'light' | 'dark' = 'light'): string {
```

With:
```ts
export interface MainOptions {
  router?: boolean
  pinia?: boolean
  vuetify?: boolean
}

export function createMainTs (defaultTheme: 'light' | 'dark' = 'light', options?: MainOptions): string {
```

- [ ] **Inject conditional imports and plugin calls into the returned string**

The function currently returns a template literal. Update it so that extra imports appear after `import './uno.config.ts'` and extra `app.use()` calls appear after `app.use(theme)`:

```ts
export function createMainTs (defaultTheme: 'light' | 'dark' = 'light', options?: MainOptions): string {
  const extraImports: string[] = []
  const extraPlugins: string[] = []

  if (options?.router) {
    extraImports.push(`import router from './router'`)
    extraPlugins.push(`app.use(router)`)
  }
  if (options?.pinia) {
    extraImports.push(`import { createPinia } from 'pinia'`)
    extraPlugins.push(`app.use(createPinia())`)
  }
  if (options?.vuetify) {
    extraImports.push(`import { createVuetify } from 'vuetify'`)
    extraPlugins.push(`app.use(createVuetify())`)
  }

  const importBlock = extraImports.length ? '\n' + extraImports.join('\n') : ''
  const pluginBlock = extraPlugins.length ? extraPlugins.join('\n') + '\n' : ''

  return `import { createApp } from 'vue'
import App from './App.vue'
import { createThemePlugin } from '@vuetify/v0'
import './uno.config.ts'${importBlock}

const theme = createThemePlugin({
  default: '${defaultTheme}',
  themes: {
    light: {
      dark: false,
      colors: {
        'primary': '#3b82f6',
        'secondary': '#64748b',
        'accent': '#6366f1',
        'error': '#ef4444',
        'info': '#1867c0',
        'success': '#22c55e',
        'warning': '#f59e0b',
        'background': '#ffffff',
        'surface': '#ffffff',
        'surface-tint': '#f5f5f5',
        'surface-variant': '#e8e8e8',
        'divider': '#e0e0e0',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-accent': '#1a1a1a',
        'on-error': '#ffffff',
        'on-info': '#ffffff',
        'on-success': '#1a1a1a',
        'on-warning': '#1a1a1a',
        'on-background': '#212121',
        'on-surface': '#212121',
        'on-surface-variant': '#666666',
      },
    },
    dark: {
      dark: true,
      colors: {
        'primary': '#c4b5fd',
        'secondary': '#94a3b8',
        'accent': '#c084fc',
        'error': '#f87171',
        'info': '#38bdf8',
        'success': '#4ade80',
        'warning': '#fb923c',
        'background': '#121212',
        'surface': '#1a1a1a',
        'surface-tint': '#2a2a2a',
        'surface-variant': '#1e1e1e',
        'divider': '#404040',
        'on-primary': '#1a1a1a',
        'on-secondary': '#ffffff',
        'on-accent': '#ffffff',
        'on-error': '#1a1a1a',
        'on-info': '#1a1a1a',
        'on-success': '#1a1a1a',
        'on-warning': '#1a1a1a',
        'on-background': '#e0e0e0',
        'on-surface': '#e0e0e0',
        'on-surface-variant': '#a0a0a0',
      },
    },
  },
})

const app = createApp(App)
app.use(theme)
${pluginBlock}app.mount('#app')
`
}
```

- [ ] **Commit**

```bash
git add apps/playground/src/data/playground-defaults.ts
git commit -m "chore(playground): extend createMainTs with MainOptions for router/pinia/vuetify"
```

---

## Task 2: Create preset definitions

**File:** Create `apps/playground/src/data/presets.ts`

All preset template files are embedded as raw strings. Icons reference names from the existing icon map (`'editor'`, `'folder'`, `'cog'`, `'lang-vue'`).

- [ ] **Create the file with all four preset definitions**

```ts
import type { MainOptions } from '@/data/playground-defaults'

export interface PresetDefinition {
  id: string
  label: string
  icon: string
  description: string
  mainOptions?: MainOptions
  files: Record<string, string>
  imports?: Record<string, string>
  css?: string[]
}

// ── Preset file templates ────────────────────────────────────────────────

const DEFAULT_APP = `<script lang="ts" setup>
  import { createSingle } from '@vuetify/v0'

  const single = createSingle({ mandatory: 'force' })

  single.onboard([
    { id: 'home', value: 'Home' },
    { id: 'profile', value: 'Profile' },
    { id: 'settings', value: 'Settings' },
  ])

  const tabs = single.values()
</script>

<template>
  <div class="p-6">
    <div class="flex border-b border-divider mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="tab.isSelected.value
          ? 'text-primary border-primary'
          : 'text-on-surface-variant border-transparent hover:text-on-surface'"
        @click="tab.toggle()"
      >
        {{ tab.value }}
      </button>
    </div>

    <p class="text-sm text-on-surface-variant">
      Active tab: <strong class="text-on-surface">{{ single.selectedId.value }}</strong>
    </p>
  </div>
</template>
`

const ROUTER_APP = `<script lang="ts" setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="p-6">
    <nav class="flex gap-4 mb-6 border-b border-divider pb-4">
      <RouterLink
        class="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
        active-class="text-primary"
        to="/"
      >Home</RouterLink>
      <RouterLink
        class="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
        active-class="text-primary"
        to="/about"
      >About</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
`

const ROUTER_ROUTER_TS = `import { createMemoryHistory, createRouter } from 'vue-router'
import Home from './Home.vue'
import About from './About.vue'

export default createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
  ],
})
`

const ROUTER_HOME = `<template>
  <div>
    <h1 class="text-xl font-semibold text-on-surface">Home</h1>
    <p class="mt-2 text-sm text-on-surface-variant">Welcome to your Vue Router playground.</p>
  </div>
</template>
`

const ROUTER_ABOUT = `<template>
  <div>
    <h1 class="text-xl font-semibold text-on-surface">About</h1>
    <p class="mt-2 text-sm text-on-surface-variant">This is the about page.</p>
  </div>
</template>
`

const PINIA_APP = `<script lang="ts" setup>
  import { useCounterStore } from './counter'

  const counter = useCounterStore()
</script>

<template>
  <div class="p-6 flex flex-col gap-4">
    <h1 class="text-xl font-semibold text-on-surface">Counter</h1>
    <div class="text-5xl font-mono text-primary">{{ counter.count }}</div>
    <div class="flex gap-3">
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium"
        @click="counter.decrement"
      >−</button>
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium"
        @click="counter.increment"
      >+</button>
      <button
        class="px-4 py-2 rounded border border-divider text-on-surface text-sm font-medium"
        @click="counter.reset"
      >Reset</button>
    </div>
    <p class="text-sm text-on-surface-variant">Double: {{ counter.doubleCount }}</p>
  </div>
</template>
`

const PINIA_COUNTER = `import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment () { count.value++ }
  function decrement () { count.value-- }
  function reset () { count.value = 0 }

  return { count, doubleCount, increment, decrement, reset }
})
`

const VUETIFY_APP = `<template>
  <v-app>
    <v-main class="pa-6">
      <v-card max-width="400">
        <v-card-title>Hello Vuetify</v-card-title>
        <v-card-text>You're using Vuetify 4 inside the @vuetify/v0 playground.</v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="flat">Click me</v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>
`

// ── Preset registry ──────────────────────────────────────────────────────

export const PRESETS: PresetDefinition[] = [
  {
    id: 'default',
    label: 'Default',
    icon: 'editor',
    description: 'Headless composables with @vuetify/v0',
    files: { 'src/App.vue': DEFAULT_APP },
  },
  {
    id: 'router',
    label: 'Vue Router',
    icon: 'folder',
    description: 'Multi-page app with vue-router',
    mainOptions: { router: true },
    files: {
      'src/App.vue': ROUTER_APP,
      'src/router.ts': ROUTER_ROUTER_TS,
      'src/Home.vue': ROUTER_HOME,
      'src/About.vue': ROUTER_ABOUT,
    },
    imports: {
      'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@latest/dist/vue-router.esm-browser.js',
    },
  },
  {
    id: 'pinia',
    label: 'Pinia',
    icon: 'cog',
    description: 'State management with pinia',
    mainOptions: { pinia: true },
    files: {
      'src/App.vue': PINIA_APP,
      'src/counter.ts': PINIA_COUNTER,
    },
    imports: {
      'pinia': 'https://cdn.jsdelivr.net/npm/pinia@latest/dist/pinia.esm-browser.mjs',
    },
  },
  {
    id: 'vuetify',
    label: 'Vuetify',
    icon: 'lang-vue',
    description: 'Material Design components with Vuetify 4',
    mainOptions: { vuetify: true },
    files: { 'src/App.vue': VUETIFY_APP },
    imports: {
      'vuetify': 'https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify.esm.js',
    },
    css: ['https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify.min.css'],
  },
]
```

- [ ] **Commit**

```bash
git add apps/playground/src/data/presets.ts
git commit -m "chore(playground): add preset definitions (default/router/pinia/vuetify)"
```

---

## Task 3: Update hash types for preset

**File:** Modify `apps/playground/src/composables/usePlayground.ts`

- [ ] **Add `preset?` to `PlaygroundHashData.settings`**

Change:
```ts
export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: { vue?: string, v0?: string }
}
```

To:
```ts
export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: { vue?: string, v0?: string, preset?: string }
}
```

- [ ] **Update `isValidSettings` to allow `preset`**

Change:
```ts
function isValidSettings (v: unknown): v is { vue?: string, v0?: string } {
  if (!isObject(v)) return false
  const s = v as Record<string, unknown>
  return (isUndefined(s.vue) || isString(s.vue))
    && (isUndefined(s.v0) || isString(s.v0))
}
```

To:
```ts
function isValidSettings (v: unknown): v is { vue?: string, v0?: string, preset?: string } {
  if (!isObject(v)) return false
  const s = v as Record<string, unknown>
  return (isUndefined(s.vue) || isString(s.vue))
    && (isUndefined(s.v0) || isString(s.v0))
    && (isUndefined(s.preset) || isString(s.preset))
}
```

- [ ] **Commit**

```bash
git add apps/playground/src/composables/usePlayground.ts
git commit -m "chore(playground): add preset field to hash settings"
```

---

## Task 4: Wire `activePreset` and `applyPreset` into `usePlaygroundFiles`

**File:** Modify `apps/playground/src/composables/usePlaygroundFiles.ts`

This is the largest task. Read the file carefully before making changes.

- [ ] **Add imports at the top**

Add after the existing `// Data` import block:

```ts
import { PRESETS } from '@/data/presets'
import type { MainOptions } from '@/data/playground-defaults'
```

- [ ] **Declare `activePreset` ref** (add after `const extraImports = ...` line)

```ts
const activePreset = shallowRef('default')
```

- [ ] **Update `loadExample` to use `activePreset` for `createMainTs`**

In `loadExample`, change:
```ts
'src/main.ts': createMainTs(theme_),
```
To:
```ts
'src/main.ts': createMainTs(theme_, PRESETS.find(p => p.id === activePreset.value)?.mainOptions),
```

- [ ] **Restore `activePreset` from hash in `onMounted` — before `loadExample`**

In the `if (decoded)` branch, add the preset restore line before the existing version restores:
```ts
if (decoded) {
  if (decoded.settings?.preset) activePreset.value = decoded.settings.preset  // must be first
  if (decoded.settings?.vue) vueVersion.value = decoded.settings.vue
  if (decoded.settings?.v0) v0Version.value = decoded.settings.v0
  await loadExample(decoded.files, decoded.active)
  if (decoded.imports && Object.keys(decoded.imports).length > 0) {
    extraImports.value = decoded.imports
    store.setImportMap({ imports: decoded.imports }, true)
  }
}
```

- [ ] **Include `activePreset` in `updateHash`**

Change:
```ts
const settings: { vue?: string, v0?: string } = {}
if (vueVersion.value) settings.vue = vueVersion.value
if (v0Version.value !== 'latest') settings.v0 = v0Version.value
const data: PlaygroundHashData = { files, active, imports: extraImports.value }
if (Object.keys(settings).length > 0) data.settings = settings
```

To:
```ts
const settings: { vue?: string, v0?: string, preset?: string } = {}
if (vueVersion.value) settings.vue = vueVersion.value
if (v0Version.value !== 'latest') settings.v0 = v0Version.value
if (activePreset.value !== 'default') settings.preset = activePreset.value
const data: PlaygroundHashData = { files, active, imports: extraImports.value }
if (Object.keys(settings).length > 0) data.settings = settings
```

- [ ] **Track `activePreset` in the `watchEffect`** so hash updates on preset change

Inside the `watchEffect` body, add `activePreset.value` alongside the existing version tracking lines:
```ts
watchEffect(() => {
  // Track refs so hash updates when they change
  vueVersion.value // eslint-disable-line @typescript-eslint/no-unused-expressions
  v0Version.value // eslint-disable-line @typescript-eslint/no-unused-expressions
  activePreset.value // eslint-disable-line @typescript-eslint/no-unused-expressions
  const aliases = ...
```

- [ ] **Update the theme watcher to pass `mainOptions`**

Change:
```ts
watch(theme.isDark, isDark => {
  if (!isReady.value) return
  const file = store.files['src/main.ts']
  if (file) {
    file.code = createMainTs(isDark ? 'dark' : 'light')
    compileFile(store, file)
  }
})
```

To:
```ts
watch(theme.isDark, isDark => {
  if (!isReady.value) return
  const file = store.files['src/main.ts']
  if (file) {
    const mainOptions = PRESETS.find(p => p.id === activePreset.value)?.mainOptions
    file.code = createMainTs(isDark ? 'dark' : 'light', mainOptions)
    compileFile(store, file)
  }
})
```

- [ ] **Add `applyPreset` function** (add before the `return` statement)

```ts
async function applyPreset (id: string) {
  const preset = PRESETS.find(p => p.id === id)
  if (!preset) return

  // Set activePreset first — loadExample reads it via closure for createMainTs
  activePreset.value = id

  // Sync extra imports ref (drives hash encoding)
  extraImports.value = preset.imports ?? undefined

  // Reset file state with preset template
  await loadExample(preset.files)

  // Apply extra JS imports to the store's import map
  store.setImportMap({ imports: preset.imports ?? {} }, true)

  // Apply (or clear) CSS links
  store.setLinks({ css: preset.css ?? [] })
}
```

- [ ] **Add `activePreset` and `applyPreset` to the return value**

Change:
```ts
return { store, isReady, loadExample, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions }
```

To:
```ts
return { store, isReady, loadExample, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions, activePreset, applyPreset }
```

- [ ] **Commit**

```bash
git add apps/playground/src/composables/usePlaygroundFiles.ts
git commit -m "chore(playground): add activePreset and applyPreset to usePlaygroundFiles"
```

---

## Task 5: Expose `activePreset` and `applyPreset` through `PlaygroundContext`

**File:** Modify `apps/playground/src/components/playground/app/PlaygroundApp.vue`

- [ ] **Add the two new fields to `PlaygroundContext`** (in the `<script lang="ts">` block)

Add after `fetchVersions: () => Promise<void>`:
```ts
activePreset: ShallowRef<string>
applyPreset: (id: string) => Promise<void>
```

The `ShallowRef` type import: add it alongside the existing `Ref` import:
```ts
import type { Ref, ShallowRef } from 'vue'
```

- [ ] **Destructure from `usePlaygroundFiles` and pass to `providePlayground`** (in `<script setup>`)

Change:
```ts
const { store, isReady, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions } = usePlaygroundFiles()
```

To:
```ts
const { store, isReady, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions, activePreset, applyPreset } = usePlaygroundFiles()
```

Add both to `providePlayground({...})`:
```ts
activePreset,
applyPreset,
```

- [ ] **Commit**

```bash
git add apps/playground/src/components/playground/app/PlaygroundApp.vue
git commit -m "chore(playground): expose activePreset and applyPreset through PlaygroundContext"
```

---

## Task 6: Enable presets section in settings modal

**File:** Modify `apps/playground/src/components/playground/settings/PlaygroundSettings.vue`

- [ ] **Import the new presets component and remove `as const`**

Add the import at the top of `<script setup>`:
```ts
import PlaygroundSettingsPresets from './PlaygroundSettingsPresets.vue'
```

The `sections` array uses `as const` which would type `component: null` as a literal `null`, causing a TypeScript error when we assign `PlaygroundSettingsPresets`. Remove `as const` and add an explicit type instead.

Replace the `sections` declaration:
```ts
const sections = [
  { id: 'versions', label: 'Versions', icon: 'cog', component: PlaygroundSettingsVersions, available: true },
  { id: 'presets', label: 'Presets', icon: 'folder', component: null, available: false },
  { id: 'export', label: 'Export', icon: 'file-plus', component: null, available: false },
] as const
```

With:
```ts
interface Section {
  id: string
  label: string
  icon: string
  component: Component | null
  available: boolean
}

const sections: Section[] = [
  { id: 'versions', label: 'Versions', icon: 'cog', component: PlaygroundSettingsVersions, available: true },
  { id: 'presets', label: 'Presets', icon: 'folder', component: PlaygroundSettingsPresets, available: true },
  { id: 'export', label: 'Export', icon: 'file-plus', component: null, available: false },
]
```

Also add `Component` to the Vue import:
```ts
import { type Component, shallowRef } from 'vue'
```

- [ ] **Commit**

```bash
git add apps/playground/src/components/playground/settings/PlaygroundSettings.vue
git commit -m "chore(playground): enable presets section in settings modal"
```

---

## Task 7: Create `PlaygroundSettingsPresets.vue`

**File:** Create `apps/playground/src/components/playground/settings/PlaygroundSettingsPresets.vue`

- [ ] **Create the file**

```vue
<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Data
  import { PRESETS } from '@/data/presets'

  // Utilities
  import { shallowRef } from 'vue'

  const playground = usePlayground()

  // ID of the preset currently showing the inline confirmation, or null
  const confirming = shallowRef<string | null>(null)

  function onPresetClick (id: string) {
    if (id === playground.activePreset.value) return
    confirming.value = confirming.value === id ? null : id
  }

  async function onApply (id: string) {
    confirming.value = null
    await playground.applyPreset(id)
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="preset in PRESETS"
      :key="preset.id"
      class="rounded-lg border transition-colors"
      :class="playground.activePreset.value === preset.id
        ? 'border-primary bg-surface-tint'
        : 'border-divider'"
    >
      <!-- Preset card header -->
      <button
        class="w-full flex items-center gap-3 px-3 py-3 text-left"
        :class="playground.activePreset.value === preset.id ? 'cursor-default' : 'cursor-pointer'"
        type="button"
        @click="onPresetClick(preset.id)"
      >
        <AppIcon
          :icon="preset.icon"
          :size="18"
          class="shrink-0"
          :class="playground.activePreset.value === preset.id ? 'text-primary' : 'text-on-surface-variant'"
        />
        <div class="flex-1 min-w-0">
          <div
            class="text-sm font-medium"
            :class="playground.activePreset.value === preset.id ? 'text-primary' : 'text-on-surface'"
          >{{ preset.label }}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">{{ preset.description }}</div>
        </div>
        <!-- Active checkmark -->
        <svg
          v-if="playground.activePreset.value === preset.id"
          aria-hidden="true"
          class="shrink-0 text-primary"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <!-- Inline confirmation -->
      <div
        v-if="confirming === preset.id"
        class="px-3 pb-3 flex flex-col gap-2 border-t border-divider pt-3"
      >
        <p class="text-xs text-on-surface-variant">
          Applying <strong class="text-on-surface">{{ preset.label }}</strong> will reset your playground. Any unsaved work will be lost.
        </p>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 rounded text-xs font-medium bg-primary text-on-primary"
            type="button"
            @click="onApply(preset.id)"
          >Apply</button>
          <button
            class="px-3 py-1.5 rounded text-xs font-medium border border-divider text-on-surface"
            type="button"
            @click="confirming = null"
          >Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Commit**

```bash
git add apps/playground/src/components/playground/settings/PlaygroundSettingsPresets.vue
git commit -m "chore(playground): add PlaygroundSettingsPresets component"
```

---

## Task 8: Verify

- [ ] **Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Start the playground dev server**

```bash
pnpm dev
```

- [ ] **Test Default preset** — Open settings → Presets. Default is active (checkmark visible). No confirmation shown.

- [ ] **Test Vue Router preset** — Click "Vue Router". Confirmation appears. Click Apply. Playground resets with RouterLink nav and Home/About pages. URL hash includes `settings.preset = 'router'`. Check import map contains `vue-router`.

- [ ] **Test Pinia preset** — Apply "Pinia". Counter store renders. Import map contains `pinia`.

- [ ] **Test Vuetify preset** — Apply "Vuetify". `v-app` and `v-card` render. CSS is injected. Import map contains `vuetify`.

- [ ] **Test Cancel** — Click a non-active preset, then click Cancel. Confirmation collapses, active preset unchanged.

- [ ] **Test one confirmation at a time** — With Router confirmation open, click Pinia. Router confirmation collapses, Pinia confirmation opens.

- [ ] **Test hash persistence** — Apply Vue Router. Reload page. URL hash decodes correctly, `activePreset` restores to `'router'`, Presets section shows Router as active.

- [ ] **Test theme switch** — While on Router preset, toggle dark/light mode. `main.ts` regenerates with router imports intact.

- [ ] **Test reset to Default** — Apply Vue Router, then apply Default. Verify import map and CSS links are cleared, and `main.ts` has no router/pinia/vuetify imports.
