<script setup lang="ts">
  defineOptions({ name: 'HxApiCardDescription' })
</script>

<template>
  <p class="helix-api-card__description">
    <slot />
  </p>
</template>

<style scoped>
  .helix-api-card__description {
    margin: 0;
    font-size: 0.875rem;
  }
</style>
