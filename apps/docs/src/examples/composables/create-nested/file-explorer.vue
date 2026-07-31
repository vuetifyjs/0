<script setup lang="ts">
  import FileTreeExplorer from './FileTreeExplorer.vue'
  import FileTreeProvider from './FileTreeProvider.vue'
</script>

<template>
  <FileTreeProvider>
    <FileTreeExplorer />
  </FileTreeProvider>
</template>
