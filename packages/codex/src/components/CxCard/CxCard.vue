<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCardProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCard' })

  const {} = defineProps<CxCardProps>()
</script>

<template>
  <V0Paper as="div" class="codex-card">
    <slot />
  </V0Paper>
</template>
