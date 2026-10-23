<script setup lang="ts">
  import { QuCheckbox } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const off = shallowRef(false)
  const on = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-controls">
    <QuCheckbox v-model="off" label="Off" />

    <QuCheckbox v-model="on" label="On" />

    <QuCheckbox disabled label="Disabled" :model-value="false" />

    <QuCheckbox disabled label="Disabled on" :model-value="true" />
  </div>
</template>

<style>
  .quantum-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
