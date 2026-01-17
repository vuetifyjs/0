<script setup lang="ts">
  // Framework
  import { useResizeObserver } from '@vuetify/v0'

  // Utilities
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

  // Types
  import type { GuidedStep } from '@/types/skill'

  const props = withDefaults(defineProps<{
    step: GuidedStep | null
    stepIndex: number
    totalSteps: number
    active?: boolean
  }>(), {
    active: true,
  })

  const emit = defineEmits<{
    complete: []
    skip: []
    prev: []
    exit: []
  }>()

  // Position state
  const tooltipStyle = ref<Record<string, string>>({})
  const anchorEl = ref<Element | null>(null)

  // Calculate position based on anchor element
  function updatePosition () {
    if (!props.step?.anchor) {
      // Default to bottom-right corner
      tooltipStyle.value = {
        bottom: '100px',
        right: '24px',
        position: 'fixed',
      }
      return
    }

    const el = document.querySelector(props.step.anchor)
    if (!el) {
      tooltipStyle.value = {
        bottom: '100px',
        right: '24px',
        position: 'fixed',
      }
      return
    }

    anchorEl.value = el
    const rect = el.getBoundingClientRect()
    const position = props.step.position ?? 'auto'
    const padding = 16

    // Tooltip dimensions (approximate)
    const tooltipWidth = 320
    const tooltipHeight = 200

    let top: number | undefined
    let left: number | undefined
    let bottom: number | undefined
    let right: number | undefined

    // Calculate position
    switch (position) {
      case 'top': {
        bottom = window.innerHeight - rect.top + padding
        left = Math.max(padding, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding))
        break
      }
      case 'bottom': {
        top = rect.bottom + padding
        left = Math.max(padding, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding))
        break
      }
      case 'left': {
        top = Math.max(padding, rect.top + rect.height / 2 - tooltipHeight / 2)
        right = window.innerWidth - rect.left + padding
        break
      }
      case 'right': {
        top = Math.max(padding, rect.top + rect.height / 2 - tooltipHeight / 2)
        left = rect.right + padding
        break
      }
      default: {
        // Smart positioning - prefer bottom, fallback to top
        if (rect.bottom + tooltipHeight + padding < window.innerHeight) {
          top = rect.bottom + padding
        } else {
          bottom = window.innerHeight - rect.top + padding
        }
        left = Math.max(padding, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding))
        break
      }
    }

    tooltipStyle.value = {
      position: 'fixed',
      ...(top !== undefined && { top: `${top}px` }),
      ...(left !== undefined && { left: `${left}px` }),
      ...(bottom !== undefined && { bottom: `${bottom}px` }),
      ...(right !== undefined && { right: `${right}px` }),
    }
  }

  // Watch for step changes
  watch(() => props.step?.anchor, updatePosition, { immediate: true })
  watch(() => props.active, active => {
    if (active) updatePosition()
  })

  // Track anchor element size
  useResizeObserver(
    computed(() => anchorEl.value ?? undefined),
    () => updatePosition(),
  )

  // Update on scroll/resize
  onMounted(() => {
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  })

  // Determine if manual completion is needed
  const isManualStep = computed(() => props.step?.validation.type === 'manual')
</script>

<template>
  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="active && step"
        class="guided-tooltip"
        :style="tooltipStyle"
      >
        <header class="guided-tooltip__header">
          <span class="guided-tooltip__progress">
            Step {{ stepIndex + 1 }} of {{ totalSteps }}
          </span>
          <button
            aria-label="Exit tour"
            class="guided-tooltip__close"
            @click="emit('exit')"
          >
            ×
          </button>
        </header>

        <div class="guided-tooltip__content">
          <h3 class="guided-tooltip__title">{{ step.title }}</h3>
          <p class="guided-tooltip__task">{{ step.task }}</p>

          <p v-if="step.hint" class="guided-tooltip__hint">
            <span class="guided-tooltip__hint-icon">💡</span>
            {{ step.hint }}
          </p>
        </div>

        <footer class="guided-tooltip__footer">
          <button
            v-if="stepIndex > 0"
            class="guided-tooltip__btn guided-tooltip__btn--secondary"
            @click="emit('prev')"
          >
            Back
          </button>
          <div class="guided-tooltip__spacer" />
          <button
            class="guided-tooltip__btn guided-tooltip__btn--text"
            @click="emit('skip')"
          >
            Skip
          </button>
          <button
            v-if="isManualStep"
            class="guided-tooltip__btn guided-tooltip__btn--primary"
            @click="emit('complete')"
          >
            Done
          </button>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.guided-tooltip {
  width: 320px;
  max-width: calc(100vw - 32px);
  background: var(--v0-surface);
  border: 1px solid var(--v0-divider);
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 9999;
  overflow: hidden;
}

.guided-tooltip__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--v0-surface-variant);
  border-bottom: 1px solid var(--v0-divider);
}

.guided-tooltip__progress {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--v0-primary);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.guided-tooltip__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--v0-on-surface-variant);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.guided-tooltip__close:hover {
  background: var(--v0-surface);
}

.guided-tooltip__content {
  padding: 16px;
}

.guided-tooltip__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--v0-on-surface);
}

.guided-tooltip__task {
  font-size: 0.875rem;
  color: var(--v0-on-surface-variant);
  margin: 0;
  line-height: 1.5;
}

.guided-tooltip__hint {
  display: flex;
  gap: 8px;
  margin: 12px 0 0;
  padding: 8px 12px;
  font-size: 0.75rem;
  color: var(--v0-on-surface-variant);
  background: color-mix(in srgb, var(--v0-info) 10%, transparent);
  border-radius: 6px;
  line-height: 1.4;
}

.guided-tooltip__hint-icon {
  flex-shrink: 0;
}

.guided-tooltip__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--v0-surface-variant);
  border-top: 1px solid var(--v0-divider);
}

.guided-tooltip__spacer {
  flex: 1;
}

.guided-tooltip__btn {
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.guided-tooltip__btn--primary {
  background: var(--v0-primary);
  color: var(--v0-on-primary);
  border: none;
}

.guided-tooltip__btn--primary:hover {
  filter: brightness(1.1);
}

.guided-tooltip__btn--secondary {
  background: var(--v0-surface);
  color: var(--v0-on-surface);
  border: 1px solid var(--v0-divider);
}

.guided-tooltip__btn--secondary:hover {
  background: var(--v0-surface-variant);
}

.guided-tooltip__btn--text {
  background: transparent;
  color: var(--v0-on-surface-variant);
  border: none;
}

.guided-tooltip__btn--text:hover {
  color: var(--v0-on-surface);
}

/* Transition */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
