/**
 * @module DiscoverySkip
 *
 * @remarks
 * Button that skips/closes the discovery tour entirely.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

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
  // Framework
  import { Atom } from '@vuetify/v0'

  // Components
  // Context
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

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

  const rootContext = useDiscoveryRootContext(namespace)

  function skip () {
    rootContext.stop()
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
