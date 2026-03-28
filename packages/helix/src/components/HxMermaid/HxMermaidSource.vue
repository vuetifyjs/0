<script setup lang="ts">
  defineOptions({ name: 'HxMermaidSource' })
</script>

<template>
  <pre class="helix-mermaid__source"><code><slot /></code></pre>
</template>

<style scoped>
  .helix-mermaid__source {
    margin: 0;
    font-family: monospace;
    font-size: 0.8125rem;
    white-space: pre-wrap;
  }
</style>
