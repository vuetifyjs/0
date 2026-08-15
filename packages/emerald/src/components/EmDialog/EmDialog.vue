<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogRootProps } from '@vuetify/v0'

  export interface EmDialogProps extends Omit<DialogRootProps, 'as' | 'renderless'> {}
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
