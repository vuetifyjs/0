/**
 * @module TourSkip
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Dismisses the tour without marking it complete. Emits `skip` then calls
 * `stop()` so listeners run before the overlay unmounts.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourSkipProps extends AtomProps {
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourSkipEmits {
    skip: []
  }

  export interface TourSkipSlotProps {
    skip: () => void
    attrs: {
      'aria-label': string
      'data-scope': 'tour'
      'data-part': 'skip'
      'tabindex': number
      'type': 'button' | undefined
      'role': 'button' | undefined
      'onClick': () => void
      'onKeydown': ((e: KeyboardEvent) => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourSkip', inheritAttrs: false })

  defineSlots<{
    default: (props: TourSkipSlotProps) => any
  }>()

  const emit = defineEmits<TourSkipEmits>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:tour',
  } = defineProps<TourSkipProps>()

  const attrs = useAttrs()
  const locale = useLocale()
  const root = useTourRootContext(namespace)

  function skip () {
    emit('skip')
    root.stop()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      skip()
    }
  }

  const slotProps = toRef((): TourSkipSlotProps => ({
    skip,
    attrs: {
      'aria-label': locale.ti('Tour.skip') ?? 'Dismiss tour',
      'data-scope': 'tour',
      'data-part': 'skip',
      'tabindex': 0,
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'onClick': skip,
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
