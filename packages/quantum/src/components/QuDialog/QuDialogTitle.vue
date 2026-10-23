<script lang="ts">
  // Framework
  import { AlertDialog, Dialog } from '@vuetify/v0'

  // Context
  import { orphan, useQuDialog } from './QuDialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogTitleProps } from '@vuetify/v0'

  export interface QuDialogTitleProps extends Pick<DialogTitleProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogTitle' })

  defineSlots<{
    /** The title: short, a question when confirming, never "Are you sure?" (writing page). */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<QuDialogTitleProps>()

  const context = useQuDialog()

  orphan('QuDialogTitle', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const alert = toRef(() => context?.variant.value === 'alert')
</script>

<template>
  <AlertDialog.Title v-if="alert" class="quantum-dialog__title" :namespace>
    <slot />
  </AlertDialog.Title>

  <Dialog.Title v-else class="quantum-dialog__title" :namespace>
    <slot />
  </Dialog.Title>
</template>

<!-- Unscoped: Dialog.Title is an Atom; a scoped data-v never lands on the <h2>. -->
<style>
  /* Title style, Medium 20 sp on a 28 dp line; 24 dp above, 20 dp to the text (dialogs page). */
  .quantum-dialog__title {
    margin: 0;
    padding: var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px) 20px;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
    line-height: 28px;
    letter-spacing: var(--quantum-type-title-tracking, 0.005em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /*
   * Over a scrolling option list the title stays pinned so it and the selected
   * item are visible together; over text it scrolls off with the content.
   */
  .quantum-dialog[data-variant='simple'] .quantum-dialog__title,
  .quantum-dialog[data-variant='confirmation'] .quantum-dialog__title {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--quantum-surface, #FFFFFF);
  }
</style>
