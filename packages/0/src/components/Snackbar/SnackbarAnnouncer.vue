/**
 * @module SnackbarAnnouncer
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * Visually-hidden live-region pair — one polite (role="status") and one
 * assertive (role="alert") — that announces snackbar messages to screen
 * readers. Must be used within a Snackbar.Portal, which auto-renders it
 * unless its `announcer` prop is false; place explicitly for custom markup
 * order or position. Both regions mount empty — live regions only announce
 * changes, so the region must exist in the DOM before content is inserted.
 *
 * @see https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
 * @see https://adrianroselli.com/2026/01/live-region-support.html
 */

<script lang="ts">
  export interface SnackbarAnnouncerProps {
    /** Namespace for context injection from parent Snackbar.Portal. @default 'v0:notifications' */
    namespace?: string
  }

  const visuallyHiddenStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  } as const
</script>

<script setup lang="ts">
  // Context
  import { useSnackbarPortalContext } from './SnackbarPortal.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'SnackbarAnnouncer' })

  const { namespace = 'v0:notifications' } = defineProps<SnackbarAnnouncerProps>()

  const portal = useSnackbarPortalContext(namespace)

  const polite = toRef(() => portal?.polite.value ?? '')
  const assertive = toRef(() => portal?.assertive.value ?? '')
</script>

<template>
  <div
    aria-atomic="true"
    aria-live="polite"
    role="status"
    :style="visuallyHiddenStyle"
  >{{ polite }}</div>

  <div
    aria-atomic="true"
    aria-live="assertive"
    role="alert"
    :style="visuallyHiddenStyle"
  >{{ assertive }}</div>
</template>
