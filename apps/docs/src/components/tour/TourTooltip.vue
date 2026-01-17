/**
 * @module TourTooltip
 *
 * @remarks
 * Positioned tooltip component for tour steps. Automatically positions
 * itself relative to the target element based on the step's position
 * configuration. Falls back to best-fit positioning when space is limited.
 */

<script lang="ts">
  import type { TourStep } from '@/composables/tour'

  export interface TourTooltipProps {
    /** Gap between tooltip and target */
    offset?: number
  }

  export interface TourTooltipSlotProps {
    /** Whether the tooltip is visible */
    isVisible: boolean
    /** Current step */
    step: TourStep | undefined
    /** Progress info */
    progress: { current: number; total: number }
    /** Whether on first step */
    isFirst: boolean
    /** Whether on last step */
    isLast: boolean
    /** Go to next step */
    next: () => void
    /** Go to previous step */
    prev: () => void
    /** Stop the tour */
    stop: () => void
  }
</script>

<script setup lang="ts">
  // Context
  import { useTourContext } from './TourRoot.vue'

  // Utilities
  import { computed, toRef, watch, shallowRef, nextTick } from 'vue'

  // Types
  import type { TourPosition } from '@/composables/tour'

  defineOptions({ name: 'TourTooltip' })

  defineSlots<{
    default?: (props: TourTooltipSlotProps) => any
  }>()

  const props = withDefaults(defineProps<TourTooltipProps>(), {
    offset: 12,
  })

  const tour = useTourContext()

  // Tooltip element ref for measuring
  const tooltipRef = shallowRef<HTMLElement | null>(null)
  const tooltipRect = shallowRef<DOMRect | null>(null)

  // Update tooltip rect when content changes
  watch([tour.currentStep, tour.targetRect], async () => {
    await nextTick()
    if (tooltipRef.value) {
      tooltipRect.value = tooltipRef.value.getBoundingClientRect()
    }
  })

  // Calculate best position with fallback
  const effectivePosition = computed((): TourPosition => {
    const preferred = tour.currentStep.value?.position ?? 'bottom'
    const targetRect = tour.targetRect.value
    const tooltip = tooltipRect.value

    if (!targetRect || !tooltip) return preferred

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Check if preferred position has enough space
    const spaceNeeded = {
      top: targetRect.top,
      bottom: viewport.height - targetRect.bottom,
      left: targetRect.left,
      right: viewport.width - targetRect.right,
    }

    const tooltipNeeds = {
      top: tooltip.height + props.offset,
      bottom: tooltip.height + props.offset,
      left: tooltip.width + props.offset,
      right: tooltip.width + props.offset,
    }

    if (spaceNeeded[preferred] >= tooltipNeeds[preferred]) {
      return preferred
    }

    // Fallback: find best position
    const positions: TourPosition[] = ['bottom', 'top', 'right', 'left']
    for (const pos of positions) {
      if (spaceNeeded[pos] >= tooltipNeeds[pos]) {
        return pos
      }
    }

    return preferred
  })

  // Calculate tooltip position
  const style = computed(() => {
    const rect = tour.targetRect.value
    if (!rect) return { display: 'none' }

    const pos = effectivePosition.value
    const offset = props.offset

    let top: string
    let left: string
    let transform: string

    switch (pos) {
      case 'top':
        top = `${rect.top - offset}px`
        left = `${rect.left + rect.width / 2}px`
        transform = 'translate(-50%, -100%)'
        break
      case 'bottom':
        top = `${rect.bottom + offset}px`
        left = `${rect.left + rect.width / 2}px`
        transform = 'translate(-50%, 0)'
        break
      case 'left':
        top = `${rect.top + rect.height / 2}px`
        left = `${rect.left - offset}px`
        transform = 'translate(-100%, -50%)'
        break
      case 'right':
        top = `${rect.top + rect.height / 2}px`
        left = `${rect.right + offset}px`
        transform = 'translate(0, -50%)'
        break
    }

    return { top, left, transform }
  })

  const isVisible = computed(() => tour.isActive.value && tour.targetRect.value !== null)

  const slotProps = toRef((): TourTooltipSlotProps => ({
    isVisible: isVisible.value,
    step: tour.currentStep.value,
    progress: tour.progress.value,
    isFirst: tour.isFirst.value,
    isLast: tour.isLast.value,
    next: tour.next,
    prev: tour.prev,
    stop: tour.stop,
  }))
</script>

<template>
  <Teleport to="body">
    <Transition name="tour-tooltip">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        class="fixed z-9999 pointer-events-auto max-w-80"
        :data-position="effectivePosition"
        :style="style"
      >
        <slot v-bind="slotProps">
          <!-- Default content with UnoCSS classes -->
          <div class="bg-surface border border-divider rounded-lg p-4 shadow-xl">
            <div v-if="slotProps.step" class="flex justify-between items-center mb-2">
              <h4 class="m-0 text-base font-semibold text-on-surface">
                {{ slotProps.step.title }}
              </h4>
              <span class="text-xs text-on-surface-variant">
                {{ slotProps.progress.current }} / {{ slotProps.progress.total }}
              </span>
            </div>
            <p v-if="slotProps.step" class="m-0 mb-4 text-sm leading-relaxed text-on-surface-variant">
              {{ slotProps.step.content }}
            </p>
            <div class="flex justify-end gap-2">
              <button
                v-if="!slotProps.isFirst"
                class="px-4 py-2 text-sm font-medium bg-transparent text-on-surface-variant rounded-md hover:bg-surface-variant transition-colors"
                type="button"
                @click="slotProps.prev"
              >
                Back
              </button>
              <button
                class="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-md hover:brightness-110 transition-all"
                type="button"
                @click="slotProps.next"
              >
                {{ slotProps.isLast ? 'Finish' : 'Next' }}
              </button>
            </div>
          </div>
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transition animations - position-aware transforms can't be done with utility classes */
.tour-tooltip-enter-active,
.tour-tooltip-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tour-tooltip-enter-from,
.tour-tooltip-leave-to {
  opacity: 0;
}

[data-position="top"].tour-tooltip-enter-from,
[data-position="top"].tour-tooltip-leave-to {
  transform: translate(-50%, calc(-100% + 8px));
}

[data-position="bottom"].tour-tooltip-enter-from,
[data-position="bottom"].tour-tooltip-leave-to {
  transform: translate(-50%, -8px);
}

[data-position="left"].tour-tooltip-enter-from,
[data-position="left"].tour-tooltip-leave-to {
  transform: translate(calc(-100% + 8px), -50%);
}

[data-position="right"].tour-tooltip-enter-from,
[data-position="right"].tour-tooltip-leave-to {
  transform: translate(-8px, -50%);
}
</style>
