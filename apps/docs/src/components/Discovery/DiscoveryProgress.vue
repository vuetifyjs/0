/**
 * @module DiscoveryProgress
 *
 * @remarks
 * Progress indicator for discovery tours. Shows current position in the
 * tour (e.g., "Step 2 of 5").
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

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
      'aria-label': string
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { computed, toRef } from 'vue'

  defineOptions({ name: 'DiscoveryProgress' })

  defineSlots<{
    default?: (props: DiscoveryProgressSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryProgressProps>()

  const discovery = useDiscovery(namespace)

  const currentIndex = computed(() => {
    const selectedId = discovery.selectedId.value
    if (!selectedId) return -1

    let idx = 0
    for (const ticket of discovery.values()) {
      if (ticket.id === selectedId) return idx
      idx++
    }
    return -1
  })

  const current = computed(() => currentIndex.value + 1)
  const total = computed(() => discovery.size)
  const text = computed(() => `${current.value} of ${total.value}`)
  const ariaLabel = computed(() => `Step ${current.value} of ${total.value}`)

  const slotProps = toRef((): DiscoveryProgressSlotProps => ({
    current: current.value,
    total: total.value,
    text: text.value,
    attrs: {
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
