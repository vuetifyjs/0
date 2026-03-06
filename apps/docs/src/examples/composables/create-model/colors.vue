<script setup lang="ts">
  import ColorConsumer from './ColorConsumer.vue'
  import ColorProvider from './ColorProvider.vue'
</script>

<template>
  <ColorProvider>
    <ColorConsumer />
  </ColorProvider>
</template>
