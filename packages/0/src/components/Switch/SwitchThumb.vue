/**
 * @module SwitchThumb
 *
 * @see https://0.vuetifyjs.com/components/forms/switch
 *
 * @remarks
 * Sliding knob indicator for switches. Must be used within a
 * Switch.Root component which provides the switch state.
 * Renders as a span by default and only displays when checked or indeterminate.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SwitchState } from './SwitchRoot.vue'

  export interface SwitchThumbProps extends AtomProps {
    /** Namespace for connecting to parent Switch.Root */
    namespace?: string
  }

  export interface SwitchThumbSlotProps {
    /** Whether the parent switch is on */
    isChecked: boolean
    /** Whether the parent switch is in a mixed/indeterminate state */
    isMixed: boolean
    /** Pre-computed data attributes and visibility style for styling */
    attrs: {
      'data-state': SwitchState
      'style': { visibility: 'visible' | 'hidden' }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SwitchThumb' })

  defineSlots<{
    default: (props: SwitchThumbSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:switch:root',
  } = defineProps<SwitchThumbProps>()

  const root = useSwitchRoot(namespace)

  const isChecked = toRef(() => toValue(root.isChecked))
  const isMixed = toRef(() => toValue(root.isMixed))
  const isVisible = toRef(() => isChecked.value || isMixed.value)
  const dataState = toRef((): SwitchState => isMixed.value
    ? 'indeterminate'
    : (isChecked.value ? 'checked' : 'unchecked'),
  )

  const slotProps = toRef((): SwitchThumbSlotProps => ({
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    attrs: {
      'data-state': dataState.value,
      'style': { visibility: isVisible.value ? 'visible' : 'hidden' },
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
