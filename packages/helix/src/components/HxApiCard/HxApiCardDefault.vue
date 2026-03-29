<script setup lang="ts">
  defineOptions({ name: 'HxApiCardDefault' })
</script>

<template>
  <div class="helix-api-card__default">
    Default: <code><slot /></code>
  </div>
</template>

<style scoped>
  .helix-api-card__default {
    font-size: 0.8125rem;
    color: var(--v0-on-surface-variant);
  }

  .helix-api-card__default code {
    font-family: monospace;
    font-size: 0.8125rem;
    color: var(--v0-on-surface);
  }
</style>
