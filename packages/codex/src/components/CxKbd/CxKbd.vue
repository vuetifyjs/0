<script lang="ts">
  export interface CxKbdProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxKbd' })

  defineProps<CxKbdProps>()
</script>

<template>
  <kbd class="codex-kbd">
    <slot />
  </kbd>
</template>

<style scoped>
  .codex-kbd {
    display: inline-block;
    padding: 0.125em 0.375em;
    border-radius: 0.25rem;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 0.75em;
    line-height: 1.5;
    vertical-align: baseline;
  }
</style>
