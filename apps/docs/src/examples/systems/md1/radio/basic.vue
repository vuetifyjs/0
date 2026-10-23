<script setup lang="ts">
  import { Md1Radio } from '@paper/md1'
  import { shallowRef } from 'vue'

  const shipping = shallowRef('standard')
</script>

<template>
  <Md1Radio.Group v-model="shipping" aria-label="Shipping">
    <Md1Radio label="Standard, 5 to 7 days" value="standard" />

    <Md1Radio label="Express, 2 days" value="express" />

    <Md1Radio label="Overnight" value="overnight" />
  </Md1Radio.Group>
</template>
