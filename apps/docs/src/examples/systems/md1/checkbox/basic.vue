<script setup lang="ts">
  import { Md1Checkbox } from '@paper/md1'
  import { shallowRef } from 'vue'

  const updates = shallowRef(true)
  const offers = shallowRef(false)
</script>

<template>
  <div class="md1-docs-controls">
    <Md1Checkbox v-model="updates" label="Product updates" />

    <Md1Checkbox v-model="offers" label="Special offers" />
  </div>
</template>

<style>
  .md1-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
