<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmUploadProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmUpload' })

  const {} = defineProps<EmUploadProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-upload">
    <slot />
  </V0Paper>
</template>
