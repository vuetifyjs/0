<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxCopyCommandProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxCopyCommand' })

  const { ...paperProps } = defineProps<HxCopyCommandProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-copy-command"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-copy-command {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: monospace;
    font-size: 0.875rem;
    max-width: 100%;
    background-color: var(--v0-surface-tint);
    border: 1px solid var(--v0-divider);
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    color: var(--v0-on-surface);
  }
</style>
