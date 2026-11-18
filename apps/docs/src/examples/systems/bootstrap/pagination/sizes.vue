<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BPagination } from '@paper/bootstrap'

  const small = shallowRef(1)
  const center = shallowRef(2)
  const large = shallowRef(3)
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <BPagination
      v-model="small"
      class="mb-0"
      label="Small pages"
      size="sm"
      :total="3"
    >
      <BPagination.Prev>Previous</BPagination.Prev>
      <BPagination.Item :value="1">1</BPagination.Item>
      <BPagination.Item :value="2">2</BPagination.Item>
      <BPagination.Item :value="3">3</BPagination.Item>
      <BPagination.Next>Next</BPagination.Next>
    </BPagination>

    <BPagination v-model="center" class="justify-content-center mb-0" label="Centered pages" :total="3">
      <BPagination.Prev>Prev</BPagination.Prev>
      <BPagination.Item :value="1">1</BPagination.Item>
      <BPagination.Item :value="2">2</BPagination.Item>
      <BPagination.Item :value="3">3</BPagination.Item>
      <BPagination.Next>Next</BPagination.Next>
    </BPagination>

    <BPagination
      v-model="large"
      class="mb-0"
      label="Large pages"
      size="lg"
      :total="3"
    >
      <BPagination.Prev>Prev</BPagination.Prev>
      <BPagination.Item :value="1">1</BPagination.Item>
      <BPagination.Item :value="2">2</BPagination.Item>
      <BPagination.Item :value="3">3</BPagination.Item>
      <BPagination.Next>Next</BPagination.Next>
    </BPagination>
  </div>
</template>
