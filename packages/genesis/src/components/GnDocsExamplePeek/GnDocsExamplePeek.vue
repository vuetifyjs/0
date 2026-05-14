<script lang="ts">
  export interface GnDocsExamplePeekProps {
    /** Force collapsed/expanded label */
    expandedLabel?: string
    collapsedLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'GnDocsExamplePeek' })

  const {
    expandedLabel = 'Collapse',
    collapsedLabel = 'Expand',
  } = defineProps<GnDocsExamplePeekProps>()

  const expanded = defineModel<boolean>('expanded', { default: false })

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <button
    :aria-expanded="expanded ? 'true' : 'false'"
    :aria-label="expanded ? expandedLabel : collapsedLabel"
    class="genesis-docs-example-peek"
    :data-expanded="expanded || undefined"
    type="button"
    @click="onToggle"
  >
    <slot :expanded>
      {{ expanded ? expandedLabel : collapsedLabel }}
    </slot>
  </button>
</template>

<style scoped>
  .genesis-docs-example-peek {
    --genesis-docs-example-peek-bg: var(--v0-primary, currentcolor);
    --genesis-docs-example-peek-fg: var(--v0-on-primary, white);

    position: absolute;
    inset-inline-start: 50%;
    bottom: -0.75rem;
    transform: translateX(-50%);
    z-index: 10;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 0.25rem;
    background: var(--genesis-docs-example-peek-bg);
    color: var(--genesis-docs-example-peek-fg);
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: opacity 0.15s, bottom 0.15s;
    touch-action: manipulation;
  }

  .genesis-docs-example-peek:hover {
    opacity: 0.85;
  }

  .genesis-docs-example-peek[data-expanded] {
    bottom: -1.5rem;
  }
</style>
