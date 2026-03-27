<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxMermaidProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxMermaid' })

  const { ...paperProps } = defineProps<CxMermaidProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="figure"
    class="codex-mermaid"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-mermaid {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
  }
</style>
