<script setup lang="ts">
  import { mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'

  // Framework
  import { useTheme } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  import { useBuilderStore } from '@/stores/builder'

  const theme = useTheme()
  const store = useBuilderStore()

  const logo = toRef(() =>
    theme.isDark.value
      ? 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-dark.svg'
      : 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-light.svg',
  )

  const icon = toRef(() => theme.isDark.value ? mdiWeatherSunny : mdiWeatherNight)

  function onToggle () {
    theme.select(theme.isDark.value ? 'light' : 'dark')
  }
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-12 bg-surface/80 backdrop-blur-lg border-b border-divider flex items-center justify-between px-6">
    <img
      :alt="theme.isDark.value ? 'v0 dark logo' : 'v0 light logo'"
      class="w-24"
      :src="logo.value"
    >

    <span class="text-sm font-semibold text-on-surface-variant">Framework Builder</span>

    <div class="flex items-center gap-3">
      <span
        v-if="store.selected.size > 0"
        class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
      >
        {{ store.selected.size }} features
      </span>

      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
        @click="onToggle"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path :d="icon.value" fill="currentColor" />
        </svg>
      </button>
    </div>
  </header>
</template>
