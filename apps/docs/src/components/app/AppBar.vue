<script setup lang="ts">
  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Framework
  import { useBreakpoints, useFeatures, useStorage } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useNavigation } from '@/composables/useNavigation'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const auth = useAuthStore()
  const navigation = useNavigation()
  const storage = useStorage()
  const route = useRoute()

  const isHomePage = toRef(() => route.path === '/')

  const breakpoints = useBreakpoints()
  const features = useFeatures()
  const search = useSearch()
  const settings = useSettings()

  const devmode = features.get('devmode')!

  watch(() => devmode.isSelected.value, isSelected => {
    storage.set('devmode', isSelected)
  })

  const darkLogo = 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-dark.svg'
  const lightLogo = 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-light.svg'
</script>

<template>
  <HxAppBar
    :class="['px-3 text-on-surface border-b border-divider', settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface']"
    :style="{ top: '24px' }"
  >
    <HxAppBarStart>
      <router-link to="/">
        <img
          alt="Vuetify0 Logo"
          class="logo-light"
          decoding="async"
          fetchpriority="high"
          height="52"
          :src="lightLogo"
          width="128"
        >
        <img
          alt="Vuetify0 Logo"
          class="logo-dark"
          decoding="async"
          fetchpriority="high"
          height="52"
          :src="darkLogo"
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
          @click="search.focus()"
        >
          <span class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
            <AppIcon icon="search" size="12" />
          </span>
          <span class="hidden md:inline text-sm text-on-surface-variant">Search the docs...</span>
          <kbd class="hidden md:inline-flex shrink-0 px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-[10px] font-mono items-center rounded-r-lg">Ctrl+K</kbd>
        </button>
      </Discovery.Activator>
    </HxAppBarStart>

    <HxAppBarEnd class="gap-3">
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

      <AppAccount v-if="!isHomePage" />

      <AppSettings v-if="!isHomePage && !auth.isAuthenticated" />
    </HxAppBarEnd>
  </HxAppBar>
</template>
