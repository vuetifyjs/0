<script lang="ts">
  // Framework
  import { Atom, Button } from '@vuetify/v0'

  export interface OnBannerProps {
    dismissible?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnBanner' })

  const emit = defineEmits<{ dismiss: [] }>()

  const { dismissible = false } = defineProps<OnBannerProps>()

  function onDismiss () {
    emit('dismiss')
  }
</script>

<template>
  <Atom as="div" class="onyx-banner">
    <div class="onyx-banner__content">
      <slot />
    </div>

    <div class="onyx-banner__actions">
      <slot name="actions" />

      <Button.Root
        v-if="dismissible"
        aria-label="Dismiss"
        class="onyx-banner__dismiss"
        @click="onDismiss"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="14"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="14"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </Button.Root>
    </div>
  </Atom>
</template>

<!-- Unscoped: onyx-banner__dismiss is a nested Button.Root — a compound child from
     v0's own file scope — whose root never receives this file's scoped data-v attribute
     (mirrors the OnButton/OnChip case). -->
<style>
  /* No girdle/pool here: a full-width banner attached to a layout edge is a fixture, not an
     object floating above the ground — same discipline rule as ghost buttons and dividers
     (direction-a.md §6): if it does not sit above the ground, it does not catch light. */
  .onyx-banner {
    align-items: center;
    background: var(--onyx-muted, #211c19);
    border-bottom: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #2f2925);
    color: var(--onyx-foreground, #f0ece5);
    display: flex;
    font-size: var(--onyx-text-sm-size, 13.5px);
    gap: var(--onyx-spacing-md, 16px);
    justify-content: space-between;
    line-height: var(--onyx-text-sm-height, 22px);
    padding: var(--onyx-spacing-sm, 12px) var(--onyx-spacing-lg, 24px);
    width: 100%;
  }

  .onyx-banner__content {
    flex: 1 1 auto;
  }

  .onyx-banner__actions {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    gap: var(--onyx-spacing-sm, 12px);
  }

  .onyx-banner__dismiss {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 9999px;
    color: var(--onyx-muted-foreground, #bab3ab);
    cursor: pointer;
    display: inline-flex;
    height: 20px;
    justify-content: center;
    padding: 0;
    width: 20px;
  }

  .onyx-banner__dismiss:hover:not([data-disabled]) {
    background: color-mix(in oklab, var(--onyx-accent, #2f2925) 70%, transparent);
    color: var(--onyx-foreground, #f0ece5);
  }

  .onyx-banner__dismiss:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }
</style>
