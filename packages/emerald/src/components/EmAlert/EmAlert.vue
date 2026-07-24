<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type EmAlertVariant = 'error' | 'success' | 'info' | 'warning'

  export interface EmAlertProps {
    variant?: EmAlertVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlert' })

  const { variant = 'error' } = defineProps<EmAlertProps>()
</script>

<template>
  <Atom
    as="div"
    class="emerald-alert"
    :data-variant="variant"
    role="alert"
  >
    <slot />
  </Atom>
</template>

<style>
  .emerald-alert {
    display: flex;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    border-radius: var(--emerald-radius-xl, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-alert-accent, transparent);
    box-shadow: var(--emerald-shadow-m, 0 2px 4px 0 rgba(51, 51, 51, 0.2));
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface, #2b2d2e);
    width: 100%;
  }

  .emerald-alert[data-variant='error'] {
    --emerald-alert-accent: var(--emerald-status-danger-br, #c61424);
    background: var(--emerald-status-danger-bg, #ffebee);
  }

  .emerald-alert[data-variant='success'] {
    --emerald-alert-accent: var(--emerald-status-success-br, #1fae60);
    background: var(--emerald-status-success-bg, #e7fff2);
  }

  .emerald-alert[data-variant='info'] {
    --emerald-alert-accent: var(--emerald-status-info-br, #3a70e2);
    background: var(--emerald-status-info-bg, #e4f2ff);
  }

  .emerald-alert[data-variant='warning'] {
    --emerald-alert-accent: var(--emerald-status-warning-br, #ffcf06);
    background: var(--emerald-status-warning-bg, #fff7e1);
  }

  .emerald-alert__title {
    margin: 0;
    font-weight: var(--emerald-text-b2-bold-weight, 600);
  }

  .emerald-alert__description {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
  }
</style>
