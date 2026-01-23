<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { shallowRef, toRef, useAttrs, watch } from 'vue'

  defineOptions({ name: 'DiscoveryContent', inheritAttrs: false })

  const attrs = useAttrs()

  const {
    placement = 'bottom',
    positionTry = 'flip-block flip-inline',
    offset = 16,
  } = defineProps<{
    placement?: string
    /** CSS position-try-fallbacks value for automatic repositioning */
    positionTry?: string
    offset?: number
  }>()

  const root = useDiscoveryRootContext('v0:discovery')
  const discovery = useDiscovery()
  const isReady = shallowRef(false)

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
  }

  const style = toRef(() => {
    if (supportsAnchor) {
      return {
        position: 'fixed' as const,
        margin: `${offset}px`,
        positionAnchor: `--discovery-${root.step}`,
        positionTryFallbacks: positionTry,
        ...placementStyles[placement] ?? placementStyles.bottom,
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
    }
    return {
      ...base,
      ...fallbackStyles[placement] ?? fallbackStyles.bottom,
    }
  })

  // Poll for activator to be registered, then show content
  watch(
    () => root.isActive.value,
    isActive => {
      if (!IN_BROWSER) return

      if (isActive) {
        isReady.value = false
        const startTime = performance.now()
        const TIMEOUT_MS = 2000

        // Poll until activator is registered (with timeout)
        function checkActivator () {
          const activator = discovery.activators.get(root.step)
          if (activator?.element) {
            // Activator found - wait one more frame for anchor-name CSS
            requestAnimationFrame(() => {
              isReady.value = true
            })
          } else if (performance.now() - startTime > TIMEOUT_MS) {
            // Timeout - show content anyway to avoid hanging
            console.warn(`[DiscoveryContent] Activator for step "${root.step}" not found after ${TIMEOUT_MS}ms`)
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
</script>

<template>
  <Teleport v-if="isReady" to="body">
    <div
      v-bind="attrs"
      :style="{
        ...style,
        zIndex: 9999,
      }"
    >
      <slot />
    </div>
  </Teleport>
</template>
