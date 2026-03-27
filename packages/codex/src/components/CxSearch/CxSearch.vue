<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxSearchProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSearch' })

  const {} = defineProps<CxSearchProps>()
</script>

<template>
  <V0Paper as="div" class="codex-search">
    <slot />
  </V0Paper>
</template>
