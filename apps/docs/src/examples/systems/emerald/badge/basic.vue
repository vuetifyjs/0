<script setup lang="ts">
  import { EmBadge } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmBadge :content="3" variant="primary" />

    <EmBadge :content="12" />

    <EmBadge variant="success">NEW</EmBadge>

    <EmBadge dot variant="danger" />
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
    color: var(--emerald-on-surface);
  }
</style>
