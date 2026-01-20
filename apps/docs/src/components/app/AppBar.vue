<script setup lang="ts">
  // Framework
  import { Atom, useBreakpoints, useDocumentEventListener, useFeatures, useHotkey, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { nextTick, ref, toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  // Stores
  import { useAppStore } from '@/stores/app'

  const { as = 'header' } = defineProps<AtomProps>()

  const app = useAppStore()
  const storage = useStorage()
  const route = useRoute()

  const isHomePage = toRef(() => route.path === '/')

  const breakpoints = useBreakpoints()
  const discovery = useDiscovery()
  const features = useFeatures()
  const theme = useTheme()
  const { open: openSearch } = useSearch()
  const { showSkillFilter, showThemeToggle, showSocialLinks } = useSettings()

  const devmode = features.get('devmode')!

  watch(() => devmode.isSelected.value, isSelected => {
    storage.set('devmode', isSelected)
  })

  const src = toRef(() => theme.isDark.value
    ? 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-dark.png'
    : 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-light.png',
  )

  discovery.on('start:open-search', () => {
    const once = useDocumentEventListener('keydown', (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.key !== 'k') return
      nextTick(() => {
        discovery.next()
        once()
      })
    })
  })

  discovery.on('back:open-search', () => {
    console.log('back to open-search')
  })

  discovery.on('complete:open-search', () => {
    console.log('completed open-search')
  })
</script>

<template>
  <Atom
    :as
    class="flex items-center justify-between h-[48px] fixed left-0 top-[24px] right-0 px-3 text-on-surface border-b border-solid border-divider z-1 bg-glass-surface"
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

      <Discovery.Root step="open-search">
        <Discovery.Activator class="rounded-2xl" step="open-search">
          <button
            aria-label="Search (Ctrl+K)"
            class="inline-flex items-center gap-1.5 md:bg-glass-surface rounded-full md:border md:border-divider md:pl-1.5 md:pr-1.5 md:py-1.5 hover:border-primary/50 transition-colors"
            title="Search (Ctrl+K)"
            type="button"
            @click="openSearch"
          >
            <span class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <AppIcon icon="search" size="12" />
            </span>
            <span class="hidden md:inline text-sm text-on-surface-variant">Search the docs...</span>
            <kbd class="hidden md:inline-flex shrink-0 px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-[10px] font-mono items-center rounded-r-lg">Ctrl+K</kbd>
          </button>
        </Discovery.Activator>

        <Discovery.Content class="p-4 bg-surface border border-divider rounded-xl shadow-xl max-w-xs">
          <div class="flex justify-between items-center">
            <Discovery.Title class="text-lg font-semibold text-on-surface mb-1">Open Search</Discovery.Title>
            <Discovery.Progress class="text-xs text-on-surface-variant mb-2" />
          </div>

          <Discovery.Description class="text-sm text-on-surface-variant mb-4">
            Press <kbd class="px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-xs font-mono">Ctrl+K</kbd> to open the search dialog.
          </Discovery.Description>

          <div class="flex justify-end">
            <Discovery.Skip class="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface">
              Skip tour
            </Discovery.Skip>
          </div>
        </Discovery.Content>
      </Discovery.Root>
    </div>

    <div class="flex align-center items-center gap-3">
      <AppSkillFilter v-if="!isHomePage && showSkillFilter && breakpoints.width.value >= 440" />

      <AppThemeToggle v-if="isHomePage || showThemeToggle" />

      <a
        v-if="isHomePage || showSocialLinks"
        aria-label="Discord Community (opens in new tab)"
        class="bg-[#5865F2] text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://discord.gg/vK6T89eNP7"
        rel="noopener noreferrer"
        target="_blank"
        title="Discord Community"
      >
        <AppIcon class="!opacity-100" icon="discord" />
      </a>

      <a
        v-if="isHomePage || showSocialLinks"
        aria-label="GitHub Repository (opens in new tab)"
        class="bg-[#24292f] text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://github.com/vuetifyjs/0"
        rel="noopener noreferrer"
        target="_blank"
        title="GitHub Repository"
      >
        <AppIcon class="!opacity-100" icon="github" />
      </a>

      <AppSettings v-if="!isHomePage" />
    </div>
  </Atom>
</template>
