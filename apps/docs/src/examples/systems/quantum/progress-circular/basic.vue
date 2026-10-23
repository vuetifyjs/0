<script setup lang="ts">
  import { QuProgressCircular } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-progress-center">
    <QuProgressCircular aria-label="Loading conversations" />
  </div>
</template>

<style>
  .quantum-docs-progress-center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
  }
</style>
