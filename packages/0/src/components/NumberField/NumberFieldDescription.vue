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

  // Context
  import { useNumberFieldRoot } from './NumberFieldRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface NumberFieldDescriptionProps extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
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
    id = useId(),
    namespace = 'v0:number-field:root',
  } = defineProps<NumberFieldDescriptionProps>()

  const root = useNumberFieldRoot(namespace)

  const ticket = root.descriptions.register({ id })

  onBeforeUnmount(() => ticket.unregister())

  const descriptionAttrs = toRef(() => ({
    id: root.descriptionId,
  }))

  const slotProps = toRef((): NumberFieldDescriptionSlotProps => ({
    id: root.descriptionId,
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, descriptionAttrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
