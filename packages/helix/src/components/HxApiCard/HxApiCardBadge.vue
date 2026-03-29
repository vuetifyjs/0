<script setup lang="ts">
  defineOptions({ name: 'HxApiCardBadge' })
</script>

<template>
  <span class="helix-api-card__badge">
    <slot />
  </span>
</template>

<style scoped>
  .helix-api-card__badge {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    background-color: var(--v0-surface);
    color: var(--v0-on-surface-variant);
    border: 1px solid var(--v0-divider);
  }
</style>
