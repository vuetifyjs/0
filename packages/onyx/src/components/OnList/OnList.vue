<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnList' })
</script>

<template>
  <Atom as="ul" class="onyx-list">
    <slot />
  </Atom>
</template>

<!-- Unscoped: this file's family CSS also styles OnListItem's Atom root, rendered
     in a sibling SFC outside this file's scope id — scoped data-v never reaches
     it. -->
<style>
  .onyx-list {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-3xs, 2px);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .onyx-list__item {
    align-items: center;
    border-radius: var(--onyx-radius-md, 0.375rem);
    color: var(--onyx-foreground, #fafafa);
    display: flex;
    gap: var(--onyx-spacing-sm, 12px);
    padding: var(--onyx-spacing-sm, 12px);
  }

  .onyx-list__item[data-active] {
    background: var(--onyx-accent, #27272a);
    color: var(--onyx-accent-foreground, #fafafa);
  }

  .onyx-list__item[data-two-line] {
    align-items: flex-start;
  }

  .onyx-list__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .onyx-list__leading,
  .onyx-list__trailing {
    align-items: center;
    display: flex;
    flex-shrink: 0;
  }
</style>
