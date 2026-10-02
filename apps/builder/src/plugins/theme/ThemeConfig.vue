<script setup lang="ts">
  import { mdiCheck, mdiChevronDown, mdiClose, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Checkbox, Input, Select, useTheme } from '@vuetify/v0'

  import { defaultConfig, preferred } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, toRef, watch } from 'vue'

  // Types
  import type { ThemeConfig, ThemeEntry } from './defaults'

  interface ColorRow {
    name: string
    value: string
  }

  interface ThemeRow {
    key: string
    dark: boolean
    colors: ColorRow[]
  }

  const store = useBuilderStore()

  // The app's own theme context, not data-theme off the DOM: the header toggle writes
  // through this and persists it, so it is the value the user actually set. Named `app`
  // because `theme` is a config row further down this file.
  const app = useTheme()

  const stored = store.pluginConfig.useTheme as ThemeConfig | undefined
  const initial: ThemeConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive({
    // Read once, on open: following the toggle afterwards would rewrite a choice the user
    // had already made on this screen.
    default: stored ? initial.default : preferred(initial, app.isDark.value),
    target: initial.target,
    foreground: !!initial.foreground,
    themes: Object.entries(initial.themes).map<ThemeRow>(([key, entry]) => ({
      key,
      dark: !!entry.dark,
      colors: Object.entries(entry.colors).map(([name, value]) => ({ name, value })),
    })),
  })

  const themeKeys = toRef(() => state.themes.map(t => t.key).filter(Boolean))

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
      colors: [],
    })
  }

  function removeTheme (index: number) {
    state.themes.splice(index, 1)
  }

  function snapshot (): ThemeConfig {
    const themes: Record<string, ThemeEntry> = {}
    for (const row of state.themes) {
      if (!row.key) continue
      const colors: Record<string, string> = {}
      for (const c of row.colors) {
        if (c.name) colors[c.name] = c.value
      }
      themes[row.key] = {
        dark: row.dark,
        colors,
      }
    }

    return {
      default: state.default,
      target: state.target,
      foreground: state.foreground,
      themes,
    }
  }

  function onSave () {
    store.savePluginConfig('useTheme', snapshot())
  }

  watch(state, () => {
    store.setDraft('useTheme', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useTheme')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useTheme" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Define color tokens for light and/or dark themes. These become CSS custom
        properties via <code class="code-chip">--v0-&lt;token&gt;</code>.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="field">
          <span class="field-label">Default theme</span>

          <Select.Root v-model="state.default">
            <Select.Activator class="field-activator">
              <Select.Value v-slot="{ selectedValue }">
                {{ selectedValue }}
              </Select.Value>

              <Select.Placeholder class="text-on-surface-variant">Choose a theme…</Select.Placeholder>

              <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
              </Select.Cue>
            </Select.Activator>

            <Select.Content class="field-menu" :style="{ minWidth: 'anchor-size(width)' }">
              <Select.Item
                v-for="key in themeKeys"
                :id="key"
                :key
                :value="key"
              >
                <template #default="{ isSelected, isHighlighted }">
                  <div
                    class="px-3 py-2 rounded-md cursor-default select-none text-sm"
                    :class="[
                      isHighlighted
                        ? 'bg-primary text-on-primary'
                        : isSelected
                          ? 'text-primary font-medium'
                          : 'text-on-surface hover:bg-surface-variant',
                    ]"
                  >
                    {{ key }}
                  </div>
                </template>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </label>

        <label class="field">
          <span class="field-label">Target</span>

          <Input.Root v-model="state.target">
            <Input.Control
              class="field-input"
              placeholder="html"
            />
          </Input.Root>
        </label>
      </div>

      <label class="flex items-center gap-2">
        <Checkbox.Root
          v-model="state.foreground"
          class="field-check"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">
          Auto-generate <code class="code-chip">on-*</code> colors
          <span class="text-on-surface-variant">— applies to every theme</span>
        </span>
      </label>

      <div class="space-y-4">
        <div
          v-for="(theme, themeIndex) in state.themes"
          :key="themeIndex"
          class="panel p-4 space-y-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="field">
                <span class="field-label">Theme key</span>

                <Input.Root v-model="theme.key">
                  <Input.Control
                    class="field-input"
                    placeholder="light"
                  />
                </Input.Root>
              </label>

              <label class="flex items-center gap-2">
                <Checkbox.Root
                  v-model="theme.dark"
                  class="field-check"
                >
                  <Checkbox.Indicator class="text-on-primary">
                    <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <span class="text-sm text-on-surface">Dark mode</span>
              </label>
            </div>

            <Button.Root
              v-if="state.themes.length > 1"
              :aria-label="`Remove theme ${theme.key}`"
              class="inline-flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:text-error hover:bg-surface-variant transition-colors duration-150"
              :title="`Remove ${theme.key}`"
              @click="removeTheme(themeIndex)"
            >
              <Button.Icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </Button.Icon>
            </Button.Root>
          </div>

          <div>
            <div class="field-label mb-2">Color tokens</div>

            <div class="space-y-2">
              <!-- Wraps below sm: sharing one row left the name too narrow to tell
                   `on-surface` from `on-surface-variant`, which both truncated the same. -->
              <div
                v-for="(color, colorIndex) in theme.colors"
                :key="colorIndex"
                class="flex flex-wrap items-center gap-2"
              >
                <Input.Root
                  v-model="color.name"
                  class="w-full sm:flex-1 sm:w-auto min-w-0"
                  :label="`${theme.key || 'theme'} token ${colorIndex + 1} name`"
                >
                  <Input.Control
                    class="field-input font-mono"
                    placeholder="primary"
                  />
                </Input.Root>

                <!-- Swatch and hex are two views of one value, so they share one frame. -->
                <div class="flex items-center h-10 rounded-md border border-divider bg-surface overflow-hidden transition-colors duration-150 focus-within:border-primary">
                  <!-- v0 has no color picker; native input is the documented exception.
                       The swatch keeps a hairline of its own, or a #ffffff token renders
                       as nothing against the surface behind it. -->
                  <input
                    v-model="color.value"
                    :aria-label="`${color.name || `Token ${colorIndex + 1}`} color picker`"
                    class="w-9 h-full shrink-0 cursor-pointer border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-1.5 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-[var(--v0-divider)]"
                    type="color"
                  >

                  <Input.Root
                    v-model="color.value"
                    :label="`${color.name || `token ${colorIndex + 1}`} hex value`"
                  >
                    <Input.Control
                      class="w-24 h-10 pr-3 bg-transparent border-0 text-on-surface text-sm font-mono outline-none"
                      placeholder="#000000"
                    />
                  </Input.Root>
                </div>

                <Button.Root
                  :aria-label="`Remove ${color.name || `token ${colorIndex + 1}`}`"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:text-error hover:bg-surface-variant transition-colors duration-150"
                  :title="`Remove ${color.name}`"
                  @click="removeColor(theme, colorIndex)"
                >
                  <Button.Icon>
                    <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
                  </Button.Icon>
                </Button.Root>
              </div>
            </div>

            <Button.Root
              class="btn-outline mt-3 h-9 px-3 text-[0.8125rem]"
              @click="addColor(theme)"
            >
              <Button.Icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
              </Button.Icon>

              <Button.Content>Add color token</Button.Content>
            </Button.Root>
          </div>
        </div>

        <Button.Root
          class="btn-outline h-9 px-3 text-[0.8125rem]"
          @click="addTheme"
        >
          <Button.Icon>
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </Button.Icon>

          <Button.Content>Add theme</Button.Content>
        </Button.Root>
      </div>
    </div>
  </PluginConfigShell>
</template>
