<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmDialogProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialog' })

  const {} = defineProps<EmDialogProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-dialog">
    <slot />
  </V0Paper>
</template>
