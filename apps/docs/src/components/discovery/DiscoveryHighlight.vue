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

    rect.value = {
      x: r.x - padding,
      y: r.y - padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2,
    }

    if (el) {
      const styles = getComputedStyle(el)
      borderRadius.value = Number.parseFloat(styles.borderRadius) || 0
    }
  }

  watch(
    [() => discovery.selectedId.value, () => discovery.isActive.value],
    () => {
      if (!IN_BROWSER) return
      requestAnimationFrame(updateRect)
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
  onBeforeUnmount(cancelScheduledUpdate)

  const isVisible = toRef(() => discovery.isActive.value && rect.value !== null)
</script>

<template>
  <slot />

  <Teleport to="body">
    <Transition name="discovery-highlight">
      <div v-if="isVisible && rect" class="fixed inset-0 z-9998">
        <!-- SVG Backdrop -->
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
