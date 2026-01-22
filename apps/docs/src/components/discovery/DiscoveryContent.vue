<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { nextTick, toRef, useAttrs, useTemplateRef, watch } from 'vue'

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

  watch(() => root.isActive.value, async isActive => {
    if (!IN_BROWSER) return
    await nextTick()
    // Extra frame to ensure anchor element is positioned after enter callbacks
    await new Promise(resolve => requestAnimationFrame(resolve))
    const el = contentRef.value
    if (!el?.isConnected) return

    if (isActive) {
      el.showPopover?.()
    } else {
      el.hidePopover?.()
    }
  }, { immediate: true })
</script>

<template>
  <Teleport v-if="root.isActive.value" to="body">
    <div
      ref="content"
      v-bind="attrs"
      popover="manual"
      :style
    >
      <slot />
    </div>
  </Teleport>
</template>
