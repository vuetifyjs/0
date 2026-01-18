/**
 * @module DiscoveryTooltip
 *
 * @remarks
 * Positioned tooltip that follows the current step's activator element.
 * Automatically positions below the activator with fallback to above.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DiscoveryTooltipProps extends AtomProps {
    /** Offset from the activator element */
    offset?: number
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryTooltipSlotProps {
    /** Whether the tooltip is visible */
    isVisible: boolean
    /** Current position */
    position: 'top' | 'bottom'
    /** Positioning style */
    style: Record<string, string>
  }
</script>

<script setup lang="ts">
  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { computed, onMounted, onUnmounted, shallowRef, toRef, watch } from 'vue'

  defineOptions({ name: 'DiscoveryTooltip' })

  defineSlots<{
    default?: (props: DiscoveryTooltipSlotProps) => any
  }>()

  const {
    offset = 12,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryTooltipProps>()

  const discovery = useDiscovery(namespace)

  // Track rect updates
  const rect = shallowRef<DOMRect | null>(null)
  const position = shallowRef<'top' | 'bottom'>('bottom')

  function updateRect () {
    const id = discovery.selectedId.value
    if (!id || !discovery.isActive.value) {
      rect.value = null
      return
    }

    const newRect = discovery.getActivatorRect(id)
    rect.value = newRect

    // Determine position based on available space
    if (newRect) {
      const spaceBelow = window.innerHeight - newRect.bottom
      const spaceAbove = newRect.top
      position.value = spaceBelow >= 200 || spaceBelow > spaceAbove ? 'bottom' : 'top'
    }
  }

  // Update on selection change and scroll/resize
  let rafId: number | null = null

  function scheduleUpdate () {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updateRect()
      rafId = null
    })
  }

  // Watch for step/active changes
  watch(
    [() => discovery.selectedId.value, () => discovery.isActive.value],
    () => {
      // Use nextTick-like timing to ensure DOM is updated
      requestAnimationFrame(updateRect)
    },
    { immediate: true },
  )

  onMounted(() => {
    updateRect()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
    if (rafId) cancelAnimationFrame(rafId)
  })

  const isVisible = computed(() => discovery.isActive.value && rect.value !== null)

  const style = computed(() => {
    if (!rect.value) return {}

    const r = rect.value
    const left = r.left + r.width / 2

    if (position.value === 'bottom') {
      return {
        position: 'fixed',
        top: `${r.bottom + offset}px`,
        left: `${left}px`,
        transform: 'translateX(-50%)',
        zIndex: '9999',
      }
    }

    return {
      position: 'fixed',
      bottom: `${window.innerHeight - r.top + offset}px`,
      left: `${left}px`,
      transform: 'translateX(-50%)',
      zIndex: '9999',
    }
  })

  const slotProps = toRef((): DiscoveryTooltipSlotProps => ({
    isVisible: isVisible.value,
    position: position.value,
    style: style.value,
  }))
</script>

<template>
  <Teleport to="body">
    <Transition name="discovery-tooltip">
      <div
        v-if="isVisible"
        data-discovery-tooltip
        :style="style"
      >
        <slot v-bind="slotProps" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.discovery-tooltip-enter-active,
.discovery-tooltip-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.discovery-tooltip-enter-from,
.discovery-tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}
</style>
