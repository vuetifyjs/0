/**
 * @module DiscoveryHighlight
 *
 * @remarks
 * SVG overlay component that highlights the active step's activator element.
 * Creates a dark backdrop with a transparent cutout around the target,
 * matching the target's border radius.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DiscoveryHighlightProps extends AtomProps {
    /** Padding around the highlighted element */
    padding?: number
    /** Backdrop opacity (0-1) */
    opacity?: number
    /** Border radius for the cutout (auto-detected from target if not set) */
    borderRadius?: number | string
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryHighlightSlotProps {
    /** Whether the highlight is visible */
    isVisible: boolean
    /** Current target rect */
    rect: DOMRect | null
  }
</script>

<script setup lang="ts">
  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { isNumber, isUndefined } from '#v0/utilities'
  import { computed, onMounted, onUnmounted, shallowRef, toRef, watch } from 'vue'

  defineOptions({ name: 'DiscoveryHighlight' })

  defineSlots<{
    default?: (props: DiscoveryHighlightSlotProps) => any
  }>()

  const {
    padding = 8,
    opacity = 0.75,
    borderRadius: borderRadiusProp,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryHighlightProps>()

  const discovery = useDiscovery(namespace)

  // Track border radius from target element
  const detectedRadius = shallowRef<string>('8px')

  // Track rect reactively
  const rect = shallowRef<{ x: number, y: number, width: number, height: number } | null>(null)

  function updateRect () {
    const id = discovery.selectedId.value
    if (!id || !discovery.isActive.value) {
      rect.value = null
      return
    }

    const r = discovery.getActivatorRect(id)
    if (!r) {
      rect.value = null
      return
    }

    rect.value = {
      x: r.x - padding,
      y: r.y - padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2,
    }

    // Update border radius from element
    const el = discovery.getActivatorElement(id)
    if (el) {
      const styles = getComputedStyle(el)
      detectedRadius.value = styles.borderRadius || '8px'
    }
  }

  // Watch for step/active changes
  watch(
    [() => discovery.selectedId.value, () => discovery.isActive.value],
    () => {
      requestAnimationFrame(updateRect)
    },
    { immediate: true },
  )

  // Update on scroll/resize
  let rafId: number | null = null

  function scheduleUpdate () {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updateRect()
      rafId = null
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
    if (rafId) cancelAnimationFrame(rafId)
  })

  // Border radius for SVG (capped to prevent oval/circle appearance)
  const borderRadius = computed(() => {
    let radius: number
    if (isUndefined(borderRadiusProp)) {
      radius = Number.parseFloat(detectedRadius.value) || 8
    } else {
      radius = isNumber(borderRadiusProp)
        ? borderRadiusProp
        : Number.parseFloat(borderRadiusProp) || 8
    }

    // Cap border-radius to half the minimum dimension to prevent oval appearance
    const r = rect.value
    if (r) {
      const maxRadius = Math.min(r.width, r.height) / 2
      radius = Math.min(radius, maxRadius)
    }

    return radius
  })

  const isVisible = computed(() => discovery.isActive.value && rect.value !== null)

  const slotProps = toRef((): DiscoveryHighlightSlotProps => ({
    isVisible: isVisible.value,
    rect: discovery.selectedId.value ? discovery.getActivatorRect(discovery.selectedId.value) : null,
  }))
</script>

<template>
  <Teleport to="body">
    <Transition name="discovery-highlight">
      <svg
        v-if="isVisible && rect"
        aria-hidden="true"
        class="fixed inset-0 z-9998 pointer-events-none w-screen h-screen"
      >
        <defs>
          <mask id="discovery-highlight-mask">
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
          mask="url(#discovery-highlight-mask)"
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
.discovery-highlight-enter-active,
.discovery-highlight-leave-active {
  transition: opacity 0.2s ease;
}

.discovery-highlight-enter-from,
.discovery-highlight-leave-to {
  opacity: 0;
}
</style>
