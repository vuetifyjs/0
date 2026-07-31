<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Pagination } from '../Pagination/index'

  const page = ref(1)
</script>

<template>
  <Pagination.Root v-model="page" :size="100">
    <Pagination.First />
    <Pagination.Prev />
    <Pagination.Item :value="1" />
    <Pagination.Item :value="2" />
    <Pagination.Ellipsis />
    <Pagination.Next />
    <Pagination.Last />
  </Pagination.Root>
</template>
