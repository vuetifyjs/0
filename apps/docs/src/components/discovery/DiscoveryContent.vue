<script setup lang="ts">
  // Framework
  import { IN_BROWSER, isNullOrUndefined, useBreakpoints, useLogger } from '@vuetify/v0'

  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { nextTick, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'DiscoveryContent', inheritAttrs: false })

  const attrs = useAttrs()
  const logger = useLogger()

  const {
    placement = 'bottom',
    placementMobile,
    offset = 16,
    noOverflow = false,
  } = defineProps<{
    placement?: string
    placementMobile?: string
    offset?: number
    noOverflow?: boolean
  }>()

  const breakpoints = useBreakpoints()
  const activePlacement = toRef(() => {
    // Last step always uses center placement
    if (discovery.isLast.value) return 'center'
    if (!isNullOrUndefined(placementMobile) && breakpoints.smAndDown.value) return placementMobile
    return placement
  })

  const root = useDiscoveryRootContext('v0:discovery')
  const discovery = useDiscovery()
  const settings = useSettings()
  const isReady = shallowRef(false)
  const contentRef = useTemplateRef<HTMLElement>('content')

  // Check for CSS Anchor Positioning support
  // Safari/iOS don't support anchor positioning - check for the specific property
  const supportsAnchor = IN_BROWSER
    && typeof CSS !== 'undefined'
    && typeof CSS.supports === 'function'
    && CSS.supports('position-area', 'top')

  // Map placement to position-area values with self-alignment for centering
  const placementStyles: Record<string, Record<string, string>> = {
    bottom: {
      positionArea: 'bottom',
      justifySelf: 'anchor-center',
    },
    top: {
      positionArea: 'top',
      justifySelf: 'anchor-center',
    },
    left: {
      positionArea: 'left',
      alignSelf: 'anchor-center',
    },
    right: {
      positionArea: 'right',
      alignSelf: 'anchor-center',
    },
    center: {
      positionArea: 'center',
    },
  }

  const style = toRef(() => {
    const currentPlacement = activePlacement.value

    if (supportsAnchor) {
      return {
        position: 'fixed' as const,
        inset: `${offset}px`,
        width: 'max-content',
        height: 'max-content',
        // maxWidth: `calc(100vw - ${offset * 2}px)`,
        maxHeight: `calc(100vh - ${offset * 2}px)`,
        overflow: noOverflow ? 'visible' : 'auto',
        positionAnchor: `--discovery-${root.step}`,
        ...placementStyles[currentPlacement] ?? placementStyles.bottom,
      }
    }
    // Fallback for browsers without anchor positioning (Safari/iOS)
    // Centers popover at viewport edge since we can't anchor to elements
    // Reset inset to avoid top-layer default positioning
    const base = { inset: 'auto', position: 'fixed' as const }
    const fallbackStyles: Record<string, Record<string, string>> = {
      bottom: { bottom: `${offset}px`, left: '50%', transform: 'translateX(-50%)' },
      top: { top: `${offset}px`, left: '50%', transform: 'translateX(-50%)' },
      left: { top: '50%', left: `${offset}px`, transform: 'translateY(-50%)' },
      right: { top: '50%', right: `${offset}px`, transform: 'translateY(-50%)' },
      center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    }
    return {
      ...base,
      ...fallbackStyles[currentPlacement] ?? fallbackStyles.bottom,
    }
  })

  // Unmount guard for rAF polling
  let isUnmounted = false
  onBeforeUnmount(() => {
    isUnmounted = true
  })

  // Poll for activator to be registered, then show content
  watch(
    root.isActive,
    isActive => {
      if (!IN_BROWSER) return

      if (isActive) {
        isReady.value = false

        const step = discovery.steps.get(root.step)
        if (step?.noActivator || discovery.isLast.value) {
          isReady.value = true
          return
        }

        const startTime = performance.now()
        const TIMEOUT_MS = 2000

        // Poll until activator is registered and DOM element exists (with timeout)
        function checkActivator () {
          if (isUnmounted) return

          const activator = discovery.activators.get(root.step)
          if (activator?.element?.value) {
            // Activator found - wait one more frame for anchor-name CSS
            requestAnimationFrame(() => {
              if (!isUnmounted) isReady.value = true
            })
          } else if (performance.now() - startTime > TIMEOUT_MS) {
            logger.warn(`[DiscoveryContent] Activator for step "${root.step}" not found after ${TIMEOUT_MS}ms`)
            // Timeout - show content anyway to avoid hanging
            isReady.value = true
          } else {
            // Keep polling
            requestAnimationFrame(checkActivator)
          }
        }
        requestAnimationFrame(checkActivator)
      } else {
        isReady.value = false
      }
    },
    { immediate: true },
  )

  watch(isReady, ready => {
    if (ready) {
      nextTick(() => contentRef.value?.focus())
    }
  })
</script>

<template>
  <Teleport v-if="isReady" to="body">
    <div
      ref="content"
      v-bind="attrs"
      :class="['outline-none', { 'discovery-content': !settings.userPrefersReducedMotion.value }]"
      :style="{
        ...style,
        zIndex: 9999,
      }"
      tabindex="-1"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style scoped>
.discovery-content {
  scale: 1;
  opacity: 1;
  transition:
    scale 0.25s cubic-bezier(0.17, 0.89, 0.32, 1.28),
    opacity 0.15s ease-out;

  @starting-style {
    scale: 0.92;
    opacity: 0;
  }
}
</style>
