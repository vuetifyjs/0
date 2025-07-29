<script setup lang="ts">
  // Components
  import { Atom } from '@vuetify/0'

  // Composables
  import { useBreakpoints } from '@vuetify/0'

  // Icons
  import { Github } from 'lucide-vue-next'

  // Types
  import type { AtomProps } from '@vuetify/0'

  const { as = 'header' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
</script>

<template>
  <Atom
    :as
    class="app-header flex items-center justify-end h-[48px] fixed left-0 top-0 right-0 px-3 transition-margin duration-200 ease-in-out"
    :class="!breakpoints.isMobile && 'ml-[220px]'"
  >
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
