/**
 * @module SnackbarPortal
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
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
  import { Portal } from '#v0/components/Portal'

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
</script>

<template>
  <Portal :disabled="teleport === false" :to="teleport || 'body'">
    <template #default="{ zIndex }">
      <Atom :as :style="{ zIndex }" v-bind="$attrs">
        <slot v-bind="{ zIndex }" />
      </Atom>
    </template>
  </Portal>
</template>
