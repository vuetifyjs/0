<script setup lang="ts">
  // Context
// Classic root baseline: classic parent + classic Atom copy, no vapor.

  import AtomClassic from './AtomClassic.vue'

  const { count = 400 } = defineProps<{
    count?: number
  }>()
</script>

<template>
  <div data-bench="classic-baseline">
    <AtomClassic v-for="i in count" :key="i" as="button" :data-i="i">Item {{ i }}</AtomClassic>
  </div>
</template>
