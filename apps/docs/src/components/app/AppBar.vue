<script setup lang="ts">
  import { Atom } from '@vuetify/0'

  import type { AtomProps } from '@vuetify/0'

  const { as = 'header' } = defineProps<AtomProps>()
</script>

<template>
  <Atom
    :as
    class="bg-4 app-header text-[#e0e0e0] flex flex-col h-[100vh] fixed w-[220px] overflow-y-auto pb-4"
  >
    <slot />
  </Atom>
</template>

<style lang="sass">
  .app-nav
    background-color: var(--v0-surfaceVariant)
</style>
