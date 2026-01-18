/**
 * @module DiscoveryContent
 *
 * @remarks
 * Content container for discovery step. Renders the step content when
 * the parent step is active. Provides accessibility attributes for
 * dialog semantics.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface DiscoveryContentProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
  }

  export interface DiscoveryContentSlotProps {
    /** Whether this step is currently active */
    isActive: boolean
    /** This step's ID */
    step: ID
    /** Attributes to bind to the content element */
    attrs: {
      'role': 'dialog'
      'aria-modal': 'false'
      'aria-labelledby': string
      'aria-describedby': string
      'data-discovery-content': ''
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoveryContent' })

  defineSlots<{
    default: (props: DiscoveryContentSlotProps) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryContentProps>()

  const rootContext = useDiscoveryRootContext(namespace)

  const slotProps = toRef((): DiscoveryContentSlotProps => ({
    isActive: rootContext.isActive.value,
    step: rootContext.step,
    attrs: {
      'role': 'dialog',
      'aria-modal': 'false',
      'aria-labelledby': rootContext.titleId,
      'aria-describedby': rootContext.descriptionId,
      'data-discovery-content': '',
    },
  }))
</script>

<template>
  <Atom
    v-if="rootContext.isActive.value"
    :as
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
