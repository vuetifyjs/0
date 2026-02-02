<script setup lang="ts">
  import NotificationConsumer from './NotificationConsumer.vue'
  import NotificationProvider from './NotificationProvider.vue'
</script>

<template>
  <NotificationProvider>
    <NotificationConsumer />
  </NotificationProvider>
</template>
