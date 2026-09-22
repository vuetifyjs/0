<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogTitleProps } from '@vuetify/v0'

  export interface EmDialogTitleProps extends Omit<DialogTitleProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogTitle' })

  const { namespace } = defineProps<EmDialogTitleProps>()
</script>

<template>
  <Dialog.Title class="emerald-dialog__title" :namespace>
    <slot />
  </Dialog.Title>
</template>

<style>
  .emerald-dialog__title {
    margin: 0;
    font-size: var(--emerald-text-h3-size, 24px);
    line-height: var(--emerald-text-h3-height, 36px);
    font-weight: var(--emerald-text-h3-weight, 700);
    color: var(--emerald-on-surface, #2b2d2e);
  }
</style>
