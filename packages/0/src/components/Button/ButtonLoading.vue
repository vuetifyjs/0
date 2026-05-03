/**
 * @module ButtonLoading
 *
 * @see https://0.vuetifyjs.com/components/actions/button
 *
 * @remarks
 * Loading indicator component that becomes visible after the Root's
 * loading grace period elapses. Registers with Root's internal
 * createSingle selection context.
 */

<script lang="ts">
  // Context
  import { useButtonRoot } from './ButtonRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { onBeforeUnmount, toRef, watch } from 'vue'

  // Types
  import type { ID } from '#v0/types'

  export interface ButtonLoadingProps {
    /** Unique identifier for ticket registration */
    id?: ID
    /** Namespace for context injection from parent Button.Root */
    namespace?: string
  }

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
    id = useId(),
    namespace = 'v0:button:root',
  } = defineProps<ButtonLoadingProps>()

  const root = useButtonRoot(namespace)

  const ticket = root.single.register({
    id,
    disabled: true,
  })

  watch(root.isLoading, active => {
    if (active) {
      ticket.disabled = false
      ticket.select()
    } else {
      ticket.disabled = true
      const fallback = root.single.seek('first')
      if (fallback) fallback.select()
    }
  }, { immediate: true })

  onBeforeUnmount(() => ticket.unregister())

  const slotProps = toRef((): ButtonLoadingSlotProps => ({
    isSelected: ticket.isSelected.value,
  }))
</script>

<template>
  <slot v-if="ticket.isSelected.value" v-bind="slotProps" />
</template>
