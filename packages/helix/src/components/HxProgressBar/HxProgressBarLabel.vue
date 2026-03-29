<script setup lang="ts">
  defineOptions({ name: 'HxProgressBarLabel' })
</script>

<template>
  <span class="helix-progress-bar__label">
    <slot />
  </span>
</template>

<style scoped>
  .helix-progress-bar__label {
    font-size: 0.75rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    width: 3rem;
    text-align: end;
  }
</style>
