<script lang="ts">
  // Framework
  import { DialogClose } from '@vuetify/v0'

  export interface EmDialogCloseProps {
    renderless?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogClose' })

  const { renderless = false } = defineProps<EmDialogCloseProps>()
</script>

<template>
  <DialogClose class="emerald-dialog__close" :renderless>
    <slot />
  </DialogClose>
</template>
