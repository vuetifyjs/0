/**
 * @module CarouselRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Root component for carousel navigation. Creates and provides step context
 * to child CarouselViewport, CarouselSlide, CarouselPrevious, and CarouselNext
 * components. Built on CSS scroll-snap with multi-slide display and peek support.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { StepContext, StepTicket } from '#v0/composables/createStep'
  import type { ID } from '#v0/types'
  import type { Ref, ShallowRef } from 'vue'

  export type CarouselOrientation = 'horizontal' | 'vertical'

  export interface CarouselRootProps {
    /** Namespace for dependency injection (must match child namespace) */
    namespace?: string
    /** Disables the entire carousel */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory slide behavior:
     * - false: No mandatory enforcement
     * - true: Prevents deselecting the last selected slide
     * - `force` (default): Automatically selects the first non-disabled slide
     */
    mandatory?: boolean | 'force'
    /** Whether navigation wraps around from last to first */
    circular?: boolean
    /** Carousel orientation */
    orientation?: CarouselOrientation
    /** Number of slides visible at once */
    perView?: number
    /** Gap between slides in pixels */
    gap?: number
    /** Amount of adjacent slide visible in pixels (peek) */
    peek?: number
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
    /** Gap between slides in pixels */
    gap: Ref<number>
    /** Amount of adjacent slide visible in pixels */
    peek: Ref<number>
    /** Whether navigation wraps around */
    circular: Ref<boolean>
    /** Root ID for generating sub-component IDs */
    rootId: string
    /** Viewport element ref, set by CarouselViewport */
    viewportEl: ShallowRef<HTMLElement | null>
  }

  export const [useCarouselRoot, provideCarouselRoot] = createContext<CarouselContext>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { createStep } from '#v0/composables/createStep'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { shallowRef, toRef, toValue, useId } from 'vue'

  defineOptions({ name: 'CarouselRoot' })

  defineSlots<{
    default: (props: CarouselRootSlotProps) => any
  }>()

  const {
    namespace = 'v0:carousel',
    disabled = false,
    enroll = false,
    mandatory = 'force',
    circular = false,
    orientation = 'horizontal',
    perView = 1,
    gap = 0,
    peek = 0,
  } = defineProps<CarouselRootProps>()

  const model = defineModel<T | T[]>()

  const rootId = useId()

  const step = createStep({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    circular,
    events: true,
    reactive: true,
  })

  useProxyModel(step, model, { multiple: false })

  const viewportEl = shallowRef<HTMLElement | null>(null)

  const context: CarouselContext = {
    ...step,
    orientation: toRef(() => orientation),
    perView: toRef(() => perView),
    gap: toRef(() => gap),
    peek: toRef(() => peek),
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
    next: step.next,
    prev: step.prev,
    step: step.step,
    select: step.select,
    attrs: {
      'role': 'region',
      'aria-roledescription': 'carousel',
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
