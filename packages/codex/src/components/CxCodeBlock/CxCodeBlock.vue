<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCodeBlockProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCodeBlock' })

  const {} = defineProps<CxCodeBlockProps>()
</script>

<template>
  <V0Paper as="div" class="codex-code-block">
    <slot />
  </V0Paper>
</template>
