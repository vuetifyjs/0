<script lang="ts">
  export interface CxCodeBlockHeaderProps {
    /** Filename to display */
    filename?: string
    /** Language label */
    language?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCodeBlockHeader' })

  const {
    filename,
    language,
  } = defineProps<CxCodeBlockHeaderProps>()
</script>

<template>
  <div v-if="filename || language" class="codex-code-block__header">
    <span v-if="filename" class="codex-code-block__filename">{{ filename }}</span>
    <span v-else-if="language" class="codex-code-block__language">{{ language }}</span>
  </div>
</template>

<style scoped>
  .codex-code-block__header {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.6;
  }

  .codex-code-block__filename {
    font-family: monospace;
    font-size: 0.8125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .codex-code-block__language {
    font-size: 0.75rem;
    text-transform: uppercase;
  }
</style>
