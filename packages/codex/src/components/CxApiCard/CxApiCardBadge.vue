<script setup lang="ts">
  defineOptions({ name: 'CxApiCardBadge' })
</script>

<template>
  <span class="codex-api-card__badge">
    <slot />
  </span>
</template>

<style scoped>
  .codex-api-card__badge {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
