/**
 * @module InputDescription
 *
 * @see https://0.vuetifyjs.com/components/forms/input
 *
 * @remarks
 * Help text component for the Input component.
 * Auto-connected to Input.Control via aria-describedby.
 * Must be used within an Input.Root component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useInputRoot } from './InputRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface InputDescriptionProps extends AtomProps {
    /** Namespace for connecting to parent Input.Root */
    namespace?: string
  }

  export interface InputDescriptionSlotProps {
    /** ID for this description element */
    id: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'InputDescription', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: InputDescriptionSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:input:root',
  } = defineProps<InputDescriptionProps>()

  const root = useInputRoot(namespace)

  root.descriptions.register({ id: useId() })
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
