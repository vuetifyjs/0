<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BPagination } from '@paper/bootstrap'

  const page = shallowRef(2)
</script>

<template>
  <BPagination v-model="page" class="mb-0" label="Page navigation example" :total="3">
    <BPagination.Prev>Previous</BPagination.Prev>
    <BPagination.Item :value="1">1</BPagination.Item>
    <BPagination.Item :value="2">2</BPagination.Item>
    <BPagination.Item :value="3">3</BPagination.Item>
    <BPagination.Next>Next</BPagination.Next>
  </BPagination>
</template>
