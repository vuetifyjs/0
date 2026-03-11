<script setup lang="ts">
  import TaskConsumer from './TaskConsumer.vue'
  import TaskProvider from './TaskProvider.vue'
</script>

<template>
  <TaskProvider>
    <TaskConsumer />
  </TaskProvider>
</template>
