<script setup lang="ts">
  defineOptions({ name: 'HxMermaidCaption' })
</script>

<template>
  <figcaption class="helix-mermaid__caption">
    <slot />
  </figcaption>
</template>

<style scoped>
  .helix-mermaid__caption {
    font-size: 0.8125rem;
    font-style: italic;
    text-align: center;
  }
</style>
