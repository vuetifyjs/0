<script setup lang="ts">
  import { Atom } from '@vuetify/0'

  import type { AtomProps } from '@vuetify/0'

  const { as = 'nav' } = defineProps<AtomProps>()
</script>

<template>
  <Atom
    :as
    class="bg-4 app-nav text-[#e0e0e0] flex flex-col h-[100vh] fixed w-[220px] "
  >
    <slot />
  </Atom>
</template>

<style lang="sass">
  .app-nav
    background-color: var(--v0-surfaceVariant)
</style>
