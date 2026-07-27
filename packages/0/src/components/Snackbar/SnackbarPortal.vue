/**
 * @module SnackbarPortal
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * Container component for snackbar notifications. Teleports into the topmost
 * open modal (`top-layer`) by default, falling back to `body`; registers with
 * useStack for z-index coordination. Passes `scrim: false` to its Portal —
 * snackbars are non-modal, so `Scrim` never paints a backdrop for them even
 * when one is active for a Dialog.
 *
 * Does not set aria-live — each SnackbarRoot handles its own live region
 * semantics via role to avoid nesting conflicts.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { Portal } from '#v0/components/Portal'

  // Utilities
  import { mergeProps } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SnackbarPortalProps extends AtomProps {
    /** Teleport target. `'top-layer'` mounts into the topmost open modal; `false` renders inline. @default 'top-layer' */
    teleport?: 'top-layer' | (string & {}) | false
  }

  export interface SnackbarPortalSlotProps {
    /** Calculated z-index from useStack */
    zIndex: number
    /** Attributes to bind to the portal element */
    attrs: {
      style: { position: 'relative', zIndex: number }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarPortal', inheritAttrs: false })

  defineSlots<{
    default: (props: SnackbarPortalSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    teleport = 'top-layer',
  } = defineProps<SnackbarPortalProps>()

  function getSlotProps (zIndex: number): SnackbarPortalSlotProps {
    return {
      zIndex,
      attrs: {
        style: { position: 'relative' as const, zIndex },
      },
    }
  }
</script>

<template>
  <Portal :disabled="teleport === false" :scrim="false" :to="teleport || 'body'">
    <template #default="{ zIndex }">
      <Atom :as :renderless v-bind="mergeProps($attrs, getSlotProps(zIndex).attrs)">
        <slot v-bind="getSlotProps(zIndex)" />
      </Atom>
    </template>
  </Portal>
</template>
