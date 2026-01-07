<script setup lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { computed, onMounted, ref, shallowRef, useId, watch } from 'vue'

  // Types
  import type Mermaid from 'mermaid'

  const mermaid = shallowRef<typeof Mermaid>()

  async function loadMermaid () {
    if (mermaid.value) return mermaid.value

    const { default: m } = await import('mermaid')
    m.initialize({
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
    mermaid.value = m
    return m
  }

  const props = defineProps<{
    code: string // base64 encoded
  }>()

  const decodedCode = computed(() => decodeBase64(props.code))

  const svg = ref('')
  const id = `mermaid-${useId()}`

  async function render () {
    if (!decodedCode.value) return
    try {
      const m = await loadMermaid()
      const { svg: rendered } = await m.render(id, decodedCode.value)
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
  <Dialog.Root>
    <Dialog.Activator class="docs-mermaid flex justify-center w-full my-4 overflow-x-auto cursor-pointer hover:opacity-80 transition-opacity">
      <div class="flex justify-center w-full" v-html="svg" />
    </Dialog.Activator>

    <Dialog.Content class="docs-mermaid-dialog m-auto rounded-xl bg-glass-surface border border-divider">
      <div class="flex items-center justify-end p-2">
        <Dialog.Title class="sr-only">
          Diagram
        </Dialog.Title>

        <Dialog.Description class="sr-only">
          Click outside or press Escape to close
        </Dialog.Description>

        <Dialog.Close aria-label="Close diagram" class="p-1.5 rounded-md bg-surface/50 hover:bg-surface border border-divider">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </Dialog.Close>
      </div>

      <div
        class="docs-mermaid flex justify-center p-4"
        v-html="svg"
      />
    </Dialog.Content>
  </Dialog.Root>
</template>

<style>
  .docs-mermaid svg {
    max-width: 100%;
    height: auto;
  }

  /* Rounded nodes */
  .docs-mermaid .node rect,
  .docs-mermaid .node polygon {
    rx: 8px;
    ry: 8px;
    fill: var(--v0-surface) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid .node .label,
  .docs-mermaid .nodeLabel {
    color: var(--v0-on-surface) !important;
    fill: var(--v0-on-surface) !important;
  }

  /* Rounded subgraphs */
  .docs-mermaid .cluster rect {
    rx: 12px;
    ry: 12px;
    fill: var(--v0-surface) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid .cluster .nodeLabel,
  .docs-mermaid .cluster .text-inner-tspan,
  .docs-mermaid .cluster-label {
    color: var(--v0-on-surface) !important;
    fill: var(--v0-on-surface) !important;
  }

  .docs-mermaid .flowchart-link {
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid .marker {
    fill: var(--v0-primary) !important;
    stroke: var(--v0-primary) !important;
  }

  /* Dialog expanded view */
  .docs-mermaid-dialog {
    min-width: min(800px, 90vw);
  }

  .docs-mermaid-dialog .docs-mermaid {
    width: 100%;
  }

  .docs-mermaid-dialog .docs-mermaid svg {
    width: 100%;
    height: auto;
    max-width: none;
  }

  /* Dialog open animation */
  @keyframes dialog-open {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes backdrop-fade {
    from { background: rgb(0 0 0 / 0); }
    to { background: rgb(0 0 0 / 0.5); }
  }

  .docs-mermaid-dialog[open] {
    animation: dialog-open 150ms ease-out;
  }

  .docs-mermaid-dialog[open]::backdrop {
    animation: backdrop-fade 150ms ease-out forwards;
  }
</style>
