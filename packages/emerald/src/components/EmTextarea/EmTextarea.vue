<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTextareaProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextarea' })

  const {} = defineProps<EmTextareaProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-textarea">
    <slot />
  </V0Paper>
</template>
