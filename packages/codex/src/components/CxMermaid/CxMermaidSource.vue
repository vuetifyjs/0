<script setup lang="ts">
  defineOptions({ name: 'CxMermaidSource' })
</script>

<template>
  <pre class="codex-mermaid__source"><code><slot /></code></pre>
</template>

<style scoped>
  .codex-mermaid__source {
    margin: 0;
    font-family: monospace;
    font-size: 0.8125rem;
    white-space: pre-wrap;
  }
</style>
