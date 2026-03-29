<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxAlertProps extends V0PaperProps {
    type?: 'info' | 'success' | 'warning' | 'error'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAlert' })

  const {
    type = 'info',
    ...paperProps
  } = defineProps<HxAlertProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-alert"
    :data-type="type"
    role="alert"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-alert {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    position: relative;
    padding: 0.75rem 1rem;
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
    gap: 0.5rem;
  }

  .helix-alert[data-type='info'] {
    border-color: var(--v0-info);
    background-color: color-mix(in srgb, var(--v0-info) 10%, transparent);
    color: var(--v0-info);
  }

  .helix-alert[data-type='success'] {
    border-color: var(--v0-success);
    background-color: color-mix(in srgb, var(--v0-success) 10%, transparent);
    color: var(--v0-success);
  }

  .helix-alert[data-type='warning'] {
    border-color: var(--v0-warning);
    background-color: color-mix(in srgb, var(--v0-warning) 10%, transparent);
    color: var(--v0-warning);
  }

  .helix-alert[data-type='error'] {
    border-color: var(--v0-error);
    background-color: color-mix(in srgb, var(--v0-error) 10%, transparent);
    color: var(--v0-error);
  }
</style>
