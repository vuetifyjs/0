/**
 * @module TourProgress
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Live-region progress indicator showing the 1-based current step over total.
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

  export interface TourProgressProps extends AtomProps {
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourProgressSlotProps {
    current: number
    total: number
    text: string
    attrs: {
      'role': 'status'
      'data-scope': 'tour'
      'data-part': 'progress'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourProgress', inheritAttrs: false })

  defineSlots<{
    default: (props: TourProgressSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:tour',
  } = defineProps<TourProgressProps>()

  const attrs = useAttrs()
  const locale = useLocale()
  const root = useTourRootContext(namespace)

  const current = toRef(() => root.index.value + 1)
  const text = toRef(() => `${locale.n(current.value)} / ${locale.n(root.total.value)}`)

  const slotProps = toRef((): TourProgressSlotProps => ({
    current: current.value,
    total: root.total.value,
    text: text.value,
    attrs: {
      'role': 'status',
      'data-scope': 'tour',
      'data-part': 'progress',
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps">
      {{ text }}
    </slot>
  </Atom>
</template>
