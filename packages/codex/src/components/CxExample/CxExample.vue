<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxExampleProps extends V0PaperProps {
    /** Optional title for the example */
    title?: string
    /** Anchor id for deep linking */
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxExample' })

  const {
    title,
    id,
    ...paperProps
  } = defineProps<CxExampleProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :id
    as="div"
    class="codex-example"
  >
    <div v-if="title" class="codex-example__header">
      <span class="codex-example__title">{{ title }}</span>
    </div>

    <!-- Preview area (default slot) -->
    <div class="codex-example__preview">
      <slot />
    </div>
  </V0Paper>
</template>

<style scoped>
  .codex-example {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .codex-example__header {
    display: flex;
    align-items: center;
  }

  .codex-example__title {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .codex-example__preview {
    display: flex;
    flex-direction: column;
  }
</style>
