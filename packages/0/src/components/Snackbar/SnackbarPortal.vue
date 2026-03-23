/**
 * @module SnackbarPortal
 *
 * @remarks
 * Container component for snackbar notifications. Teleports to body
 * and registers with useStack for z-index coordination with Dialog/Scrim.
 *
 * Does not set aria-live — each SnackbarRoot handles its own live region
 * semantics via role to avoid nesting conflicts.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useStack } from '#v0/composables/useStack'

  // Utilities
  import { onUnmounted, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SnackbarPortalProps extends AtomProps {
    /** Teleport target. `false` renders inline. @default 'body' */
    teleport?: string | false
  }

  export interface SnackbarPortalSlotProps {
    /** Calculated z-index from useStack */
    zIndex: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarPortal', inheritAttrs: false })

  defineSlots<{
    default: (props: SnackbarPortalSlotProps) => any
  }>()

  const {
    as = 'div',
    teleport = 'body',
  } = defineProps<SnackbarPortalProps>()

  const stack = useStack()
  const ticket = stack.register()

  onUnmounted(() => ticket.unregister())

  const styles = toRef(() => ({ zIndex: ticket.zIndex.value }))

  const slotProps = toRef((): SnackbarPortalSlotProps => ({
    zIndex: ticket.zIndex.value,
  }))
</script>

<template>
  <Teleport v-if="teleport" :to="teleport">
    <Atom :as :style="styles" v-bind="$attrs">
      <slot v-bind="slotProps" />
    </Atom>
  </Teleport>

  <Atom v-else :as :style="styles" v-bind="$attrs">
    <slot v-bind="slotProps" />
  </Atom>
</template>
