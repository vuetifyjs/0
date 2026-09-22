<script setup lang="ts">
  import { EmAlert, EmAlertDescription, EmAlertTitle } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmAlert variant="error">
      <EmAlertTitle>Import failed</EmAlertTitle>

      <EmAlertDescription>Row 14 has an invalid date. Nothing was imported.</EmAlertDescription>
    </EmAlert>

    <EmAlert variant="warning">
      <EmAlertTitle>Trial ending</EmAlertTitle>

      <EmAlertDescription>Your trial ends in 3 days. Add a payment method to keep your projects.</EmAlertDescription>
    </EmAlert>

    <EmAlert variant="success">
      <EmAlertTitle>Changes published</EmAlertTitle>

      <EmAlertDescription>Your site is live. New pages can take a minute to appear.</EmAlertDescription>
    </EmAlert>

    <EmAlert variant="info">
      <EmAlertTitle>Scheduled maintenance</EmAlertTitle>

      <EmAlertDescription>The API will be read-only on Sunday between 02:00 and 03:00 UTC.</EmAlertDescription>
    </EmAlert>
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
