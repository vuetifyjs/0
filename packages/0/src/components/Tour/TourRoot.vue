/**
 * @module TourRoot
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Per-step context provider for a guided tour. Consumes `useTour()` and
 * provides step-local state (isActive, title/description ids, navigation)
 * to Tour sub-components. Does not create the tour instance.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useTour } from '#v0/composables/createTour'

  // Utilities
  import { useId } from '#v0/utilities'
  import { toRef } from 'vue'

  // Types
  import type { ID } from '#v0/types'
  import type { Ref } from 'vue'

  export interface TourRootContext {
    step: ID
    isActive: Readonly<Ref<boolean>>
    index: Readonly<Ref<number>>
    total: Readonly<Ref<number>>
    isFirst: Readonly<Ref<boolean>>
    isLast: Readonly<Ref<boolean>>
    canGoBack: Readonly<Ref<boolean>>
    canGoNext: Readonly<Ref<boolean>>
    titleId: string
    descriptionId: string
    next: () => void
    prev: () => void
    stop: () => void
    complete: () => void
  }

  export interface TourRootProps {
    /** Step id this root represents */
    step: ID
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourRootSlotProps {
    isActive: boolean
    index: number
    total: number
    isFirst: boolean
    isLast: boolean
    canGoBack: boolean
    canGoNext: boolean
    next: () => void
    prev: () => void
    stop: () => void
    complete: () => void
  }

  export const [useTourRootContext, provideTourRootContext] = createContext<TourRootContext>({ suffix: 'root' })
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourRoot' })

  defineSlots<{
    default: (props: TourRootSlotProps) => any
  }>()

  const {
    step,
    namespace = 'v0:tour',
  } = defineProps<TourRootProps>()

  const tour = useTour(namespace)
  const id = useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  const isActive = toRef(() => tour.isActive.value && tour.selectedId.value === step)
  const index = toRef(() => tour.steps.selectedIndex.value)
  const total = toRef(() => tour.total)

  function next () {
    void tour.next()
  }

  function prev () {
    void tour.prev()
  }

  function stop () {
    tour.stop()
  }

  function complete () {
    tour.complete()
  }

  provideTourRootContext(namespace, {
    step,
    isActive,
    index,
    total,
    isFirst: tour.isFirst,
    isLast: tour.isLast,
    canGoBack: tour.canGoBack,
    canGoNext: tour.canGoNext,
    titleId,
    descriptionId,
    next,
    prev,
    stop,
    complete,
  })

  const slotProps = toRef((): TourRootSlotProps => ({
    isActive: isActive.value,
    index: index.value,
    total: total.value,
    isFirst: tour.isFirst.value,
    isLast: tour.isLast.value,
    canGoBack: tour.canGoBack.value,
    canGoNext: tour.canGoNext.value,
    next,
    prev,
    stop,
    complete,
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
