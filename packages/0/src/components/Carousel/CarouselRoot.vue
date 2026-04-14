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
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { createStep } from '#v0/composables/createStep'
  import { useLocale } from '#v0/composables/useLocale'
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { useTimer } from '#v0/composables/useTimer'

  // Utilities
  import { toRef, toValue, useId } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RegistryContext, RegistryTicketInput } from '#v0/composables/createRegistry'
  import type { StepContext, StepTicket } from '#v0/composables/createStep'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  export type CarouselOrientation = 'horizontal' | 'vertical'

  export interface CarouselTicket extends StepTicket {
    /** Element reference for DOM measurement */
    el?: MaybeRefOrGetter<HTMLElement | null>
  }

  export interface CarouselRootProps extends AtomProps {
    /** Unique identifier for the carousel */
    id?: string
    /** Accessible label for the carousel region */
    label?: string
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
    /** Scroll behavior for programmatic navigation */
    behavior?: ScrollBehavior
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
      'aria-label': string
      'aria-disabled': boolean
      'data-disabled': true | undefined
    }
  }

  export interface CarouselPartTicket extends RegistryTicketInput {
    type: 'viewport' | 'previous' | 'next' | 'indicator' | 'progress' | 'live-region'
    el: MaybeRefOrGetter<HTMLElement | null>
  }

  export interface CarouselContext extends StepContext<CarouselTicket> {
    /** Carousel orientation */
    orientation: Ref<CarouselOrientation>
    /** Number of slides visible at once */
    perView: Ref<number>
    /** Whether navigation wraps around */
    circular: Ref<boolean>
    /** Root ID for generating sub-component IDs */
    rootId: string
    /** Scroll behavior for programmatic navigation */
    behavior: Ref<ScrollBehavior>
    /** Registry for structural sub-components */
    parts: RegistryContext<CarouselPartTicket>
    /** Autoplay interval duration in ms (0 = disabled) */
    autoplay: Readonly<Ref<number>>
    /** Milliseconds remaining until next auto-advance */
    remaining: Readonly<Ref<number>>
    /** Whether autoplay is currently active */
    isAutoplay: Readonly<Ref<boolean>>
    /** Whether autoplay is currently paused */
    isPaused: Readonly<Ref<boolean>>
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
    as = 'div',
    renderless,
    id: rootId = useId(),
    label,
    namespace = 'v0:carousel',
    disabled = false,
    circular = false,
    orientation = 'horizontal',
    perView = 1,
    autoplay = 0,
    behavior = 'smooth',
  } = defineProps<CarouselRootProps>()

  const locale = useLocale()

  const model = defineModel<T | T[]>()

  const step = createStep<CarouselTicket>({
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

  function pause () {
    timer?.pause()
  }
  function resume () {
    timer?.resume()
  }
  function play () {
    timer?.start()
  }
  function stop () {
    timer?.stop()
  }

  const parts = createRegistry<CarouselPartTicket>()

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
    behavior: toRef(() => behavior),
    parts,
    autoplay: toRef(() => autoplay),
    remaining: toRef(() => timer?.remaining.value ?? 0),
    isAutoplay: toRef(() => timer?.isActive.value ?? false),
    isPaused: toRef(() => timer?.isPaused.value ?? false),
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
    isAutoplay: timer?.isActive.value ?? false,
    isPaused: timer?.isPaused.value ?? false,
    remaining: timer?.remaining.value ?? 0,
    play,
    stop,
    pause,
    resume,
    attrs: {
      'role': 'region',
      'aria-roledescription': 'carousel',
      'aria-label': label ?? locale.t('Carousel.label'),
      'aria-disabled': toValue(step.disabled),
      'data-disabled': toValue(step.disabled) || undefined,
    },
  }))
</script>

<template>
  <Atom v-bind="slotProps.attrs" :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
