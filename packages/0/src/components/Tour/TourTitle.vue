/**
 * @module TourTitle
 *
 * @remarks
 * Semantic heading for tour step content.
 * Sets id for aria-labelledby reference from TourContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourTitleProps extends AtomProps {
    namespace?: string
  }

  export interface TourTitleSlotProps {}
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  defineOptions({ name: 'TourTitle' })

  defineSlots<{
    default: (props: TourTitleSlotProps) => any
  }>()

  const { as = 'h2', namespace = 'v0:tour' } = defineProps<TourTitleProps>()

  const root = useTourRootContext(namespace)
</script>

<template>
  <Atom
    :id="root.titleId"
    :as
    data-part="title"
    data-scope="tour"
  >
    <slot />
  </Atom>
</template>
