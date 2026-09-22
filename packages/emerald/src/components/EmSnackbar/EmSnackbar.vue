<script lang="ts">
  // Framework
  import { Snackbar } from '@vuetify/v0'

  // Types
  import type { SnackbarRootProps } from '@vuetify/v0'

  export type EmSnackbarVariant = 'success' | 'error' | 'info' | 'warning' | 'neutral'

  /**
   * `urgent` defaults to true for `variant="error"` and false otherwise;
   * pass it explicitly to override the variant-derived default.
   */
  export interface EmSnackbarProps extends Pick<SnackbarRootProps, 'id' | 'namespace' | 'urgent'> {
    variant?: EmSnackbarVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSnackbar' })

  const {
    id,
    namespace,
    variant = 'neutral',
    // `= undefined` isn't a no-op here: without it, Vue's Boolean-prop casting
    // resolves an absent `urgent` to `false` rather than `undefined`, which
    // would permanently short-circuit the `??` fallback below.
    urgent = undefined,
  } = defineProps<EmSnackbarProps>()
</script>

<template>
  <Snackbar.Root
    :id
    class="emerald-snackbar"
    :data-variant="variant"
    :namespace
    :urgent="urgent ?? variant === 'error'"
  >
    <slot />
  </Snackbar.Root>
</template>

<style>
  .emerald-snackbar {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    padding: var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-snackbar-accent, transparent);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-surface, #fff);
    box-shadow: var(--emerald-shadow-l, 0 5px 12px -1px rgba(51, 51, 51, 0.2));
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-snackbar[data-variant='error'] {
    --emerald-snackbar-accent: var(--emerald-status-danger-br, #c61424);
    background: var(--emerald-status-danger-bg, #ffebee);
  }

  .emerald-snackbar[data-variant='success'] {
    --emerald-snackbar-accent: var(--emerald-status-success-br, #1fae60);
    background: var(--emerald-status-success-bg, #e7fff2);
  }

  .emerald-snackbar[data-variant='info'] {
    --emerald-snackbar-accent: var(--emerald-status-info-br, #3a70e2);
    background: var(--emerald-status-info-bg, #e4f2ff);
  }

  .emerald-snackbar[data-variant='warning'] {
    --emerald-snackbar-accent: var(--emerald-status-warning-br, #ffcf06);
    background: var(--emerald-status-warning-bg, #fff7e1);
  }

  .emerald-snackbar[data-variant='neutral'] {
    --emerald-snackbar-accent: var(--emerald-neutral-400, #aeb6be);
    background: var(--emerald-neutral-200, #f6f8fa);
  }
</style>
