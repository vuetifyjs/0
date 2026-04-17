<script lang="ts">
  // Framework
  import { DialogTitle } from '@vuetify/v0'

  export interface EmDialogTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogTitle' })
</script>

<template>
  <DialogTitle class="emerald-dialog__title">
    <slot />
  </DialogTitle>
</template>
