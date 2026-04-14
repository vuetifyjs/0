/**
 * @module CarouselRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Root component for carousel navigation. Creates and provides step context
 * to child CarouselViewport, CarouselItem, CarouselPrevious, and CarouselNext
 * components. Built on CSS scroll-snap with multi-slide display and peek support.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createStep } from '#v0/composables/createStep'
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { useTimer } from '#v0/composables/useTimer'

  // Utilities
  import { shallowRef, toRef, toValue, useId } from 'vue'

  // Types
  import type { StepContext, StepTicket } from '#v0/composables/createStep'
  import type { ID } from '#v0/types'
  import type { Ref, ShallowRef } from 'vue'

  export type CarouselOrientation = 'horizontal' | 'vertical'

  export interface CarouselRootProps {
    /** Unique identifier for the carousel */
    id?: string
    /** Namespace for dependency injection (must match child namespace) */
    namespace?: string
    /** Disables the entire carousel */
    disabled?: boolean
    /** Whether navigation wraps around from last to first */
    circular?: boolean
    /** Carousel orientation */
    orientation?: CarouselOrientation
    /** Number of slides visible at once */
    perView?: number
    /** Autoplay interval in milliseconds. 0 disables autoplay. */
    autoplay?: number
  }

  export interface CarouselRootSlotProps {
    /** Whether the carousel is disabled */
    isDisabled: boolean
    /** Current orientation */
    orientation: CarouselOrientation
    /** Number of slides visible at once */
    perView: number
    /** Select the first slide */
    first: () => void
    /** Select the last slide */
    last: () => void
    /** Select the next slide */
    next: () => void
    /** Select the previous slide */
    prev: () => void
    /** Step forward or backward by a specific count */
    step: (count: number) => void
    /** Select a slide by ID */
    select: (id: ID) => void
    /** Whether autoplay is active */
    isAutoplay: boolean
    /** Whether autoplay is paused */
    isPaused: boolean
    /** Milliseconds remaining until next slide */
    remaining: number
    /** Start or restart autoplay from full interval */
    play: () => void
    /** Stop autoplay and reset timer */
    stop: () => void
    /** Pause autoplay, preserving remaining time */
    pause: () => void
    /** Resume autoplay from where it was paused */
    resume: () => void
    /** Attributes to bind to the root element */
    attrs: {
      'role': 'region'
      'aria-roledescription': 'carousel'
    }
  }

  export interface CarouselContext extends StepContext<StepTicket> {
    /** Carousel orientation */
    orientation: Ref<CarouselOrientation>
    /** Number of slides visible at once */
    perView: Ref<number>
    /** Whether navigation wraps around */
    circular: Ref<boolean>
    /** Root ID for generating sub-component IDs */
    rootId: string
    /** Viewport element ref, set by CarouselViewport */
    viewportEl: ShallowRef<HTMLElement | null>
    /** Restart autoplay from full interval */
    play: () => void
    /** Pause autoplay timer */
    pause: () => void
    /** Resume autoplay timer from remaining time */
    resume: () => void
  }

  export const [useCarouselRoot, provideCarouselRoot] = createContext<CarouselContext>()
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'CarouselRoot' })

  defineSlots<{
    default: (props: CarouselRootSlotProps) => any
  }>()

  const {
    id: rootId = useId(),
    namespace = 'v0:carousel',
    disabled = false,
    circular = false,
    orientation = 'horizontal',
    perView = 1,
    autoplay = 0,
  } = defineProps<CarouselRootProps>()

  const model = defineModel<T | T[]>()

  const step = createStep({
    disabled: toRef(() => disabled),
    mandatory: 'force',
    circular,
    events: true,
    reactive: true,
  })

  useProxyModel(step, model, { multiple: false })

  function next () {
    if (circular && perView > 1) {
      const maxStart = Math.max(0, step.size - perView)
      if (step.selectedIndex.value >= maxStart) {
        step.first()
        return
      }
    }
    step.next()
  }

  function prev () {
    if (circular && perView > 1 && step.selectedIndex.value === 0) {
      step.step(Math.max(0, step.size - perView))
      return
    }
    step.prev()
  }

  const timer = autoplay > 0
    ? useTimer(() => next(), { duration: autoplay, repeat: true })
    : null

  function noop () {}
  const pause = timer ? () => timer.pause() : noop
  const resume = timer ? () => timer.resume() : noop
  const play = timer ? () => timer.start() : noop
  const stop = timer ? () => timer.stop() : noop
  const isPlaying = toRef(() => timer?.isActive.value ?? false)

  const viewportEl = shallowRef<HTMLElement | null>(null)

  const context: CarouselContext = {
    ...step,
    next,
    prev,
    play,
    pause,
    resume,
    orientation: toRef(() => orientation),
    perView: toRef(() => perView),
    circular: toRef(() => circular),
    rootId,
    viewportEl,
    // Re-define size getter since object spread evaluates it as a static value
    get size () {
      return step.size
    },
  }

  provideCarouselRoot(namespace, context)

  const slotProps = toRef((): CarouselRootSlotProps => ({
    isDisabled: toValue(step.disabled),
    orientation,
    perView,
    first: step.first,
    last: step.last,
    next,
    prev,
    step: step.step,
    select: step.select,
    isAutoplay: isPlaying.value,
    isPaused: timer?.isPaused.value ?? false,
    remaining: timer?.remaining.value ?? 0,
    play,
    stop,
    pause,
    resume,
    attrs: {
      'role': 'region',
      'aria-roledescription': 'carousel',
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
