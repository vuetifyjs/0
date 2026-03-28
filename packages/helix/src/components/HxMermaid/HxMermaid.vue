<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { Dialog, useEventListener, useResizeObserver } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  // svg-pan-zoom is an optional peer dep — inline the type to avoid import failure
  interface PanZoomInstance {
    zoom: (scale: number) => void
    getZoom: () => number
    resetZoom: () => void
    resize: () => void
    fit: () => void
    center: () => void
    destroy: () => void
  }

  export interface HxMermaidProps extends V0PaperProps {
    /** Rendered SVG/HTML content to display */
    code?: string
    /** Figure caption text */
    caption?: string
    /** Enable fullscreen pan-zoom dialog on click */
    zoom?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { nextTick, onUnmounted, ref, shallowRef, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'HxMermaid' })

  const {
    code,
    caption,
    zoom = false,
    ...paperProps
  } = defineProps<HxMermaidProps>()

  const isOpen = ref(false)
  const panZoomInstance = shallowRef<PanZoomInstance>()
  const dialogSvgRef = useTemplateRef<HTMLElement>('dialogSvg')

  // --- Pan-zoom ---

  async function loadPanZoom () {
    const mod = 'svg-pan-zoom'
    const { default: svgPanZoom } = await import(/* @vite-ignore */ mod)
    return svgPanZoom
  }

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

    function onTouchStart (e: TouchEvent) {
      if (!instance) return

      if (e.touches.length === 1) {
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
        initialScale = instance.getZoom()
        initialDistance = getDistance(e.touches)
        e.preventDefault()
      }
    }

    function onTouchMove (e: TouchEvent) {
      if (!instance) return

      if (e.touches.length === 1) {
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
        const distance = getDistance(e.touches)
        const scale = distance / initialDistance
        const center = getCenter(e.touches)

        instance.zoomAtPoint(initialScale * scale, center)
        e.preventDefault()
      }
    }

    function onTouchEnd (e: TouchEvent) {
      pannedX = 0
      pannedY = 0

      if (e.touches.length < 2) {
        initialDistance = 0
      }
    }

    return {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
      init (options: { svgElement: SVGElement, instance: PanZoomInstance }) {
        instance = options.instance

        cleanups.push(
          useEventListener(options.svgElement, 'touchstart', onTouchStart, { passive: false }),
          useEventListener(options.svgElement, 'touchmove', onTouchMove, { passive: false }),
          useEventListener(options.svgElement, 'touchend', onTouchEnd),
          useEventListener(options.svgElement, 'touchcancel', onTouchEnd),
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

  async function initPanZoom () {
    await nextTick()
    const svgElement = dialogSvgRef.value?.querySelector('svg')
    if (!svgElement) return

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

  watch(isOpen, async open => {
    if (open) {
      await initPanZoom()
    } else if (panZoomInstance.value) {
      panZoomInstance.value.destroy()
      panZoomInstance.value = undefined
    }
  })

  useResizeObserver(dialogSvgRef, () => {
    if (panZoomInstance.value) {
      panZoomInstance.value.resize()
      panZoomInstance.value.fit()
      panZoomInstance.value.center()
    }
  })

  onUnmounted(() => panZoomInstance.value?.destroy())
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="figure"
    class="helix-mermaid"
  >
    <template v-if="zoom">
      <Dialog.Root v-model="isOpen">
        <Dialog.Activator class="helix-mermaid__activator">
          <slot>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-if="code" v-html="code" />
          </slot>

          <HxMermaidCaption v-if="caption">
            {{ caption }}
          </HxMermaidCaption>
        </Dialog.Activator>

        <Dialog.Content class="helix-mermaid__dialog">
          <!-- Header toolbar -->
          <div class="helix-mermaid__toolbar">
            <Dialog.Title as="span" class="helix-mermaid__sr-only">
              {{ caption || 'Diagram' }}
            </Dialog.Title>

            <Dialog.Description class="helix-mermaid__sr-only">
              Use controls to zoom and pan. Click outside or press Escape to close.
            </Dialog.Description>

            <!-- Zoom controls -->
            <div class="helix-mermaid__controls">
              <button
                aria-label="Zoom out"
                class="helix-mermaid__btn"
                title="Zoom out"
                type="button"
                @click="zoomOut"
              >
                <svg class="helix-mermaid__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </button>

              <button
                aria-label="Zoom in"
                class="helix-mermaid__btn"
                title="Zoom in"
                type="button"
                @click="zoomIn"
              >
                <svg class="helix-mermaid__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </button>

              <button
                aria-label="Reset view"
                class="helix-mermaid__btn"
                title="Reset view"
                type="button"
                @click="resetZoom"
              >
                <svg class="helix-mermaid__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </button>
            </div>

            <!-- Right-side actions slot + close button -->
            <div class="helix-mermaid__actions">
              <slot name="actions" />

              <Dialog.Close aria-label="Close diagram" class="helix-mermaid__btn" title="Close">
                <svg class="helix-mermaid__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                </svg>
              </Dialog.Close>
            </div>
          </div>

          <!-- Diagram area -->
          <figure class="helix-mermaid__figure">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div ref="dialogSvg" class="helix-mermaid__panzoom" v-html="code" />

            <HxMermaidCaption v-if="caption">
              {{ caption }}
            </HxMermaidCaption>
          </figure>
        </Dialog.Content>
      </Dialog.Root>
    </template>

    <template v-else>
      <slot>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="code" v-html="code" />
      </slot>

      <HxMermaidCaption v-if="caption">
        {{ caption }}
      </HxMermaidCaption>
    </template>
  </V0Paper>
</template>

<style scoped>
  .helix-mermaid {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
  }

  .helix-mermaid__activator {
    cursor: pointer;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .helix-mermaid__dialog[open] {
    width: min(90vw, 1200px);
    height: min(80vh, 900px);
    display: flex;
    flex-direction: column;
  }

  .helix-mermaid__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .helix-mermaid__controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .helix-mermaid__actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .helix-mermaid__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem;
    border: none;
    background: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .helix-mermaid__icon {
    width: 1rem;
    height: 1rem;
  }

  .helix-mermaid__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .helix-mermaid__figure {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .helix-mermaid__panzoom {
    flex: 1;
    width: 100%;
    min-height: 0;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .helix-mermaid__panzoom:active {
    cursor: grabbing;
  }

  .helix-mermaid__panzoom :deep(svg) {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
  }

  @media (pointer: coarse) {
    .helix-mermaid__panzoom {
      cursor: default;
    }
  }
</style>
