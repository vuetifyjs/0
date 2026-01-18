/**
 * @module DiscoverySkip
 *
 * @remarks
 * Button that skips/closes the discovery tour entirely.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DiscoverySkipProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoverySkipSlotProps {
    /** Skip the tour */
    skip: () => void
    /** Attributes to bind to the button element */
    attrs: {
      'aria-label': string
      'type': 'button' | undefined
      'onClick': () => void
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoverySkip' })

  defineSlots<{
    default: (props: DiscoverySkipSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:discovery',
  } = defineProps<DiscoverySkipProps>()

  const discovery = useDiscovery(namespace)

  function skip () {
    discovery.stop()
  }

  const slotProps = toRef((): DiscoverySkipSlotProps => ({
    skip,
    attrs: {
      'aria-label': 'Skip tour',
      'type': as === 'button' ? 'button' : undefined,
      'onClick': skip,
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
