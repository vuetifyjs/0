<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  export interface EmDialogDescriptionProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogDescription' })

  const { namespace } = defineProps<EmDialogDescriptionProps>()
</script>

<template>
  <Dialog.Description class="emerald-dialog__description" :namespace>
    <slot />
  </Dialog.Description>
</template>

<style>
  .emerald-dialog__description {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
    font-weight: var(--emerald-text-b1-weight, 400);
    color: var(--emerald-neutral-700, #757e85);
  }
</style>
