/**
 * @module TourRoot
 *
 * @remarks
 * Per-step context provider for the Tour compound component.
 * Gates children by active step and provides step-scoped context.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { TourContext } from '#v0/composables/useTour'
  import type { ID } from '#v0/types'
  import type { Ref } from 'vue'

  export interface TourRootContext {
    step: ID
    isActive: Readonly<Ref<boolean>>
    index: Readonly<Ref<number>>
    total: Ref<number>
    isFirst: Readonly<Ref<boolean>>
    isLast: Readonly<Ref<boolean>>
    canGoBack: TourContext['canGoBack']
    canGoNext: TourContext['canGoNext']
    titleId: string
    descriptionId: string
    next: () => void
    prev: () => void
    stop: () => void
  }

  export interface TourRootProps {
    step: ID
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
  }

  export const [useTourRootContext, provideTourRootContext] = createContext<TourRootContext>({ suffix: 'root' })
</script>

<script setup lang="ts">
  // Composables
  import { useTour } from '#v0/composables/useTour'

  // Utilities
  import { useId } from '#v0/utilities'
  import { toRef } from 'vue'

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
  const total = toRef(() => tour.total)
  const index = toRef(() => tour.steps.selectedIndex.value)

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
    next: () => tour.next(),
    prev: () => tour.prev(),
    stop: () => tour.stop(),
  })

</script>

<template>
  <slot
    :can-go-back="tour.canGoBack.value"
    :can-go-next="tour.canGoNext.value"
    :index
    :is-active
    :is-first="tour.isFirst.value"
    :is-last="tour.isLast.value"
    :total
  />
</template>
