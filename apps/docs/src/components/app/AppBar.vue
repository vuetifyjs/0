<script setup lang="ts">
  // Components
  import { Atom, useBreakpoints } from '@vuetify/v0'

  // Icons
  import { Github, Menu } from 'lucide-vue-next'

  // Types
  import type { AtomProps } from '@vuetify/v0'
  import { useAppContext } from '@/composables/useApp'

  const { as = 'header' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
  const app = useAppContext()
</script>

<template>
  <Atom
    :as
    class="app-header flex items-center justify-between h-[48px] fixed left-[220px] top-[24px] right-0 px-3 transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile && 'left-0'"
  >
    <Menu
      v-if="breakpoints.isMobile"
      class="pa-1 rounded opacity-90 hover:opacity-100 cursor-pointer"
      :size="26"
      @click="app.nav.value = !app.nav.value"
    />

    <span v-else />

    <a href="https://github.com/vuetifyjs/0" rel="noopener noreferrer" target="_blank">
      <Github class="bg-gray-800 text-white pa-1 rounded opacity-90 hover:opacity-100" :size="26" />
    </a>
  </Atom>
</template>

<style lang="sass">
  .app-header
    background-color: var(--v0-surface)
    border-bottom: thin solid var(--v0-divider)
</style>
