<script setup lang="ts">
  import { useTemplateRef } from 'vue'
  // Components
  import { Atom, useBreakpoints, useLayoutItem } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'footer' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
  const footerRef = useTemplateRef<HTMLElement>('footerRef')
  const footer = useLayoutItem({
    id: 'footer',
    position: 'bottom',
    element: footerRef,
    value: 24,
  })
</script>

<template>
  <Atom
    ref="footerRef"
    :as
    :class="`app-footer flex items-center justify-end fixed px-3 text-xs ${breakpoints.isMobile && 'left-0'}`"
    :style="`left: ${footer.rect.x.value}px; top:${footer.rect.y.value}px; height:${footer.rect.height.value}px; width:${footer.rect.width.value}px;`"
  >
    <DocsLastCommit />

    &copy; 2016-2025 Vuetify, LLC
  </Atom>
</template>

<style lang="sass">
  .app-footer
    background-color: var(--v0-surfaceTint)
</style>
