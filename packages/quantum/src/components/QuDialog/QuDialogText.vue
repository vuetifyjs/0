<script lang="ts">
  // Framework
  import { AlertDialog, Dialog } from '@vuetify/v0'

  // Context
  import { orphan, useQuDialog } from './QuDialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogDescriptionProps } from '@vuetify/v0'

  export interface QuDialogTextProps extends Pick<DialogDescriptionProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogText' })

  defineSlots<{
    /** Body copy: one or two sentences, a question or a statement about the actions. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<QuDialogTextProps>()

  const context = useQuDialog()

  orphan('QuDialogText', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const alert = toRef(() => context?.variant.value === 'alert')
</script>

<!-- A div, not v0's default <p>: the text region may hold a list or a control beside its copy. -->
<template>
  <AlertDialog.Description v-if="alert" as="div" class="quantum-dialog__text" :namespace>
    <slot />
  </AlertDialog.Description>

  <Dialog.Description v-else as="div" class="quantum-dialog__text" :namespace>
    <slot />
  </Dialog.Description>
</template>

<!-- Unscoped: Dialog.Description is an Atom; a scoped data-v never lands on the element. -->
<style>
  /*
   * Body 1 at the secondary ink (a Quantum decision: the page states no body
   * style), inside the 24 dp content keylines, 24 dp above the actions.
   */
  .quantum-dialog__text {
    margin: 0;
    padding: 0 var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* An alert without a title bar: the text takes the title's 24 dp from the top edge. */
  .quantum-dialog__text:first-child {
    padding-top: var(--quantum-spacing-3, 24px);
  }
</style>
