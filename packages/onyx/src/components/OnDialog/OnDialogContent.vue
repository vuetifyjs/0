<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  export type OnDialogContentMode = 'default' | 'sheet'

  export interface OnDialogContentProps {
    blocking?: boolean
    closeOnClickOutside?: boolean
    mode?: OnDialogContentMode
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnDialogContent' })

  const {
    blocking,
    closeOnClickOutside,
    mode = 'default',
  } = defineProps<OnDialogContentProps>()
</script>

<template>
  <Dialog.Content
    :blocking
    class="onyx-dialog__content"
    :close-on-click-outside
    :data-mode="mode"
  >
    <slot />
  </Dialog.Content>
</template>

<!-- Unscoped: Dialog.Content is a compound child from v0's own file scope; scoped
     data-v never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-dialog__content {
    background: var(--onyx-background, #09090b);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #27272a);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    box-shadow: var(--onyx-shadow-sm, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1));
    color: var(--onyx-foreground, #fafafa);
    margin: auto;
    max-width: 512px;
    padding: var(--onyx-spacing-lg, 24px);
    width: 100%;
  }

  /* No `position` override here: a modal <dialog> is already `position: fixed` via
     the UA stylesheet, which already establishes the containing block the close
     button's `position: absolute` needs. Setting `position: relative` here would
     beat that UA rule (author origin always wins, regardless of specificity) and
     break the dialog's viewport-relative centering. */

  /* [open] scoping is load-bearing: an unconditional `display` here would beat the
     UA's `dialog:not([open]) { display: none }` rule (author origin always wins
     over UA origin, regardless of specificity), leaving the dialog visible even
     while closed. */
  .onyx-dialog__content[open] {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-md, 16px);
  }

  .onyx-dialog__content::backdrop {
    background: rgb(0 0 0 / 0.5);
  }

  .onyx-dialog__content[data-mode='sheet'] {
    margin: var(--onyx-spacing-3xl, 64px) auto auto;
  }

  @media (max-width: 768px) {
    .onyx-dialog__content[data-mode='sheet'] {
      border-radius: var(--onyx-radius-lg, 0.5rem) var(--onyx-radius-lg, 0.5rem) 0 0;
      bottom: 0;
      left: 0;
      margin: 0;
      max-width: 100%;
      position: fixed;
      right: 0;
      top: auto;
      width: 100%;
    }
  }
</style>
