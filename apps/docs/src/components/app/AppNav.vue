<script setup lang="ts">
  import { Atom } from '@vuetify/0'

  import type { AtomProps } from '@vuetify/0'

  const { as = 'nav' } = defineProps<AtomProps>()
</script>

<template>
  <Atom
    :as
    class="bg-4 bg-[#212121] text-[#e0e0e0] flex flex-col h-[100vh]"
  >
    <slot />
  </Atom>
</template>
