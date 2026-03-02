<script setup lang="ts">
  import CanvasConsumer from './CanvasConsumer.vue'
  import CanvasProvider from './CanvasProvider.vue'
</script>

<template>
  <CanvasProvider>
    <CanvasConsumer />
  </CanvasProvider>
</template>
