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
        <dl class="emerald-docs-snippet">
          <div>
            <dt>Plan</dt>
            <dd>Studio</dd>
          </div>

          <div>
            <dt>Owner</dt>
            <dd>Sarah Chen</dd>
          </div>

          <div>
            <dt>Last invoice</dt>
            <dd>Mar 4</dd>
          </div>
        </dl>
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

  .emerald-docs-snippet {
    margin: 0;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 20px);
  }

  .emerald-docs-snippet div {
    display: flex;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-snippet dt {
    color: var(--emerald-on-surface-variant);
  }

  .emerald-docs-snippet dd {
    margin: 0;
  }
</style>
