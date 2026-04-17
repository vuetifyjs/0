<script lang="ts">
  // Framework
  import { DialogClose } from '@vuetify/v0'

  export interface EmDialogCloseProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogClose' })
</script>

<template>
  <DialogClose class="emerald-dialog__close">
    <slot />
  </DialogClose>
</template>
