<script setup lang="ts">
  defineOptions({ name: 'HxExampleTitle' })
</script>

<template>
  <div class="helix-example__header">
    <span class="helix-example__title">
      <slot />
    </span>
  </div>
</template>

<style scoped>
  .helix-example__header {
    display: flex;
    align-items: center;
  }

  .helix-example__title {
    font-weight: 600;
    font-size: 0.875rem;
  }
</style>
