<script setup lang="ts">
  import { EmBadge } from '@paper/emerald'

  import type { EmBadgeVariant } from '@paper/emerald'

  const variants: EmBadgeVariant[] = ['neutral', 'primary', 'success', 'danger', 'info', 'warning']
</script>

<template>
  <div class="emerald-docs-variants">
    <div v-for="variant in variants" :key="variant" class="emerald-docs-variant">
      <EmBadge :content="8" :variant />

      <span class="emerald-docs-caption">{{ variant }}</span>
    </div>
  </div>
</template>

<style>
  .emerald-docs-variants {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-l, 24px);
  }

  .emerald-docs-variant {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
  }

  .emerald-docs-caption {
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-neutral-700);
  }
</style>
