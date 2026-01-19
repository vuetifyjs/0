/**
 * @module DiscoveryPrev
 *
 * @remarks
 * Navigation button that moves to the previous step. Automatically disables
 * when already on the first step.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface DiscoveryPrevProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface DiscoveryPrevSlotProps {
    /** Whether button is disabled */
    isDisabled: boolean
    /** Go to previous step */
    prev: () => void
    /** Attributes to bind to the button element */
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
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

  defineOptions({ name: 'DiscoveryPrev' })

  defineSlots<{
    default: (props: DiscoveryPrevSlotProps) => any
  }>()

  const {
    as = 'button',
    disabled,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryPrevProps>()

  const rootContext = useDiscoveryRootContext(namespace)

  const isDisabled = toRef(() => disabled || rootContext.isFirst.value)

  function prev () {
    if (isDisabled.value) return
    rootContext.prev()
  }

  const slotProps = toRef((): DiscoveryPrevSlotProps => ({
    isDisabled: isDisabled.value,
    prev,
    attrs: {
      'aria-label': 'Go to previous step',
      'aria-disabled': as === 'button' ? undefined : isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': prev,
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
