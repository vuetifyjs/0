<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()
</script>

<template>
  <Atom
    :as
    class="flex items-center justify-center h-[24px] fixed left-0 top-0 right-0 px-3 text-xs gap-2 text-on-warning z-1 bg-glass-warning"
  >
    <AppIcon icon="alert" :size="14" />

    <div>
      You are viewing Pre-Alpha documentation. <span class="hidden md:inline">Some features may not work as expected.</span>
    </div>
  </Atom>
</template>
