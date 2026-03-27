<script setup lang="ts">
  defineOptions({ name: 'CxExampleTitle' })
</script>

<template>
  <div class="codex-example__header">
    <span class="codex-example__title">
      <slot />
    </span>
  </div>
</template>

<style scoped>
  .codex-example__header {
    display: flex;
    align-items: center;
  }

  .codex-example__title {
    font-weight: 600;
    font-size: 0.875rem;
  }
</style>
