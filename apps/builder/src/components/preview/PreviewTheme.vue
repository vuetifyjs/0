<script setup lang="ts">
  // Framework
  import { Button, useTheme } from '@vuetify/v0'

  import { defaultConfig, preferred } from '@/plugins/theme/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { ThemeConfig } from '@/plugins/theme/defaults'

  const store = useBuilderStore()

  const app = useTheme()

  // Split from `config` so the fallback is distinguishable: a config the user has touched
  // carries its own default, and only the static one follows the builder's mode.
  const saved = toRef(() => {
    if (store.draft?.id === 'useTheme') return store.draft.config as ThemeConfig

    return store.pluginConfig.useTheme as ThemeConfig | undefined
  })

  const config = toRef(() => saved.value ?? defaultConfig)

  const keys = toRef(() => Object.keys(config.value.themes ?? {}))

  const selected = shallowRef(
    saved.value ? config.value.default : preferred(config.value, app.isDark.value),
  )

  watch(() => config.value.default, value => {
    selected.value = value
  })

  const active = toRef(() => keys.value.includes(selected.value) ? selected.value : keys.value[0] ?? '')

  const entry = toRef(() => config.value.themes?.[active.value])

  const tokens = toRef(() => Object.entries(entry.value?.colors ?? {}))

  const palette = toRef(() => {
    const colors = entry.value?.colors ?? {}

    return {
      primary: colors.primary || '#808080',
      error: colors.error || '#b3261e',
      background: colors.background || '#ededed',
      surface: colors.surface || '#fafafa',
      divider: colors.divider || '#d4d4d4',
      onPrimary: colors['on-primary'] || '#ffffff',
      onSurface: colors['on-surface'] || '#1f1f1f',
      onVariant: colors['on-surface-variant'] || '#757575',
    }
  })

  function onSelect (key: string) {
    selected.value = key
  }
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="keys.length > 1"
      class="inline-flex items-center gap-1 p-1 rounded-lg bg-surface-variant"
    >
      <Button.Root
        v-for="key in keys"
        :key
        class="px-3 py-1 rounded-md text-xs transition-colors"
        :class="key === active
          ? 'bg-surface text-on-surface shadow-sm'
          : 'text-on-surface-variant hover:text-on-surface'"
        @click="onSelect(key)"
      >
        {{ key }}
      </Button.Root>
    </div>

    <!-- Four columns leaves ~60px per cell on a phone, too narrow for a name like
         "background" to fit; names then break mid-word. Two columns fits every default
         token on one line down to 320px, and the swatch height is fixed either way. -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <div v-for="[name, value] in tokens" :key="name" class="min-w-0 overflow-hidden">
        <div
          class="h-12 rounded-lg border border-divider transition-colors"
          :style="{ background: value }"
        />

        <p class="mt-1 text-[10px] font-mono leading-tight text-on-surface" :title="name">{{ name }}</p>
        <p class="text-[10px] font-mono leading-tight text-on-surface-variant">{{ value }}</p>
      </div>
    </div>

    <MiniFrame :title="`preview — ${active || 'theme'}`">
      <div
        class="rounded-lg overflow-hidden border transition-all"
        :style="{ background: palette.background, borderColor: palette.divider }"
      >
        <header
          class="flex items-center justify-between px-4 py-3 border-b transition-all"
          :style="{ background: palette.surface, borderColor: palette.divider }"
        >
          <span class="text-sm font-semibold transition-colors" :style="{ color: palette.onSurface }">Acme</span>
          <span class="text-xs transition-colors" :style="{ color: palette.onVariant }">Dashboard</span>
        </header>

        <div class="p-4 space-y-4">
          <div
            class="rounded-lg border p-4 transition-all"
            :style="{ background: palette.surface, borderColor: palette.divider }"
          >
            <p class="text-sm font-medium transition-colors" :style="{ color: palette.onSurface }">Quarterly report</p>
            <p class="mt-1 text-xs transition-colors" :style="{ color: palette.onVariant }">Updated two hours ago by the analytics team.</p>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              :style="{ background: palette.primary, color: palette.onPrimary }"
            >
              Continue
            </span>

            <span
              class="px-4 py-1.5 rounded-lg border text-xs font-medium transition-all"
              :style="{ borderColor: palette.primary, color: palette.primary }"
            >
              Cancel
            </span>
          </div>

          <p class="text-xs transition-colors" :style="{ color: palette.error }">Your payment method expired.</p>
        </div>
      </div>
    </MiniFrame>
  </div>
</template>
