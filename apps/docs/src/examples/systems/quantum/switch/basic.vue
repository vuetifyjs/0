<script setup lang="ts">
  import { QuSwitch } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
</script>

<template>
  <QuSwitch v-model="wifi" label="Wi-Fi" />
</template>
