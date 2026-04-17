<script lang="ts">
  // Framework
  import { DialogDescription } from '@vuetify/v0'

  export interface EmDialogDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogDescription' })
</script>

<template>
  <DialogDescription class="emerald-dialog__description">
    <slot />
  </DialogDescription>
</template>
