<script setup lang="ts">
  import UploadConsumer from './UploadConsumer.vue'
  import UploadProvider from './UploadProvider.vue'
</script>

<template>
  <UploadProvider>
    <UploadConsumer />
  </UploadProvider>
</template>
