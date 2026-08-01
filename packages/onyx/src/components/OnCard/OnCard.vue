<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnCard' })
</script>

<template>
  <Atom as="div" class="onyx-card">
    <slot />
  </Atom>
</template>

<!-- Unscoped: this file's family CSS also styles OnCardHeader/Title/Description/Content/Footer's
     Atom roots, rendered in sibling SFCs outside this file's scope id — scoped data-v never
     reaches them. -->
<style>
  .onyx-card {
    background: var(--onyx-card, #18181b);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #27272a);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    box-shadow: var(--onyx-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
    color: var(--onyx-card-foreground, #fafafa);
  }

  .onyx-card__header {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-2xs, 4px);
    padding: var(--onyx-spacing-lg, 24px);
  }

  .onyx-card__title {
    font-size: var(--onyx-text-md-size, 16px);
    font-weight: 600;
    line-height: var(--onyx-text-md-height, 24px);
  }

  .onyx-card__description {
    color: var(--onyx-muted-foreground, #a1a1aa);
    font-size: var(--onyx-text-sm-size, 13px);
    line-height: var(--onyx-text-sm-height, 18px);
  }

  .onyx-card__content {
    padding: 0 var(--onyx-spacing-lg, 24px) var(--onyx-spacing-lg, 24px);
  }

  .onyx-card__footer {
    align-items: center;
    display: flex;
    padding: 0 var(--onyx-spacing-lg, 24px) var(--onyx-spacing-lg, 24px);
  }
</style>
