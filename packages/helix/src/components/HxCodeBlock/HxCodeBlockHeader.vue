<script lang="ts">
  export interface HxCodeBlockHeaderProps {
    /** Filename to display */
    filename?: string
    /** Language label */
    language?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxCodeBlockHeader' })

  const {
    filename,
    language,
  } = defineProps<HxCodeBlockHeaderProps>()
</script>

<template>
  <div v-if="filename || language" class="helix-code-block__header">
    <span v-if="filename" class="helix-code-block__filename">{{ filename }}</span>
    <span v-else-if="language" class="helix-code-block__language">{{ language }}</span>
  </div>
</template>

<style scoped>
  .helix-code-block__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--v0-surface-tint);
    border-bottom: 1px solid var(--v0-divider);
    color: var(--v0-on-surface-variant);
  }

  .helix-code-block__filename {
    font-family: monospace;
    font-size: 0.8125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .helix-code-block__language {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
