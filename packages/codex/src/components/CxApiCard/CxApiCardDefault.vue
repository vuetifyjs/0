<script setup lang="ts">
  defineOptions({ name: 'CxApiCardDefault' })
</script>

<template>
  <div class="codex-api-card__default">
    Default: <code><slot /></code>
  </div>
</template>

<style scoped>
  .codex-api-card__default code {
    font-family: monospace;
    font-size: 0.8125rem;
  }
</style>
