<script setup lang="ts">
  import {
    EmPopover,
    EmPopoverActivator,
    EmPopoverContent,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-center">
    <EmPopover>
      <EmPopoverActivator>Details</EmPopoverActivator>

      <EmPopoverContent>
        <p class="emerald-docs-note">
          Anchored to its trigger, rendered in the top layer, and dismissed by
          clicking outside or pressing Escape.
        </p>
      </EmPopoverContent>
    </EmPopover>
  </div>
</template>

<style>
  .emerald-docs-center {
    display: flex;
    justify-content: center;
    padding: var(--emerald-spacing-l, 24px) 0;
  }

  .emerald-docs-note {
    margin: 0;
    max-width: 280px;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 20px);
  }
</style>
