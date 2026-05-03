/**
 * @module ButtonContent
 *
 * @see https://0.vuetifyjs.com/components/actions/button
 *
 * @remarks
 * Default content area for buttons. Registers with Root's internal
 * createSingle selection as the fallback — selected when Loading is not active.
 */

<script lang="ts">
  // Context
  import { useButtonRoot } from './ButtonRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { onBeforeUnmount, toRef } from 'vue'

  // Types
  import type { ID } from '#v0/types'

  export interface ButtonContentProps {
    /** Unique identifier for ticket registration */
    id?: ID
    /** Namespace for context injection from parent Button.Root */
    namespace?: string
  }

  export interface ButtonContentSlotProps {
    isSelected: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ButtonContent' })

  defineSlots<{
    default: (props: ButtonContentSlotProps) => any
  }>()

  const {
    id = useId(),
    namespace = 'v0:button:root',
  } = defineProps<ButtonContentProps>()

  const root = useButtonRoot(namespace)

  const ticket = root.single.register({ id })

  onBeforeUnmount(() => ticket.unregister())

  const slotProps = toRef((): ButtonContentSlotProps => ({
    isSelected: ticket.isSelected.value,
  }))
</script>

<template>
  <span :style="{ visibility: ticket.isSelected.value ? 'visible' : 'hidden' }">
    <slot v-bind="slotProps" />
  </span>
</template>
