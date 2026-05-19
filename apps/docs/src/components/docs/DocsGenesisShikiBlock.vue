<script setup lang="ts">
  // Composables
  import { useHighlightCode } from '@/composables/useHighlightCode'

  const { code, language = 'vue' } = defineProps<{
    code: string
    language?: string
  }>()

  const { highlightedCode } = useHighlightCode(() => code, { lang: language })
</script>

<template>
  <div
    v-if="highlightedCode"
    class="docs-genesis-shiki-block"
    v-html="highlightedCode"
  />

  <pre v-else class="docs-genesis-shiki-block__fallback"><code>{{ code }}</code></pre>
</template>

<style scoped>
  .docs-genesis-shiki-block :deep(pre),
  .docs-genesis-shiki-block__fallback {
    margin: 0;
    padding: 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    white-space: pre;
    overflow-x: auto;
    background: transparent;
  }
</style>
