<script lang="ts">
  export interface GnPeekProps {
    /** Label shown while expanded */
    expandedLabel?: string
    /** Label shown while collapsed */
    collapsedLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'GnPeek' })

  const {
    expandedLabel = 'Collapse',
    collapsedLabel = 'Expand',
  } = defineProps<GnPeekProps>()

  const expanded = defineModel<boolean>('expanded', { default: false })

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <button
    :aria-expanded="expanded ? 'true' : 'false'"
    :aria-label="expanded ? expandedLabel : collapsedLabel"
    class="genesis-peek"
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
  .genesis-peek {
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
    border-radius: 0.75rem;
    corner-shape: squircle;
    background: var(--v0-primary, #5f3aed);
    color: var(--v0-on-primary, #fff);
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: opacity 0.15s;
    touch-action: manipulation;
  }

  .genesis-peek:hover {
    opacity: 0.85;
  }
</style>
