<script setup lang="ts">
  // Components
  import { Atom, useFeatures, usePermissions, useTheme } from '@vuetify/v0'

  // Composables
  import { useAppStore } from '@/stores/app'
  import { useAuthStore } from '@vuetify/one/stores/auth'

  // Utilities
  import { computed, watch } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const app = useAppStore()

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
    if (!id) return

    localStorage.setItem('v0:theme', JSON.stringify(id))
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
    class="app-header flex items-center justify-between h-[48px] fixed left-0 top-[24px] right-0 px-3 bg-surface text-on-surface border-b border-solid border-divider z-1"
  >
    <div class="flex items-center gap-1">
      <img
        alt="Vuetify0 Logo"
        decoding="async"
        fetchpriority="high"
        :src
        width="128"
      >

      <AppIcon
        class="pa-1 cursor-pointer md:hidden"
        :icon="app.drawer ? 'close' : 'menu'"
        @click="app.drawer = !app.drawer"
      />
    </div>

    <div class="flex align-center items-center gap-3">
      <button
        class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded opacity-90 hover:opacity-100 transition-all border"
        title="Toggle Theme"
        @click="onClickTheme"
      >
        <AppIcon :icon="themeIcon" />
      </button>

      <!-- update when latest @vuetify/one is released -->
      <button
        v-if="permissions.can(auth?.user?.role ?? 'guest', 'use', 'devmode')"
        class="text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        :class="devmode.isSelected.value ? 'bg-red' : 'bg-gray-400'"
        @click="onClickDevmode"
      >
        <AppIcon icon="dev" />
      </button>

      <a
        class="bg-[#5661ea] text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://discord.gg/vK6T89eNP7"
        rel="noopener noreferrer"
        target="_blank"
        title="Discord Community"
      >
        <AppIcon icon="discord" />
      </a>

      <a
        class="bg-gray-800 text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://github.com/vuetifyjs/0"
        rel="noopener noreferrer"
        target="_blank"
        title="GitHub Repository"
      >
        <AppIcon icon="github" />
      </a>

      <a
        class="bg-[#1867c0] text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://vuetifyjs.com"
        rel="noopener noreferrer"
        target="_blank"
        title="Vuetify Documentation"
      >
        <AppIcon icon="vuetify" />
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
