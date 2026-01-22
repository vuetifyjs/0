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

  const style = toRef(() => ({
    position: 'fixed' as const,
    margin: `${offset}px`,
    positionAnchor: `--discovery-${root.step}`,
    positionTryFallbacks: positionTry,
    ...placementStyles[placement] ?? placementStyles.bottom,
  }))

  watch(() => root.isActive.value, async isActive => {
    if (!IN_BROWSER) return
    await nextTick()
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
