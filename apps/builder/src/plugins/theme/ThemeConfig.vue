<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { computed, reactive } from 'vue'

  // Types
  import type { ThemeConfig, ThemeEntry } from './defaults'

  interface ColorRow {
    name: string
    value: string
  }

  interface ThemeRow {
    key: string
    dark: boolean
    foreground: boolean
    colors: ColorRow[]
  }

  const store = useBuilderStore()

  const stored = store.pluginConfig.useTheme as ThemeConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive({
    default: initial.default,
    target: initial.target,
    themes: Object.entries(initial.themes).map<ThemeRow>(([key, entry]) => ({
      key,
      dark: !!entry.dark,
      foreground: !!entry.foreground,
      colors: Object.entries(entry.colors).map(([name, value]) => ({ name, value })),
    })),
  })

  const themeKeys = computed(() => state.themes.map(t => t.key).filter(Boolean))

  function addColor (theme: ThemeRow) {
    theme.colors.push({ name: '', value: '#000000' })
  }

  function removeColor (theme: ThemeRow, index: number) {
    theme.colors.splice(index, 1)
  }

  function addTheme () {
    state.themes.push({
      key: `theme-${state.themes.length + 1}`,
      dark: false,
      foreground: false,
      colors: [],
    })
  }

  function removeTheme (index: number) {
    state.themes.splice(index, 1)
  }

  function onSave () {
    const themes: Record<string, ThemeEntry> = {}
    for (const row of state.themes) {
      if (!row.key) continue
      const colors: Record<string, string> = {}
      for (const c of row.colors) {
        if (c.name) colors[c.name] = c.value
      }
      themes[row.key] = {
        dark: row.dark,
        foreground: row.foreground,
        colors,
      }
    }

    const config: ThemeConfig = {
      default: state.default,
      target: state.target,
      themes,
    }

    store.savePluginConfig('useTheme', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useTheme" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Define color tokens for light and/or dark themes. These become CSS custom
        properties via <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">--v0-&lt;token&gt;</code>.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Default theme</span>

          <select
            v-model="state.default"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
          >
            <option v-for="key in themeKeys" :key :value="key">{{ key }}</option>
          </select>
        </label>

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Target</span>

          <input
            v-model="state.target"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
            placeholder="html"
          >
        </label>
      </div>

      <div class="space-y-4">
        <div
          v-for="(theme, themeIndex) in state.themes"
          :key="themeIndex"
          class="border border-divider rounded-lg p-4 space-y-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <label class="block">
                <span class="text-xs uppercase tracking-wide text-on-surface-variant">Theme key</span>

                <input
                  v-model="theme.key"
                  class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
                  placeholder="light"
                >
              </label>

              <label class="flex items-center gap-2 mt-5">
                <input v-model="theme.dark" class="w-4 h-4" type="checkbox">
                <span class="text-sm text-on-surface">Dark mode</span>
              </label>

              <label class="flex items-center gap-2 mt-5">
                <input v-model="theme.foreground" class="w-4 h-4" type="checkbox">
                <span class="text-sm text-on-surface">Auto-generate on-* colors</span>
              </label>
            </div>

            <button
              v-if="state.themes.length > 1"
              class="text-on-surface-variant hover:text-error p-1"
              :title="`Remove ${theme.key}`"
              type="button"
              @click="removeTheme(themeIndex)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
            </button>
          </div>

          <div>
            <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Color tokens</div>

            <div class="space-y-2">
              <div
                v-for="(color, colorIndex) in theme.colors"
                :key="colorIndex"
                class="flex items-center gap-2"
              >
                <input
                  v-model="color.name"
                  class="flex-1 px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                  placeholder="primary"
                >

                <input
                  v-model="color.value"
                  class="w-10 h-9 rounded border border-divider cursor-pointer"
                  type="color"
                >

                <input
                  v-model="color.value"
                  class="w-28 px-2 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                  placeholder="#000000"
                >

                <button
                  class="text-on-surface-variant hover:text-error p-1"
                  :title="`Remove ${color.name}`"
                  type="button"
                  @click="removeColor(theme, colorIndex)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
                </button>
              </div>
            </div>

            <button
              class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
              type="button"
              @click="addColor(theme)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
              Add color token
            </button>
          </div>
        </div>

        <button
          class="text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
          type="button"
          @click="addTheme"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          Add theme
        </button>
      </div>
    </div>
  </PluginConfigShell>
</template>
