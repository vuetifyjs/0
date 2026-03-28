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
  }
</style>
