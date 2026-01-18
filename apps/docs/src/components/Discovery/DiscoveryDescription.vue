/**
 * @module DiscoveryDescription
 *
 * @remarks
 * Description component for discovery steps. Provides supplementary
 * description for the step via aria-describedby. Should be used inside
 * DiscoveryContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface DiscoveryDescriptionProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryDescriptionSlotProps {
    /** Attributes to bind to the description element */
    attrs: {
      id: string
    }
  }
</script>

<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoveryDescription' })

  defineSlots<{
    default: (props: DiscoveryDescriptionSlotProps) => any
  }>()

  const {
    as = 'p',
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryDescriptionProps>()

  const rootContext = useDiscoveryRootContext(namespace)

  const slotProps = toRef((): DiscoveryDescriptionSlotProps => ({
    attrs: {
      id: rootContext.descriptionId,
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
