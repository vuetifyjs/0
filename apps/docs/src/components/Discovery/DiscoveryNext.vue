/**
 * @module DiscoveryNext
 *
 * @remarks
 * Navigation button that moves to the next step. On the last step,
 * completes the tour by calling stop().
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

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
      'aria-disabled': boolean
      'data-disabled': true | undefined
      'disabled': boolean | undefined
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
  import { computed, toRef } from 'vue'

  defineOptions({ name: 'DiscoveryNext' })

  defineSlots<{
    default: (props: DiscoveryNextSlotProps) => any
  }>()

  const {
    as = 'button',
    disabled,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryNextProps>()

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

  const isLast = computed(() => currentIndex.value === discovery.size - 1)
  const isDisabled = toRef(() => disabled ?? false)

  function next () {
    if (isDisabled.value) return

    if (isLast.value) {
      discovery.stop()
    } else {
      discovery.next()
    }
  }

  const ariaLabel = computed(() => isLast.value ? 'Complete tour' : 'Go to next step')

  const slotProps = toRef((): DiscoveryNextSlotProps => ({
    isDisabled: isDisabled.value,
    isLast: isLast.value,
    next,
    attrs: {
      'aria-label': ariaLabel.value,
      'aria-disabled': isDisabled.value,
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
