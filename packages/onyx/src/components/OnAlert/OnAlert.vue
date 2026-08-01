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
    background: var(--onyx-band), var(--onyx-card, #181411);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #2f2925);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    box-shadow: var(--onyx-girdle), var(--onyx-pool);
    color: var(--onyx-card-foreground, #f0ece5);
    display: grid;
    gap: var(--onyx-spacing-sm, 12px);
    grid-template-columns: auto 1fr;
    padding: var(--onyx-spacing-md, 16px) var(--onyx-spacing-lg, 24px);
  }

  /* Severity lives in the girdle, same rule as OnToast (direction-a.md §5.8): a severity alert
     is a stone object with a colored light on its top edge, not a tinted panel. */
  .onyx-alert[data-variant='info'],
  .onyx-alert[data-variant='success'],
  .onyx-alert[data-variant='warning'],
  .onyx-alert[data-variant='destructive'] {
    box-shadow: inset 0 1px 0 0 color-mix(in oklab, var(--onyx-alert-accent) 70%, transparent), var(--onyx-pool);
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
    font-size: var(--onyx-text-base-size, 15px);
    font-weight: 550;
    line-height: var(--onyx-text-base-height, 24px);
  }

  .onyx-alert__description {
    color: var(--onyx-muted-foreground, #bab3ab);
    font-size: var(--onyx-text-sm-size, 13.5px);
    line-height: var(--onyx-text-sm-height, 22px);
  }

  .onyx-alert[data-variant='default'] {
    --onyx-alert-accent: var(--onyx-foreground, #f0ece5);
  }

  .onyx-alert[data-variant='info'] {
    --onyx-alert-accent: var(--onyx-info, #90bce9);
  }

  .onyx-alert[data-variant='success'] {
    --onyx-alert-accent: var(--onyx-success, #93ca9e);
  }

  .onyx-alert[data-variant='warning'] {
    --onyx-alert-accent: var(--onyx-warning, #fcb26f);
  }

  .onyx-alert[data-variant='destructive'] {
    --onyx-alert-accent: var(--onyx-destructive, #cf4b3b);
  }
</style>
