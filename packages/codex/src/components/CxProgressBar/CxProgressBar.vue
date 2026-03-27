<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxProgressBarProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxProgressBar' })

  const {} = defineProps<CxProgressBarProps>()
</script>

<template>
  <V0Paper as="div" class="codex-progress-bar">
    <slot />
  </V0Paper>
</template>
