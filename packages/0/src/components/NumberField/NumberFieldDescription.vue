/**
 * @module NumberFieldDescription
 *
 * @remarks
 * Help text component for number fields.
 * Auto-connected to NumberField.Control via aria-describedby.
 * Must be used within a NumberField.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Utilities
  import { onBeforeUnmount, onMounted, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface NumberFieldDescriptionProps extends AtomProps {
    /** Namespace for connecting to parent NumberField.Root */
    namespace?: string
  }

  export interface NumberFieldDescriptionSlotProps {
    /** ID for this description element */
    id: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'NumberFieldDescription', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: NumberFieldDescriptionSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:number-field:root',
  } = defineProps<NumberFieldDescriptionProps>()

  const root = useNumberFieldRoot(namespace)

  onMounted(() => {
    root.hasDescription.value = true
  })

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
