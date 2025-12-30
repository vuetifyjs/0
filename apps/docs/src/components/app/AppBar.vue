<script setup lang="ts">
  // Framework
  import { Atom, useFeatures, useStorage } from '@vuetify/v0'

  // Composables
  import { useSearch } from '@/composables/useSearch'
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  import { useAppStore } from '@/stores/app'

  const { as = 'header' } = defineProps<AtomProps>()

  const app = useAppStore()
  const storage = useStorage()
  const route = useRoute()

  const isHomePage = toRef(() => route.path === '/')

  const features = useFeatures()
  const { theme, icon: themeIcon, title: themeTitle, toggle: onClickTheme } = useThemeToggle()
  const { open: openSearch } = useSearch()

  const devmode = features.get('devmode')!

  watch(() => devmode.isSelected.value, isSelected => {
    storage.set('devmode', isSelected)
  })

  const src = toRef(() => theme.isDark.value
    ? 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-dark.png'
    : 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-light.png',
  )
</script>

<template>
  <Atom
    :as
    class="flex items-center justify-between h-[48px] fixed left-0 top-[24px] right-0 px-3 text-on-surface border-b border-solid border-divider z-1 glass-surface"
    data-app-bar
  >
    <div class="flex items-center gap-2">
      <router-link to="/">
        <img
          alt="Vuetify0 Logo"
          decoding="async"
          fetchpriority="high"
          :src
          width="128"
        >
      </router-link>

      <button
        v-if="!isHomePage"
        :aria-expanded="app.drawer"
        :aria-label="app.drawer ? 'Close navigation' : 'Open navigation'"
        class="pa-1 cursor-pointer md:hidden bg-transparent border-0 inline-flex align-center"
        type="button"
        @click="app.drawer = !app.drawer"
      >
        <AppIcon :icon="app.drawer ? 'close' : 'menu'" />
      </button>

      <button
        aria-label="Search (Ctrl+K)"
        class="hidden md:inline-flex items-center gap-1.5 glass-surface rounded-full border border-divider pl-1.5 pr-1.5 py-1.5 hover:border-primary/50 transition-colors"
        title="Search (Ctrl+K)"
        type="button"
        @click="openSearch"
      >
        <span class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
          <AppIcon icon="search" size="12" />
        </span>
        <kbd class="shrink-0 px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant text-[10px] font-mono inline-flex items-center">Ctrl+K</kbd>
      </button>
    </div>

    <div class="flex align-center items-center gap-3">

      <button
        :aria-label="themeTitle"
        class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded opacity-90 hover:opacity-100 transition-all border"
        :title="themeTitle"
        type="button"
        @click="onClickTheme"
      >
        <AppIcon :icon="themeIcon" />
      </button>

      <a
        aria-label="Discord Community (opens in new tab)"
        class="bg-[#5661ea] text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://discord.gg/vK6T89eNP7"
        rel="noopener noreferrer"
        target="_blank"
        title="Discord Community"
      >
        <AppIcon icon="discord" />
      </a>

      <a
        aria-label="GitHub Repository (opens in new tab)"
        class="bg-gray-800 text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://github.com/vuetifyjs/0"
        rel="noopener noreferrer"
        target="_blank"
        title="GitHub Repository"
      >
        <AppIcon icon="github" />
      </a>
    </div>
  </Atom>
</template>
