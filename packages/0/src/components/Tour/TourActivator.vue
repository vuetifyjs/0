/**
 * @module TourActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Registers a target element with the tour activator registry and sets
 * the CSS `anchor-name` used by Tour.Content for positioning.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useTour } from '#v0/composables/createTour'

  // Transformers
  import { toArray } from '#v0/composables/toArray'
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isElement, isUndefined } from '#v0/utilities'
  import { mergeProps, nextTick, onBeforeUnmount, onMounted, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface TourActivatorProps extends AtomProps {
    /** Step id or ids this activator belongs to */
    step: ID | ID[]
    /** Extra padding reported to Tour.Highlight */
    padding?: number
    /** Scroll the activator into view when its step becomes active @default true */
    scroll?: boolean
    /** Options forwarded to `scrollIntoView` */
    scrollOptions?: ScrollIntoViewOptions
    /** Class applied while this activator's step is selected */
    activeClass?: string
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourActivatorSlotProps {
    isActive: boolean
    attrs: {
      'data-scope': 'tour'
      'data-part': 'activator'
      'data-state': 'active' | undefined
      'style': {
        anchorName: string
        scrollMarginBottom: string
      }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourActivator', inheritAttrs: false })

  defineSlots<{
    default: (props: TourActivatorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    step,
    padding,
    scroll = true,
    scrollOptions,
    activeClass,
    namespace = 'v0:tour',
  } = defineProps<TourActivatorProps>()

  const attrs = useAttrs()
  const tour = useTour(namespace)
  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)
  const steps = toArray(step)

  const tickets = steps.map(id => tour.activators.register({
    id,
    element: el,
    padding,
  }))

  onBeforeUnmount(() => {
    for (const ticket of tickets) {
      tour.activators.unregister(ticket.id)
    }
  })

  const isActive = toRef(() => {
    const selected = tour.selectedId.value
    return tour.isActive.value && !isUndefined(selected) && steps.includes(selected)
  })

  async function onActive () {
    if (!scroll || !isActive.value) return

    await nextTick()

    const element = el.value
    if (!isElement(element)) return

    ;(element as HTMLElement).scrollIntoView(scrollOptions ?? { block: 'end', behavior: 'instant' })
  }

  onMounted(onActive)
  watch(() => tour.selectedId.value, onActive)

  const slotProps = toRef((): TourActivatorSlotProps => ({
    isActive: isActive.value,
    attrs: {
      'data-scope': 'tour',
      'data-part': 'activator',
      'data-state': isActive.value ? 'active' : undefined,
      'style': {
        anchorName: steps.map(id => `--tour-${id}`).join(', '),
        scrollMarginBottom: '100px',
      },
    },
  }))
</script>

<template>
  <Atom
    ref="atom"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :class="isActive ? activeClass : undefined"
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
