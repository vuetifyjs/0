<script lang="ts">
  export interface HxKbdProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxKbd' })

  defineProps<HxKbdProps>()
</script>

<template>
  <kbd class="helix-kbd">
    <slot />
  </kbd>
</template>

<style scoped>
  .helix-kbd {
    display: inline-block;
    padding: 0.125em 0.375em;
    border: 1px solid var(--v0-divider);
    border-radius: 0.25rem;
    background-color: var(--v0-surface-tint);
    color: var(--v0-on-surface);
    box-shadow: 0 1px 0 var(--v0-divider);
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 0.75em;
    line-height: 1.5;
    vertical-align: baseline;
  }
</style>
