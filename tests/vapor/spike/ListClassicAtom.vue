<script setup vapor lang="ts">
  // Context
// Vapor parent instantiating a CLASSIC Atom copy inline: one interop
  // crossing per item. The control that shows the crossing tax.

  import AtomClassic from './AtomClassic.vue'

  const { count = 400 } = defineProps<{
    count?: number
  }>()
</script>

<template>
  <div data-bench="classic-atom-inline">
    <AtomClassic v-for="i in count" :key="i" as="button" :data-i="i">Item {{ i }}</AtomClassic>
  </div>
</template>
