<script setup lang="ts">
  defineOptions({ name: 'CxApiCardName' })
</script>

<template>
  <code class="codex-api-card__name">
    <slot />
  </code>
</template>

<style scoped>
  .codex-api-card__name {
    font-family: monospace;
    font-weight: 600;
  }
</style>
