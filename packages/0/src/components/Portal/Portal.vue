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
    /** Block scrim close. @default false */
    blocking?: boolean
    /** Whether a scrim/backdrop should back this portal. @default true */
    scrim?: boolean
  }

  export interface PortalSlotProps {
    /** Calculated z-index from useStack */
    zIndex: number
    /** Close this portal (unselects from stack) */
    close: () => void
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Portal' })

  defineSlots<{
    default: (props: PortalSlotProps) => any
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const {
    to = 'body',
    disabled = false,
    blocking = false,
    scrim = true,
  } = defineProps<PortalProps>()

  const stack = useStack()
  // `disabled` is the Teleport toggle (render inline) — bound on <Teleport>
  // below. It must NOT reach the stack ticket, whose `disabled` means
  // selection-disabled: forwarding it makes ticket.select() a no-op, so an
  // inline portal is excluded from the stack (z-index pins to base, inline
  // portals collide, no dismiss/scrim coordination).
  const ticket = stack.register({
    blocking,
    scrim,
    onDismiss: () => emit('close'),
  })
  ticket.select()

  const slotProps = toRef((): PortalSlotProps => ({
    zIndex: ticket.zIndex.value,
    close: ticket.dismiss,
  }))
</script>

<template>
  <Teleport :disabled :to>
    <slot v-bind="slotProps" />
  </Teleport>
</template>
