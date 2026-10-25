<script lang="ts">
  // Framework
  import { AlertDialog, Dialog } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Dialog } from './Md1Dialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogTitleProps } from '@vuetify/v0'

  export interface Md1DialogTitleProps extends Pick<DialogTitleProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogTitle' })

  defineSlots<{
    /** The title: short, a question when confirming, never "Are you sure?" (writing page). */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<Md1DialogTitleProps>()

  const context = useMd1Dialog()

  orphan('Md1DialogTitle', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const alert = toRef(() => context?.variant.value === 'alert')
</script>

<template>
  <AlertDialog.Title v-if="alert" class="md1-dialog__title" :namespace>
    <slot />
  </AlertDialog.Title>

  <Dialog.Title v-else class="md1-dialog__title" :namespace>
    <slot />
  </Dialog.Title>
</template>

<!-- Unscoped: Dialog.Title is an Atom; a scoped data-v never lands on the <h2>. -->
<style>
  /* Title style, Medium 20 sp on a 28 dp line; 24 dp above, 20 dp to the text (dialogs page). */
  .md1-dialog__title {
    margin: 0;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) 20px;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    line-height: 28px;
    letter-spacing: var(--md1-type-title-tracking, 0.02em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /*
   * Over a scrolling option list the title stays pinned so it and the selected
   * item are visible together; over text it scrolls off with the content.
   */
  .md1-dialog[data-variant='simple'] .md1-dialog__title,
  .md1-dialog[data-variant='confirmation'] .md1-dialog__title {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--md1-surface, #FFFFFF);
  }
</style>
