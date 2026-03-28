<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxMermaidProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxMermaid' })

  const { ...paperProps } = defineProps<HxMermaidProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="figure"
    class="helix-mermaid"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-mermaid {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
  }
</style>
