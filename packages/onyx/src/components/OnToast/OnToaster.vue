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
    background: var(--onyx-band), var(--onyx-popover, #211c19);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #2f2925);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    box-shadow: var(--onyx-girdle), var(--onyx-pool-overlay);
    color: var(--onyx-popover-foreground, #f0ece5);
    display: flex;
    gap: var(--onyx-spacing-sm, 12px);
    max-width: 360px;
    padding: var(--onyx-spacing-md, 16px) var(--onyx-spacing-lg, 24px);
    width: 100%;
  }

  .onyx-toast {
    animation: onyx-present var(--onyx-motion-base, 200ms) var(--onyx-motion-easing, cubic-bezier(0.16, 1, 0.3, 1));
  }

  /* Transforms dropped entirely, only opacity remains at 120ms (direction-a.md §7). */
  @media (prefers-reduced-motion: reduce) {
    .onyx-toast {
      animation: onyx-fade var(--onyx-motion-fast, 120ms) linear;
    }
  }

  /* Severity lives in the girdle and nowhere else — no tinted backgrounds, no colored borders.
     A severity toast is a stone object with a colored light on its top edge (direction-a.md §5.8). */
  .onyx-toast[data-severity='info'] {
    box-shadow: inset 0 1px 0 0 color-mix(in oklab, var(--onyx-info, #90bce9) 70%, transparent), var(--onyx-pool-overlay);
  }

  .onyx-toast[data-severity='success'] {
    box-shadow: inset 0 1px 0 0 color-mix(in oklab, var(--onyx-success, #93ca9e) 70%, transparent), var(--onyx-pool-overlay);
  }

  .onyx-toast[data-severity='warning'] {
    box-shadow: inset 0 1px 0 0 color-mix(in oklab, var(--onyx-warning, #fcb26f) 70%, transparent), var(--onyx-pool-overlay);
  }

  .onyx-toast[data-severity='error'] {
    box-shadow: inset 0 1px 0 0 color-mix(in oklab, var(--onyx-destructive, #cf4b3b) 70%, transparent), var(--onyx-pool-overlay);
  }

  .onyx-toast__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--onyx-spacing-3xs, 2px);
  }

  .onyx-toast__subject {
    font-size: var(--onyx-text-base-size, 15px);
    font-weight: 550;
    line-height: var(--onyx-text-base-height, 24px);
    margin: 0;
  }

  .onyx-toast__body {
    color: var(--onyx-muted-foreground, #bab3ab);
    font-size: var(--onyx-text-sm-size, 13.5px);
    line-height: var(--onyx-text-sm-height, 22px);
    margin: 0;
  }

  .onyx-toast__action {
    background: transparent;
    border: none;
    color: var(--onyx-foreground, #f0ece5);
    cursor: pointer;
    flex-shrink: 0;
    font-size: var(--onyx-text-sm-size, 13.5px);
    font-weight: 550;
    padding: 0;
    text-decoration-line: underline;
    text-underline-offset: 4px;
  }

  .onyx-toast__action:focus-visible,
  .onyx-toast__close:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  .onyx-toast__close {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--onyx-radius-sm, 0.25rem);
    color: var(--onyx-muted-foreground, #bab3ab);
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    height: 20px;
    justify-content: center;
    padding: 0;
    width: 20px;
  }

  .onyx-toast__close:hover {
    background: color-mix(in oklab, var(--onyx-accent, #2f2925) 70%, transparent);
    color: var(--onyx-foreground, #f0ece5);
  }
</style>
