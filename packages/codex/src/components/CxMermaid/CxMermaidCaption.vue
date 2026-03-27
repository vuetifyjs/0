<script setup lang="ts">
  defineOptions({ name: 'CxMermaidCaption' })
</script>

<template>
  <figcaption class="codex-mermaid__caption">
    <slot />
  </figcaption>
</template>

<style scoped>
  .codex-mermaid__caption {
    font-size: 0.8125rem;
    font-style: italic;
    text-align: center;
  }
</style>
