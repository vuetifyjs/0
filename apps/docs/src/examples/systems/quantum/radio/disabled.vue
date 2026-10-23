<script setup lang="ts">
  import { QuRadio } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const size = shallowRef('m')
</script>

<template>
  <QuRadio.Group v-model="size" aria-label="Size">
    <QuRadio label="Small" value="s" />

    <QuRadio label="Medium" value="m" />

    <QuRadio disabled label="Large (sold out)" value="l" />
  </QuRadio.Group>
</template>
