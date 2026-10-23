<script setup lang="ts">
  import { Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const off = shallowRef(false)
  const on = shallowRef(true)
</script>

<template>
  <div class="md1-docs-controls">
    <Md1Switch v-model="off" label="Off" />

    <Md1Switch v-model="on" label="On" />

    <Md1Switch disabled label="Disabled" :model-value="false" />

    <Md1Switch disabled label="Disabled on" :model-value="true" />
  </div>
</template>

<style>
  .md1-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
