<script setup lang="ts">
  import { Atom } from '@vuetify/0'

  import type { AtomProps } from '@vuetify/0'

  const { as = 'nav' } = defineProps<AtomProps>()
</script>

<template>
  <Atom
    :as
    class="pa-4 bg-4 bg-[#212121] text-[#e0e0e0]"
  >
    <slot />
  </Atom>
</template>
