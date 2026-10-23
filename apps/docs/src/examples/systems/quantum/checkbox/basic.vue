<script setup lang="ts">
  import { QuCheckbox } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const updates = shallowRef(true)
  const offers = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-controls">
    <QuCheckbox v-model="updates" label="Product updates" />

    <QuCheckbox v-model="offers" label="Special offers" />
  </div>
</template>

<style>
  .quantum-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
