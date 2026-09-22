<script lang="ts">
  // Framework
  import { Snackbar } from '@vuetify/v0'

  // Types
  import type { SnackbarQueueProps } from '@vuetify/v0'

  export interface EmSnackbarQueueProps extends Omit<SnackbarQueueProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSnackbarQueue' })

  const { namespace } = defineProps<EmSnackbarQueueProps>()
</script>

<template>
  <Snackbar.Queue
    v-slot="slotProps"
    class="emerald-snackbar-queue"
    :namespace
  >
    <slot v-bind="slotProps" />
  </Snackbar.Queue>
</template>

<style>
  .emerald-snackbar-queue {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
  }
</style>
