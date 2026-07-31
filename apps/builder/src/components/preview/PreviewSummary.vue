<script setup lang="ts">
  import { mdiCheck } from '@mdi/js'

  // Framework
  import { isString } from '@vuetify/v0'

  import { PLUGINS } from '@/data/plugins'
  import { defaultConfig as localeDefaults } from '@/plugins/locale/defaults'
  import { defaultConfig as rtlDefaults } from '@/plugins/rtl/defaults'
  import { defaultConfig as themeDefaults } from '@/plugins/theme/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { LocaleConfig } from '@/plugins/locale/defaults'
  import type { RtlConfig } from '@/plugins/rtl/defaults'
  import type { ThemeConfig } from '@/plugins/theme/defaults'

  const store = useBuilderStore()

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
      customized: p.id in store.pluginConfig,
    })))
</script>

<template>
  <div v-if="empty" class="panel px-6 py-12 text-center">
    <p class="t-section text-on-surface mb-1.5">Nothing selected yet</p>
    <p class="t-meta text-on-surface-variant">Pick plugins on the left and your build shows up here.</p>
  </div>

  <div v-else class="space-y-4">
    <div class="panel p-4">
      <div class="grid grid-cols-3 divide-x divide-divider">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="px-2 text-center"
        >
          <p class="text-2xl font-bold text-on-surface tabular-nums leading-none">{{ stat.value }}</p>
          <p class="t-eyebrow text-on-surface-variant mt-2">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <MiniFrame title="your-app">
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

    <div v-if="rows.length > 0" class="panel overflow-hidden">
      <div class="flex items-center h-10 px-4 border-b border-divider bg-surface-variant/50">
        <p class="t-eyebrow text-on-surface">Subsystems</p>
      </div>

      <ul class="divide-y divide-divider">
        <li
          v-for="row in rows"
          :key="row.id"
          class="flex items-center justify-between gap-3 px-4 py-2.5"
        >
          <span class="inline-flex items-center gap-2 t-meta text-on-surface">
            <Icon class="text-primary" :path="mdiCheck" :size="14" />
            {{ row.title }}
          </span>

          <span :class="row.customized ? 'chip-on' : 'chip-quiet'">
            {{ row.customized ? 'customized' : 'stock' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
