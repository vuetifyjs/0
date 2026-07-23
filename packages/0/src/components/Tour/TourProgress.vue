/**
 * @module TourProgress
 *
 * @remarks
 * Step counter with ARIA status role.
 * Exposes current, total, text, and percent via slot props.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourProgressProps extends AtomProps {
    namespace?: string
  }

  export interface TourProgressSlotProps {
    current: number
    total: number
    text: string
    percent: number
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'TourProgress' })

  defineSlots<{
    default: (props: TourProgressSlotProps) => any
  }>()

  const { as = 'span', namespace = 'v0:tour' } = defineProps<TourProgressProps>()

  const root = useTourRootContext(namespace)

  const current = toRef(() => root.index.value + 1)
  const percent = toRef(() => root.total.value > 0 ? Math.round((current.value / root.total.value) * 100) : 0)
  const text = toRef(() => `${current.value} of ${root.total.value}`)

  const slotProps = toRef((): TourProgressSlotProps => ({
    current: current.value,
    total: root.total.value,
    text: text.value,
    percent: percent.value,
  }))
</script>

<template>
  <Atom
    :aria-label="`Step ${current} of ${root.total.value}`"
    :as
    data-part="progress"
    data-scope="tour"
    role="status"
  >
    <slot v-bind="slotProps">
      {{ text }}
    </slot>
  </Atom>
</template>
