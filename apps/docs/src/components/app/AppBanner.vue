<script setup lang="ts">
  // Components
  import { Atom, useBreakpoints } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
</script>

<template>
  <Atom
    :as
    class="app-banner flex items-center justify-center h-[24px] fixed left-0 top-0 right-0 px-3 text-xs gap-2"
  >
    <AppIcon icon="alert" :size="14" />

    <div>
      You are viewing Pre-Alpha documentation. <span v-if="!breakpoints.isMobile.value">Some features may not work as expected.</span>
    </div>
  </Atom>
</template>

<style lang="sass">
  .app-banner
    background-color: var(--v0-warning)
</style>
