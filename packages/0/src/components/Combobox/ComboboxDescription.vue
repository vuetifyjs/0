/**
 * @module ComboboxDescription
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Help text component for the Combobox component.
 * Auto-connected to Combobox.Control via aria-describedby.
 * Must be used within a Combobox.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxRoot } from './ComboboxRoot.vue'

  // Utilities
  import { onBeforeUnmount, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxDescriptionProps extends AtomProps {
    /** Namespace for connecting to parent Combobox.Root */
    namespace?: string
  }

  export interface ComboboxDescriptionSlotProps {
    /** ID for this description element */
    id: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxDescription', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ComboboxDescriptionSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:combobox',
  } = defineProps<ComboboxDescriptionProps>()

  const root = useComboboxRoot(namespace)

  root.hasDescription.value = true

  onBeforeUnmount(() => {
    root.hasDescription.value = false
  })
</script>

<template>
  <Atom
    v-bind="attrs"
    :id="root.descriptionId"
    :as
    :renderless
  >
    <slot :id="root.descriptionId" />
  </Atom>
</template>
