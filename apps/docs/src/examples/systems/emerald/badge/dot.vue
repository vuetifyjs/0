<script setup lang="ts">
  import { EmBadge } from '@paper/emerald'
</script>

<template>
  <ul class="emerald-docs-status">
    <li>
      <EmBadge dot variant="primary" />

      Online
    </li>

    <li>
      <EmBadge dot variant="warning" />

      Away
    </li>

    <li>
      <EmBadge dot variant="danger" />

      Do not disturb
    </li>

    <li>
      <EmBadge dot variant="neutral" />

      Offline
    </li>
  </ul>
</template>

<style>
  .emerald-docs-status {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface);
  }

  .emerald-docs-status li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }
</style>
