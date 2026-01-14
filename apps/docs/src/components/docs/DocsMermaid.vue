<script setup lang="ts">
  // Framework
  import { Dialog, useEventListener, useLogger, useResizeObserver } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, useId, watch } from 'vue'

  const { prefersReducedMotion } = useSettings()
  const { copied, copy } = useClipboard()
  const logger = useLogger()

  // Types
  import type Mermaid from 'mermaid'
  import type { Instance as PanZoomInstance } from 'svg-pan-zoom'

  const mermaid = shallowRef<typeof Mermaid>()
  const panZoomInstance = shallowRef<PanZoomInstance>()
  const dialogSvgRef = ref<HTMLElement>()
  const isOpen = ref(false)

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

  async function loadPanZoom () {
    const { default: svgPanZoom } = await import('svg-pan-zoom')
    return svgPanZoom
  }

  // Custom touch events handler for mobile support
  function createTouchEventsHandler () {
    let pannedX = 0
    let pannedY = 0
    let initialScale = 1
    let initialDistance = 0
    let lastTap = 0
    let instance: PanZoomInstance | null = null
    const cleanups: Array<() => void> = []

    function getDistance (touches: TouchList) {
      const [t1, t2] = [touches[0], touches[1]]
      return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
    }

    function getCenter (touches: TouchList) {
      const [t1, t2] = [touches[0], touches[1]]
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      }
    }

    function handleTouchStart (e: TouchEvent) {
      if (!instance) return

      if (e.touches.length === 1) {
        // Check for double tap
        const now = Date.now()
        if (now - lastTap < 300) {
          instance.zoomIn()
          lastTap = 0
        } else {
          lastTap = now
        }
        pannedX = 0
        pannedY = 0
      } else if (e.touches.length === 2) {
        // Start pinch
        initialScale = instance.getZoom()
        initialDistance = getDistance(e.touches)
        e.preventDefault()
      }
    }

    function handleTouchMove (e: TouchEvent) {
      if (!instance) return

      if (e.touches.length === 1) {
        // Pan
        const touch = e.touches[0]
        const deltaX = touch.clientX - (pannedX || touch.clientX)
        const deltaY = touch.clientY - (pannedY || touch.clientY)

        if (pannedX !== 0 || pannedY !== 0) {
          instance.panBy({ x: deltaX, y: deltaY })
        }

        pannedX = touch.clientX
        pannedY = touch.clientY
        e.preventDefault()
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const distance = getDistance(e.touches)
        const scale = distance / initialDistance
        const center = getCenter(e.touches)

        instance.zoomAtPoint(initialScale * scale, center)
        e.preventDefault()
      }
    }

    function handleTouchEnd (e: TouchEvent) {
      pannedX = 0
      pannedY = 0

      // Reset pinch if no more touches
      if (e.touches.length < 2) {
        initialDistance = 0
      }
    }

    return {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
      init (options: { svgElement: SVGElement, instance: PanZoomInstance }) {
        instance = options.instance

        cleanups.push(
          useEventListener(options.svgElement, 'touchstart', handleTouchStart, { passive: false }),
          useEventListener(options.svgElement, 'touchmove', handleTouchMove, { passive: false }),
          useEventListener(options.svgElement, 'touchend', handleTouchEnd),
          useEventListener(options.svgElement, 'touchcancel', handleTouchEnd),
        )
      },
      destroy () {
        for (const cleanup of cleanups) {
          cleanup()
        }
        cleanups.length = 0
        instance = null
      },
    }
  }

  const props = defineProps<{
    code: string // base64 encoded
    caption?: string // base64 encoded
  }>()

  const decodedCaption = computed(() => props.caption ? decodeBase64(props.caption) : undefined)

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
      logger.error('Mermaid render error', error)
      svg.value = `<pre class="text-error">${decodedCode.value}</pre>`
    }
  }

  async function initPanZoom () {
    await nextTick()
    const svgElement = dialogSvgRef.value?.querySelector('svg')
    if (!svgElement) return

    // Destroy previous instance if exists
    if (panZoomInstance.value) {
      panZoomInstance.value.destroy()
      panZoomInstance.value = undefined
    }

    const svgPanZoom = await loadPanZoom()
    panZoomInstance.value = svgPanZoom(svgElement, {
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 10,
      zoomScaleSensitivity: 0.3,
      customEventsHandler: createTouchEventsHandler(),
    })
  }

  function zoomIn () {
    panZoomInstance.value?.zoomIn()
  }

  function zoomOut () {
    panZoomInstance.value?.zoomOut()
  }

  function resetZoom () {
    panZoomInstance.value?.resetZoom()
    panZoomInstance.value?.resetPan()
    panZoomInstance.value?.fit()
    panZoomInstance.value?.center()
  }

  function copySvg () {
    copy(svg.value)
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

  watch(isOpen, async open => {
    if (open) {
      await initPanZoom()
    } else if (panZoomInstance.value) {
      panZoomInstance.value.destroy()
      panZoomInstance.value = undefined
    }
  })

  // Update pan-zoom when container resizes (e.g., window resize while dialog open)
  useResizeObserver(dialogSvgRef, () => {
    if (panZoomInstance.value) {
      panZoomInstance.value.resize()
      panZoomInstance.value.fit()
      panZoomInstance.value.center()
    }
  })

  onMounted(render)
  onUnmounted(() => panZoomInstance.value?.destroy())
  watch(decodedCode, render)
</script>

<template>
  <Dialog.Root v-model="isOpen">
    <Dialog.Activator class="docs-mermaid flex justify-center w-full my-4 overflow-x-auto cursor-pointer hover:opacity-80 transition-opacity">
      <figure class="flex flex-col items-center w-full">
        <div class="flex justify-center w-full" v-html="svg" />
        <figcaption v-if="decodedCaption" class="mt-2 text-sm text-on-surface-variant italic">
          {{ decodedCaption }}
        </figcaption>
      </figure>
    </Dialog.Activator>

    <Dialog.Content :class="['docs-mermaid-dialog m-auto rounded-xl bg-glass-surface border border-divider', prefersReducedMotion && 'reduce-motion']">
      <!-- Header toolbar -->
      <div class="flex items-center justify-between gap-2 p-2 border-b border-divider">
        <Dialog.Title as="span" class="sr-only">
          {{ decodedCaption || 'Diagram' }}
        </Dialog.Title>

        <Dialog.Description class="sr-only">
          Use controls to zoom and pan. Click outside or press Escape to close.
        </Dialog.Description>

        <!-- Zoom controls -->
        <div class="flex items-center gap-1">
          <button
            aria-label="Zoom out"
            class="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-divider"
            title="Zoom out"
            type="button"
            @click="zoomOut"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <button
            aria-label="Zoom in"
            class="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-divider"
            title="Zoom in"
            type="button"
            @click="zoomIn"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <button
            aria-label="Reset view"
            class="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-divider"
            title="Reset view"
            type="button"
            @click="resetZoom"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <div class="w-px h-4 bg-divider mx-1" />
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-1">
          <button
            :aria-label="copied ? 'Copied!' : 'Copy SVG'"
            class="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-divider"
            :title="copied ? 'Copied!' : 'Copy SVG'"
            type="button"
            @click="copySvg"
          >
            <svg
              v-if="!copied"
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
            class="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-divider"
            title="Download SVG"
            type="button"
            @click="downloadSvg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <div class="w-px h-4 bg-divider mx-1" />

          <Dialog.Close aria-label="Close diagram" class="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-divider" title="Close">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </Dialog.Close>
        </div>
      </div>

      <!-- Diagram area -->
      <figure>
        <div
          ref="dialogSvgRef"
          class="docs-mermaid docs-mermaid-panzoom"
          v-html="svg"
        />
        <figcaption v-if="decodedCaption" class="pb-4 text-center text-sm text-on-surface-variant italic">
          {{ decodedCaption }}
        </figcaption>
      </figure>
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

  /* Semantic node classes (use with classDef in mermaid) */
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

  /* Dialog expanded view */
  .docs-mermaid-dialog[open] {
    width: min(90vw, 1200px);
    height: min(80vh, 900px);
    display: flex;
    flex-direction: column;
  }

  .docs-mermaid-dialog figure {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* Pan-zoom enabled SVG container */
  .docs-mermaid-panzoom {
    flex: 1;
    width: 100%;
    min-height: 0;
    overflow: hidden;
    cursor: grab;
    touch-action: none; /* Prevent default touch behaviors for custom pan/zoom */
    -webkit-user-select: none;
    user-select: none;
  }

  .docs-mermaid-panzoom:active {
    cursor: grabbing;
  }

  @media (pointer: coarse) {
    .docs-mermaid-panzoom {
      cursor: default;
    }

    /* Prevent sticky hover states on touch devices */
    .docs-mermaid-dialog button:hover:not(:focus-visible):not(:active) {
      background-color: transparent;
      border-color: transparent;
    }
  }

  .docs-mermaid-panzoom svg {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
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

  .docs-mermaid-dialog.reduce-motion[open],
  .docs-mermaid-dialog.reduce-motion[open]::backdrop {
    animation: none;
  }

  .docs-mermaid-dialog.reduce-motion[open]::backdrop {
    background: rgb(0 0 0 / 0.5);
  }
</style>
