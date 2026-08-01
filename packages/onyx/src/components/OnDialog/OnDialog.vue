<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  export interface OnDialogProps {
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnDialog' })

  const { id } = defineProps<OnDialogProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <Dialog.Root :id v-model="model">
    <slot />
  </Dialog.Root>
</template>
