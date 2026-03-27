<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxTocProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxToc' })

  const {} = defineProps<CxTocProps>()
</script>

<template>
  <V0Paper as="nav" class="codex-toc">
    <slot />
  </V0Paper>
</template>
