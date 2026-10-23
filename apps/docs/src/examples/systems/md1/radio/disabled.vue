<script setup lang="ts">
  import { Md1Radio } from '@paper/md1'
  import { shallowRef } from 'vue'

  const size = shallowRef('m')
</script>

<template>
  <Md1Radio.Group v-model="size" aria-label="Size">
    <Md1Radio label="Small" value="s" />

    <Md1Radio label="Medium" value="m" />

    <Md1Radio disabled label="Large (sold out)" value="l" />
  </Md1Radio.Group>
</template>
