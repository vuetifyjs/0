<script setup lang="ts">
  // Framework
  import { useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

  // Types
  import type { GuidedHighlight } from '@/types/skill'

  const props = withDefaults(defineProps<{
    highlight: GuidedHighlight | undefined
    active?: boolean
  }>(), {
    active: true,
  })

  // Element rect and border radius
  const rect = ref<DOMRect | null>(null)
  const borderRadius = ref<string>('8px')
  const targetEl = ref<Element | null>(null)

  // Update rect and border radius from target element
  function updateRect () {
    if (!props.highlight?.selector) {
      rect.value = null
      borderRadius.value = '8px'
      return
    }

    const el = document.querySelector(props.highlight.selector)
    if (!el) {
      rect.value = null
      borderRadius.value = '8px'
      return
    }

    targetEl.value = el
    rect.value = el.getBoundingClientRect()

    // Get computed border-radius from the target element
    const computed = getComputedStyle(el)
    borderRadius.value = computed.borderRadius || '8px'
  }

  // Watch for highlight changes
  watch(() => props.highlight?.selector, updateRect, { immediate: true })
  watch(() => props.active, active => {
    if (active) updateRect()
  })

  // Use ResizeObserver to track element size changes
  useResizeObserver(
    computed(() => targetEl.value ?? undefined),
    () => updateRect(),
  )

  // Also update on scroll/resize
  onMounted(() => {
    updateRect()
    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateRect, true)
    window.removeEventListener('resize', updateRect)
  })

  // Computed padding
  const padding = computed(() => props.highlight?.padding ?? 4)

  // Style for highlight box
  const highlightStyle = computed(() => {
    if (!rect.value) return null
    return {
      top: `${rect.value.top - padding.value}px`,
      left: `${rect.value.left - padding.value}px`,
      width: `${rect.value.width + padding.value * 2}px`,
      height: `${rect.value.height + padding.value * 2}px`,
      borderRadius: borderRadius.value,
    }
  })

  // Style classes
  const styleClass = computed(() => {
    const style = props.highlight?.style ?? 'outline'
    return `guided-highlight--${style}`
  })

  // Parse border radius for SVG rx attribute (handles "8px", "50%", "9999px", etc.)
  const spotlightRx = computed(() => {
    const br = borderRadius.value
    // For percentage-based (like rounded-full which uses 9999px or 50%), use half the smaller dimension
    if (br.includes('%') || parseInt(br) > 100) {
      if (!rect.value) return '8'
      return String(Math.min(rect.value.width, rect.value.height) / 2 + padding.value)
    }
    return br
  })
</script>

<template>
  <Teleport to="body">
    <Transition name="highlight">
      <div
        v-if="active && highlightStyle"
        class="guided-highlight"
        :class="styleClass"
        :style="highlightStyle"
      />
    </Transition>

    <!-- Spotlight backdrop for spotlight style -->
    <Transition name="fade">
      <div
        v-if="active && highlightStyle && highlight?.style === 'spotlight'"
        class="guided-spotlight-backdrop"
      >
        <svg height="100%" width="100%">
          <defs>
            <mask id="spotlight-mask">
              <rect fill="white" height="100%" width="100%" />
              <rect
                fill="black"
                :height="highlightStyle.height"
                :rx="spotlightRx"
                :width="highlightStyle.width"
                :x="highlightStyle.left"
                :y="highlightStyle.top"
              />
            </mask>
          </defs>
          <rect
            fill="rgba(0, 0, 0, 0.5)"
            height="100%"
            mask="url(#spotlight-mask)"
            width="100%"
          />
        </svg>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.guided-highlight {
  position: fixed;
  z-index: 9998;
  pointer-events: none;
  transition: all 0.3s ease;
}

.guided-highlight--outline {
  border: 2px solid var(--v0-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--v0-primary) 25%, transparent);
}

.guided-highlight--pulse {
  border: 2px solid var(--v0-primary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow:
      0 0 0 0 color-mix(in srgb, var(--v0-primary) 40%, transparent),
      0 0 0 0 color-mix(in srgb, var(--v0-primary) 20%, transparent);
  }
  50% {
    box-shadow:
      0 0 0 8px color-mix(in srgb, var(--v0-primary) 0%, transparent),
      0 0 0 16px color-mix(in srgb, var(--v0-primary) 0%, transparent);
  }
}

.guided-highlight--spotlight {
  border: 2px solid var(--v0-primary);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--v0-primary) 30%, transparent);
}

.guided-spotlight-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
}

/* Transitions */
.highlight-enter-active,
.highlight-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.highlight-enter-from,
.highlight-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
