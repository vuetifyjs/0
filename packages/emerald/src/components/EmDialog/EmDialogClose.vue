<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogClose' })
</script>

<template>
  <Dialog.Close class="emerald-dialog__close">
    <slot>
      <span aria-hidden="true">×</span>
    </slot>
  </Dialog.Close>
</template>

<style>
  .emerald-dialog__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--emerald-icon-xl, 32px);
    height: var(--emerald-icon-xl, 32px);
    padding: 0;
    border: 0;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-neutral-700, #757e85);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
  }

  .emerald-dialog__close:hover {
    background: var(--emerald-neutral-200, #ebf0f4);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-dialog__close:focus-visible {
    outline: var(--emerald-stroke-s, 1px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 0;
  }
</style>
