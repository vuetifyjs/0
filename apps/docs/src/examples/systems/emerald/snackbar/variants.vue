<script setup lang="ts">
  import { EmSnackbar, EmSnackbarContent } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSnackbar variant="success">
      <EmSnackbarContent>Deploy finished — all checks passed.</EmSnackbarContent>
    </EmSnackbar>

    <EmSnackbar variant="error">
      <EmSnackbarContent>Build failed. Check the logs for details.</EmSnackbarContent>
    </EmSnackbar>

    <EmSnackbar variant="info">
      <EmSnackbarContent>A new version is available. Refresh to update.</EmSnackbarContent>
    </EmSnackbar>

    <EmSnackbar variant="warning">
      <EmSnackbarContent>API rate limit at 80% for this workspace.</EmSnackbarContent>
    </EmSnackbar>

    <EmSnackbar variant="neutral">
      <EmSnackbarContent>Draft moved to the archive.</EmSnackbarContent>
    </EmSnackbar>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
  }
</style>
