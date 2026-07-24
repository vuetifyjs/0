<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  export interface EmDialogProps {
    id?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialog' })

  const {
    id,
    namespace,
  } = defineProps<EmDialogProps>()

  const model = defineModel<boolean>()
</script>

<template>
  <Dialog.Root :id v-model="model" :namespace>
    <slot />
  </Dialog.Root>
</template>
