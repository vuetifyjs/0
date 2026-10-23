<script setup lang="ts">
  import { QuRadio } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const shipping = shallowRef('standard')
</script>

<template>
  <QuRadio.Group v-model="shipping" aria-label="Shipping">
    <QuRadio label="Standard, 5 to 7 days" value="standard" />

    <QuRadio label="Express, 2 days" value="express" />

    <QuRadio label="Overnight" value="overnight" />
  </QuRadio.Group>
</template>
