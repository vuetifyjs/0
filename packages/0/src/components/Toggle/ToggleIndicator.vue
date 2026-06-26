/**
 * @module ToggleIndicator
 *
 * @see https://0.vuetifyjs.com/components/actions/toggle
 *
 * @remarks
 * Visual indicator for the pressed state of a toggle. Consumes
 * ToggleRootContext and exposes isPressed for rendering icons,
 * checkmarks, or other visual cues. Hidden when unpressed.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ToggleIndicatorProps extends AtomProps {
    /** Namespace for context injection from parent Toggle.Root */
    namespace?: string
  }

  export interface ToggleIndicatorSlotProps {
    /** Whether this toggle is currently pressed */
    isPressed: boolean
    /** Attributes to bind to the indicator element */
    attrs: {
      'data-state': 'on' | 'off'
      'style': { visibility: 'visible' | 'hidden' }
    }
  }
</script>

<script setup lang="ts">
  // Context
  import { useToggleRoot } from './ToggleRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'ToggleIndicator' })

  defineSlots<{
    default: (props: ToggleIndicatorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:toggle:root',
  } = defineProps<ToggleIndicatorProps>()

  const root = useToggleRoot(namespace)

  const isPressed = toRef(() => toValue(root.isPressed))

  const slotProps = toRef((): ToggleIndicatorSlotProps => ({
    isPressed: isPressed.value,
    attrs: {
      'data-state': isPressed.value ? 'on' : 'off',
      'style': { visibility: isPressed.value ? 'visible' : 'hidden' },
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
