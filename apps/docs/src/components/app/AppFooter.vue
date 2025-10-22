<script setup lang="ts">
  // Components
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'footer' } = defineProps<AtomProps>()
</script>

<template>
  <Atom
    :as
    class="app-footer flex items-center justify-between h-[24px] fixed bottom-0 left-0 md:left-[220px] right-0 px-3 text-xs bg-surface border-t"
  >
    <DocsLastCommit />

    &copy; 2016-2025 Vuetify, LLC
  </Atom>
</template>

<style lang="sass">
  .app-footer
    background-color: var(--v0-surface-tint)
</style>
