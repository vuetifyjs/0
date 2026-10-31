<script setup lang="ts">
  import { BSwitch } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const on = shallowRef(false)
</script>

<template>
  <BSwitch
    id="switch"
    v-model="on"
  />
</template>
