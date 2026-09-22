/**
 * @module TourDescription
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Accessible description for the current tour step. Its id is referenced by
 * Tour.Content via `aria-describedby`.
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

  export interface TourDescriptionProps extends AtomProps {
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourDescriptionSlotProps {
    attrs: {
      'id': string
      'data-scope': 'tour'
      'data-part': 'description'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourDescription', inheritAttrs: false })

  defineSlots<{
    default: (props: TourDescriptionSlotProps) => any
  }>()

  const {
    as = 'p',
    renderless,
    namespace = 'v0:tour',
  } = defineProps<TourDescriptionProps>()

  const attrs = useAttrs()
  const root = useTourRootContext(namespace)

  const slotProps = toRef((): TourDescriptionSlotProps => ({
    attrs: {
      'id': root.descriptionId,
      'data-scope': 'tour',
      'data-part': 'description',
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
