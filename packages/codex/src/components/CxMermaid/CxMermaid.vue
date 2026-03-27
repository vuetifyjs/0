<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxMermaidProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxMermaid' })

  const {} = defineProps<CxMermaidProps>()
</script>

<template>
  <V0Paper as="div" class="codex-mermaid">
    <slot />
  </V0Paper>
</template>
