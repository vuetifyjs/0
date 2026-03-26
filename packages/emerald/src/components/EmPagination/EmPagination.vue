<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmPaginationProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPagination' })

  const {} = defineProps<EmPaginationProps>()
</script>

<template>
  <V0Paper as="nav" class="emerald-pagination">
    <slot />
  </V0Paper>
</template>
