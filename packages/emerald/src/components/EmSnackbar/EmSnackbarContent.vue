<script lang="ts">
  // Framework
  import { Snackbar } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSnackbarContent' })
</script>

<template>
  <Snackbar.Content class="emerald-snackbar__content">
    <slot />
  </Snackbar.Content>
</template>

<style>
  .emerald-snackbar__content {
    flex: 1;
    min-width: 0;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-weight, 400);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface, #2b2d2e);
  }
</style>
