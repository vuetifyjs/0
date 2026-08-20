<script setup lang="ts">
  import {
    EmButton,
    EmPopover,
    EmPopoverActivator,
    EmPopoverContent,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-center">
    <EmPopover>
      <!-- attrs carry the anchor-name style; binding them alone anchors the panel -->
      <EmPopoverActivator v-slot="{ attrs }" renderless>
        <EmButton v-bind="attrs" variant="secondary">Notifications</EmButton>
      </EmPopoverActivator>

      <EmPopoverContent>
        <ul class="emerald-docs-list">
          <li>Build finished</li>

          <li>2 new comments</li>

          <li>Invite accepted</li>
        </ul>
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

  .emerald-docs-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    min-width: 200px;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 20px);
  }
</style>
