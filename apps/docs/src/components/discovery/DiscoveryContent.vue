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
    offset = 16,
  } = defineProps<{
    placement?: string
    offset?: number
  }>()

  const root = useDiscoveryRootContext('v0:discovery')
  const contentRef = useTemplateRef<HTMLElement>('content')

  const marginMap: Record<string, string> = {
    top: `0 0 ${offset}px 0`,
    bottom: `${offset}px 0 0 0`,
    left: `0 ${offset}px 0 0`,
    right: `0 0 0 ${offset}px`,
  }

  const style = toRef(() => ({
    position: 'fixed' as const,
    margin: marginMap[placement] ?? `${offset}px`,
    positionArea: placement,
    positionAnchor: `--discovery-${root.step}`,
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
