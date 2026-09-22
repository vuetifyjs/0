<script setup lang="ts">
  import LoadingTable from './LoadingTable.vue'
  import { useLoading } from './useLoading'

  const { users } = useLoading()
</script>

<template>
  <LoadingTable :users />
</template>
