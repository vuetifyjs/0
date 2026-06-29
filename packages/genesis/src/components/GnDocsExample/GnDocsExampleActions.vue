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
</style>
