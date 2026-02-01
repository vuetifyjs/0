<script setup lang="ts">
  // Framework
  import { Atom, useBreakpoints, useFeatures, useStorage, useTheme } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useNavigation } from '@/composables/useNavigation'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const navigation = useNavigation()
  const storage = useStorage()
  const route = useRoute()

  const isHomePage = toRef(() => route.path === '/')

  const breakpoints = useBreakpoints()
  const features = useFeatures()
  const theme = useTheme()
  const search = useSearch()
  const settings = useSettings()

  const devmode = features.get('devmode')!

  watch(() => devmode.isSelected.value, isSelected => {
    storage.set('devmode', isSelected)
  })

  const src = toRef(() => theme.isDark.value
    ? 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-dark.svg'
    : 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-light.svg',
  )
</script>

<template>
  <Atom
    :as
    :class="['flex items-center justify-between h-[48px] fixed left-0 top-[24px] right-0 px-3 text-on-surface border-b border-solid border-divider z-1', settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface']"
    data-app-bar
  >
    <div class="flex items-center gap-2">
      <router-link to="/">
        <img
          alt="Vuetify0 Logo"
          decoding="async"
          fetchpriority="high"
          height="52"
          :src
          width="128"
        >
      </router-link>

      <button
        v-if="!isHomePage"
        :aria-expanded="navigation.isOpen.value"
        :aria-label="navigation.isOpen.value ? 'Close navigation' : 'Open navigation'"
        class="pa-1 cursor-pointer md:hidden bg-transparent border-0 inline-flex align-center"
        type="button"
        @click="navigation.toggle()"
      >
        <AppIcon :icon="navigation.isOpen.value ? 'close' : 'menu'" />
      </button>

      <Discovery.Activator class="rounded-2xl" step="search">
        <button
          aria-label="Search (Ctrl+K)"
          :class="['inline-flex items-center gap-1.5 rounded-full md:border md:border-divider md:pl-1.5 md:pr-1.5 md:py-1.5 hover:border-primary/50 transition-colors', settings.showBgGlass.value ? 'md:bg-glass-surface' : 'md:bg-surface']"
          title="Search (Ctrl+K)"
          type="button"
          @click="search.open()"
        >
          <span class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
            <AppIcon icon="search" size="12" />
          </span>
          <span class="hidden md:inline text-sm text-on-surface-variant">Search the docs...</span>
          <kbd class="hidden md:inline-flex shrink-0 px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-[10px] font-mono items-center rounded-r-lg">Ctrl+K</kbd>
        </button>
      </Discovery.Activator>
    </div>

    <div class="flex align-center items-center gap-3">
      <AppSkillFilter v-if="!isHomePage && settings.showSkillFilter.value && breakpoints.width.value >= 440" />

      <AppThemeToggle v-if="isHomePage || settings.showThemeToggle.value" />

      <a
        v-if="isHomePage || settings.showSocialLinks.value"
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
        v-if="isHomePage || settings.showSocialLinks.value"
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
