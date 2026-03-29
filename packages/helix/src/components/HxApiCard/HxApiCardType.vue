<script setup lang="ts">
  defineOptions({ name: 'HxApiCardType' })
</script>

<template>
  <div class="helix-api-card__type">
    <code><slot /></code>
  </div>
</template>

<style scoped>
  .helix-api-card__type code {
    font-family: monospace;
    font-size: 0.8125rem;
    color: var(--v0-primary);
  }
</style>
