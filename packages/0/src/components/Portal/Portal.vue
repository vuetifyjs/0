<script lang="ts">
  /**
   * @module Portal
   *
   * @see https://0.vuetifyjs.com/components/primitives/portal
   *
   * @remarks
   * Renderless component wrapping Vue's Teleport with automatic
   * useStack integration for z-index coordination.
   *
   * Standardizes the teleport + stack registration pattern used by
   * overlay components (Snackbar, Toast, Dialog, etc.).
   */

  // Composables
  import { useStack } from '#v0/composables/useStack'

  // Utilities
  import { toRef } from 'vue'

  export interface PortalProps {
    /** Teleport target. @default 'body' */
    to?: string | HTMLElement
    /** Render inline instead of teleporting. @default false */
    disabled?: boolean
  }

  export interface PortalSlotProps {
    /** Calculated z-index from useStack */
    zIndex: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Portal' })

  defineSlots<{
    default: (props: PortalSlotProps) => any
  }>()

  const {
    to = 'body',
    disabled = false,
  } = defineProps<PortalProps>()

  const stack = useStack()
  const ticket = stack.register()

  if (!disabled) {
    ticket.select()
  }

  const slotProps = toRef((): PortalSlotProps => ({
    zIndex: ticket.zIndex.value,
  }))
</script>

<template>
  <Teleport :disabled :to>
    <slot v-bind="slotProps" />
  </Teleport>
</template>
