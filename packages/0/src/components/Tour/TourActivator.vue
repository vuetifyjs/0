/**
 * @module TourActivator
 *
 * @remarks
 * Registers a DOM element as the anchor target for a tour step.
 * Handles scroll-into-view and CSS anchor-name for positioning.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface TourActivatorProps extends AtomProps {
    step: ID | ID[]
    padding?: number
    scroll?: boolean
    scrollOptions?: ScrollIntoViewOptions
    activeClass?: string
    namespace?: string
  }

  export interface TourActivatorSlotProps {
    isActive: boolean
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useTour } from '#v0/composables/useTour'

  // Utilities
  import { nextTick, onBeforeUnmount, onMounted, toRef, useTemplateRef, watch } from 'vue'

  // Transformers
  import { toArray } from '#v0/composables/toArray'
  import { toElement } from '#v0/composables/toElement'

  defineOptions({ name: 'TourActivator' })

  defineSlots<{
    default: (props: TourActivatorSlotProps) => any
  }>()

  const {
    as = 'span',
    step,
    padding,
    scroll = true,
    scrollOptions = { block: 'end', behavior: 'instant' },
    activeClass,
    namespace = 'v0:tour',
  } = defineProps<TourActivatorProps>()

  const tour = useTour(namespace)
  const activatorRef = useTemplateRef<HTMLElement>('activator')

  const steps = toArray(step)
  let tickets: ReturnType<typeof tour.activators.register>[] = []

  onMounted(() => {
    tickets = steps.map(id => tour.activators.register({ id, element: activatorRef, padding }))
  })

  onBeforeUnmount(() => {
    for (const ticket of tickets) {
      tour.activators.unregister(ticket.id)
    }
  })

  async function scrollIntoViewIfActive () {
    if (!scroll) return
    if (!steps.includes(tour.selectedId.value as ID)) return
    await nextTick()
    toElement(activatorRef)?.scrollIntoView(scrollOptions)
  }

  onMounted(scrollIntoViewIfActive)
  watch(() => tour.selectedId.value, scrollIntoViewIfActive)

  const style = toRef(() => ({
    anchorName: steps.map(id => `--tour-${id}`).join(', '),
    scrollMarginBottom: '100px',
  }))

  const isActive = toRef(() => steps.includes(tour.selectedId.value as ID))

  const slotProps = toRef((): TourActivatorSlotProps => ({
    isActive: isActive.value,
  }))
</script>

<template>
  <Atom
    ref="activator"
    :as
    :class="isActive && activeClass"
    data-part="activator"
    data-scope="tour"
    :data-state="isActive ? 'active' : undefined"
    :style
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
