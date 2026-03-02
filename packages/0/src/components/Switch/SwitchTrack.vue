/**
 * @module SwitchTrack
 *
 * @remarks
 * Track/rail component for switches. Always visible, provides data-state
 * attribute for CSS styling. Must be used within a Switch.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SwitchState } from './SwitchRoot.vue'

  export interface SwitchTrackProps extends AtomProps {
    namespace?: string
  }

  export interface SwitchTrackSlotProps {
    isChecked: boolean
    isMixed: boolean
    attrs: {
      'data-state': SwitchState
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SwitchTrack' })

  defineSlots<{
    default: (props: SwitchTrackSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:switch:root',
  } = defineProps<SwitchTrackProps>()

  const root = useSwitchRoot(namespace)

  const isChecked = toRef(() => toValue(root.isChecked))
  const isMixed = toRef(() => toValue(root.isMixed))
  const dataState = toRef((): SwitchState => isMixed.value
    ? 'indeterminate'
    : (isChecked.value ? 'checked' : 'unchecked'),
  )

  const slotProps = toRef((): SwitchTrackSlotProps => ({
    isChecked: isChecked.value,
    isMixed: isMixed.value,
    attrs: {
      'data-state': dataState.value,
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
