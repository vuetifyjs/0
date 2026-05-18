<script lang="ts">
  export interface GnDocsExampleActionsProps {
    /** Accessible label for the actions group */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'GnDocsExampleActions' })

  const { label = 'Example actions' } = defineProps<GnDocsExampleActionsProps>()
</script>

<template>
  <div
    :aria-label="label"
    class="genesis-docs-example-actions"
    role="toolbar"
  >
    <slot />
  </div>
</template>

<style scoped>
  .genesis-docs-example-actions {
    margin-inline-start: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .genesis-docs-example-actions :deep(button) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    padding: 0 0.5rem;
    background: transparent;
    color: var(--gn-on-surface-variant);
    border: none;
    border-radius: 0.25rem;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .genesis-docs-example-actions :deep(button:hover) {
    background: color-mix(in srgb, var(--gn-on-surface) 8%, transparent);
    color: var(--gn-on-surface);
  }
</style>
