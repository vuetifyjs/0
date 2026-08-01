<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnDialogClose' })
</script>

<template>
  <Dialog.Close class="onyx-dialog__close">
    <slot>
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </slot>
  </Dialog.Close>
</template>

<!-- Unscoped: Dialog.Close is a compound child from v0's own file scope; scoped
     data-v never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-dialog__close {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--onyx-radius-sm, 0.25rem);
    color: var(--onyx-muted-foreground, #a1a1aa);
    cursor: pointer;
    display: inline-flex;
    height: 28px;
    justify-content: center;
    padding: 0;
    position: absolute;
    right: var(--onyx-spacing-md, 16px);
    top: var(--onyx-spacing-md, 16px);
    width: 28px;
  }

  .onyx-dialog__close:hover {
    background: var(--onyx-accent, #27272a);
    color: var(--onyx-foreground, #fafafa);
  }

  .onyx-dialog__close:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--onyx-ring, #71717a) 50%, transparent);
    outline: none;
  }
</style>
