/**
 * @module TourHighlight
 *
 * @remarks
 * SVG overlay with cutout that highlights the active step's activator.
 * Tracks activator bounding rect via rAF loop. Teleports to body.
 * Renders full scrim for dialog/floating steps without activators.
 */

<script lang="ts">
  // Types
  export interface TourHighlightProps {
    namespace?: string
    /** Backdrop opacity (0-1). @default 0.5 */
    opacity?: number
    /** Padding around the highlighted element. @default 0 */
    padding?: number
    /** Whether clicking the backdrop dismisses the tour. @default false */
    dismissible?: boolean
  }

  export interface TourHighlightSlotProps {
    rect: { x: number, y: number, width: number, height: number } | null
    radius: number
    isVisible: boolean
  }
</script>

<script setup lang="ts">
  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Composables
  import { useTour } from '#v0/composables/useTour'

  // Utilities
  import { useId } from '#v0/utilities'
  import { onBeforeUnmount, shallowRef, toRef, watch } from 'vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  defineOptions({ name: 'TourHighlight' })

  defineSlots<{
    default: (props: TourHighlightSlotProps) => any
  }>()

  const {
    namespace = 'v0:tour',
    opacity = 0.5,
    padding = 0,
    dismissible = false,
  } = defineProps<TourHighlightProps>()

  const tour = useTour(namespace)
  const maskId = `tour-highlight-${useId()}`

  const rect = shallowRef<{ x: number, y: number, width: number, height: number } | null>(null)
  const borderRadius = shallowRef(0)

  function updateRect () {
    const id = tour.selectedId.value
    if (!id || !tour.isActive.value) {
      if (rect.value !== null) rect.value = null
      return
    }

    const step = tour.steps.get(id)
    if (step?.type === 'dialog' || step?.type === 'floating') {
      if (rect.value !== null) rect.value = null
      return
    }

    const activator = tour.activators.get(id)
    const el = toElement(activator?.element)
    const r = el?.getBoundingClientRect()
    if (!r) return

    const p = activator?.padding ?? padding

    const newRect = {
      x: r.x - p,
      y: r.y - p,
      width: r.width + p * 2,
      height: r.height + p * 2,
    }

    if (
      !rect.value
      || rect.value.x !== newRect.x
      || rect.value.y !== newRect.y
      || rect.value.width !== newRect.width
      || rect.value.height !== newRect.height
    ) {
      rect.value = newRect
    }

    if (el) {
      const styles = getComputedStyle(el)
      const newRadius = Number.parseFloat(styles.borderRadius) || 0
      if (borderRadius.value !== newRadius) {
        borderRadius.value = newRadius
      }
    }
  }

  // Continuous RAF loop
  let rafId: number | null = null

  function startLoop () {
    if (rafId !== null || !IN_BROWSER) return
    function loop () {
      updateRect()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
  }

  function stopLoop () {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    rect.value = null
  }

  watch(
    () => tour.isActive.value,
    active => {
      if (active) startLoop()
      else stopLoop()
    },
    { immediate: true },
  )

  onBeforeUnmount(stopLoop)

  const isVisible = toRef(() => tour.isActive.value)
  const showCutout = toRef(() => rect.value !== null)

  function onBackdropClick () {
    if (dismissible) tour.stop()
  }

  const slotProps = toRef((): TourHighlightSlotProps => ({
    rect: rect.value,
    radius: borderRadius.value,
    isVisible: isVisible.value,
  }))
</script>

<template>
  <slot v-bind="slotProps" />

  <Teleport to="body">
    <div v-if="isVisible" class="fixed inset-0 pointer-events-none" style="z-index: 9998">
      <!-- Click layer for backdrop dismissal -->
      <div
        v-if="dismissible"
        aria-hidden="true"
        class="absolute inset-0 pointer-events-auto"
        @click="onBackdropClick"
      />

      <!-- SVG Backdrop -->
      <svg
        aria-hidden="true"
        class="absolute inset-0 pointer-events-none w-screen h-screen"
      >
        <template v-if="showCutout && rect">
          <defs>
            <mask :id="maskId">
              <rect fill="white" height="100%" width="100%" />
              <rect
                fill="black"
                :height="rect.height"
                :rx="borderRadius"
                :ry="borderRadius"
                :width="rect.width"
                :x="rect.x"
                :y="rect.y"
              />
            </mask>
          </defs>

          <rect
            :fill="`rgba(0, 0, 0, ${opacity})`"
            height="100%"
            :mask="`url(#${maskId})`"
            width="100%"
          />

          <rect
            class="fill-none"
            :height="rect.height"
            :rx="borderRadius"
            :ry="borderRadius"
            stroke="currentColor"
            stroke-opacity="0.3"
            stroke-width="2"
            :width="rect.width"
            :x="rect.x"
            :y="rect.y"
          />
        </template>

        <!-- Full scrim for dialog/floating steps -->
        <rect
          v-else
          :fill="`rgba(0, 0, 0, ${opacity})`"
          height="100%"
          width="100%"
        />
      </svg>
    </div>
  </Teleport>
</template>
