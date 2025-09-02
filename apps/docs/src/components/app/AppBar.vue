<script setup lang="ts">
  // Components
  import { Atom, useBreakpoints } from '@vuetify/v0'

  // Composables
  import { useAppStore } from '@/stores/app'
  import { useAuthStore } from '@vuetify/one'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const app = useAppStore()

  let auth: ReturnType<typeof useAuthStore> | null = null
  if (!import.meta.env.SSR) {
    auth = useAuthStore()
  }
  const breakpoints = useBreakpoints()
</script>

<template>
  <Atom
    :as
    class="app-header flex items-center justify-between h-[48px] fixed left-0 top-[24px] right-0 px-3 transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile && 'left-0'"
  >
    <div class="flex items-center gap-1">
      <img
        alt="Vuetify0 Logo"
        decoding="async"
        fetchpriority="high"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-light.png"
        width="128"
      >

      <AppIcon
        v-if="breakpoints.isMobile"
        class="pa-1 cursor-pointer"
        :icon="app.drawer ? 'close' : 'menu'"
        @click="app.drawer = !app.drawer"
      />
    </div>

    <div class="flex align-center items-center gap-3">
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

<style lang="sass">
  .app-header
    background-color: var(--v0-surface)
    border-bottom: thin solid var(--v0-divider)
</style>
