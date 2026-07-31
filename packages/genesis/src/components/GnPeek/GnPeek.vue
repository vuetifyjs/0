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

    <slot :expanded name="icon">
      <svg
        aria-hidden="true"
        class="genesis-peek__chevron"
        fill="currentColor"
        height="14"
        viewBox="0 0 24 24"
        width="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
      </svg>
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

  .genesis-peek__chevron {
    transition: transform 0.15s;
  }

  .genesis-peek[data-expanded] .genesis-peek__chevron {
    transform: rotate(180deg);
  }
</style>
