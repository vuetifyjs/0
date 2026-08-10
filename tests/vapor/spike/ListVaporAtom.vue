<script setup vapor lang="ts">
  // Framework
// Pure-vapor list: vapor parent + vapor-compiled real Atom. Zero crossings.

  import { Atom } from '@vuetify/v0/components'

  const { count = 400 } = defineProps<{
    count?: number
  }>()
</script>

<template>
  <div data-bench="vapor-atom">
    <Atom v-for="i in count" :key="i" as="button" :data-i="i">Item {{ i }}</Atom>
  </div>
</template>
