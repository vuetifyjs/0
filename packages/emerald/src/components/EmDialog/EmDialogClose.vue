<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogCloseProps } from '@vuetify/v0'

  // Components
  import EmIcon from '../EmIcon/EmIcon.vue'

  export interface EmDialogCloseProps extends Omit<DialogCloseProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogClose' })

  const { namespace } = defineProps<EmDialogCloseProps>()
</script>

<template>
  <Dialog.Close class="emerald-dialog__close" :namespace>
    <slot>
      <EmIcon name="close" size="s" />
    </slot>
  </Dialog.Close>
</template>

<style>
  .emerald-dialog__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* Hit area, not glyph scale — --emerald-icon-* sizes the mark inside. */
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-neutral-700, #757e85);
    cursor: pointer;
  }

  .emerald-dialog__close:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-dialog__close:focus-visible {
    outline: var(--emerald-stroke-s, 1px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 0;
  }
</style>
