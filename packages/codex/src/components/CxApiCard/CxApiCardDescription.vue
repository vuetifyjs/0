<script setup lang="ts">
  defineOptions({ name: 'CxApiCardDescription' })
</script>

<template>
  <p class="codex-api-card__description">
    <slot />
  </p>
</template>

<style scoped>
  .codex-api-card__description {
    margin: 0;
    font-size: 0.875rem;
  }
</style>
