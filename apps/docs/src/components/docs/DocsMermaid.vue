<script setup lang="ts">
  import { HxMermaid } from '@paper/helix'

  // Framework
  import { useLogger } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { onMounted, ref, toRef, useId, watch } from 'vue'

  // Types
  import type Mermaid from 'mermaid'

  const settings = useSettings()
  const clipboard = useClipboard()
  const logger = useLogger()

  const mermaid = ref<typeof Mermaid>()

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
    caption?: string // base64 encoded
  }>()

  const decodedCaption = toRef(() => props.caption ? decodeBase64(props.caption) : undefined)
  const decodedCode = toRef(() => decodeBase64(props.code))

  const svg = ref('')
  const id = `mermaid-${useId()}`

  async function render () {
    if (!decodedCode.value) return
    try {
      const m = await loadMermaid()
      const { svg: rendered } = await m.render(id, decodedCode.value)
      svg.value = rendered
    } catch (error) {
      logger.error('Mermaid render error', error)
      svg.value = `<pre class="text-error">${decodedCode.value}</pre>`
    }
  }

  function copySvg () {
    clipboard.copy(svg.value)
  }

  function downloadSvg () {
    const blob = new Blob([svg.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${decodedCaption.value || 'diagram'}.svg`
    document.body.append(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  onMounted(render)
  watch(decodedCode, render)
</script>

<template>
  <HxMermaid
    :caption="decodedCaption"
    :class="['docs-mermaid my-4 w-full overflow-x-auto', settings.prefersReducedMotion.value && 'reduce-motion']"
    :code="svg"
    zoom
  >
    <template #actions>
      <button
        :aria-label="clipboard.copied.value ? 'Copied!' : 'Copy SVG'"
        class="btn-icon"
        :title="clipboard.copied.value ? 'Copied!' : 'Copy SVG'"
        type="button"
        @click="copySvg"
      >
        <svg
          v-if="!clipboard.copied.value"
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-success"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </button>

      <button
        aria-label="Download SVG"
        class="btn-icon"
        title="Download SVG"
        type="button"
        @click="downloadSvg"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </button>

      <div class="w-px h-4 bg-divider mx-1" />
    </template>
  </HxMermaid>
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

  .docs-mermaid .cluster-label text {
    transform: translateY(4px);
  }

  .docs-mermaid .flowchart-link {
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid .marker {
    fill: var(--v0-primary) !important;
    stroke: var(--v0-primary) !important;
  }

  /* State diagram styling */
  .docs-mermaid .statediagram-state .basic path {
    fill: var(--v0-surface) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid .statediagram-state .nodeLabel,
  .docs-mermaid .statediagram-state .nodeLabel p {
    color: var(--v0-on-surface) !important;
  }

  .docs-mermaid g.stateGroup rect {
    fill: var(--v0-surface) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid g.stateGroup text,
  .docs-mermaid g.stateGroup .state-title {
    fill: var(--v0-on-surface) !important;
  }

  .docs-mermaid .transition {
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid [id*="stateDiagram-barbEnd"] path {
    fill: var(--v0-primary) !important;
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid .node circle.state-start {
    fill: var(--v0-primary) !important;
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid .node circle.state-end {
    fill: var(--v0-primary) !important;
    stroke: transparent !important;
  }

  .docs-mermaid .statediagram .edgeLabel {
    background-color: var(--v0-surface) !important;
  }

  .docs-mermaid .statediagram .edgeLabel p,
  .docs-mermaid .statediagram .edgeLabel .text-inner-tspan {
    background-color: var(--v0-surface) !important;
    color: var(--v0-on-surface-variant) !important;
    fill: var(--v0-on-surface-variant) !important;
  }

  .docs-mermaid .statediagram .edgeLabel rect.background {
    fill: var(--v0-surface) !important;
    opacity: 1 !important;
  }

  /* Sequence diagram styling */
  .docs-mermaid rect.actor {
    rx: 8px;
    ry: 8px;
    fill: var(--v0-surface) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid text.actor > tspan {
    fill: var(--v0-on-surface) !important;
  }

  .docs-mermaid .actor-line {
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid .messageLine0,
  .docs-mermaid .messageLine1 {
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid .messageText {
    fill: var(--v0-on-surface) !important;
    stroke: none !important;
  }

  .docs-mermaid .activation {
    fill: color-mix(in srgb, var(--v0-primary) 10%, transparent) !important;
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid .labelBox {
    fill: var(--v0-surface-variant) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid .labelText,
  .docs-mermaid .labelText > tspan {
    fill: var(--v0-on-surface-variant) !important;
  }

  .docs-mermaid .loopLine {
    stroke: var(--v0-divider) !important;
    fill: none !important;
  }

  .docs-mermaid .loopText,
  .docs-mermaid .loopText > tspan {
    fill: var(--v0-on-surface-variant) !important;
  }

  .docs-mermaid .note {
    fill: var(--v0-surface-variant) !important;
    stroke: var(--v0-divider) !important;
  }

  .docs-mermaid .noteText,
  .docs-mermaid .noteText > tspan {
    fill: var(--v0-on-surface) !important;
  }

  .docs-mermaid #arrowhead path {
    fill: var(--v0-primary) !important;
    stroke: var(--v0-primary) !important;
  }

  .docs-mermaid .sequenceNumber {
    fill: var(--v0-on-primary) !important;
  }

  /* Semantic node classes (use with classDef in mermaid) */
  .docs-mermaid .node.primary rect,
  .docs-mermaid .node.primary polygon {
    fill: var(--v0-primary) !important;
  }

  .docs-mermaid .node.primary .nodeLabel {
    fill: var(--v0-on-primary) !important;
    color: var(--v0-on-primary) !important;
  }

  .docs-mermaid .node.secondary rect,
  .docs-mermaid .node.secondary polygon {
    fill: var(--v0-secondary) !important;
  }

  .docs-mermaid .node.secondary .nodeLabel {
    fill: var(--v0-on-secondary) !important;
    color: var(--v0-on-secondary) !important;
  }

  .docs-mermaid .node.accent rect,
  .docs-mermaid .node.accent polygon {
    fill: var(--v0-accent) !important;
  }

  .docs-mermaid .node.accent .nodeLabel {
    fill: var(--v0-on-accent) !important;
    color: var(--v0-on-accent) !important;
  }

  .docs-mermaid .node.success rect,
  .docs-mermaid .node.success polygon {
    fill: var(--v0-success) !important;
  }

  .docs-mermaid .node.success .nodeLabel {
    fill: var(--v0-on-success) !important;
    color: var(--v0-on-success) !important;
  }

  .docs-mermaid .node.info rect,
  .docs-mermaid .node.info polygon {
    fill: var(--v0-info) !important;
  }

  .docs-mermaid .node.info .nodeLabel {
    fill: var(--v0-on-info) !important;
    color: var(--v0-on-info) !important;
  }

  .docs-mermaid .node.warning rect,
  .docs-mermaid .node.warning polygon {
    fill: var(--v0-warning) !important;
  }

  .docs-mermaid .node.warning .nodeLabel {
    fill: var(--v0-on-warning) !important;
    color: var(--v0-on-warning) !important;
  }

  .docs-mermaid .node.error rect,
  .docs-mermaid .node.error polygon {
    fill: var(--v0-error) !important;
  }

  .docs-mermaid .node.error .nodeLabel {
    fill: var(--v0-on-error) !important;
    color: var(--v0-on-error) !important;
  }

  .docs-mermaid .node.muted rect,
  .docs-mermaid .node.muted polygon {
    fill: var(--v0-surface-variant) !important;
    stroke: var(--v0-divider) !important;
    stroke-width: 1px !important;
  }

  .docs-mermaid .node.muted .nodeLabel {
    fill: var(--v0-on-surface-variant) !important;
    color: var(--v0-on-surface-variant) !important;
  }

  /* Dialog styling */
  .docs-mermaid .helix-mermaid__dialog[open] {
    border-radius: 0.75rem;
    border: 1px solid var(--v0-divider);
  }

  .docs-mermaid .helix-mermaid__toolbar {
    border-bottom: 1px solid var(--v0-divider);
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
    to { background: rgb(0 0 0 / 0.3); }
  }

  .docs-mermaid .helix-mermaid__dialog[open] {
    animation: dialog-open 150ms ease-out;
  }

  .docs-mermaid .helix-mermaid__dialog[open]::backdrop {
    animation: backdrop-fade 150ms ease-out forwards;
  }

  .docs-mermaid.reduce-motion .helix-mermaid__dialog[open],
  .docs-mermaid.reduce-motion .helix-mermaid__dialog[open]::backdrop {
    animation: none;
  }

  .docs-mermaid.reduce-motion .helix-mermaid__dialog[open]::backdrop {
    background: rgb(0 0 0 / 0.3);
  }
</style>
