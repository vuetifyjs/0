<script lang="ts">
  // Framework
  import { DialogRoot } from '@vuetify/v0'

  export interface EmDialogProps {
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialog' })

  const { id } = defineProps<EmDialogProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <DialogRoot
    :id
    v-model="model"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </DialogRoot>
</template>
