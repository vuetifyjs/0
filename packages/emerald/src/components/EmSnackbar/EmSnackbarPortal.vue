<script lang="ts">
  // Framework
  import { Snackbar } from '@vuetify/v0'

  // Types
  import type { SnackbarPortalProps } from '@vuetify/v0'

  export interface EmSnackbarPortalProps extends Pick<SnackbarPortalProps, 'teleport'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSnackbarPortal' })

  const { teleport } = defineProps<EmSnackbarPortalProps>()
</script>

<template>
  <Snackbar.Portal class="emerald-snackbar-portal" :teleport>
    <slot />
  </Snackbar.Portal>
</template>

<style>
  .emerald-snackbar-portal {
    position: fixed;
    right: var(--emerald-spacing-m, 16px);
    bottom: var(--emerald-spacing-m, 16px);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--emerald-spacing-xs, 8px);
    width: min(360px, calc(100vw - 32px));
    pointer-events: none;
  }

  .emerald-snackbar-portal > * {
    pointer-events: auto;
  }
</style>
