<script setup lang="ts">
  import { createThemeContext, useTheme } from '@vuetify/v0'

  const [, provideTheme] = createThemeContext({
    default: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#ffffff',
          surface: '#f8fafc',
          primary: '#3b82f6',
          text: '#1e293b',
          muted: '#94a3b8',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#818cf8',
          text: '#f1f5f9',
          muted: '#64748b',
        },
      },
      forest: {
        dark: false,
        colors: {
          background: '#f0fdf4',
          surface: '#dcfce7',
          primary: '#16a34a',
          text: '#14532d',
          muted: '#6b7280',
        },
      },
      sunset: {
        dark: false,
        colors: {
          background: '#fff7ed',
          surface: '#ffedd5',
          primary: '#ea580c',
          text: '#7c2d12',
          muted: '#a1a1aa',
        },
      },
    },
  })

  provideTheme()

  const theme = useTheme()

  function onCycle () {
    theme.cycle()
  }
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="id in theme.keys()"
        :key="id"
        class="px-3 py-1.5 text-sm rounded-lg border transition-all"
        :class="theme.selectedId.value === id
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="theme.select(id)"
      >
        {{ id }}
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded-lg border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
        @click="onCycle"
      >
        Cycle
      </button>
    </div>

    <div
      class="rounded-lg p-4 border border-divider transition-colors"
      :style="{
        backgroundColor: theme.colors.value[theme.selectedId.value!]?.surface,
        color: theme.colors.value[theme.selectedId.value!]?.text,
      }"
    >
      <p class="text-sm font-medium mb-2">
        Theme: {{ theme.selectedId.value }}
      </p>

      <p class="text-xs mb-3" :style="{ color: theme.colors.value[theme.selectedId.value!]?.muted }">
        Dark mode: {{ theme.isDark.value ? 'enabled' : 'disabled' }}
      </p>

      <div class="flex gap-2">
        <div
          v-for="(color, name) in theme.colors.value[theme.selectedId.value!]"
          :key="name"
          class="flex flex-col items-center gap-1"
        >
          <div
            class="size-8 rounded-md border border-black/10"
            :style="{ backgroundColor: color }"
          />
          <span class="text-[10px]">{{ name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
