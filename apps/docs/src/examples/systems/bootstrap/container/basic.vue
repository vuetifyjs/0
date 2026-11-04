<script setup lang="ts">
  import { BCol, BContainer, BRow } from '@paper/bootstrap'
</script>

<template>
  <BContainer class="text-center">
    <BRow>
      <BCol>One of three columns</BCol>

      <BCol :sm="6">One of three columns</BCol>

      <BCol>One of three columns</BCol>
    </BRow>
  </BContainer>
</template>
