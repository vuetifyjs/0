<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  // Components
  import { Atom, useBreakpoints, useLayoutItem } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()
  const breakpoints = useBreakpoints()
  const bannerRef = useTemplateRef<HTMLElement>('bannerRef')
  const banner = useLayoutItem({
    id: 'banner',
    position: 'top',
    element: bannerRef,
    value: 24 })
</script>

<template>
  <Atom
    ref="bannerRef"
    :as
    class="app-banner flex items-center justify-center fixed px-3 text-xs gap-2"
    :style="{
      top: banner.rect.y.value + 'px',
      left: banner.rect.x.value + 'px',
      height: banner.rect.height.value + 'px',
      width: banner.rect.width.value + 'px',
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
