/**
 * @module TourNext
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Next-step control. On the last step, click calls `complete()` rather than
 * a no-op `next()`. Disabled while the tour is unready.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Composables
  import { useTour } from '#v0/composables/createTour'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourNextProps extends AtomProps {
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface TourNextSlotProps {
    isDisabled: boolean
    isLast: boolean
    next: () => void
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'data-scope': 'tour'
      'data-part': 'next'
      'disabled': boolean | undefined
      'tabindex': number
      'type': 'button' | undefined
      'role': 'button' | undefined
      'onClick': () => void
      'onKeydown': ((e: KeyboardEvent) => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourNext', inheritAttrs: false })

  defineSlots<{
    default: (props: TourNextSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:tour',
    disabled = false,
  } = defineProps<TourNextProps>()

  const attrs = useAttrs()
  const locale = useLocale()
  const root = useTourRootContext(namespace)
  const tour = useTour(namespace)

  const isDisabled = toRef(() => {
    return disabled || !tour.isReady.value || (!root.canGoNext.value && !root.isLast.value)
  })

  function next () {
    if (isDisabled.value) return
    if (root.isLast.value) {
      root.complete()
      return
    }
    root.next()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      next()
    }
  }

  const slotProps = toRef((): TourNextSlotProps => ({
    isDisabled: isDisabled.value,
    isLast: root.isLast.value,
    next,
    attrs: {
      'aria-label': root.isLast.value
        ? locale.ti('Tour.complete') ?? 'Complete tour'
        : locale.ti('Tour.next') ?? 'Go to next step',
      'aria-disabled': as === 'button' ? undefined : isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'data-scope': 'tour',
      'data-part': 'next',
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'tabindex': isDisabled.value ? -1 : 0,
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'onClick': next,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
