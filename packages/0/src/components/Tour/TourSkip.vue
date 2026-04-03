/**
 * @module TourSkip
 *
 * @remarks
 * Dismiss/skip tour button. Emits 'skip' event for consumer routing logic.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourSkipProps extends AtomProps {
    namespace?: string
  }

  export interface TourSkipEmits {
    skip: []
  }

  export interface TourSkipSlotProps {}
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  defineOptions({ name: 'TourSkip' })

  defineSlots<{
    default: (props: TourSkipSlotProps) => any
  }>()

  const { as = 'button' } = defineProps<TourSkipProps>()

  const emit = defineEmits<TourSkipEmits>()

  function skip () {
    emit('skip')
  }
</script>

<template>
  <Atom
    aria-label="Dismiss tour"
    :as
    data-part="skip"
    data-scope="tour"
    type="button"
    @click="skip"
  >
    <slot />
  </Atom>
</template>
