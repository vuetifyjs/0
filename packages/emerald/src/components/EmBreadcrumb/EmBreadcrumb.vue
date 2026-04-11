<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmBreadcrumbProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumb' })

  const {} = defineProps<EmBreadcrumbProps>()
</script>

<template>
  <V0Paper as="nav" class="emerald-breadcrumb">
    <slot />
  </V0Paper>
</template>
