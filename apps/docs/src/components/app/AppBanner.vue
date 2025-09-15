<script setup lang="ts">
  // Components
  import { Atom, useBreakpoints, useLayout } from '@vuetify/v0'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
  const element = useTemplateRef('banner')
  const layout = useLayout()
  const item = layout.register({
    id: 'banner',
    position: 'top',
    element,
    value: 24,
  })
</script>

<template>
  <Atom
    ref="banner"
    :as
    class="app-banner flex items-center justify-center fixed px-3 text-xs gap-2"
    :style="{
      top: item.rect.y.value + 'px',
      left: item.rect.x.value + 'px',
      height: item.rect.height.value + 'px',
      width: item.rect.width.value + 'px',
    }"
  >
    <AppIcon icon="alert" :size="14" />

    You are viewing Pre-Alpha documentation. <span v-if="!breakpoints.isMobile">Some features may not work as expected.</span>
  </Atom>
</template>

<style lang="sass">
  .app-banner
    background-color: var(--v0-warning)
</style>
