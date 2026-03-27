<script setup lang="ts">
  defineOptions({ name: 'CxCopyCommandText' })
</script>

<template>
  <code class="codex-copy-command__text">
    <slot />
  </code>
</template>

<style scoped>
  .codex-copy-command__text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
