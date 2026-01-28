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
  import type { AtomProps } from '@vuetify/v0'
  export interface DiscoveryHighlightProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
    /** Backdrop opacity (0-1) */
    opacity?: number
    /** Padding around the highlighted element */
    padding?: number
    /** Whether clicking the backdrop blocks interaction (default: false) */
    blocking?: boolean
    /** Whether clicking the highlighted element also blocks interaction (default: false) */
    blockActivator?: boolean
  }
  export interface DiscoveryHighlightSlotProps {

  }
</script>

<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { onBeforeUnmount, shallowRef, toRef, toValue, watch } from 'vue'

  defineOptions({ name: 'DiscoveryHighlight' })

  defineSlots<{
    default?: (props: DiscoveryHighlightSlotProps) => any
  }>()

  const {
    namespace = 'v0:discovery',
    padding = 0,
    opacity = 0.75,
    blocking = false,
    blockActivator = false,
  } = defineProps<DiscoveryHighlightProps>()

  const discovery = useDiscovery(namespace)
  const settings = useSettings()

  const rect = shallowRef<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  const borderRadius = shallowRef(0)

  function updateRect () {
    const id = discovery.selectedId.value
    if (!id || !discovery.isActive.value) {
      if (rect.value !== null) rect.value = null
      return
    }

    // Clear rect for steps with no activator (scrim still shows, just no cutout)
    const step = discovery.steps.get(id)
    if (step?.noActivator) {
      if (rect.value !== null) rect.value = null
      return
    }

    const activator = discovery.activators.get(id)
    const el = toValue(activator?.element?.value ?? activator?.element)
    const r = el?.getBoundingClientRect()
    // Don't clear rect if activator not found yet - keep old position for smooth transition
    if (!r) return

    // Use activator-specific padding, fall back to global padding prop
    const p = activator?.padding ?? padding

    const newRect = {
      x: r.x - p,
      y: r.y - p,
      width: r.width + p * 2,
      height: r.height + p * 2,
    }

    // Only update if position/size actually changed
    if (
      !rect.value ||
      rect.value.x !== newRect.x ||
      rect.value.y !== newRect.y ||
      rect.value.width !== newRect.width ||
      rect.value.height !== newRect.height
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

  // Continuous RAF loop for smooth tracking
  let rafLoopId: number | null = null

  function startLoop () {
    if (rafLoopId !== null || !IN_BROWSER) return

    function loop () {
      updateRect()
      rafLoopId = requestAnimationFrame(loop)
    }
    rafLoopId = requestAnimationFrame(loop)
  }

  function stopLoop () {
    if (rafLoopId !== null) {
      cancelAnimationFrame(rafLoopId)
      rafLoopId = null
    }
    rect.value = null
  }

  watch(
    () => discovery.isActive.value,
    active => {
      if (active) {
        startLoop()
      } else {
        stopLoop()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(stopLoop)

  const isVisible = toRef(() => discovery.isActive.value)
  const showCutout = toRef(() => rect.value !== null)

  // Clip-path that covers everything except the cutout (for blocking clicks)
  const clipPath = toRef(() => {
    if (!rect.value) return undefined
    const { x, y, width, height } = rect.value
    const r = borderRadius.value
    // Use path() for rounded rectangle cutout
    // Outer: full screen rectangle
    // Inner: rounded rectangle (counter-clockwise to create hole)
    if (r > 0) {
      return `path(evenodd, "M 0 0 H 100000 V 100000 H 0 Z M ${x + r} ${y} H ${x + width - r} Q ${x + width} ${y} ${x + width} ${y + r} V ${y + height - r} Q ${x + width} ${y + height} ${x + width - r} ${y + height} H ${x + r} Q ${x} ${y + height} ${x} ${y + height - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z")`
    }
    // Simple rectangle cutout (no border radius)
    return `path(evenodd, "M 0 0 H 100000 V 100000 H 0 Z M ${x} ${y} V ${y + height} H ${x + width} V ${y} Z")`
  })
</script>

<template>
  <slot />

  <Teleport to="body">
    <Transition name="discovery-highlight">
      <div v-if="isVisible" class="fixed inset-0 pointer-events-none" style="z-index: 9998">
        <!-- Click-blocking layer for backdrop (when blocking is enabled) -->
        <div
          v-if="blocking && showCutout && rect"
          aria-hidden="true"
          class="absolute inset-0 pointer-events-auto cursor-default"
          :style="{ clipPath }"
        />

        <!-- Click-blocking layer for activator (when blockActivator is enabled) -->
        <div
          v-if="blockActivator && showCutout && rect"
          aria-hidden="true"
          class="absolute pointer-events-auto cursor-default"
          :style="{
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            borderRadius: `${borderRadius}px`,
          }"
        />

        <!-- SVG Backdrop (visual only) -->
        <svg
          aria-hidden="true"
          :class="['absolute inset-0 pointer-events-none w-screen h-screen', { 'smooth-tracking': !settings.userPrefersReducedMotion.value }]"
        >
          <!-- With cutout mask -->
          <template v-if="showCutout && rect">
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
            <!-- Glow effect around the cutout (offset outward so stroke is outside only) -->
            <rect
              :class="['fill-none stroke-primary', { 'highlight-glow': !settings.userPrefersReducedMotion.value }]"
              :height="rect.height + 3"
              :rx="borderRadius + 1.5"
              :ry="borderRadius + 1.5"
              stroke-width="3"
              :width="rect.width + 3"
              :x="rect.x - 1.5"
              :y="rect.y - 1.5"
            />
            <!-- Border around the cutout -->
            <rect
              class="stroke-primary fill-none"
              :height="rect.height"
              :rx="borderRadius"
              :ry="borderRadius"
              stroke-width="2"
              :width="rect.width"
              :x="rect.x"
              :y="rect.y"
            />
          </template>

          <!-- Full scrim without cutout (for noActivator steps) -->
          <rect
            v-else
            :fill="`rgba(0, 0, 0, ${opacity})`"
            height="100%"
            width="100%"
          />
        </svg>
      </div>
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

/* Smooth position tracking when user prefers motion */
svg.smooth-tracking rect {
  transition:
    x 0.15s ease-out,
    y 0.15s ease-out,
    width 0.15s ease-out,
    height 0.15s ease-out,
    rx 0.15s ease-out,
    ry 0.15s ease-out;
}

/* Pulsing glow effect for highlighted area */
.highlight-glow {
  animation: highlight-pulse 2s ease-in-out infinite;
}

@keyframes highlight-pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
