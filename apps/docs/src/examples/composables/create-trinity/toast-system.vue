<script setup lang="ts">
  import ToastConsumer from './ToastConsumer.vue'
  import ToastProvider from './ToastProvider.vue'
</script>

<template>
  <ToastProvider>
    <ToastConsumer />
  </ToastProvider>
</template>
