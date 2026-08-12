/**
 * @module AlertRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Root component for inline status messages. Renders with `role="alert"` by
 * default (assertive live region — AT reads it immediately on update).
 * Use `role="status"` for non-urgent informational messages (polite live
 * region). Pair with AlertTitle and AlertDescription for structured content.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertRootProps extends AtomProps {
    /**
     * ARIA live-region role.
     * - `'alert'`  — assertive: AT interrupts to announce the message immediately.
     * - `'status'` — polite: AT waits for the current speech to finish.
     * @default 'alert'
     */
    role?: 'alert' | 'status'
  }

  export interface AlertRootSlotProps {
    /** Attributes to bind to the alert element */
    attrs: {
      role: 'alert' | 'status'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertRoot' })

  defineSlots<{
    default: (props: AlertRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    role = 'alert',
  } = defineProps<AlertRootProps>()

  const slotProps = toRef((): AlertRootSlotProps => ({
    attrs: { role },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
