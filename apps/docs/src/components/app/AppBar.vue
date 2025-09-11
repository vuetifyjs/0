<script setup lang="ts">
  // Components
  import { Atom, useBreakpoints, useLayout } from '@vuetify/v0'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Composables
  import { useAppStore } from '@/stores/app'
  import { useAuthStore } from '@vuetify/one/stores/auth'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const app = useAppStore()

  let auth: ReturnType<typeof useAuthStore> | null = null
  if (!import.meta.env.SSR) {
    auth = useAuthStore()
  }
  const breakpoints = useBreakpoints()
  const element = useTemplateRef('bar')
  const layout = useLayout()
  const item = layout.register({
    id: 'bar',
    position: 'top',
    element,
  })

</script>

<template>
  <Atom
    ref="bar"
    :as
    class="app-header flex items-center justify-between fixed px-3 h-[48px]"
    :style="{
      left: item.rect.x.value + 'px',
      top: item.rect.y.value + 'px',
      width: item.rect.width.value + 'px',
    }"
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
