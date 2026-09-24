/**
 * @module TourTitle
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Accessible heading for the current tour step. Its id is referenced by
 * Tour.Content via `aria-labelledby`.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourTitleProps extends AtomProps {
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourTitleSlotProps {
    attrs: {
      'id': string
      'data-scope': 'tour'
      'data-part': 'title'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourTitle', inheritAttrs: false })

  defineSlots<{
    default: (props: TourTitleSlotProps) => any
  }>()

  const {
    as = 'h2',
    renderless,
    namespace = 'v0:tour',
  } = defineProps<TourTitleProps>()

  const attrs = useAttrs()
  const root = useTourRootContext(namespace)

  const slotProps = toRef((): TourTitleSlotProps => ({
    attrs: {
      'id': root.titleId,
      'data-scope': 'tour',
      'data-part': 'title',
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
