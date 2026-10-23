<script setup lang="ts">
  import { Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
</script>

<template>
  <Md1Switch v-model="wifi" label="Wi-Fi" />
</template>
