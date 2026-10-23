<script setup lang="ts">
  import { Md1ProgressCircular } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-progress-center">
    <Md1ProgressCircular aria-label="Loading conversations" />
  </div>
</template>

<style>
  .md1-docs-progress-center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
  }
</style>
