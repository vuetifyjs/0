/**
 * @module RadioIndicator
 *
 * @remarks
 * Visual indicator component for radio buttons. Must be used within a
 * Radio.Root component which provides the radio state and actions.
 * Renders as a span by default and only displays when checked.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RadioState } from './RadioRoot.vue'

  export interface RadioIndicatorProps extends AtomProps {
    /** Namespace for context injection from parent Radio.Root */
    namespace?: string
  }

  export interface RadioIndicatorSlotProps {
    /** Whether this radio is currently checked */
    isChecked: boolean
    /** Attributes to bind to the indicator element */
    attrs: {
      'data-state': RadioState
      'style': { visibility: 'visible' | 'hidden' }
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useRadioRoot } from './RadioRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'RadioIndicator' })

  defineSlots<{
    default: (props: RadioIndicatorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:radio:root',
  } = defineProps<RadioIndicatorProps>()

  const root = useRadioRoot(namespace)

  const isChecked = toRef(() => toValue(root.isChecked))
  const dataState = toRef((): RadioState => isChecked.value ? 'checked' : 'unchecked')

  const slotProps = toRef((): RadioIndicatorSlotProps => ({
    isChecked: isChecked.value,
    attrs: {
      'data-state': dataState.value,
      'style': { visibility: isChecked.value ? 'visible' : 'hidden' },
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
