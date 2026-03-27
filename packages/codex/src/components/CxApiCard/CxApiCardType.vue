<script setup lang="ts">
  defineOptions({ name: 'CxApiCardType' })
</script>

<template>
  <div class="codex-api-card__type">
    <code><slot /></code>
  </div>
</template>

<style scoped>
  .codex-api-card__type code {
    font-family: monospace;
    font-size: 0.8125rem;
  }
</style>
