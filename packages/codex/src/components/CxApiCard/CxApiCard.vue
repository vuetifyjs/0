<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxApiCardProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxApiCard' })

  const {} = defineProps<CxApiCardProps>()
</script>

<template>
  <V0Paper as="div" class="codex-api-card">
    <slot />
  </V0Paper>
</template>
