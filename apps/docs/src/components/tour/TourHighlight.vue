/**
 * @module TourHighlight
 *
 * @remarks
 * SVG overlay component that highlights a target element during a tour.
 * Creates a dark backdrop with a cutout around the target element,
 * matching the target's border radius.
 */

<script lang="ts">
  export interface TourHighlightProps {
    /** Padding around the highlighted element */
    padding?: number
    /** Backdrop opacity (0-1) */
    opacity?: number
    /** Border radius for the cutout (auto-detected from target if not set) */
    borderRadius?: number | string
  }

  export interface TourHighlightSlotProps {
    /** Whether the highlight is visible */
    isVisible: boolean
    /** Current target rect */
    rect: DOMRect | null
  }
</script>

<script setup lang="ts">
  // Context
  import { useTourContext } from './TourRoot.vue'

  // Utilities
  import { computed, toRef, watch, shallowRef } from 'vue'

  defineOptions({ name: 'TourHighlight' })

  defineSlots<{
    default?: (props: TourHighlightSlotProps) => any
  }>()

  const props = withDefaults(defineProps<TourHighlightProps>(), {
    padding: 8,
    opacity: 0.75,
    borderRadius: undefined,
  })

  const tour = useTourContext()

  // Track border radius from target element
  const detectedRadius = shallowRef<string>('8px')

  // Update border radius when target changes
  watch(tour.targetElement, el => {
    if (el) {
      const computed = getComputedStyle(el)
      detectedRadius.value = computed.borderRadius || '8px'
    }
  }, { immediate: true })

  // Computed rect with padding
  const rect = computed(() => {
    const r = tour.targetRect.value
    if (!r) return null

    return {
      x: r.x - props.padding,
      y: r.y - props.padding,
      width: r.width + props.padding * 2,
      height: r.height + props.padding * 2,
    }
  })

  // Border radius for SVG (capped to prevent oval/circle appearance)
  const borderRadius = computed(() => {
    let radius: number
    if (props.borderRadius !== undefined) {
      radius = typeof props.borderRadius === 'number'
        ? props.borderRadius
        : parseFloat(props.borderRadius) || 8
    } else {
      radius = parseFloat(detectedRadius.value) || 8
    }

    // Cap border-radius to half the minimum dimension to prevent oval appearance
    const r = rect.value
    if (r) {
      const maxRadius = Math.min(r.width, r.height) / 2
      radius = Math.min(radius, maxRadius)
    }

    return radius
  })

  const isVisible = computed(() => tour.isActive.value && rect.value !== null)

  const slotProps = toRef((): TourHighlightSlotProps => ({
    isVisible: isVisible.value,
    rect: tour.targetRect.value,
  }))
</script>

<template>
  <Teleport to="body">
    <Transition name="tour-highlight">
      <svg
        v-if="isVisible && rect"
        aria-hidden="true"
        class="fixed inset-0 z-9998 pointer-events-none w-screen h-screen"
      >
        <defs>
          <mask id="tour-highlight-mask">
            <!-- White background = visible -->
            <rect fill="white" height="100%" width="100%" />
            <!-- Black cutout = transparent -->
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
        <!-- Backdrop with mask applied -->
        <rect
          :fill="`rgba(0, 0, 0, ${opacity})`"
          height="100%"
          mask="url(#tour-highlight-mask)"
          width="100%"
        />

        <!-- Border around the cutout -->
        <rect
          class="stroke-primary"
          fill="none"
          :height="rect.height"
          :rx="borderRadius"
          :ry="borderRadius"
          stroke-width="2"
          :width="rect.width"
          :x="rect.x"
          :y="rect.y"
        />

        <slot v-bind="slotProps" />
      </svg>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transition animations - can't be done with utility classes */
.tour-highlight-enter-active,
.tour-highlight-leave-active {
  transition: opacity 0.2s ease;
}

.tour-highlight-enter-from,
.tour-highlight-leave-to {
  opacity: 0;
}
</style>
