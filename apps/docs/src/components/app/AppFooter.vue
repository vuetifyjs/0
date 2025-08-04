<script setup lang="ts">
  // Components
  import { Atom, useBreakpoints } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'footer' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
</script>

<template>
  <Atom
    :as
    class="app-footer flex items-center justify-end h-[24px] fixed bottom-0 left-[220px] right-0 px-3 text-xs"
    :class="breakpoints.isMobile && 'left-0'"
  >
    &copy; 2016-2025 Vuetify, LLC
  </Atom>
</template>

<style lang="sass">
  .app-footer
    background-color: var(--v0-surfaceTint)
</style>
