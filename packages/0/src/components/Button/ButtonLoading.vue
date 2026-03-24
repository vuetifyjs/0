/**
 * @module ButtonLoading
 *
 * @remarks
 * Loading indicator component that becomes visible after the Root's
 * loading grace period elapses. Registers with Root's internal
 * createSingle selection context.
 */

<script lang="ts">
  export interface ButtonLoadingProps {
    /** Namespace for context injection from parent Button.Root */
    namespace?: string
  }

  // Components
  import { useButtonRoot } from './ButtonRoot.vue'

  // Utilities
  import { onUnmounted, toRef, watch } from 'vue'

  export interface ButtonLoadingSlotProps {
    /** Whether this loading indicator is currently selected/visible */
    isSelected: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ButtonLoading' })

  defineSlots<{
    default: (props: ButtonLoadingSlotProps) => any
  }>()

  const {
    namespace = 'v0:button:root',
  } = defineProps<ButtonLoadingProps>()

  const root = useButtonRoot(namespace)

  const ticket = root.single.register({
    id: 'loading',
    disabled: true,
  })

  watch(root.isLoading, active => {
    if (active) {
      ticket.disabled = false
      ticket.select()
    } else {
      ticket.disabled = true
      root.single.select('content')
    }
  }, { immediate: true })

  onUnmounted(() => {
    root.single.unregister(ticket.id)
  })

  const slotProps = toRef((): ButtonLoadingSlotProps => ({
    isSelected: ticket.isSelected.value,
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
