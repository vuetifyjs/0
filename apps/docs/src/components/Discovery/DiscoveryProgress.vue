/**
 * @module DiscoveryProgress
 *
 * @remarks
 * Progress indicator for discovery tours. Shows current position in the
 * tour (e.g., "Step 2 of 5").
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface DiscoveryProgressProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryProgressSlotProps {
    /** Current step number (1-indexed) */
    current: number
    /** Total number of steps */
    total: number
    /** Formatted progress text */
    text: string
    /** Attributes to bind to the progress element */
    attrs: {
      'role': 'status'
      'aria-label': string
    }
  }
</script>

<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Components
  // Context
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoveryProgress' })

  defineSlots<{
    default?: (props: DiscoveryProgressSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryProgressProps>()

  const rootContext = useDiscoveryRootContext(namespace)

  const current = toRef(() => rootContext.index.value + 1)
  const total = toRef(() => rootContext.total.value)
  const text = toRef(() => `${current.value} of ${total.value}`)
  const ariaLabel = toRef(() => `Step ${current.value} of ${total.value}`)

  const slotProps = toRef((): DiscoveryProgressSlotProps => ({
    current: current.value,
    total: total.value,
    text: text.value,
    attrs: {
      'role': 'status',
      'aria-label': ariaLabel.value,
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps">
      {{ text }}
    </slot>
  </Atom>
</template>
