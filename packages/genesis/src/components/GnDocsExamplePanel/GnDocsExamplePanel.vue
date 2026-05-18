<script lang="ts">
  // Types
  import type { GnDocsExampleFile } from '../GnDocsExampleTabs'

  export interface GnDocsExamplePanelProps {
    /** File metadata for this panel — passed by the parent Tabs default-slot iteration */
    file?: GnDocsExampleFile
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'GnDocsExamplePanel' })

  const { file } = defineProps<GnDocsExamplePanelProps>()
</script>

<template>
  <div class="genesis-docs-example-panel">
    <slot :file />
  </div>
</template>

<style scoped>
  .genesis-docs-example-panel {
    display: block;
  }
</style>
