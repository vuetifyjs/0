<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogContentProps } from '@vuetify/v0'

  export interface EmDialogContentProps extends Omit<DialogContentProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogContent' })

  const {
    closeOnClickOutside,
    blocking,
    namespace,
  } = defineProps<EmDialogContentProps>()
</script>

<template>
  <Dialog.Content
    :blocking
    class="emerald-dialog"
    :close-on-click-outside
    :namespace
  >
    <div class="emerald-dialog__content">
      <slot />
    </div>
  </Dialog.Content>
</template>

<style>
  .emerald-dialog {
    padding: 0;
    margin: auto;
    border: none;
    background: transparent;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
    overflow: visible;
  }

  .emerald-dialog::backdrop {
    background: var(--emerald-neutral-alpha-30, rgba(51, 51, 51, 0.3));
  }

  .emerald-dialog__content {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xl, 24px);
    width: fit-content;
    max-width: 100%;
    max-height: calc(100vh - 32px);
    min-width: min(320px, 100%);
    /* Shares the card surface pad (m/l) so dialogs and cards read as one family */
    padding: var(--emerald-spacing-m, 16px) var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border-radius: var(--emerald-radius-m, 8px);
    overflow-x: clip;
    overflow-y: auto;
    box-shadow: var(--emerald-shadow-l, 0 5px 12px -1px rgba(51, 51, 51, 0.2));
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-surface, #2b2d2e);
  }
</style>
