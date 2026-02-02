<script setup lang="ts">
  import StackConsumer from './StackConsumer.vue'
  import StackProvider from './StackProvider.vue'
</script>

<template>
  <StackProvider>
    <StackConsumer />
  </StackProvider>
</template>
