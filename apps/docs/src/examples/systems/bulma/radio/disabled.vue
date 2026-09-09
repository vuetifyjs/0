<script setup lang="ts">
  import { BuControl, BuRadio } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const plan = shallowRef('free')
</script>

<template>
  <BuControl>
    <BuRadio v-model="plan" name="plan" value="free">Free</BuRadio>
    <BuRadio v-model="plan" name="plan" value="pro">Pro</BuRadio>
    <BuRadio v-model="plan" disabled name="plan" value="enterprise">Enterprise</BuRadio>
  </BuControl>
</template>
