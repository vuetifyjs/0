<script setup lang="ts">
  import { mdiCheck, mdiChevronDown, mdiClose, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Checkbox, Input, Select } from '@vuetify/v0'

  import { defaultConfig } from './defaults'

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

  const stored = store.pluginConfig.useTheme as ThemeConfig | undefined
  const initial: ThemeConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive({
    default: initial.default,
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
      <p class="text-on-surface-variant mb-8">
        Define color tokens for light and/or dark themes. These become CSS custom
        properties via <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">--v0-&lt;token&gt;</code>.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Default theme</span>

          <Select.Root v-model="state.default">
            <Select.Activator class="mt-1 flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              <Select.Value v-slot="{ selectedValue }">
                {{ selectedValue }}
              </Select.Value>

              <Select.Placeholder class="text-on-surface-variant">Choose a theme…</Select.Placeholder>

              <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
              </Select.Cue>
            </Select.Activator>

            <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
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

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Target</span>

          <Input.Root v-model="state.target">
            <Input.Control
              class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm outline-none data-[focused]:border-primary transition-colors"
              placeholder="html"
            />
          </Input.Root>
        </label>
      </div>

      <label class="flex items-center gap-2">
        <Checkbox.Root
          v-model="state.foreground"
          class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">
          Auto-generate <code class="text-xs px-1 py-0.5 rounded bg-surface-variant">on-*</code> colors
          <span class="text-on-surface-variant">— applies to every theme</span>
        </span>
      </label>

      <div class="space-y-4">
        <div
          v-for="(theme, themeIndex) in state.themes"
          :key="themeIndex"
          class="border border-divider rounded-lg p-4 space-y-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="block">
                <span class="text-xs uppercase tracking-wide text-on-surface-variant">Theme key</span>

                <Input.Root v-model="theme.key">
                  <Input.Control
                    class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm outline-none data-[focused]:border-primary transition-colors"
                    placeholder="light"
                  />
                </Input.Root>
              </label>

              <label class="flex items-center gap-2 mt-5">
                <Checkbox.Root
                  v-model="theme.dark"
                  class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
              class="text-on-surface-variant hover:text-error p-1"
              :title="`Remove ${theme.key}`"
              @click="removeTheme(themeIndex)"
            >
              <Button.Icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </Button.Icon>
            </Button.Root>
          </div>

          <div>
            <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Color tokens</div>

            <div class="space-y-2">
              <div
                v-for="(color, colorIndex) in theme.colors"
                :key="colorIndex"
                class="flex items-center gap-2"
              >
                <Input.Root v-model="color.name" class="flex-1">
                  <Input.Control
                    :aria-label="`Token ${colorIndex + 1} name`"
                    class="w-full px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono outline-none data-[focused]:border-primary transition-colors"
                    placeholder="primary"
                  />
                </Input.Root>

                <!-- v0 has no color picker; native input is the documented exception -->
                <input
                  v-model="color.value"
                  :aria-label="`${color.name || `Token ${colorIndex + 1}`} color picker`"
                  class="w-10 h-9 rounded border border-divider cursor-pointer"
                  type="color"
                >

                <Input.Root v-model="color.value">
                  <Input.Control
                    :aria-label="`${color.name || 'color'} hex value`"
                    class="w-28 px-2 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono outline-none data-[focused]:border-primary transition-colors"
                    placeholder="#000000"
                  />
                </Input.Root>

                <Button.Root
                  :aria-label="`Remove ${color.name || `token ${colorIndex + 1}`}`"
                  class="text-on-surface-variant hover:text-error p-1"
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
              class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
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
          class="text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
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
