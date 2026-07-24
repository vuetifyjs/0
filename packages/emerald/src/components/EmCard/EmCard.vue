<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type EmCardVariant = 'complete' | 'simple'

  export interface EmCardProps {
    variant?: EmCardVariant
    hoverable?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCard' })

  const {
    variant = 'complete',
    hoverable = false,
  } = defineProps<EmCardProps>()
</script>

<template>
  <Atom
    as="div"
    class="emerald-card"
    :data-hoverable="hoverable || undefined"
    :data-variant="variant"
  >
    <slot />
  </Atom>
</template>

<style>
  .emerald-card {
    display: flex;
    flex-direction: column;
    background: var(--emerald-background, #fefefe);
    border-radius: var(--emerald-radius-m, 8px);
    overflow: clip;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-card[data-variant='complete'] {
    padding: var(--emerald-spacing-2xl, 32px) var(--emerald-spacing-3xl, 40px);
    box-shadow: var(--emerald-shadow-l, 0 5px 12px -1px rgba(51, 51, 51, 0.2));
  }

  .emerald-card[data-variant='simple'] {
    padding: var(--emerald-spacing-3xs, 2px);
  }

  .emerald-card[data-hoverable]:hover {
    box-shadow: var(--emerald-shadow-xl, 0 16px 40px -8px rgba(51, 51, 51, 0.2));
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-primary-500, #6fb38c);
  }

  .emerald-card__header {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
    margin-bottom: var(--emerald-spacing-s, 12px);
  }

  .emerald-card__title {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    line-height: var(--emerald-text-h4-height, 30px);
    font-weight: var(--emerald-text-h4-weight, 500);
  }

  .emerald-card__subtitle {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .emerald-card__body {
    flex: 1;
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
  }

  .emerald-card__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--emerald-spacing-xs, 8px);
    margin-top: var(--emerald-spacing-l, 20px);
  }
</style>
