/**
 * @module ButtonContent
 *
 * @remarks
 * Default content area for buttons. Registers with Root's internal
 * createSingle selection as the fallback — selected when Loading is not active.
 */

<script lang="ts">
  export interface ButtonContentProps {
    /** Namespace for context injection from parent Button.Root */
    namespace?: string
  }

  // Components
  import { useButtonRoot } from './ButtonRoot.vue'

  // Utilities
  import { onUnmounted, toRef } from 'vue'

  export interface ButtonContentSlotProps {
    /** Whether this content area is currently selected/visible */
    isSelected: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ButtonContent' })

  defineSlots<{
    default: (props: ButtonContentSlotProps) => any
  }>()

  const {
    namespace = 'v0:button:root',
  } = defineProps<ButtonContentProps>()

  const root = useButtonRoot(namespace)

  // Register as fallback — mandatory: 'force' ensures this gets selected by default
  const ticket = root.single.register({ id: 'content' })

  onUnmounted(() => {
    root.single.unregister(ticket.id)
  })

  const slotProps = toRef((): ButtonContentSlotProps => ({
    isSelected: ticket.isSelected.value,
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
