<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCopyCommandProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCopyCommand' })

  const { ...paperProps } = defineProps<CxCopyCommandProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-copy-command"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-copy-command {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: monospace;
    font-size: 0.875rem;
    max-width: 100%;
  }
</style>
