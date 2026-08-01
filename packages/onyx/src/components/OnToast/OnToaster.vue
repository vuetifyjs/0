<script lang="ts">
  // Framework
  import { Button, isFunction, isObject, isString, Snackbar } from '@vuetify/v0'

  export interface OnToastAction {
    label: string
    onClick: () => void
  }

  function isToastAction (value: unknown): value is OnToastAction {
    return isObject(value) && isString(value.label) && isFunction(value.onClick)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnToaster' })
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }" class="onyx-toaster">
      <Snackbar.Root
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        class="onyx-toast"
        :data-severity="item.severity"
      >
        <Snackbar.Content class="onyx-toast__content">
          <p v-if="item.subject" class="onyx-toast__subject">{{ item.subject }}</p>
          <p v-if="item.body" class="onyx-toast__body">{{ item.body }}</p>
        </Snackbar.Content>

        <Button.Root
          v-if="isToastAction(item.data?.action)"
          class="onyx-toast__action"
          @click="(item.data!.action as OnToastAction).onClick()"
        >
          {{ (item.data!.action as OnToastAction).label }}
        </Button.Root>

        <Snackbar.Close class="onyx-toast__close">
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
        </Snackbar.Close>
      </Snackbar.Root>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>

<!-- Unscoped: Snackbar.Root/Content/Close are compound children from v0's own file
     scope; scoped data-v never reaches their roots (mirrors the OnButton/Button.Root
     case). -->
<style>
  .onyx-toaster {
    bottom: var(--onyx-spacing-lg, 24px);
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-xs, 8px);
    position: fixed;
    right: var(--onyx-spacing-lg, 24px);
  }

  .onyx-toast {
    background: var(--onyx-popover, #18181b);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #27272a);
    border-left-color: var(--onyx-border, #27272a);
    border-left-width: 4px;
    border-radius: var(--onyx-radius-md, 0.375rem);
    box-shadow: var(--onyx-shadow-sm, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1));
    color: var(--onyx-foreground, #fafafa);
    display: flex;
    gap: var(--onyx-spacing-sm, 12px);
    max-width: 360px;
    padding: var(--onyx-spacing-md, 16px);
    width: 100%;
  }

  .onyx-toast[data-severity='info'] {
    border-left-color: var(--onyx-info, #60a5fa);
  }

  .onyx-toast[data-severity='success'] {
    border-left-color: var(--onyx-success, #22c55e);
  }

  .onyx-toast[data-severity='warning'] {
    border-left-color: var(--onyx-warning, #fbbf24);
  }

  .onyx-toast[data-severity='error'] {
    border-left-color: var(--onyx-destructive, #ef4444);
  }

  .onyx-toast__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--onyx-spacing-3xs, 2px);
  }

  .onyx-toast__subject {
    font-size: var(--onyx-text-sm-size, 13px);
    font-weight: 600;
    line-height: var(--onyx-text-sm-height, 18px);
    margin: 0;
  }

  .onyx-toast__body {
    color: var(--onyx-muted-foreground, #a1a1aa);
    font-size: var(--onyx-text-sm-size, 13px);
    line-height: var(--onyx-text-sm-height, 18px);
    margin: 0;
  }

  .onyx-toast__action {
    background: transparent;
    border: none;
    color: var(--onyx-foreground, #fafafa);
    cursor: pointer;
    flex-shrink: 0;
    font-size: var(--onyx-text-sm-size, 13px);
    font-weight: 600;
    padding: 0;
    text-decoration-line: underline;
    text-underline-offset: 4px;
  }

  .onyx-toast__close {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--onyx-radius-sm, 0.25rem);
    color: var(--onyx-muted-foreground, #a1a1aa);
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    height: 20px;
    justify-content: center;
    padding: 0;
    width: 20px;
  }

  .onyx-toast__close:hover {
    background: var(--onyx-accent, #27272a);
    color: var(--onyx-foreground, #fafafa);
  }
</style>
