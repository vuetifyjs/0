<script setup lang="ts">
  // Components
  import { Atom, useBreakpoints, useLayoutItem } from '@vuetify/v0'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'footer' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
  const element = useTemplateRef<HTMLElement>('footer')
  const item = useLayoutItem({
    id: 'footer',
    position: 'bottom',
    element,
    value: 24,
  })
</script>

<template>
  <Atom
    ref="footer"
    :as
    :class="`app-footer flex items-center justify-end fixed px-3 text-xs ${breakpoints.isMobile && 'left-0'}`"
    :style="{
      left: item.rect.x.value + 'px',
      top: item.rect.y.value + 'px',
      height: item.rect.height.value + 'px',
      width: item.rect.width.value + 'px',
    }"
  >
    <DocsLastCommit />

    &copy; 2016-2025 Vuetify, LLC
  </Atom>
</template>

<style lang="sass">
  .app-footer
    background-color: var(--v0-surface-tint)
</style>
