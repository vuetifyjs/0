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
  /* Override the global .shiki rule (App.vue ~line 543) which adds border +
     8px border-radius. Inside the example container we want a flush block:
     no border, no top radius. Visual rounding comes from the parent
     .genesis-docs-example__code (overflow: hidden + nth-last-child radius). */
  .docs-genesis-shiki-block :deep(.shiki) {
    border: none;
    border-radius: 0;
    background: transparent;
  }

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

  .docs-genesis-shiki-block :deep(pre code) {
    padding: 0 0 0.5rem;
  }
</style>
