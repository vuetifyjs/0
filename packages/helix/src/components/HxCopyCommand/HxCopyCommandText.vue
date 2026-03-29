<script setup lang="ts">
  defineOptions({ name: 'HxCopyCommandText' })
</script>

<template>
  <code class="helix-copy-command__text">
    <slot />
  </code>
</template>

<style scoped>
  .helix-copy-command__text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--v0-on-surface);
  }
</style>
