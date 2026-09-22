<script setup lang="ts">
  import {
    EmButton,
    EmPopover,
    EmPopoverActivator,
    EmPopoverContent,
  } from '@paper/emerald'

  const areas = [
    { label: 'Top', area: 'top' },
    { label: 'Bottom', area: 'bottom' },
    { label: 'End', area: 'inline-end span-block-end' },
  ]
</script>

<template>
  <div class="emerald-docs-row">
    <EmPopover v-for="item in areas" :key="item.area">
      <EmPopoverActivator v-slot="{ attrs }" renderless>
        <EmButton v-bind="attrs" variant="secondary">{{ item.label }}</EmButton>
      </EmPopoverActivator>

      <EmPopoverContent :position-area="item.area" position-try="flip-block">
        <p class="emerald-docs-note">position-area: {{ item.area }}</p>
      </EmPopoverContent>
    </EmPopover>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    justify-content: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-xl, 32px) 0;
  }

  .emerald-docs-note {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 20px);
  }
</style>
