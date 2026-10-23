<script setup lang="ts">
  import { QuSwitch } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const off = shallowRef(false)
  const on = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-controls">
    <QuSwitch v-model="off" label="Off" />

    <QuSwitch v-model="on" label="On" />

    <QuSwitch disabled label="Disabled" :model-value="false" />

    <QuSwitch disabled label="Disabled on" :model-value="true" />
  </div>
</template>

<style>
  .quantum-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
