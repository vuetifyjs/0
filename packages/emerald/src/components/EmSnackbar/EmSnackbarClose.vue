<script lang="ts">
  // Framework
  import { Snackbar } from '@vuetify/v0'

  export interface EmSnackbarCloseProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSnackbarClose' })

  const { namespace } = defineProps<EmSnackbarCloseProps>()
</script>

<template>
  <Snackbar.Close class="emerald-snackbar__close" :namespace>
    <slot>
      <span aria-hidden="true">×</span>
    </slot>
  </Snackbar.Close>
</template>

<style>
  .emerald-snackbar__close {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: var(--emerald-icon-l, 24px);
    height: var(--emerald-icon-l, 24px);
    margin: calc(var(--emerald-spacing-3xs, 2px) * -1) calc(var(--emerald-spacing-3xs, 2px) * -1) 0 0;
    padding: 0;
    border: 0;
    border-radius: var(--emerald-radius-s, 6px);
    background: transparent;
    color: var(--emerald-neutral-700, #757e85);
    font-size: 1.125rem;
    line-height: 1;
    cursor: pointer;
  }

  .emerald-snackbar__close:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-snackbar__close:focus-visible {
    outline: var(--emerald-stroke-s, 1px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 0;
  }
</style>
