<script setup lang="ts">
  import { BCol, BContainer, BRow } from '@paper/bootstrap'
</script>

<template>
  <BContainer class="text-center">
    <BRow>
      <BCol :lg="8" :offset="2" :sm="6" :span="4">Offset column</BCol>

      <BCol :span="4">Beside it</BCol>
    </BRow>
  </BContainer>
</template>
