/**
 * @module DiscoveryPrev
 *
 * @remarks
 * Navigation button that moves to the previous step. Automatically disables
 * when already on the first step.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

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

  defineOptions({ name: 'DiscoveryPrev' })

  defineSlots<{
    default: (props: DiscoveryPrevSlotProps) => any
  }>()

  const {
    as = 'button',
    disabled,
    namespace = 'v0:discovery',
  } = defineProps<DiscoveryPrevProps>()

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

  const isFirst = computed(() => currentIndex.value === 0)
  const isDisabled = toRef(() => disabled || isFirst.value)

  function prev () {
    if (isDisabled.value) return
    discovery.prev()
  }

  const slotProps = toRef((): DiscoveryPrevSlotProps => ({
    isDisabled: isDisabled.value,
    prev,
    attrs: {
      'aria-label': 'Go to previous step',
      'aria-disabled': isDisabled.value,
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
