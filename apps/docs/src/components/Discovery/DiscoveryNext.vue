/**
 * @module DiscoveryNext
 *
 * @remarks
 * Navigation button that moves to the next step. On the last step,
 * completes the tour by calling stop().
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface DiscoveryNextProps extends AtomProps {
    /** Namespace for context injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface DiscoveryNextSlotProps {
    /** Whether button is disabled */
    isDisabled: boolean
    /** Whether this is the last step */
    isLast: boolean
    /** Go to next step or complete tour */
    next: () => void
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

  defineOptions({ name: 'DiscoveryNext' })

  defineSlots<{
    default: (props: DiscoveryNextSlotProps) => any
  }>()

  const {
    as = 'button',
    disabled,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryNextProps>()

  const rootContext = useDiscoveryRootContext(namespace)

  const isDisabled = toRef(() => disabled ?? false)

  function next () {
    if (isDisabled.value) return
    rootContext.next()
  }

  const ariaLabel = toRef(() => rootContext.isLast.value ? 'Complete tour' : 'Go to next step')

  const slotProps = toRef((): DiscoveryNextSlotProps => ({
    isDisabled: isDisabled.value,
    isLast: rootContext.isLast.value,
    next,
    attrs: {
      'aria-label': ariaLabel.value,
      'aria-disabled': as === 'button' ? undefined : isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': next,
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
