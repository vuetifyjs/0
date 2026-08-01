<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type OnAlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive'

  export interface OnAlertProps {
    variant?: OnAlertVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnAlert' })

  const { variant = 'default' } = defineProps<OnAlertProps>()
</script>

<template>
  <Atom as="div" class="onyx-alert" :data-variant="variant" role="alert">
    <div class="onyx-alert__icon">
      <slot name="icon" />
    </div>

    <div class="onyx-alert__content">
      <slot />
    </div>
  </Atom>
</template>

<!-- Unscoped: this file's family CSS also styles OnAlertTitle/OnAlertDescription's Atom
     roots, rendered in sibling SFCs outside this file's scope id — scoped data-v never
     reaches them. -->
<style>
  .onyx-alert {
    background: var(--onyx-background, #09090b);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #27272a);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    color: var(--onyx-foreground, #fafafa);
    display: grid;
    gap: var(--onyx-spacing-sm, 12px);
    grid-template-columns: auto 1fr;
    padding: var(--onyx-spacing-md, 16px);
  }

  .onyx-alert__icon {
    align-items: center;
    color: var(--onyx-alert-accent);
    display: flex;
  }

  .onyx-alert__content {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-3xs, 2px);
  }

  .onyx-alert__title {
    font-weight: 600;
    line-height: var(--onyx-text-sm-height, 18px);
  }

  .onyx-alert__description {
    color: var(--onyx-muted-foreground, #a1a1aa);
    font-size: var(--onyx-text-sm-size, 13px);
    line-height: var(--onyx-text-sm-height, 18px);
  }

  .onyx-alert[data-variant='default'] {
    --onyx-alert-accent: var(--onyx-foreground, #fafafa);
  }

  .onyx-alert[data-variant='info'] {
    --onyx-alert-accent: var(--onyx-info, #60a5fa);
  }

  .onyx-alert[data-variant='success'] {
    --onyx-alert-accent: var(--onyx-success, #22c55e);
  }

  .onyx-alert[data-variant='warning'] {
    --onyx-alert-accent: var(--onyx-warning, #fbbf24);
  }

  .onyx-alert[data-variant='destructive'] {
    --onyx-alert-accent: var(--onyx-destructive, #ef4444);
  }
</style>
