/**
 * @module TourRoot
 *
 * @remarks
 * Root component for tour contexts. Creates and provides tour context
 * to child TourHighlight and TourTooltip components. Manages tour state
 * and step navigation.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '@vuetify/v0'

  // Types
  import type { TourContext, TourStep } from '@/composables/tour'

  export interface TourRootProps {
    /** Step definitions for the tour */
    steps?: TourStep[]
    /** Start the tour automatically on mount */
    autoStart?: boolean
    /** Starting step index when auto-starting */
    startIndex?: number
  }

  export interface TourRootSlotProps {
    /** Whether the tour is currently active */
    isActive: boolean
    /** Current step definition */
    currentStep: TourStep | undefined
    /** Current step index */
    currentIndex: number
    /** Progress info */
    progress: { current: number; total: number }
    /** Whether on first step */
    isFirst: boolean
    /** Whether on last step */
    isLast: boolean
    /** Start the tour */
    start: (stepIndex?: number) => void
    /** Stop the tour */
    stop: () => void
    /** Go to next step */
    next: () => void
    /** Go to previous step */
    prev: () => void
    /** Go to specific step */
    goto: (index: number) => void
  }

  export const [useTourContext, provideTourContext] = createContext<TourContext>('Tour')
</script>

<script setup lang="ts">
  // Composables
  import { createTour } from '@/composables/tour'

  // Utilities
  import { onMounted, toRef, watch } from 'vue'

  defineOptions({ name: 'TourRoot' })

  defineSlots<{
    default: (props: TourRootSlotProps) => any
  }>()

  const props = withDefaults(defineProps<TourRootProps>(), {
    steps: () => [],
    autoStart: false,
    startIndex: 0,
  })

  const emit = defineEmits<{
    'update:active': [value: boolean]
    'update:step': [index: number]
    complete: []
  }>()

  // Create tour context
  const tour = createTour({
    steps: props.steps,
  })

  // Sync steps prop
  watch(() => props.steps, newSteps => {
    tour.setSteps(newSteps)
    // Update rect in case selector changed
    if (tour.isActive.value) {
      requestAnimationFrame(() => tour.updateRect())
    }
  }, { deep: true })

  // Sync startIndex prop (for external control)
  watch(() => props.startIndex, newIndex => {
    if (tour.isActive.value && newIndex !== tour.currentIndex.value) {
      tour.goto(newIndex)
    }
  })

  // Emit events
  watch(tour.isActive, isActive => {
    emit('update:active', isActive)
  })

  watch(tour.currentIndex, index => {
    emit('update:step', index)
  })

  // Auto-start when steps are ready
  onMounted(() => {
    if (props.autoStart) {
      if (props.steps.length > 0) {
        tour.start(props.startIndex)
      } else {
        // Wait for steps to be available
        const unwatch = watch(() => props.steps, newSteps => {
          if (newSteps.length > 0 && !tour.isActive.value) {
            tour.start(props.startIndex)
            unwatch()
          }
        }, { immediate: true })
      }
    }
  })

  // Handle completion
  function handleNext () {
    if (tour.isLast.value) {
      tour.stop()
      emit('complete')
    } else {
      tour.next()
    }
  }

  // Provide context to children
  provideTourContext(tour)

  const slotProps = toRef((): TourRootSlotProps => ({
    isActive: tour.isActive.value,
    currentStep: tour.currentStep.value,
    currentIndex: tour.currentIndex.value,
    progress: tour.progress.value,
    isFirst: tour.isFirst.value,
    isLast: tour.isLast.value,
    start: tour.start,
    stop: tour.stop,
    next: handleNext,
    prev: tour.prev,
    goto: tour.goto,
  }))

  // Expose tour for parent access
  defineExpose({ tour })
</script>

<template>
  <slot v-bind="slotProps" />
</template>
