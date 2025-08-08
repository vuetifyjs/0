<script setup lang="ts">

  import { useTemplateRef, onMounted } from 'vue'
  // Components
  import { Atom, useBreakpoints, useLayout } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()
  const breakpoints = useBreakpoints()

  const banner = useTemplateRef('banner')
  const layout = useLayout()
  onMounted(() => {
    layout.register({ position: 'top', element: banner })
  })

</script>

<template>
  <Atom
    ref="banner"
    :as
    class="app-banner flex items-center justify-center h-[24px] fixed left-0 top-0 right-0 px-3 text-xs gap-2"
  >
    <AppIcon icon="alert" :size="14" />

    You are viewing Pre-Alpha documentation. <span v-if="!breakpoints.isMobile">Some features may not work as expected.</span>
  </Atom>
</template>

<style lang="sass">
  .app-banner
    background-color: var(--v0-warning)
</style>
