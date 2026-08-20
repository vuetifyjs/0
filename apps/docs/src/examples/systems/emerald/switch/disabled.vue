<script setup lang="ts">
  import { EmSwitch } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSwitch disabled>Off and disabled</EmSwitch>

    <EmSwitch disabled :model-value="true">On and disabled</EmSwitch>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }
</style>
