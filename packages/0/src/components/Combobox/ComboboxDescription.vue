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
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Utilities
  import { onBeforeUnmount, onMounted, useAttrs } from 'vue'

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

  const context = useComboboxContext(namespace)

  onMounted(() => {
    context.hasDescription.value = true
  })

  onBeforeUnmount(() => {
    context.hasDescription.value = false
  })
</script>

<template>
  <Atom
    v-bind="attrs"
    :id="context.descriptionId"
    :as
    :renderless
  >
    <slot :id="context.descriptionId" />
  </Atom>
</template>
