<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type OnBadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

  export interface OnBadgeProps {
    variant?: OnBadgeVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnBadge' })

  const { variant = 'default' } = defineProps<OnBadgeProps>()
</script>

<template>
  <Atom as="span" class="onyx-badge" :data-variant="variant">
    <slot />
  </Atom>
</template>

<!-- Unscoped: DS-wide policy — Atom's root-selection branches (renderless/self-closing/slot)
     make scoped data-v attachment unreliable for any Atom-based primitive; one rule, zero
     judgment calls (DESIGN_SYSTEMS.md §3). -->
<style>
  .onyx-badge {
    align-items: center;
    border-radius: 9999px;
    display: inline-flex;
    font-size: var(--onyx-text-xs-size, 12px);
    font-weight: 600;
    line-height: var(--onyx-text-xs-height, 16px);
    padding: 2px 10px;
    white-space: nowrap;
  }

  .onyx-badge[data-variant='default'] {
    background: var(--onyx-primary, #fafafa);
    color: var(--onyx-primary-foreground, #18181b);
  }

  .onyx-badge[data-variant='secondary'] {
    background: var(--onyx-secondary, #27272a);
    color: var(--onyx-secondary-foreground, #fafafa);
  }

  .onyx-badge[data-variant='outline'] {
    background: transparent;
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #27272a);
    color: var(--onyx-foreground, #fafafa);
  }

  .onyx-badge[data-variant='destructive'] {
    background: var(--onyx-destructive, #ef4444);
    color: var(--onyx-destructive-foreground, #ffffff);
  }
</style>
