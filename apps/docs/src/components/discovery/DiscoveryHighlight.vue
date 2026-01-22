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
  }
  export interface DiscoveryHighlightSlotProps {

  }
</script>

<script setup lang="ts">
  // Framework
  import { IN_BROWSER, isNull, useWindowEventListener } from '@vuetify/v0'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

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
  } = defineProps<DiscoveryHighlightProps>()

  const discovery = useDiscovery(namespace)

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
      rect.value = null
      return
    }

    const activator = discovery.activators.get(id)
    const el = toValue(activator?.element?.value ?? activator?.element)
    const r = el?.getBoundingClientRect()
    if (!r) {
      rect.value = null
      return
    }

    // Use activator-specific padding, fall back to global padding prop
    const p = activator?.padding ?? padding

    rect.value = {
      x: r.x - p,
      y: r.y - p,
      width: r.width + p * 2,
      height: r.height + p * 2,
    }

    if (el) {
      const styles = getComputedStyle(el)
      borderRadius.value = Number.parseFloat(styles.borderRadius) || 0
    }
  }

  let delayTimeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    [() => discovery.selectedId.value, () => discovery.isActive.value],
    () => {
      if (!IN_BROWSER) return

      // Clear any pending delayed update
      if (delayTimeoutId) {
        clearTimeout(delayTimeoutId)
        delayTimeoutId = null
      }

      const id = discovery.selectedId.value
      const step = id ? discovery.steps.get(id) : undefined
      const delay = step?.delay ?? 0

      if (delay > 0) {
        // Hide highlight during delay
        rect.value = null
        delayTimeoutId = setTimeout(() => {
          requestAnimationFrame(updateRect)
          delayTimeoutId = null
        }, delay)
      } else {
        requestAnimationFrame(updateRect)
      }
    },
    { immediate: true },
  )
  let rafId: number | null = null
  function scheduleUpdate () {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updateRect()
      rafId = null
    })
  }
  function cancelScheduledUpdate () {
    if (isNull(rafId)) return
    cancelAnimationFrame(rafId)
    rafId = null
  }
  useWindowEventListener(['scroll', 'resize'], scheduleUpdate, { passive: true })
  onBeforeUnmount(() => {
    cancelScheduledUpdate()
    if (delayTimeoutId) {
      clearTimeout(delayTimeoutId)
      delayTimeoutId = null
    }
  })

  const isVisible = toRef(() => discovery.isActive.value && rect.value !== null)

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
      <div v-if="isVisible && rect" class="fixed inset-0 z-9998 pointer-events-none">
        <!-- Click-blocking layer (when blocking is enabled) -->
        <div
          v-if="blocking"
          aria-hidden="true"
          class="absolute inset-0 pointer-events-auto cursor-default"
          :style="{ clipPath }"
        />

        <!-- SVG Backdrop (visual only) -->
        <svg
          aria-hidden="true"
          class="absolute inset-0 pointer-events-none w-screen h-screen"
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
</style>
