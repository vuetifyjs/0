<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxBreadcrumbsProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxBreadcrumbs' })

  const {} = defineProps<CxBreadcrumbsProps>()
</script>

<template>
  <V0Paper as="nav" class="codex-breadcrumbs">
    <slot />
  </V0Paper>
</template>
