/**
 * @module TourNext
 *
 * @remarks
 * Next step / complete tour button with dynamic ARIA label.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourNextProps extends AtomProps {
    disabled?: boolean
    namespace?: string
  }

  export interface TourNextSlotProps {
    isDisabled: boolean
    isLast: boolean
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'TourNext' })

  defineSlots<{
    default: (props: TourNextSlotProps) => any
  }>()

  const {
    as = 'button',
    disabled,
    namespace = 'v0:tour',
  } = defineProps<TourNextProps>()

  const root = useTourRootContext(namespace)

  const isDisabled = toRef(() => disabled ?? false)
  const label = toRef(() => root.isLast.value ? 'Complete tour' : 'Go to next step')

  function next () {
    if (isDisabled.value) return
    root.next()
  }

  const slotProps = toRef((): TourNextSlotProps => ({
    isDisabled: isDisabled.value,
    isLast: root.isLast.value,
  }))
</script>

<template>
  <Atom
    :aria-label="label"
    :as
    data-part="next"
    data-scope="tour"
    :disabled="isDisabled"
    type="button"
    @click="next"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
