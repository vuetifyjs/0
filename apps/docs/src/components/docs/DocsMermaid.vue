<script lang="ts" setup>
  import mermaid from 'mermaid'
  import { computed, onMounted, ref, watch } from 'vue'

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      // Node styling
      primaryColor: '#e0e7ff',
      primaryTextColor: '#1e1b4b',
      primaryBorderColor: '#6366f1',
      lineColor: '#6366f1',
      // Subgraph styling
      secondaryColor: '#f5f3ff',
      secondaryBorderColor: '#a5b4fc',
      tertiaryColor: '#f5f3ff',
      tertiaryBorderColor: '#a5b4fc',
      // Background
      background: 'transparent',
      mainBkg: '#e0e7ff',
      nodeBorder: '#6366f1',
      clusterBkg: '#f5f3ff',
      clusterBorder: '#c7d2fe',
      // Text
      fontFamily: 'inherit',
      fontSize: '14px',
    },
    flowchart: {
      htmlLabels: false,
      curve: 'basis',
      padding: 16,
      nodeSpacing: 50,
      rankSpacing: 50,
      useMaxWidth: true,
    },
  })

  const props = defineProps<{
    code: string // base64 encoded
  }>()

  const decodedCode = computed(() => {
    try {
      return atob(props.code)
    } catch {
      return props.code
    }
  })

  const svg = ref('')
  const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`

  async function render () {
    if (!decodedCode.value) return
    try {
      const { svg: rendered } = await mermaid.render(id, decodedCode.value)
      svg.value = rendered
    } catch (error) {
      console.error('Mermaid render error:', error)
      svg.value = `<pre class="text-error">${decodedCode.value}</pre>`
    }
  }

  onMounted(render)
  watch(decodedCode, render)
</script>

<template>
  <div
    class="docs-mermaid flex justify-center w-full my-4 overflow-x-auto"
    v-html="svg"
  />
</template>

<style scoped>
  .docs-mermaid :deep(svg) {
    max-width: 100%;
    height: auto;
  }

  /* Rounded nodes */
  .docs-mermaid :deep(.node rect),
  .docs-mermaid :deep(.node polygon) {
    rx: 8px;
    ry: 8px;
    fill: var(--v0-pre) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid :deep(.node .label),
  .docs-mermaid :deep(.nodeLabel) {
    color: var(--v0-on-surface) !important;
    fill: var(--v0-on-surface) !important;
  }

  /* Rounded subgraphs */
  .docs-mermaid :deep(.cluster rect) {
    rx: 12px;
    ry: 12px;
    fill: var(--v0-surface) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid :deep(.cluster .nodeLabel),
  .docs-mermaid :deep(.cluster .text-inner-tspan),
  .docs-mermaid :deep(.cluster-label) {
    color: var(--v0-on-surface) !important;
    fill: var(--v0-on-surface) !important;
  }
</style>
