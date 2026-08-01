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
  .onyx-banner {
    align-items: center;
    background: var(--onyx-muted, #27272a);
    border-bottom: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #27272a);
    color: var(--onyx-foreground, #fafafa);
    display: flex;
    font-size: var(--onyx-text-sm-size, 13px);
    gap: var(--onyx-spacing-md, 16px);
    justify-content: space-between;
    line-height: var(--onyx-text-sm-height, 18px);
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
    color: var(--onyx-muted-foreground, #a1a1aa);
    cursor: pointer;
    display: inline-flex;
    height: 20px;
    justify-content: center;
    padding: 0;
    width: 20px;
  }

  .onyx-banner__dismiss:hover:not([data-disabled]) {
    background: var(--onyx-accent, #27272a);
    color: var(--onyx-foreground, #fafafa);
  }
</style>
