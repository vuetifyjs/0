<script setup lang="ts">
  import { GnDotGrid, GnDocsExampleCode } from '@paper/genesis'

  // Framework
  import { isString, isUndefined } from '@vuetify/v0'

  // Composables
  import { useHighlightCode } from '@/composables/useHighlightCode'

  import { getPluginById, PLUGINS } from '@/data/plugins'
  // Engine — read only: the aside shows the file the builder actually emits, not a mock-up
  // of one, so what you watch being written is what you download.
  import { generateMainTs } from '@/engine/manifest'
  import { defaultConfig as localeDefaults } from '@/plugins/locale/defaults'
  import { defaultConfig as rtlDefaults } from '@/plugins/rtl/defaults'
  import { defaultConfig as themeDefaults } from '@/plugins/theme/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { computed, shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { LocaleConfig } from '@/plugins/locale/defaults'
  import type { RtlConfig } from '@/plugins/rtl/defaults'
  import type { ThemeConfig } from '@/plugins/theme/defaults'

  const store = useBuilderStore()
  const route = useRoute()

  // Saved-with-defaults is not customized: a config only counts as custom when it
  // differs from the plugin's own defaults, not merely because a screen was saved.
  const DEFAULTS = Object.fromEntries(
    Object.entries(import.meta.glob('../../plugins/*/defaults.ts', { eager: true }))
      .map(([path, mod]) => [
        path.split('/').at(-2)!,
        (mod as { defaultConfig?: unknown }).defaultConfig,
      ]),
  )

  function customized (id: string): boolean {
    const saved = store.pluginConfig[id]
    if (isUndefined(saved)) return false

    const meta = getPluginById(id)
    if (!meta?.hasConfig) return false

    const defaults = DEFAULTS[meta.slug]
    if (defaults === undefined) return true

    return JSON.stringify(saved) !== JSON.stringify(defaults)
  }

  const SLATE: Record<string, string> = {
    'primary': '#64748b',
    'background': '#f1f5f9',
    'surface': '#ffffff',
    'surface-variant': '#f1f5f9',
    'divider': '#e2e8f0',
    'on-primary': '#ffffff',
    'on-surface': '#334155',
    'on-surface-variant': '#64748b',
  }

  function configFor<T> (id: string, fallback: T): T {
    if (store.draft?.id === id) return store.draft.config as T
    return (store.pluginConfig[id] as T | undefined) ?? fallback
  }

  const theme = toRef(() => configFor<ThemeConfig>('useTheme', themeDefaults))
  const locale = toRef(() => configFor<LocaleConfig>('useLocale', localeDefaults))
  const rtl = toRef(() => configFor<RtlConfig>('useRtl', rtlDefaults))

  const empty = toRef(() => store.selectedPlugins.size === 0 && store.selectedComponents.size === 0)

  // Step 1 (route === '/builder') is the plugin-picking screen — the manifest preview,
  // the app mock-up, and the customized-chip row all compete with picking plugins, so
  // the aside there is stats only. Every other route that falls back to this component
  // (plugin config screens) keeps the full panel set.
  const step1 = toRef(() => route.path === '/builder')

  const stats = toRef(() => [
    { label: 'Plugins', value: store.selectedPlugins.size },
    { label: 'Components', value: store.selectedComponents.size },
    { label: 'Auto-included', value: store.resolved.autoIncluded.length },
  ])

  const palette = toRef(() => {
    if (!store.isPluginSelected('useTheme')) return SLATE
    return theme.value.themes[theme.value.default]?.colors ?? SLATE
  })

  const dir = toRef(() => store.isPluginSelected('useRtl') && rtl.value.default ? 'rtl' : undefined)

  const localized = toRef(() => store.isPluginSelected('useLocale'))

  const greeting = toRef(() => {
    if (!localized.value) return 'Hello'
    const hello = locale.value.messages[locale.value.default]?.hello
    return isString(hello) ? hello : 'Hello'
  })

  const toast = toRef(() => store.isPluginSelected('useNotifications'))

  const tiles = toRef(() => [...store.selectedComponents].slice(0, 8))
  const extra = toRef(() => Math.max(0, store.selectedComponents.size - 8))

  const rows = toRef(() => PLUGINS
    .filter(p => store.selectedPlugins.has(p.id))
    .map(p => ({
      id: p.id,
      title: p.title,
      customized: customized(p.id),
    })))

  const source = computed(() => generateMainTs(store.selectedPlugins, store.pluginConfig))

  const lines = toRef(() => source.value.split('\n'))

  const { highlightedCode } = useHighlightCode(() => source.value, { lang: 'ts' })

  const expanded = shallowRef(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="!empty" class="panel p-4 flex-shrink-0">
      <div class="grid grid-cols-3 divide-x divide-divider">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="px-2 text-center"
        >
          <p class="t-stat text-on-surface">{{ stat.value }}</p>
          <p class="t-eyebrow text-on-surface-variant mt-2">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- The manifest, above the app preview: the thing being built here is a file, and this
         is that file, generated by the same engine the download uses. Always rendered, even
         with nothing selected — never a blank panel. The dot grid layers only the body below,
         never the toolbar, so "src/main.ts … N lines" stays legible against a flat bar. Step 1
         drops this panel entirely — the manifest is noise a plugin-picking screen doesn't need,
         and its aside is stats only. -->
    <div
      v-if="!step1"
      aria-label="Generated src/main.ts preview"
      class="panel overflow-hidden"
      role="region"
    >
      <div class="flex items-center justify-between gap-3 h-10 px-4 border-b border-divider bg-surface-variant/50 flex-shrink-0">
        <p class="font-mono text-[0.75rem] text-on-surface-variant">src/main.ts</p>
        <p class="t-index text-on-surface-variant">{{ lines.length }} lines</p>
      </div>

      <div class="relative overflow-hidden">
        <GnDotGrid
          aria-hidden="true"
          class="absolute inset-0 pointer-events-none"
          :coverage="30"
          :lines="6"
          origin="top left"
        />

        <p v-if="store.selectedPlugins.size === 0" class="relative t-meta text-on-surface-variant px-4 pt-3 flex-shrink-0">
          Nothing installed yet — pick plugins on the left and watch this file get written.
        </p>

        <GnDocsExampleCode
          v-slot="{ code }"
          v-model:expanded="expanded"
          class="relative [--v0-pre:color-mix(in_srgb,var(--v0-surface)_55%,transparent)]"
          :code="source"
          file-name="src/main.ts"
          hide-filename
          language="ts"
          max-height="24rem"
          peek
          :peek-lines="14"
        >
          <div v-if="highlightedCode" v-html="highlightedCode" />
          <pre v-else><code>{{ code }}</code></pre>
        </GnDocsExampleCode>
      </div>
    </div>

    <MiniFrame v-if="!empty && !step1" title="your-app">
      <div
        class="relative rounded-lg border overflow-hidden transition-colors"
        :dir
        :style="{ backgroundColor: palette.background, borderColor: palette.divider }"
      >
        <div
          class="flex items-center justify-between gap-3 px-3 h-9 border-b transition-colors"
          :style="{ backgroundColor: palette.surface, borderColor: palette.divider }"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="w-3 h-3 rounded-sm flex-shrink-0 transition-colors"
              :style="{ backgroundColor: palette.primary }"
            />

            <span
              class="text-xs font-semibold truncate transition-colors"
              :style="{ color: palette['on-surface'] }"
            >
              Acme
            </span>
          </div>

          <div
            class="flex items-center gap-2.5 text-[10px] transition-colors"
            :style="{ color: palette['on-surface-variant'] }"
          >
            <span>Home</span>
            <span>Docs</span>
            <span>About</span>
          </div>
        </div>

        <div class="p-4 space-y-3" :class="toast ? 'pb-10' : ''">
          <div
            class="rounded-lg border p-3 space-y-2 transition-colors"
            :style="{ backgroundColor: palette.surface, borderColor: palette.divider }"
          >
            <div class="flex items-center gap-2">
              <p
                class="text-sm font-semibold transition-colors"
                :style="{ color: palette['on-surface'] }"
              >
                {{ greeting }}
              </p>

              <span
                v-if="localized"
                class="px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide transition-colors"
                :style="{ backgroundColor: palette.primary, color: palette['on-primary'] }"
              >
                {{ locale.default }}
              </span>
            </div>

            <span
              class="block h-1.5 w-2/3 rounded-full transition-colors"
              :style="{ backgroundColor: palette['surface-variant'] }"
            />

            <span
              class="block h-1.5 w-1/2 rounded-full transition-colors"
              :style="{ backgroundColor: palette['surface-variant'] }"
            />

            <span
              class="inline-flex w-fit px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors"
              :style="{ backgroundColor: palette.primary, color: palette['on-primary'] }"
            >
              Get started
            </span>
          </div>

          <div v-if="tiles.length > 0" class="grid grid-cols-3 gap-1.5">
            <div
              v-for="tile in tiles"
              :key="tile"
              class="rounded-md border px-2 py-2 text-[9px] font-medium truncate transition-colors"
              :style="{ backgroundColor: palette.surface, borderColor: palette.divider, color: palette['on-surface-variant'] }"
            >
              {{ tile }}
            </div>

            <div
              v-if="extra > 0"
              class="rounded-md border border-dashed px-2 py-2 text-[9px] font-medium transition-colors"
              :style="{ borderColor: palette.divider, color: palette['on-surface-variant'] }"
            >
              +{{ extra }} more
            </div>
          </div>

          <p
            v-else
            class="text-[10px] italic transition-colors"
            :style="{ color: palette['on-surface-variant'] }"
          >
            No components yet
          </p>
        </div>

        <span
          v-if="toast"
          class="absolute bottom-2 right-2 px-2.5 py-1 rounded-full text-[9px] font-semibold shadow-sm transition-colors"
          :style="{ backgroundColor: palette.primary, color: palette['on-primary'] }"
        >
          Saved
        </span>
      </div>
    </MiniFrame>

    <!-- Which of them you have already tuned; the manifest above says what is installed,
         this says how much of it is still stock. Step 1's aside is stats only, so this
         chip row is dropped there along with everything else below the stats. -->
    <div v-if="rows.length > 0 && !step1" class="panel px-4 py-3">
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="row in rows"
          :key="row.id"
          :class="row.customized ? 'chip-on' : 'chip-quiet'"
        >
          {{ row.id }}
          <span class="sr-only">{{ row.customized ? 'customized' : 'stock' }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
