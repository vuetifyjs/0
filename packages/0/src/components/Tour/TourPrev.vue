/**
 * @module TourPrev
 *
 * @remarks
 * Previous step navigation button with ARIA label and disabled state.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourPrevProps extends AtomProps {
    disabled?: boolean
    namespace?: string
  }

  export interface TourPrevSlotProps {
    isDisabled: boolean
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'TourPrev' })

  defineSlots<{
    default: (props: TourPrevSlotProps) => any
  }>()

  const {
    as = 'button',
    disabled,
    namespace = 'v0:tour',
  } = defineProps<TourPrevProps>()

  const root = useTourRootContext(namespace)

  const isDisabled = toRef(() => disabled || root.isFirst.value)

  function prev () {
    if (isDisabled.value) return
    root.prev()
  }

  const slotProps = toRef((): TourPrevSlotProps => ({
    isDisabled: isDisabled.value,
  }))
</script>

<template>
  <Atom
    aria-label="Go to previous step"
    :as
    data-part="prev"
    data-scope="tour"
    :disabled="isDisabled"
    type="button"
    @click="prev"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
