<script setup lang="ts">
  // Components
  import { Atom, useFeatures, usePermissions, useTheme, useStorage } from '@vuetify/v0'

  // Composables
  import { useAppStore } from '@/stores/app'
  import { useAuthStore } from '@vuetify/one/stores/auth'

  // Utilities
  import { computed, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const app = useAppStore()
  const storage = useStorage()
  const route = useRoute()

  const isHomePage = computed(() => route.path === '/')

  let auth: ReturnType<typeof useAuthStore> | null = null
  if (!import.meta.env.SSR) {
    auth = useAuthStore()
  }
  const permissions = usePermissions()
  const features = useFeatures()
  const theme = useTheme()

  const devmode = features.get('devmode')!

  function onClickDevmode () {
    devmode.toggle()
  }

  function onClickTheme () {
    theme.cycle(['light', 'dark'])
  }

  watch(() => theme.selectedId.value, id => {
    storage.set('theme', id)
  })

  watch(() => devmode.isSelected.value, isSelected => {
    storage.set('devmode', isSelected)
  })

  const themeIcon = computed(() => theme.isDark.value ? 'theme-light' : 'theme-dark')
  const src = computed(() => theme.isDark.value
    ? 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-dark.png'
    : 'https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-light.png',
  )
</script>

<template>
  <Atom
    :as
    class="app-header flex items-center justify-between h-[48px] fixed left-0 top-[24px] right-0 px-3 text-on-surface border-b border-solid border-divider z-1"
    data-app-bar
  >
    <div class="flex items-center gap-1">
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
    </div>

    <div class="flex align-center items-center gap-3">
      <button
        aria-label="Toggle Theme"
        class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded opacity-90 hover:opacity-100 transition-all border"
        title="Toggle Theme"
        type="button"
        @click="onClickTheme"
      >
        <AppIcon :icon="themeIcon" />
      </button>

      <!-- update when latest @vuetify/one is released -->
      <button
        v-if="permissions.can(auth?.user?.role ?? 'guest', 'use', 'devmode')"
        :aria-label="devmode.isSelected.value ? 'Disable Developer Mode' : 'Enable Developer Mode'"
        :aria-pressed="devmode.isSelected.value"
        class="text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        :class="devmode.isSelected.value ? 'bg-red' : 'bg-gray-400'"
        title="Developer Mode"
        type="button"
        @click="onClickDevmode"
      >
        <AppIcon icon="dev" />
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

      <client-only>
        <img
          v-if="auth!.user?.picture"
          alt="Vuetify One Avatar"
          class="rounded-full"
          height="28"
          :src="auth!.user.picture"
          title="Vuetify One Avatar"
          width="28"
        >
      </client-only>
    </div>
  </Atom>
</template>

<style scoped>
  .app-header {
    background: color-mix(in srgb, var(--v0-surface) 70%, transparent);
    backdrop-filter: blur(12px);
  }
</style>
