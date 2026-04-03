/**
 * @module TourDescription
 *
 * @remarks
 * Semantic paragraph for tour step description.
 * Sets id for aria-describedby reference from TourContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourDescriptionProps extends AtomProps {
    namespace?: string
  }

  export interface TourDescriptionSlotProps {}
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  defineOptions({ name: 'TourDescription' })

  defineSlots<{
    default: (props: TourDescriptionSlotProps) => any
  }>()

  const { as = 'p', namespace = 'v0:tour' } = defineProps<TourDescriptionProps>()

  const root = useTourRootContext(namespace)
</script>

<template>
  <Atom
    :id="root.descriptionId"
    :as
    data-part="description"
    data-scope="tour"
  >
    <slot />
  </Atom>
</template>
