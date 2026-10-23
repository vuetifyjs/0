<script setup lang="ts">
  import { Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const location = shallowRef(true)
  const sync = shallowRef(false)
  const saver = shallowRef(false)
</script>

<template>
  <div class="md1-docs-controls">
    <Md1Switch v-model="location" label="Use location" />

    <Md1Switch v-model="sync" label="Sync in the background" />

    <Md1Switch v-model="saver" label="Battery saver" />
  </div>
</template>

<style>
  .md1-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
