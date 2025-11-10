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
    class="app-footer flex items-center justify-between h-[24px] fixed bottom-0 left-0 md:left-[220px] right-0 px-3 text-xs bg-surface-tint text-on-surface-tint"
  >
    <DocsLastCommit />

    &copy; 2016-{{ (new Date()).getFullYear() }} Vuetify, LLC
  </Atom>
</template>
