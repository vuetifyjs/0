<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxSkeletonProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSkeleton' })

  const {} = defineProps<CxSkeletonProps>()
</script>

<template>
  <V0Paper as="div" class="codex-skeleton">
    <slot />
  </V0Paper>
</template>
