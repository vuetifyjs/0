<script setup lang="ts">
  import DashboardConsumer from './DashboardConsumer.vue'
  import DashboardProvider from './DashboardProvider.vue'
</script>

<template>
  <DashboardProvider>
    <DashboardConsumer />
  </DashboardProvider>
</template>
