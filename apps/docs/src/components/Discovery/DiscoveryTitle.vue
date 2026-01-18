/**
 * @module DiscoveryTitle
 *
 * @remarks
 * Title component for discovery steps. Provides the accessible name for
 * the step via aria-labelledby. Should be used inside DiscoveryContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DiscoveryTitleProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryTitleSlotProps {
    /** Attributes to bind to the title element */
    attrs: {
      id: string
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  // Context
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoveryTitle' })

  defineSlots<{
    default: (props: DiscoveryTitleSlotProps) => any
  }>()

  const {
    as = 'h2',
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryTitleProps>()

  const rootContext = useDiscoveryRootContext(namespace)

  const slotProps = toRef((): DiscoveryTitleSlotProps => ({
    attrs: {
      id: rootContext.titleId,
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
