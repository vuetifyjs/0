<script setup lang="ts">
  import { QuSwitch } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const location = shallowRef(true)
  const sync = shallowRef(false)
  const saver = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-controls">
    <QuSwitch v-model="location" label="Use location" />

    <QuSwitch v-model="sync" label="Sync in the background" />

    <QuSwitch v-model="saver" label="Battery saver" />
  </div>
</template>

<style>
  .quantum-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
