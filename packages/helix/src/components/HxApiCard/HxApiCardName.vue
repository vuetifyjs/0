<script setup lang="ts">
  defineOptions({ name: 'HxApiCardName' })
</script>

<template>
  <code class="helix-api-card__name">
    <slot />
  </code>
</template>

<style scoped>
  .helix-api-card__name {
    font-family: monospace;
    font-weight: 600;
  }
</style>
